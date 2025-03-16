
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
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { RefreshCw, Search } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface Process {
  id: string;
  name: string;
  type: 'pre-production' | 'production';
}

interface RawMaterial {
  id: string;
  name: string;
  category: string;
  unit: string;
  current_stock: number;
}

interface ProductionStatus {
  id: string;
  month: string;
  year: number;
  process: string;
  raw_material_id: string;
  raw_material_name: string;
  raw_material_category: string;
  raw_material_unit: string;
  opening_balance: number;
  assigned: number;
  completed: number;
  wastage: number;
  pending: number;
  adjustment: number;
  closing_balance: number;
}

const ProductionStatusPage = () => {
  const [productionStatus, setProductionStatus] = useState<ProductionStatus[]>([]);
  const [processes, setProcesses] = useState<Process[]>([]);
  const [rawMaterials, setRawMaterials] = useState<RawMaterial[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusDate, setStatusDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedProcess, setSelectedProcess] = useState<string>('all');
  const [adjustments, setAdjustments] = useState<Record<string, number>>({});
  const { toast } = useToast();

  // Parse date to get month and year
  const month = new Date(statusDate).toLocaleString('default', { month: 'short' });
  const year = new Date(statusDate).getFullYear();

  // Fetch data on component mount
  useEffect(() => {
    fetchProcesses();
    fetchRawMaterials();
  }, []);

  useEffect(() => {
    if (processes.length > 0 && rawMaterials.length > 0) {
      fetchProductionStatus();
    }
  }, [processes, rawMaterials, statusDate, selectedProcess]);

  const fetchProcesses = async () => {
    try {
      const { data, error } = await supabase
        .from('processes')
        .select('*')
        .order('name');

      if (error) throw error;
      setProcesses(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching processes",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchRawMaterials = async () => {
    try {
      const { data, error } = await supabase
        .from('raw_materials')
        .select('*')
        .order('name');

      if (error) throw error;
      setRawMaterials(data || []);
    } catch (error: any) {
      toast({
        title: "Error fetching raw materials",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  const fetchProductionStatus = async () => {
    try {
      setLoading(true);
      
      // Create or update production status for each process and material combination
      const productionStatusItems: ProductionStatus[] = [];
      const newAdjustments: Record<string, number> = {};

      // For each raw material and process combination
      for (const material of rawMaterials) {
        // Filter processes if a specific one is selected
        const processesToUse = selectedProcess === 'all' 
          ? processes 
          : processes.filter(p => p.name === selectedProcess);

        for (const process of processesToUse) {
          // Generate a unique ID for this combination
          const comboId = `${material.id}_${process.name}_${month}_${year}`;
          
          // Check if we already have data for this combination
          const { data: existingData } = await supabase
            .from('production_status')
            .select('*')
            .eq('month', month)
            .eq('year', year)
            .eq('raw_material_id', material.id)
            .eq('process', process.name)
            .maybeSingle();

          // Get previous month's closing balance
          const prevMonth = new Date(year, new Date(`${month} 1, ${year}`).getMonth() - 1, 1);
          const prevMonthString = prevMonth.toLocaleString('default', { month: 'short' });
          const prevYear = prevMonth.getFullYear();
          
          const { data: prevData } = await supabase
            .from('production_status')
            .select('closing_balance')
            .eq('month', prevMonthString)
            .eq('year', prevYear)
            .eq('raw_material_id', material.id)
            .eq('process', process.name)
            .maybeSingle();

          // Get opening balance - the closing balance of the previous month or 0
          const openingBalance = prevData?.closing_balance || 0;

          // Calculate date range for current month
          const startDate = new Date(year, new Date(`${month} 1, ${year}`).getMonth(), 1);
          const endDate = new Date(year, new Date(`${month} 1, ${year}`).getMonth() + 1, 0);
          
          // Get assigned tasks for this material and process
          const { data: assignedTasks, error: assignedError } = await supabase
            .from('tasks')
            .select('assigned_qty')
            .eq('raw_material_id', material.id)
            .eq('process', process.name)
            .gte('date_assigned', startDate.toISOString().split('T')[0])
            .lte('date_assigned', endDate.toISOString().split('T')[0]);

          if (assignedError) throw assignedError;
          
          const assignedQty = assignedTasks?.reduce((sum, task) => sum + Number(task.assigned_qty), 0) || 0;

          // Get completed tasks for this material and process
          const { data: completedTasks, error: completedError } = await supabase
            .from('tasks')
            .select('assigned_qty')
            .eq('raw_material_id', material.id)
            .eq('process', process.name)
            .not('date_completed', 'is', null)
            .gte('date_assigned', startDate.toISOString().split('T')[0])
            .lte('date_assigned', endDate.toISOString().split('T')[0]);

          if (completedError) throw completedError;
          
          const completedQty = completedTasks?.reduce((sum, task) => sum + Number(task.assigned_qty), 0) || 0;

          // Get wastage for this material and process
          const { data: wastageData, error: wastageError } = await supabase
            .from('tasks')
            .select('wastage_qty')
            .eq('raw_material_id', material.id)
            .eq('process', process.name)
            .not('wastage_qty', 'is', null)
            .gte('date_assigned', startDate.toISOString().split('T')[0])
            .lte('date_assigned', endDate.toISOString().split('T')[0]);

          if (wastageError) throw wastageError;
          
          const wastageQty = wastageData?.reduce((sum, task) => sum + Number(task.wastage_qty || 0), 0) || 0;

          // Calculate pending quantity (assigned - completed)
          const pendingQty = assignedQty - completedQty;

          // Use adjustment from existing record or default to 0
          const adjustment = existingData?.adjustment || 0;

          // Calculate closing balance = opening + completed - wastage + adjustment
          const closingBalance = openingBalance + completedQty - wastageQty + adjustment;

          // Create or update the production status record
          if (existingData) {
            // Update existing record
            await supabase
              .from('production_status')
              .update({
                opening_balance: openingBalance,
                assigned: assignedQty,
                completed: completedQty,
                wastage: wastageQty,
                pending: pendingQty,
                closing_balance: closingBalance,
                updated_at: new Date().toISOString()
              })
              .eq('id', existingData.id);

            // Add to our in-memory records
            productionStatusItems.push({
              id: existingData.id,
              month,
              year,
              process: process.name,
              raw_material_id: material.id,
              raw_material_name: material.name,
              raw_material_category: material.category,
              raw_material_unit: material.unit,
              opening_balance: openingBalance,
              assigned: assignedQty,
              completed: completedQty,
              wastage: wastageQty,
              pending: pendingQty,
              adjustment,
              closing_balance: closingBalance
            });

            newAdjustments[existingData.id] = adjustment;
          } else {
            // Insert new record
            const { data: insertedData, error: insertError } = await supabase
              .from('production_status')
              .insert({
                month,
                year,
                process: process.name,
                raw_material_id: material.id,
                opening_balance: openingBalance,
                assigned: assignedQty,
                completed: completedQty,
                wastage: wastageQty,
                pending: pendingQty,
                adjustment: 0,
                closing_balance: closingBalance
              })
              .select();

            if (insertError) throw insertError;

            if (insertedData && insertedData[0]) {
              // Add to our in-memory records
              productionStatusItems.push({
                id: insertedData[0].id,
                month,
                year,
                process: process.name,
                raw_material_id: material.id,
                raw_material_name: material.name,
                raw_material_category: material.category,
                raw_material_unit: material.unit,
                opening_balance: openingBalance,
                assigned: assignedQty,
                completed: completedQty,
                wastage: wastageQty,
                pending: pendingQty,
                adjustment: 0,
                closing_balance: closingBalance
              });

              newAdjustments[insertedData[0].id] = 0;
            }
          }
        }
      }

      setProductionStatus(productionStatusItems);
      setAdjustments(newAdjustments);
    } catch (error: any) {
      toast({
        title: "Error fetching production status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle adjustment change
  const handleAdjustmentChange = (id: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setAdjustments(prev => ({
      ...prev,
      [id]: numValue
    }));
  };

  // Update production status with new adjustments
  const handleUpdateStatus = async () => {
    try {
      setLoading(true);

      // Update each production status with new adjustment
      for (const status of productionStatus) {
        const newAdjustment = adjustments[status.id] || 0;
        const newClosingBalance = status.opening_balance + status.completed - status.wastage + newAdjustment;

        // Update in database
        const { error } = await supabase
          .from('production_status')
          .update({
            adjustment: newAdjustment,
            closing_balance: newClosingBalance
          })
          .eq('id', status.id);

        if (error) throw error;
      }

      toast({
        title: "Production status updated",
        description: "Production status has been updated successfully with new adjustments.",
      });

      // Refresh data
      fetchProductionStatus();
    } catch (error: any) {
      toast({
        title: "Error updating production status",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  // Filter production status based on search query
  const filteredProductionStatus = productionStatus.filter(status => 
    status.raw_material_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    status.raw_material_category.toLowerCase().includes(searchQuery.toLowerCase()) ||
    status.process.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Production Status</h1>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
          <div className="flex flex-wrap gap-4 items-end">
            <div>
              <Label htmlFor="statusDate" className="block mb-1">Status Date</Label>
              <Input
                id="statusDate"
                type="date"
                value={statusDate}
                onChange={(e) => setStatusDate(e.target.value)}
                className="w-40"
              />
            </div>
            <div>
              <Label htmlFor="processFilter" className="block mb-1">Process</Label>
              <Select value={selectedProcess} onValueChange={setSelectedProcess}>
                <SelectTrigger id="processFilter" className="w-[180px]">
                  <SelectValue placeholder="Select Process" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Processes</SelectItem>
                  {processes.map(process => (
                    <SelectItem key={process.id} value={process.name}>
                      {process.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
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

        <div className="flex items-center w-full max-w-md mb-4">
          <div className="relative w-full">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              type="search"
              placeholder="Search production status..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Process</TableHead>
                  <TableHead>RM/Stock Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Opening Balance</TableHead>
                  <TableHead>Assigned</TableHead>
                  <TableHead>Completed</TableHead>
                  <TableHead>Wastage</TableHead>
                  <TableHead>Pending</TableHead>
                  <TableHead>Adj +/-</TableHead>
                  <TableHead>Closing Bal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">Loading...</TableCell>
                  </TableRow>
                ) : filteredProductionStatus.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={10} className="text-center py-10">
                      {searchQuery ? 'No production status found matching your search.' : 'No production status data available.'}
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProductionStatus.map(status => {
                    // Calculate real-time closing balance based on current adjustment
                    const currentAdjustment = adjustments[status.id] || 0;
                    const calculatedClosingBalance = status.opening_balance + status.completed - status.wastage + currentAdjustment;
                    
                    return (
                      <TableRow key={status.id}>
                        <TableCell className="font-medium">{status.process}</TableCell>
                        <TableCell>{status.raw_material_name}</TableCell>
                        <TableCell>{status.raw_material_category}</TableCell>
                        <TableCell>{status.opening_balance} {status.raw_material_unit}</TableCell>
                        <TableCell>{status.assigned} {status.raw_material_unit}</TableCell>
                        <TableCell>{status.completed} {status.raw_material_unit}</TableCell>
                        <TableCell>{status.wastage} {status.raw_material_unit}</TableCell>
                        <TableCell>{status.pending} {status.raw_material_unit}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            value={adjustments[status.id] || 0}
                            onChange={(e) => handleAdjustmentChange(status.id, e.target.value)}
                            className="w-16 text-center"
                            min="-9999"
                            step="0.01"
                          />
                        </TableCell>
                        <TableCell>{calculatedClosingBalance.toFixed(2)} {status.raw_material_unit}</TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default ProductionStatusPage;
