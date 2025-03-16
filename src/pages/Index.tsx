import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CircleAlert, PackageCheck, ShoppingCart, TrendingUp, Users, Warehouse } from 'lucide-react';
import Layout from '@/components/Layout';

// Define types for better type safety
interface Sale {
  id: string;
  date: string;
  quantity: number;
  total_amount: number;
  products?: {
    name: string;
    sku: string;
  } | null;
  sales_channels?: {
    name: string;
  } | null;
}

interface RawMaterial {
  id: string;
  name: string;
  code: string;
  current_stock: number;
  min_stock: number;
  unit: string;
}

const Dashboard = () => {
  // Fetch summary data from different tables
  const { data: productData, isLoading: productsLoading } = useQuery({
    queryKey: ['products-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: rawMaterialsData, isLoading: rawMaterialsLoading } = useQuery({
    queryKey: ['raw-materials-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('raw_materials')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: salesData, isLoading: salesLoading } = useQuery<Sale[]>({
    queryKey: ['recent-sales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          id,
          date,
          quantity,
          total_amount,
          products(name, sku),
          sales_channels(name)
        `)
        .order('date', { ascending: false })
        .limit(5);
      
      if (error) throw error;
      
      // Transform the data to match our Sale interface
      return (data || []).map(item => ({
        id: item.id,
        date: item.date,
        quantity: item.quantity,
        total_amount: item.total_amount,
        products: item.products,
        sales_channels: item.sales_channels
      })) as Sale[];
    }
  });

  const { data: lowStockRawMaterials, isLoading: lowStockLoading } = useQuery<RawMaterial[]>({
    queryKey: ['low-stock-raw-materials'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('raw_materials')
        .select('*')
        .lt('current_stock', 'min_stock')
        .limit(5);
      
      if (error) throw error;
      return data as RawMaterial[] || [];
    }
  });

  // Mock data for charts (will be replaced with real data later)
  const salesChartData = [
    { name: 'Jan', sales: 4000 },
    { name: 'Feb', sales: 3000 },
    { name: 'Mar', sales: 5000 },
    { name: 'Apr', sales: 6000 },
    { name: 'May', sales: 7000 },
    { name: 'Jun', sales: 5500 },
  ];

  const productionChartData = [
    { name: 'Jan', produced: 2400 },
    { name: 'Feb', produced: 1398 },
    { name: 'Mar', produced: 9800 },
    { name: 'Apr', produced: 3908 },
    { name: 'May', produced: 4800 },
    { name: 'Jun', produced: 3800 },
  ];

  const isLoading = productsLoading || rawMaterialsLoading || salesLoading || lowStockLoading;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="text-sm text-gray-500">
          {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </div>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-blue-500/10 p-3">
              <PackageCheck className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Products</p>
              <h3 className="text-2xl font-bold">{isLoading ? '...' : productData}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <Warehouse className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Raw Materials</p>
              <h3 className="text-2xl font-bold">{isLoading ? '...' : rawMaterialsData}</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-amber-500/10 p-3">
              <ShoppingCart className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Total Sales</p>
              <h3 className="text-2xl font-bold">₹ 1,43,382</h3>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 flex items-center gap-4">
            <div className="rounded-full bg-purple-500/10 p-3">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Staff Members</p>
              <h3 className="text-2xl font-bold">12</h3>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Monthly Sales</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={salesChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="sales" fill="#4f46e5" />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Production Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={productionChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="produced" stroke="#10b981" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="sales">
            <TabsList className="mb-4">
              <TabsTrigger value="sales">Recent Sales</TabsTrigger>
              <TabsTrigger value="alerts">Stock Alerts</TabsTrigger>
            </TabsList>
            <TabsContent value="sales">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Date</th>
                      <th className="text-left py-3 px-4">Product</th>
                      <th className="text-left py-3 px-4">Channel</th>
                      <th className="text-left py-3 px-4">Quantity</th>
                      <th className="text-right py-3 px-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">Loading...</td>
                      </tr>
                    ) : salesData && salesData.length > 0 ? (
                      salesData.map((sale) => (
                        <tr key={sale.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{new Date(sale.date).toLocaleDateString()}</td>
                          <td className="py-3 px-4">
                            {sale.products?.name || 'Unknown'} 
                            {sale.products?.sku ? `(${sale.products.sku})` : ''}
                          </td>
                          <td className="py-3 px-4">{sale.sales_channels?.name || 'Unknown'}</td>
                          <td className="py-3 px-4">{sale.quantity}</td>
                          <td className="py-3 px-4 text-right">₹ {sale.total_amount.toLocaleString()}</td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">No recent sales found</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
            <TabsContent value="alerts">
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4">Material</th>
                      <th className="text-left py-3 px-4">Code</th>
                      <th className="text-left py-3 px-4">Current Stock</th>
                      <th className="text-left py-3 px-4">Min Stock</th>
                      <th className="text-right py-3 px-4">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {isLoading ? (
                      <tr>
                        <td colSpan={5} className="text-center py-4">Loading...</td>
                      </tr>
                    ) : lowStockRawMaterials && lowStockRawMaterials.length > 0 ? (
                      lowStockRawMaterials.map((material) => (
                        <tr key={material.id} className="border-b hover:bg-gray-50">
                          <td className="py-3 px-4">{material.name}</td>
                          <td className="py-3 px-4">{material.code}</td>
                          <td className="py-3 px-4">{material.current_stock} {material.unit}</td>
                          <td className="py-3 px-4">{material.min_stock} {material.unit}</td>
                          <td className="py-3 px-4 text-right">
                            <span className="inline-flex items-center gap-1 rounded-full bg-red-100 px-2 py-1 text-xs font-semibold text-red-600">
                              <CircleAlert className="h-3 w-3" /> Low Stock
                            </span>
                          </td>
                        </tr>
                      ))
                    ) : (
                      <tr>
                        <td colSpan={5} className="text-center py-4">No stock alerts</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

const IndexPage = () => {
  return (
    <Layout>
      <Dashboard />
    </Layout>
  );
};

export default IndexPage;
