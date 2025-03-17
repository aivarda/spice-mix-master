
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { useNavigate } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  BoxIcon,
  Package,
  ShoppingBag,
  ShoppingCart,
  Users,
} from 'lucide-react';
import Layout from '@/components/Layout';
import { format } from 'date-fns';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

// Define interfaces
interface Sale {
  id: string;
  date: string;
  quantity: number;
  total_amount: number;
  product_id?: string;
  product?: {
    name: string;
    sku: string;
  };
  products?: {
    name: string;
    sku: string;
  }[];
  channel_id?: string;
  sales_channel?: {
    name: string;
  };
  sales_channels?: {
    name: string;
  }[];
}

interface Task {
  id: string;
  task_id: string;
  process: string;
  date_assigned: string;
  staff?: {
    name: string;
  };
  raw_materials?: {
    name: string;
  };
}

interface Product {
  id: string;
  name: string;
  sku: string;
  quantity: number;
  min_stock: number;
}

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  // Fetch recent sales data
  const { data: salesData, isLoading: isSalesLoading } = useQuery({
    queryKey: ['recentSales'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sales')
        .select(`
          id, date, quantity, total_amount,
          products:product_id(name, sku),
          sales_channels:channel_id(name)
        `)
        .order('date', { ascending: false })
        .limit(5);

      if (error) throw error;
      console.log("Sales data:", data);
      return data as Sale[];
    }
  });

  // Fetch recent tasks data
  const { data: tasksData, isLoading: isTasksLoading } = useQuery({
    queryKey: ['recentTasks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          id, task_id, process, date_assigned,
          staff(name),
          raw_materials:raw_material_id(name)
        `)
        .order('date_assigned', { ascending: false })
        .limit(5);

      if (error) throw error;
      return data as Task[];
    }
  });

  // Fetch low stock products
  const { data: lowStockData, isLoading: isLowStockLoading } = useQuery({
    queryKey: ['lowStock'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('products')
        .select('id, name, sku, quantity, min_stock')
        .lt('quantity', 20)
        .order('quantity', { ascending: true })
        .limit(5);

      if (error) throw error;
      return data as Product[];
    }
  });

  // Calculate total sales
  const totalSales = salesData?.reduce((acc, sale) => acc + (sale.total_amount || 0), 0) || 0;

  return (
    <Layout>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
      </div>

      <Tabs defaultValue={activeTab} className="mt-6" onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="sales">Sales</TabsTrigger>
          <TabsTrigger value="tasks">Tasks</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
        </TabsList>
        <TabsContent value="overview" className="space-y-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Sales</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹{totalSales.toLocaleString()}</div>
                <p className="text-xs text-muted-foreground">
                  Last month sales overview
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Tasks</CardTitle>
                <BoxIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{tasksData?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Currently ongoing tasks
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Inventory Items</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{lowStockData?.length || 0}</div>
                <p className="text-xs text-muted-foreground">
                  Low stock items to reorder
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Staff</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  Team members on duty
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Sales</CardTitle>
                <CardDescription>
                  Last {salesData?.length || 0} sales transactions
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isSalesLoading ? (
                  <div className="flex justify-center py-6">Loading recent sales...</div>
                ) : salesData && salesData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Product</TableHead>
                        <TableHead>Channel</TableHead>
                        <TableHead className="text-right">Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {salesData.map((sale) => (
                        <TableRow key={sale.id}>
                          <TableCell>{format(new Date(sale.date), 'dd/MM/yyyy')}</TableCell>
                          <TableCell>{sale.products?.[0]?.name || 'Unknown'}</TableCell>
                          <TableCell>{sale.sales_channels?.[0]?.name || 'Unknown'}</TableCell>
                          <TableCell className="text-right">₹{sale.total_amount}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex justify-center py-6">No recent sales found</div>
                )}
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="float-right" onClick={() => navigate('/sales/records')}>
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Low Stock Alert</CardTitle>
                <CardDescription>
                  Items below minimum threshold
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isLowStockLoading ? (
                  <div className="flex justify-center py-6">Loading stock data...</div>
                ) : lowStockData && lowStockData.length > 0 ? (
                  <div className="space-y-4">
                    {lowStockData.map((item) => (
                      <div key={item.id} className="flex items-center justify-between">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-sm text-muted-foreground">{item.sku}</p>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          item.quantity === 0 ? 'bg-red-100 text-red-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {item.quantity} left
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="flex justify-center py-6">No low stock items</div>
                )}
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="float-right" onClick={() => navigate('/purchases/stock-status')}>
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Recent Tasks</CardTitle>
                <CardDescription>
                  Latest assigned production tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                {isTasksLoading ? (
                  <div className="flex justify-center py-6">Loading recent tasks...</div>
                ) : tasksData && tasksData.length > 0 ? (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Task ID</TableHead>
                        <TableHead>Process</TableHead>
                        <TableHead>Material</TableHead>
                        <TableHead>Assigned To</TableHead>
                        <TableHead>Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tasksData.map((task) => (
                        <TableRow key={task.id}>
                          <TableCell>{task.task_id}</TableCell>
                          <TableCell>{task.process}</TableCell>
                          <TableCell>{task.raw_materials?.name || 'Unknown'}</TableCell>
                          <TableCell>{task.staff?.name || 'Unassigned'}</TableCell>
                          <TableCell>{format(new Date(task.date_assigned), 'dd/MM/yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="flex justify-center py-6">No recent tasks found</div>
                )}
                <div className="mt-4">
                  <Button size="sm" variant="outline" className="float-right" onClick={() => navigate('/tasks/management')}>
                    View all <ArrowRight className="ml-1 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Quick Access</CardTitle>
                <CardDescription>
                  Common actions and reports
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/sales/records')}>
                    Record Sales
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/purchases/stock-purchases')}>
                    Purchase Stock
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/tasks/management')}>
                    Assign Tasks
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                  <Button variant="outline" className="w-full justify-between" onClick={() => navigate('/sales/inventory-status')}>
                    Check Inventory
                    <ArrowUpRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="sales" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Sales Overview</CardTitle>
              <CardDescription>Detailed analysis of your sales data</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Sales detailed content goes here...</p>
              <Button className="mt-4" onClick={() => navigate('/sales/records')}>
                Go to Sales Module
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tasks" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Tasks Overview</CardTitle>
              <CardDescription>Current production tasks and assignments</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Tasks detailed content goes here...</p>
              <Button className="mt-4" onClick={() => navigate('/tasks/management')}>
                Go to Tasks Module
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="inventory" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Inventory Overview</CardTitle>
              <CardDescription>Stock levels and raw materials status</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Inventory detailed content goes here...</p>
              <Button className="mt-4" onClick={() => navigate('/purchases/stock-status')}>
                Go to Inventory Module
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </Layout>
  );
};

export default Dashboard;
