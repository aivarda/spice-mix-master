
import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import TabButton from '@/components/TabButton';
import StatusBadge from '@/components/StatusBadge';
import { Edit, Trash, Plus, Download, Upload, RefreshCw } from 'lucide-react';

const Sales = () => {
  const [activeTab, setActiveTab] = useState('salesChannels');

  return (
    <div>
      <PageHeader 
        title="Sales" 
        description="Manage sales channels, inventory, and track sales records" 
      />
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex gap-2">
          <TabButton 
            active={activeTab === 'salesChannels'} 
            label="Sales Channels" 
            onClick={() => setActiveTab('salesChannels')} 
          />
          <TabButton 
            active={activeTab === 'salesRecord'} 
            label="Sales Record" 
            onClick={() => setActiveTab('salesRecord')} 
          />
          <TabButton 
            active={activeTab === 'inventory'} 
            label="Inventory" 
            onClick={() => setActiveTab('inventory')} 
          />
          <TabButton 
            active={activeTab === 'inventoryStatus'} 
            label="Inventory Status" 
            onClick={() => setActiveTab('inventoryStatus')} 
          />
        </div>
      </div>
      
      {activeTab === 'salesChannels' && <SalesChannelsTab />}
      {activeTab === 'salesRecord' && <SalesRecordTab />}
      {activeTab === 'inventory' && <InventoryTab />}
      {activeTab === 'inventoryStatus' && <InventoryStatusTab />}
    </div>
  );
};

const SalesChannelsTab = () => {
  const channels = [
    { id: 1, name: 'Amazon', description: 'Online marketplace', contactPerson: 'John Doe', email: 'john@amazon.com', phone: '123-456-7890' },
    { id: 2, name: 'Retail Store', description: 'Physical retail locations', contactPerson: 'Jane Smith', email: 'jane@retailstore.com', phone: '987-654-3210' },
    { id: 3, name: 'Wholesale', description: 'Bulk sales to distributors', contactPerson: 'Mike Johnson', email: 'mike@wholesale.com', phone: '555-123-4567' },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search channels..."
            className="search-input max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary-button">
            <Upload size={16} />
            Import
          </button>
          <button className="secondary-button">
            <Download size={16} />
            Export
          </button>
          <button className="action-button">
            <Plus size={16} />
            Add Sales Channel
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Channel Name</th>
              <th>Description</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {channels.map(channel => (
              <tr key={channel.id}>
                <td>{channel.name}</td>
                <td>{channel.description}</td>
                <td>{channel.contactPerson}</td>
                <td>{channel.email}</td>
                <td>{channel.phone}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 text-sm text-gray-500">
          Showing {channels.length} of {channels.length} entries
        </div>
      </div>
    </div>
  );
};

const SalesRecordTab = () => {
  const sales = [
    { id: 1, date: '15/05/2023', channel: 'Amazon', orderNo: 'ORD-001', invoiceNo: 'INV-001', product: 'SAM250 - Sambar Powder 250g', quantity: 10, unitPrice: 125, totalAmount: 1250 },
    { id: 2, date: '18/05/2023', channel: 'Retail Store', orderNo: 'ORD-002', invoiceNo: 'INV-002', product: 'CHL100 - Chilli Powder 100g', quantity: 15, unitPrice: 60, totalAmount: 900 },
    { id: 3, date: '20/05/2023', channel: 'Wholesale', orderNo: 'ORD-003', invoiceNo: 'INV-003', product: 'SAM500 - Sambar Powder 500g', quantity: 25, unitPrice: 230, totalAmount: 5750 },
    { id: 4, date: '22/05/2023', channel: 'Amazon', orderNo: 'ORD-004', invoiceNo: 'INV-004', product: 'TUR250 - Turmeric Powder 250g', quantity: 8, unitPrice: 85, totalAmount: 680 },
    { id: 5, date: '25/05/2023', channel: 'Retail Store', orderNo: 'ORD-005', invoiceNo: 'INV-005', product: 'BRY500 - Biryani Masala 500g', quantity: 5, unitPrice: 250, totalAmount: 1250 },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search sales..."
            className="search-input max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary-button">
            <Upload size={16} />
            Import
          </button>
          <button className="secondary-button">
            <Download size={16} />
            Export
          </button>
          <button className="action-button">
            <Plus size={16} />
            Record New Sale
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Sales Channel</th>
              <th>Order No.</th>
              <th>Invoice No.</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total Amount</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sales.map(sale => (
              <tr key={sale.id}>
                <td>{sale.date}</td>
                <td>{sale.channel}</td>
                <td>{sale.orderNo}</td>
                <td>{sale.invoiceNo}</td>
                <td>{sale.product}</td>
                <td>{sale.quantity}</td>
                <td>₹{sale.unitPrice.toFixed(2)}</td>
                <td>₹{sale.totalAmount.toFixed(2)}</td>
                <td>
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 text-sm text-gray-500">
          Showing {sales.length} of {sales.length} entries
        </div>
      </div>
    </div>
  );
};

const InventoryTab = () => {
  const inventory = [
    { id: 1, sku: 'SAM250', name: 'Sambar Powder 250g', category: 'Blended Spices', unitPrice: 125, quantity: 100, minStock: 20, status: 'normal' },
    { id: 2, sku: 'SAM500', name: 'Sambar Powder 500g', category: 'Blended Spices', unitPrice: 230, quantity: 75, minStock: 15, status: 'normal' },
    { id: 3, sku: 'CHL100', name: 'Chilli Powder 100g', category: 'Pure Spices', unitPrice: 60, quantity: 150, minStock: 30, status: 'normal' },
    { id: 4, sku: 'TUR250', name: 'Turmeric Powder 250g', category: 'Pure Spices', unitPrice: 85, quantity: 120, minStock: 25, status: 'normal' },
    { id: 5, sku: 'COR100', name: 'Coriander Powder 100g', category: 'Pure Spices', unitPrice: 45, quantity: 90, minStock: 20, status: 'normal' },
    { id: 6, sku: 'BRY500', name: 'Biryani Masala 500g', category: 'Blended Spices', unitPrice: 250, quantity: 10, minStock: 15, status: 'low' },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search inventory..."
            className="search-input max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary-button">
            <Upload size={16} />
            Import
          </button>
          <button className="secondary-button">
            <Download size={16} />
            Export
          </button>
          <button className="action-button">
            <Plus size={16} />
            Add Inventory Item
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Unit Price</th>
              <th>Quantity</th>
              <th>Minimum Stock</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>₹{item.unitPrice.toFixed(2)}</td>
                <td>{item.quantity}</td>
                <td>{item.minStock}</td>
                <td>
                  <StatusBadge status={item.status as 'normal' | 'low' | 'out'} />
                </td>
                <td>
                  <div className="flex gap-2">
                    <button className="p-1 text-blue-600 hover:text-blue-800">
                      <Edit size={18} />
                    </button>
                    <button className="p-1 text-red-600 hover:text-red-800">
                      <Trash size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="p-4 text-sm text-gray-500">
          Showing {inventory.length} of {inventory.length} entries
        </div>
      </div>
    </div>
  );
};

const InventoryStatusTab = () => {
  const [date, setDate] = useState('14-03-2025');
  const [filter, setFilter] = useState('All Items');

  const inventory = [
    { id: 1, sku: 'SAM250', name: 'Sambar Powder 250g', category: 'Blended Spices', initialQty: 100, sold: 10, remaining: 90, minStock: 20, status: 'normal' },
    { id: 2, sku: 'SAM500', name: 'Sambar Powder 500g', category: 'Blended Spices', initialQty: 75, sold: 25, remaining: 50, minStock: 15, status: 'normal' },
    { id: 3, sku: 'CHL100', name: 'Chilli Powder 100g', category: 'Pure Spices', initialQty: 150, sold: 15, remaining: 135, minStock: 30, status: 'normal' },
    { id: 4, sku: 'TUR250', name: 'Turmeric Powder 250g', category: 'Pure Spices', initialQty: 120, sold: 8, remaining: 112, minStock: 25, status: 'normal' },
  ];

  return (
    <div>
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex items-start">
          <div className="flex-shrink-0 text-yellow-600">
            <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <span className="font-medium">Low Stock Warning:</span> 1 item is below minimum stock levels.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-4">Inventory Status as of 3/14/2025</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filter
            </label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="All Items">All Items</option>
              <option value="Low Stock">Low Stock</option>
              <option value="Normal Stock">Normal Stock</option>
              <option value="Out of Stock">Out of Stock</option>
            </select>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <button className="action-button">
            <RefreshCw size={16} />
            Update Status
          </button>
        </div>
      </div>
      
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search inventory..."
            className="search-input max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <button className="secondary-button">
            <Upload size={16} />
            Import
          </button>
          <button className="secondary-button">
            <Download size={16} />
            Export
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>SKU</th>
              <th>Product Name</th>
              <th>Category</th>
              <th>Initial Quantity</th>
              <th>Sold</th>
              <th>Remaining</th>
              <th>Min. Stock</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {inventory.map(item => (
              <tr key={item.id}>
                <td>{item.sku}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.initialQty}</td>
                <td>{item.sold}</td>
                <td>{item.remaining}</td>
                <td>{item.minStock}</td>
                <td>
                  <StatusBadge status={item.status as 'normal' | 'low' | 'out'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Sales;
