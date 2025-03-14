
import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import TabButton from '@/components/TabButton';
import StatusBadge from '@/components/StatusBadge';
import { Edit, Trash, Plus, Download, Upload, RefreshCw } from 'lucide-react';

const Purchases = () => {
  const [activeTab, setActiveTab] = useState('vendors');

  return (
    <div>
      <PageHeader 
        title="Purchases" 
        description="Manage vendors, raw materials, and stock purchases" 
      />
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex gap-2">
          <TabButton 
            active={activeTab === 'vendors'} 
            label="Vendors" 
            onClick={() => setActiveTab('vendors')} 
          />
          <TabButton 
            active={activeTab === 'rawMaterials'} 
            label="Raw Materials" 
            onClick={() => setActiveTab('rawMaterials')} 
          />
          <TabButton 
            active={activeTab === 'stockPurchases'} 
            label="Stock Purchases" 
            onClick={() => setActiveTab('stockPurchases')} 
          />
          <TabButton 
            active={activeTab === 'stockStatus'} 
            label="Stock Status" 
            onClick={() => setActiveTab('stockStatus')} 
          />
        </div>
      </div>
      
      {activeTab === 'vendors' && <VendorsTab />}
      {activeTab === 'rawMaterials' && <RawMaterialsTab />}
      {activeTab === 'stockPurchases' && <StockPurchasesTab />}
      {activeTab === 'stockStatus' && <StockStatusTab />}
    </div>
  );
};

const VendorsTab = () => {
  const vendors = [
    { id: 1, name: 'Spice Traders Ltd', contactPerson: 'John Smith', email: 'john@spicetraders.com', phone: '123-456-7890', gstin: 'GST1234567890' },
    { id: 2, name: 'Natural Herbs Co', contactPerson: 'Sarah Johnson', email: 'sarah@naturalherbs.com', phone: '987-654-3210', gstin: 'GST0987654321' },
    { id: 3, name: 'Farm Fresh Spices', contactPerson: 'Mike Davis', email: 'mike@farmfresh.com', phone: '555-123-4567', gstin: 'GST5551234567' },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search vendors..."
            className="search-input max-w-md"
          />
        </div>
        <button className="action-button">
          <Plus size={16} />
          Add Vendor
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Vendor</th>
              <th>Contact Person</th>
              <th>Email</th>
              <th>Phone</th>
              <th>GSTIN</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {vendors.map(vendor => (
              <tr key={vendor.id}>
                <td>{vendor.name}</td>
                <td>{vendor.contactPerson}</td>
                <td>{vendor.email}</td>
                <td>{vendor.phone}</td>
                <td>{vendor.gstin}</td>
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
      </div>
    </div>
  );
};

const RawMaterialsTab = () => {
  const rawMaterials = [
    { id: 1, name: 'Red Chilli', code: 'RM001', category: 'Spices', minStock: 50, unit: 'kg' },
    { id: 2, name: 'Turmeric', code: 'RM002', category: 'Spices', minStock: 30, unit: 'kg' },
    { id: 3, name: 'Coriander Seeds', code: 'RM003', category: 'Seeds', minStock: 40, unit: 'kg' },
    { id: 4, name: 'Black Pepper', code: 'RM004', category: 'Spices', minStock: 25, unit: 'kg' },
    { id: 5, name: 'Cumin Seeds', code: 'RM005', category: 'Seeds', minStock: 20, unit: 'kg' },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search raw materials..."
            className="search-input max-w-md"
          />
        </div>
        <button className="action-button">
          <Plus size={16} />
          Add Raw Material
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>RM/Stock Name</th>
              <th>RM Code</th>
              <th>Category</th>
              <th>Min. Stock</th>
              <th>Unit</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {rawMaterials.map(material => (
              <tr key={material.id}>
                <td>{material.name}</td>
                <td>{material.code}</td>
                <td>{material.category}</td>
                <td>{material.minStock}</td>
                <td>{material.unit}</td>
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
      </div>
    </div>
  );
};

const StockPurchasesTab = () => {
  const stockPurchases = [
    { id: 1, date: '10/03/2023', vendor: 'Spice Traders Ltd', poInvoice: 'PO-2023-001', rmName: 'Red Chilli', quantity: 100, unitPrice: 120, total: 12000 },
    { id: 2, date: '12/03/2023', vendor: 'Natural Herbs Co', poInvoice: 'PO-2023-002', rmName: 'Turmeric', quantity: 75, unitPrice: 90, total: 6750 },
    { id: 3, date: '15/03/2023', vendor: 'Farm Fresh Spices', poInvoice: 'PO-2023-003', rmName: 'Coriander Seeds', quantity: 50, unitPrice: 150, total: 7500 },
    { id: 4, date: '18/03/2023', vendor: 'Spice Traders Ltd', poInvoice: 'PO-2023-004', rmName: 'Black Pepper', quantity: 40, unitPrice: 200, total: 8000 },
    { id: 5, date: '22/03/2023', vendor: 'Natural Herbs Co', poInvoice: 'PO-2023-005', rmName: 'Cumin Seeds', quantity: 30, unitPrice: 180, total: 5400 },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search purchases..."
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
            Add Stock Purchase
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Vendor</th>
              <th>PO/Invoice</th>
              <th>RM/Stock Name</th>
              <th>Quantity</th>
              <th>Unit Price</th>
              <th>Total</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {stockPurchases.map(purchase => (
              <tr key={purchase.id}>
                <td>{purchase.date}</td>
                <td>{purchase.vendor}</td>
                <td>{purchase.poInvoice}</td>
                <td>{purchase.rmName}</td>
                <td>{purchase.quantity}</td>
                <td>₹{purchase.unitPrice.toFixed(2)}</td>
                <td>₹{purchase.total.toFixed(2)}</td>
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
      </div>
    </div>
  );
};

const StockStatusTab = () => {
  const stockStatus = [
    { id: 1, name: 'Red Chilli', category: 'Spices', openingBal: 50, purchases: 100, utilised: 75, adjustment: 0, closingBal: 75, minLevel: 50, status: 'normal' },
    { id: 2, name: 'Turmeric', category: 'Spices', openingBal: 30, purchases: 75, utilised: 60, adjustment: 0, closingBal: 45, minLevel: 30, status: 'normal' },
    { id: 3, name: 'Coriander Seeds', category: 'Seeds', openingBal: 20, purchases: 50, utilised: 55, adjustment: 0, closingBal: 15, minLevel: 40, status: 'low' },
    { id: 4, name: 'Black Pepper', category: 'Spices', openingBal: 15, purchases: 40, utilised: 30, adjustment: 0, closingBal: 25, minLevel: 25, status: 'normal' },
    { id: 5, name: 'Cumin Seeds', category: 'Seeds', openingBal: 10, purchases: 30, utilised: 40, adjustment: 0, closingBal: 0, minLevel: 20, status: 'out' },
  ];

  const [date, setDate] = useState('14-03-2023');

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-4">
        <div className="flex gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date
            </label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="border border-gray-300 rounded-md p-2"
            />
          </div>
          <button className="action-button h-10 self-end">
            <RefreshCw size={16} />
            Update Status
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-app-normal">{stockStatus.filter(s => s.status === 'normal').length}</div>
          <div className="text-gray-600">Normal Stock Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-app-low">{stockStatus.filter(s => s.status === 'low').length}</div>
          <div className="text-gray-600">Low Stock Items</div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow-sm">
          <div className="text-xl font-bold text-app-out">{stockStatus.filter(s => s.status === 'out').length}</div>
          <div className="text-gray-600">Out of Stock Items</div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Stock Name</th>
              <th>Category</th>
              <th>Opening Balance</th>
              <th>Purchases</th>
              <th>Utilised</th>
              <th>Adj +/-</th>
              <th>Closing Bal</th>
              <th>Min. Level</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {stockStatus.map(stock => (
              <tr key={stock.id}>
                <td>{stock.name}</td>
                <td>{stock.category}</td>
                <td>{stock.openingBal}</td>
                <td>{stock.purchases}</td>
                <td>{stock.utilised}</td>
                <td>
                  <input
                    type="number"
                    defaultValue={stock.adjustment}
                    className="w-16 border border-gray-300 rounded p-1"
                  />
                </td>
                <td>{stock.closingBal}</td>
                <td>{stock.minLevel}</td>
                <td>
                  <StatusBadge status={stock.status as 'normal' | 'low' | 'out'} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Purchases;
