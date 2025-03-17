
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
import { RefreshCw, Search, Download } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

// Types
interface Product {
  id: string;
  name: string;
  sku: string;
  category: string;
  min_stock: number;
  quantity: number;
}

interface InventoryStatus {
  id: string;
  month: string;
  year: number;
  product_id: string;
  product_name?: string;
  product_category?: string;
  product_sku?: string;
  initial_qty: number;
  produced: number;
  sold: number;
  remaining: number;
  status: 'normal' | 'low' | 'out';
  min_level: number;
}

interface Sale {
  id: string;
  date: string;
  product_id: string;
  quantity: number;
}

const InventoryStatusPage = () => {
  const [inventoryStatus, setInventoryStatus] = useState<InventoryStatus[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [statusDate, setStatusDate] = useState(new Date().toISOString().split('T')[0]);
  const { toast } = useToast();

  // Parse date to get month and year
  const statusDateObj = new Date(statusDate);
  const month = statusDateObj.toLocaleString('default', { month: 'short' });
  const year = statusDateObj.getFullYear();

  // Query for products
  const { data: products = [] } = useQuery({
    queryKey: ['products'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('name');

      if (error) throw error;
      return data as Product[];
    }
  });

  // Query for sales data based on date
  const { data: salesData = [] } = useQuery({
    queryKey: ['sales', month, year],
    queryFn: async () => {
      // Calculate start and end date for the selected month
      const startDate = new Date(year, statusDateObj.getMonth(), 1);
      const endDate = new Date(year, statusDateObj.getMonth() + 1, 0);
      
      const startDateStr = startDate.toISOString().split('T')[0];
      const endDateStr = endDate.toISOString().split('T')[0];
      
      const { data, error } = await supabase
        .from('sales')
        .select('id, date, product_id, quantity')
        .gte('date', startDateStr)
        .lte('date', endDateStr);

      if (error) throw error;
      return data as Sale[];
    },
    enabled: !!month && !!year
  });

  // Query for existing inventory status
  const { data: existingInventoryStatus = [], refetch: refetchInventoryStatus } = useQuery({
    queryKey: ['inventoryStatus', month, year],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inventory_status')
        .select(`
          *,
          products:product_id(name, sku, category, min_stock)
        `)
        .eq('month', month)
        .eq('year', year);

      if (error) throw error;
      return data;
    },
    enabled: !!month && !!year
  });

  // Effect to process inventory status data
  useEffect(() => {
    const processInventoryStatus = async () => {
      try {
        setLoading(true);
        console.log("Processing inventory status for", month, year);

        if (existingInventoryStatus && existingInventoryStatus.length > 0) {
          console.log("Using existing inventory status data");
          processExistingInventoryStatus();
        } else {
          console.log("Generating new inventory status data");
          await generateInventoryStatus();
        }
      } catch (error) {
        console.error("Error processing inventory status:", error);
        toast({
          title: "Error",
          description: "Failed to process inventory status data",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    if (products.length > 0) {
      processInventoryStatus();
    }
  }, [products, existingInventoryStatus, salesData, month, year]);

  // Process existing inventory status data
  const processExistingInventoryStatus = () => {
    const transformedData = existingInventoryStatus.map((status: any) => {
      const product = status.products;
      
      return {
        ...status,
        product_name: product?.name || 'Unknown',
        product_category: product?.category || 'Unknown',
        product_sku: product?.sku || 'Unknown',
        min_level: product?.min_stock || 0,
        status: determineStatus(status.remaining, product?.min_stock || 0),
      };
    });

    setInventoryStatus(transformedData);
  };

  // Generate inventory status for each product
  const generateInventoryStatus = async () => {
    try {
      console.log("Generating inventory status for", month, year);
      const newInventoryStatus: InventoryStatus[] = [];

      // Calculate date for previous month
      const prevDate = new Date(year, statusDateObj.getMonth() - 1, 1);
      const prevMonth = prevDate.toLocaleString('default', { month: 'short' });
      const prevYear = prevDate.getFullYear();

      for (const product of products) {
        console.log(`Processing product: ${product.name}`);
        
        // Get previous month's remaining quantity (for Initial Quantity)
        const { data: prevData } = await supabase
          .from('inventory_status')
          .select('remaining')
          .eq('month', prevMonth)
          .eq('year', prevYear)
          .eq('product_id', product.id)
          .maybeSingle();

        // Use previous month's remaining or current quantity if no previous data
        const initialQty = prevData ? prevData.remaining : product.quantity;
        console.log(`Initial quantity for ${product.name}: ${initialQty}`);

        // Calculate sold for current month
        const productSales = salesData.filter(
          sale => sale.product_id === product.id
        );
        const soldQty = productSales.reduce(
          (sum, sale) => sum + Number(sale.quantity), 0
        );
        console.log(`Sold quantity for ${product.name}: ${soldQty}`);

        // For this demo, we'll set produced to a random value
        // In a real app, this would come from production records
        const producedQty = 0; // Replace with actual production data when available
        console.log(`Produced quantity for ${product.name}: ${producedQty}`);

        // Calculate remaining quantity
        const remainingQty = initialQty + producedQty - soldQty;
        console.log(`Remaining quantity for ${product.name}: ${remainingQty}`);

        // Determine status based on min_stock
        const status = determineStatus(remainingQty, product.min_stock);
        console.log(`Status for ${product.name}: ${status}`);

        // Insert into database
        const { data: insertedData, error: insertError } = await supabase
          .from('inventory_status')
          .insert({
            month,
            year,
            product_id: product.id,
            initial_qty: initialQty,
            produced: producedQty,
            sold: soldQty,
            remaining: remainingQty,
            status,
          })
          .select();

        if (insertError) {
          console.error('Error inserting inventory status:', insertError);
          throw insertError;
        }

        if (insertedData && insertedData[0]) {
          const newStatus: InventoryStatus = {
            id: insertedData[0].id,
            month,
            year,
            product_id: product.id,
            product_name: product.name,
            product_category: product.category,
            product_sku: product.sku,
            initial_qty: initialQty,
            produced: producedQty,
            sold: soldQty,
            remaining: remainingQty,
            min_level: product.min_stock,
            status,
          };

          newInventoryStatus.push(newStatus);
        }
      }

      setInventoryStatus(newInventoryStatus);
      
      toast({
        title: "Success",
        description: `Inventory status generated for ${month} ${year}`,
      });
      
      // Also update the current quantity in products table
      for (const status of newInventoryStatus) {
        await supabase
          .from('products')
          .update({ quantity: status.remaining })
          .eq('id', status.product_id);
      }

      // Refresh data
      refetchInventoryStatus();
    } catch (error: any) {
      console.error('Error in generateInventoryStatus:', error);
      toast({
        title: "Error generating inventory status",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Determine status based on remaining quantity and min stock
  const determineStatus = (remaining: number, min: number): 'normal' | 'low' | 'out' => {
    if (remaining <= 0) return 'out';
    if (remaining < min) return 'low';
    return 'normal';
  };

  // Handle date change
  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setStatusDate(e.target.value);
  };

  // Handle export to CSV
  const handleExport = () => {
    if (inventoryStatus.length === 0) {
      toast({
        title: "No data to export",
        description: "There is no inventory status data to export.",
        variant: "destructive",
      });
      return;
    }

    const headers = ['SKU', 'Product Name', 'Category', 'Initial Qty', 'Produced', 'Sold', 'Remaining', 'Min Level', 'Status'];
    const data = inventoryStatus.map(item => [
      item.product_sku,
      item.product_name,
      item.product_category,
      item.initial_qty.toString(),
      item.produced.toString(),
      item.sold.toString(),
      item.remaining.toString(),
      item.min_level.toString(),
      item.status
    ]);

    let csvContent = "data:text/csv;charset=utf-8," 
      + headers.join(',') + '\n'
      + data.map(row => row.join(',')).join('\n');

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `inventory_status_${month}_${year}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    toast({
      title: "Export successful",
      description: "Inventory status data has been exported to CSV.",
    });
  };

  // Handle update status button
  const handleUpdateStatus = () => {
    // Simply refresh the data
    refetchInventoryStatus();
  };

  // Get status counts
  const normalCount = inventoryStatus.filter(s => s.status === 'normal').length;
  const lowCount = inventoryStatus.filter(s => s.status === 'low').length;
  const outCount = inventoryStatus.filter(s => s.status === 'out').length;

  // Filter inventory status based on search query
  const filteredInventoryStatus = inventoryStatus.filter(status => 
    (status.product_name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (status.product_category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
    (status.product_sku?.toLowerCase() || '').includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold">Inventory Status</h1>
          <Button variant="outline" onClick={handleExport}>
            <Download className="mr-2 h-4 w-4" />
            Export
          </Button>
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
              placeholder="Search inventory..."
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
                <TableHead>SKU</TableHead>
                <TableHead>Product Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Initial Qty</TableHead>
                <TableHead>Produced</TableHead>
                <TableHead>Sold</TableHead>
                <TableHead>Remaining</TableHead>
                <TableHead>Min. Level</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">Loading...</TableCell>
                </TableRow>
              ) : filteredInventoryStatus.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="text-center py-10">
                    {searchQuery ? 'No inventory items found matching your search.' : 'No inventory status data available for this month.'}
                  </TableCell>
                </TableRow>
              ) : (
                filteredInventoryStatus.map(status => (
                  <TableRow key={status.id}>
                    <TableCell>{status.product_sku}</TableCell>
                    <TableCell className="font-medium">{status.product_name}</TableCell>
                    <TableCell>{status.product_category}</TableCell>
                    <TableCell>{status.initial_qty}</TableCell>
                    <TableCell>{status.produced}</TableCell>
                    <TableCell>{status.sold}</TableCell>
                    <TableCell>{status.remaining}</TableCell>
                    <TableCell>{status.min_level}</TableCell>
                    <TableCell>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        status.status === 'normal' ? 'bg-green-100 text-green-800' :
                        status.status === 'low' ? 'bg-amber-100 text-amber-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {status.status === 'normal' ? 'Normal' : 
                        status.status === 'low' ? 'Low Stock' : 
                        'Out of Stock'}
                      </span>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </Layout>
  );
};

export default InventoryStatusPage;
