
import React, { useState, useEffect } from 'react';
import Layout from '@/components/Layout';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { format, parseISO } from 'date-fns';
import { useQuery } from '@tanstack/react-query';

// Types
interface RawMaterial {
  id: string;
  name: string;
  category: string;
  min_stock: number;
  unit: string;
  current_stock: number;
}

interface StockStatus {
  id: string;
  month: string;
  year: number;
  raw_material_id: string;
  raw_material_name?: string;
  raw_material_category?: string;
  raw_material_unit?: string;
  opening_balance: number;
  purchases: number;
  utilized: number;
  adjustment: number;
  closing_balance: number;
  min_level: number;
  status: 'normal' | 'low' | 'out';
}

interface StockPurchase {
  id: string;
  date: string;
  raw_material_id: string;
  quantity: number;
}

interface Task {
  id: string;
  date_assigned: string;
  raw_material_id: string;
  process: string;
  assigned_qty: number;
}

const StockStatusPage = () => {
  const [stockStatus, setStockStatus] = useState<StockStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusDate, setStatusDate] = useState(new Date().toISOString().split('T')[0]);
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // Parse date to get month and year
  const statusDateObj = new Date(statusDate);
  const month = statusDateObj.toLocaleString('default', { month: 'short' });
  const year = statusDateObj.getFullYear();

  // Query for raw materials
  const { data: rawMaterials = [] } = useQuery({
    queryKey: ['rawMaterials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('raw_materials')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as RawMaterial[];
    }
  });

  // Query for stock purchases based on date
  const { data: stockPurchases = [], refetch: refetchPurchases } = useQuery({
    queryKey: ['stockPurchases', month, year],
    queryFn: async () => {
      // Calculate start and end date for the selected month
      const startDate = new Date(year, statusDateObj.getMonth(), 1);
      const endDate = new Date(year, statusDateObj.getMonth() + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('stock_purchases')
        .select('id, date, raw_material_id, quantity')
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      if (error) throw error;
      return data as StockPurchase[];
    },
    enabled: !!month && !!year
  });

  // Query for tasks based on date
  const { data: tasks = [], refetch: refetchTasks } = useQuery({
    queryKey: ['tasks', month, year],
    queryFn: async () => {
      // Calculate start and end date for the selected month
      const startDate = new Date(year, statusDateObj.getMonth(), 1);
      const endDate = new Date(year, statusDateObj.getMonth() + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('tasks')
        .select('id, date_assigned, raw_material_id, process, assigned_qty')
        .eq('process', 'Cleaning')
        .gte('date_assigned', startDateStr)
        .lte('date_assigned', endDateStr);

      if (error) throw error;
      return data as Task[];
    },
    enabled: !!month && !!year
  });

  // Query for existing stock status
  const { data: existingStockStatus = [], refetch: refetchStockStatus } = useQuery({
    queryKey: ['stockStatus', month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('stock_status')
        .select(`
          *,
          raw_materials(name, category, unit, min_stock)
        `)
        .eq('month', month)
        .eq('year', year);

      if (error) throw error;
      return data;
    },
    enabled: !!month && !!year
  });

  // Effect to process stock status data
  useEffect(() => {
    const processStockStatus = async () => {
      try {
        setLoading(true);
        console.log("Processing stock status for", month, year);

        if (existingStockStatus.length > 0) {
          console.log("Using existing stock status data:", existingStockStatus);
          processExistingStockStatus();
        } else {
          console.log("Generating new stock status data");
          await generateStockStatus();
        }
      } catch (error) {
        console.error("Error processing stock status:", error);
        toast({
          title: "Error",
          description: "Failed to process stock status data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (rawMaterials.length > 0) {
      processStockStatus();
    }
  }, [rawMaterials, existingStockStatus, stockPurchases, tasks, month, year]);

  // Process existing stock status data
  const processExistingStockStatus = () => {
    const newAdjustments: Record<string, number> = {};
    
    const transformedData = existingStockStatus.map((status: any) => {
      const rawMaterial = status.raw_materials;
      newAdjustments[status.id] = status.adjustment;
      
      return {
        ...status,
        raw_material_name: rawMaterial?.name || 'Unknown',
        raw_material_category: rawMaterial?.category || 'Unknown',
        raw_material_unit: rawMaterial?.unit || 'unit',
        min_level: rawMaterial?.min_stock || 0,
        status: determineStatus(status.closing_balance, rawMaterial?.min_stock || 0),
      };
    });

    setStockStatus(transformedData);
    setAdjustments(newAdjustments);
  };

  // Generate stock status for each raw material
  const generateStockStatus = async () => {
    try {
      console.log("Generating stock status for", month, year);
      const newStockStatus: StockStatus[] = [];
      const newAdjustments: Record<string, number> = {};

      // Calculate date for previous month
      const prevDate = new Date(year, statusDateObj.getMonth() - 1, 1);
      const prevMonth = prevDate.toLocaleString('default', { month: 'short' });
      const prevYear = prevDate.getFullYear();

      for (const material of rawMaterials) {
        console.log(`Processing material: ${material.name}`);
        
        // 1. Get previous month's closing balance (for Opening Balance)
        const { data: prevData } = await supabase
          .from('stock_status')
          .select('closing_balance')
          .eq('month', prevMonth)
          .eq('year', prevYear)
          .eq('raw_material_id', material.id)
          .maybeSingle();

        // Use previous month's closing balance or current_stock if no previous data
        const openingBalance = prevData ? prevData.closing_balance : material.current_stock;
        console.log(`Opening balance for ${material.name}: ${openingBalance}`);

        // 2. Calculate purchases for current month
        const materialPurchases = stockPurchases.filter(
          purchase => purchase.raw_material_id === material.id
        );
        const purchases = materialPurchases.reduce(
          (sum, purchase) => sum + Number(purchase.quantity), 0
        );
        console.log(`Purchases for ${material.name}: ${purchases}`);

        // 3. Calculate utilized for current month (from cleaning process)
        const materialTasks = tasks.filter(
          task => task.raw_material_id === material.id && task.process === 'Cleaning'
        );
        const utilized = materialTasks.reduce(
          (sum, task) => sum + Number(task.assigned_qty), 0
        );
        console.log(`Utilized for ${material.name}: ${utilized}`);

        // 4. Set adjustment to 0 initially
        const adjustment = 0;

        // 5. Calculate closing balance
        const closingBalance = openingBalance + purchases - utilized + adjustment;
        console.log(`Closing balance for ${material.name}: ${closingBalance}`);

        // 6. Determine status based on min_stock
        const status = determineStatus(closingBalance, material.min_stock);
        console.log(`Status for ${material.name}: ${status}`);

        // Insert into database
        const { data: insertedData, error: insertError } = await supabase
          .from('stock_status')
          .insert({
            month,
            year,
            raw_material_id: material.id,
            opening_balance: openingBalance,
            purchases,
            utilized,
            adjustment,
            closing_balance: closingBalance,
            status,
          })
          .select();

        if (insertError) {
          console.error('Error inserting stock status:', insertError);
          throw insertError;
        }

        if (insertedData && insertedData[0]) {
          const newStatus: StockStatus = {
            id: insertedData[0].id,
            month,
            year,
            raw_material_id: material.id,
            raw_material_name: material.name,
            raw_material_category: material.category,
            raw_material_unit: material.unit,
            opening_balance: openingBalance,
            purchases,
            utilized,
            adjustment,
            closing_balance: closingBalance,
            min_level: material.min_stock,
            status,
          };

          newStockStatus.push(newStatus);
          newAdjustments[insertedData[0].id] = 0;
        }
      }

      setStockStatus(newStockStatus);
      setAdjustments(newAdjustments);
      
      toast({
        title: "Success",
        description: `Stock status generated for ${month} ${year}`,
      });
      
      // Refresh data
      refetchStockStatus();
    } catch (error: any) {
      console.error('Error in generateStockStatus:', error);
      toast({
        title: "Error generating stock status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Determine status based on closing balance and min stock
  const determineStatus = (closing: number, min: number): 'normal' | 'low' | 'out' => {
    if (closing <= 0) return 'out';
    if (closing < min) return 'low';
    return 'normal';
  };

  // Handle adjustment change
  const handleAdjustmentChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAdjustments(prev => ({
      ...prev,
      [id]: numValue
    }));
  };

  // Update stock status with new adjustments
  const handleUpdateStatus = async () => {
    try {
      setLoading(true);

      // Update each stock status with new adjustment
      for (const status of stockStatus) {
        const newAdjustment = adjustments[status.id] || 0;
        const newClosingBalance = status.opening_balance + status.purchases - status.utilized + newAdjustment;
        const newStatus = determineStatus(newClosingBalance, status.min_level);

        // Update in database
        const { error } = await supabase
          .from('stock_status')
          .update({
            adjustment: newAdjustment,
            closing_balance: newClosingBalance,
            status: newStatus
          })
          .eq('id', status.id);

        if (error) throw error;

        // Also update raw material current stock
        const { error: materialError } = await supabase
          .from('raw_materials')
          .update({
            current_stock: newClosingBalance
          })
          .eq('id', status.raw_material_id);

        if (materialError) throw materialError;
      }

      toast({
        title: "Success",
        description: "Stock status updated successfully",
      });

      // Refresh data
      refetchStockStatus();
    } catch (error: any) {
      toast({
        title: "Error updating stock status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusDate(e.target.value);
    // Reset adjustments when date changes
    setAdjustments({});
  };

  // Get status counts
  const normalCount = stockStatus.filter(s => s.status === 'normal').length;
  const lowCount = stockStatus.filter(s => s.status === 'low').length;
  const outCount = stockStatus.filter(s => s.status === 'out').length;

  // Filter stock status based on search query
  const filteredStockStatus = stockStatus.filter(status => 
    (status.raw_material_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (status.raw_material_category?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Stock Status</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label htmlFor="statusDate" className="block mb-1">Status Date</Label>
              <Input
                id="statusDate"
                type="date"
                value={statusDate}
                onChange={handleDateChange}
                className="w-40"
              />
            </div>
            <div>
              <span className="block text-sm font-medium text-gray-700 mb-1">Month / Year</span>
              <div className="h-10 px-3 py-2 border border-gray-200 rounded bg-gray-50">
                {month}-{year}
              </div>
            </div>
            <Button 
              onClick={handleUpdateStatus} 
              disabled={loading}
              className="ml-auto"
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Update Status
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xl font-bold text-green-600">{normalCount}</div>
            <div className="text-gray-600">Normal Stock Items</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xl font-bold text-amber-600">{lowCount}</div>
            <div className="text-gray-600">Low Stock Items</div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow-sm">
            <div className="text-xl font-bold text-red-600">{outCount}</div>
            <div className="text-gray-600">Out of Stock Items</div>
          </div>
        </div>

        <div className="flex items-center w-full max-w-md mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search stock status..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Opening Balance</TableHead>
                <TableHead>Purchases</TableHead>
                <TableHead>Utilised</TableHead>
                <TableHead>Adj +/-</TableHead>
                <TableHead>Closing Bal</TableHead>
                <TableHead>Min. Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : filteredStockStatus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    {searchQuery ? 'No stock items found matching your search.' : 'No stock status data available for this month.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredStockStatus.map(status => {
                  // Calculate real-time closing balance based on current adjustment
                  const currentAdjustment = adjustments[status.id] || 0;
                  const calculatedClosingBalance = status.opening_balance + status.purchases - status.utilized + currentAdjustment;
                  const calculatedStatus = determineStatus(calculatedClosingBalance, status.min_level);
                  
                  return (
                    <TableRow key={status.id}>
                      <TableCell className="font-medium">{status.raw_material_name}</TableCell>
                      <TableCell>{status.raw_material_category}</TableCell>
                      <TableCell>{status.opening_balance.toFixed(2)} {status.raw_material_unit}</TableCell>
                      <TableCell>{status.purchases.toFixed(2)} {status.raw_material_unit}</TableCell>
                      <TableCell>{status.utilized.toFixed(2)} {status.raw_material_unit}</TableCell>
                      <TableCell>
                        <Input
                          type="number"
                          value={adjustments[status.id] || 0}
                          onChange={(e) => handleAdjustmentChange(status.id, e.target.value)}
                          className="w-20 text-center"
                          min="-9999"
                          step="0.01"
                        />
                      </TableCell>
                      <TableCell>{calculatedClosingBalance.toFixed(2)} {status.raw_material_unit}</TableCell>
                      <TableCell>{status.min_level} {status.raw_material_unit}</TableCell>
                      <TableCell>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          calculatedStatus === 'normal' ? 'bg-green-100 text-green-800' :
                          calculatedStatus === 'low' ? 'bg-amber-100 text-amber-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {calculatedStatus === 'normal' ? 'Normal' : 
                          calculatedStatus === 'low' ? 'Low Stock' : 
                          'Out of Stock'}
                        </span>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default StockStatusPage;
