
import React from 'react';
import PageHeader from '@/components/PageHeader';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { ArrowUpRight, Package, ShoppingCart, Truck, Users, DollarSign, AlertCircle } from 'lucide-react';

const salesData = [
  { name: 'Jan', value: 12000 },
  { name: 'Feb', value: 19000 },
  { name: 'Mar', value: 15000 },
  { name: 'Apr', value: 28000 },
  { name: 'May', value: 22000 },
  { name: 'Jun', value: 30000 },
];

const inventoryData = [
  { name: 'Sambar Powder', value: 40 },
  { name: 'Chilli Powder', value: 20 },
  { name: 'Turmeric Powder', value: 15 },
  { name: 'Coriander Powder', value: 25 },
];

const COLORS = ['#0ea5e9', '#22c55e', '#eab308', '#ef4444'];

const Dashboard = () => {
  return (
    <div>
      <PageHeader 
        title="Dashboard" 
        description="Overview of your spice production business" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          title="Total Sales"
          value="₹1,28,500"
          trend="+12%"
          icon={<DollarSign className="text-green-500" />}
        />
        <DashboardCard
          title="Raw Materials"
          value="24"
          trend="3 Low Stock"
          icon={<Package className="text-blue-500" />}
          trendColor="text-yellow-500"
        />
        <DashboardCard
          title="Pending Tasks"
          value="8"
          trend="2 Overdue"
          icon={<AlertCircle className="text-red-500" />}
          trendColor="text-red-500"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Monthly Sales</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip formatter={(value) => [`₹${value}`, 'Revenue']} />
                <Legend />
                <Bar dataKey="value" fill="#0ea5e9" name="Revenue" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Inventory Distribution</h2>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={inventoryData}
                  cx="50%"
                  cy="50%"
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                  nameKey="name"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {inventoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value, name) => [`${value} units`, name]} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Recent Purchases</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Date</th>
                <th className="text-left py-2">Vendor</th>
                <th className="text-left py-2">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">12/03/2023</td>
                <td className="py-2">Spice Traders Ltd</td>
                <td className="py-2">₹12,500</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">10/03/2023</td>
                <td className="py-2">Natural Herbs Co</td>
                <td className="py-2">₹8,200</td>
              </tr>
              <tr className="border-b">
                <td className="py-2">05/03/2023</td>
                <td className="py-2">Farm Fresh Spices</td>
                <td className="py-2">₹15,300</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h2 className="text-lg font-medium mb-4">Low Stock Items</h2>
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-2">Item</th>
                <th className="text-left py-2">Current</th>
                <th className="text-left py-2">Minimum</th>
                <th className="text-left py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="py-2">Biryani Masala 500g</td>
                <td className="py-2">10</td>
                <td className="py-2">15</td>
                <td className="py-2">
                  <span className="status-badge status-low">Low Stock</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Cardamom Green</td>
                <td className="py-2">5</td>
                <td className="py-2">10</td>
                <td className="py-2">
                  <span className="status-badge status-low">Low Stock</span>
                </td>
              </tr>
              <tr className="border-b">
                <td className="py-2">Cumin Seeds</td>
                <td className="py-2">0</td>
                <td className="py-2">8</td>
                <td className="py-2">
                  <span className="status-badge status-out">Out of Stock</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

type DashboardCardProps = {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  trendColor?: string;
};

const DashboardCard = ({ title, value, trend, icon, trendColor = "text-green-500" }: DashboardCardProps) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex justify-between items-start">
        <div>
          <p className="text-gray-500 mb-1">{title}</p>
          <h3 className="text-2xl font-bold">{value}</h3>
          <p className={`flex items-center gap-1 ${trendColor}`}>
            {trend}
            <ArrowUpRight size={16} />
          </p>
        </div>
        <div className="p-3 bg-gray-100 rounded-full">{icon}</div>
      </div>
    </div>
  );
};

export default Dashboard;
