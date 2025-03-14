
import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import { Save } from 'lucide-react';

const Settings = () => {
  const [companyName, setCompanyName] = useState('Spice Mix Master');
  const [email, setEmail] = useState('admin@spice.com');
  const [phone, setPhone] = useState('123-456-7890');
  const [address, setAddress] = useState('123 Spice Road, Bangalore, Karnataka, India');
  const [gstin, setGstin] = useState('GSTIN123456789');
  const [currency, setCurrency] = useState('INR');

  return (
    <div>
      <PageHeader 
        title="Settings" 
        description="Configure your application settings" 
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Company Information</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Company Name
                  </label>
                  <input
                    type="text"
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    GSTIN
                  </label>
                  <input
                    type="text"
                    value={gstin}
                    onChange={(e) => setGstin(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Address
                  </label>
                  <textarea
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    rows={3}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Application Settings</h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <select
                    value={currency}
                    onChange={(e) => setCurrency(e.target.value)}
                    className="w-full border border-gray-300 rounded-md p-2"
                  >
                    <option value="INR">Indian Rupee (₹)</option>
                    <option value="USD">US Dollar ($)</option>
                    <option value="EUR">Euro (€)</option>
                    <option value="GBP">British Pound (£)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Date Format
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    defaultValue="dd/mm/yyyy"
                  >
                    <option value="dd/mm/yyyy">DD/MM/YYYY</option>
                    <option value="mm/dd/yyyy">MM/DD/YYYY</option>
                    <option value="yyyy/mm/dd">YYYY/MM/DD</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Default Tax Rate (%)
                  </label>
                  <input
                    type="number"
                    defaultValue={18}
                    className="w-full border border-gray-300 rounded-md p-2"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Financial Year Start
                  </label>
                  <select
                    className="w-full border border-gray-300 rounded-md p-2"
                    defaultValue="april"
                  >
                    <option value="january">January</option>
                    <option value="april">April</option>
                    <option value="july">July</option>
                    <option value="october">October</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 flex justify-end">
            <button className="action-button">
              <Save size={16} />
              Save Settings
            </button>
          </div>
        </div>

        <div>
          <div className="bg-white rounded-lg shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Categories</h3>
            </div>
            <div className="p-4">
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Raw Material Categories
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Spices</span>
                    <button className="text-gray-500 hover:text-gray-700">Edit</button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Seeds</span>
                    <button className="text-gray-500 hover:text-gray-700">Edit</button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Herbs</span>
                    <button className="text-gray-500 hover:text-gray-700">Edit</button>
                  </div>
                </div>
                <button className="mt-2 text-app-blue font-medium text-sm">
                  + Add Category
                </button>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Product Categories
                </label>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Blended Spices</span>
                    <button className="text-gray-500 hover:text-gray-700">Edit</button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Pure Spices</span>
                    <button className="text-gray-500 hover:text-gray-700">Edit</button>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span>Masala Blends</span>
                    <button className="text-gray-500 hover:text-gray-700">Edit</button>
                  </div>
                </div>
                <button className="mt-2 text-app-blue font-medium text-sm">
                  + Add Category
                </button>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm overflow-hidden mt-6">
            <div className="p-4 border-b">
              <h3 className="text-lg font-medium">Units</h3>
            </div>
            <div className="p-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>kg (Kilogram)</span>
                  <button className="text-gray-500 hover:text-gray-700">Edit</button>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>g (Gram)</span>
                  <button className="text-gray-500 hover:text-gray-700">Edit</button>
                </div>
                <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                  <span>pcs (Pieces)</span>
                  <button className="text-gray-500 hover:text-gray-700">Edit</button>
                </div>
              </div>
              <button className="mt-2 text-app-blue font-medium text-sm">
                + Add Unit
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
