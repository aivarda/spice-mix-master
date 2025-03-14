
import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import TabButton from '@/components/TabButton';
import StatusBadge from '@/components/StatusBadge';
import { Edit, RefreshCw, Save } from 'lucide-react';

const Production = () => {
  const [activeTab, setActiveTab] = useState('productionPlanner');

  return (
    <div>
      <PageHeader 
        title="Production" 
        description="Manage production planning and processes" 
      />
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex gap-2">
          <TabButton 
            active={activeTab === 'productionPlanner'} 
            label="Production Planner" 
            onClick={() => setActiveTab('productionPlanner')} 
          />
          <TabButton 
            active={activeTab === 'productionProcesses'} 
            label="Production Processes" 
            onClick={() => setActiveTab('productionProcesses')} 
          />
          <TabButton 
            active={activeTab === 'productionStatus'} 
            label="Production Status" 
            onClick={() => setActiveTab('productionStatus')} 
          />
        </div>
      </div>
      
      {activeTab === 'productionPlanner' && <ProductionPlannerTab />}
      {activeTab === 'productionProcesses' && <ProductionProcessesTab />}
      {activeTab === 'productionStatus' && <ProductionStatusTab />}
    </div>
  );
};

const ProductionPlannerTab = () => {
  const productionPlans = [
    { id: 1, product: 'Sambar Powder 250g', plannedQty: 500, startDate: '20/03/2023', endDate: '25/03/2023', status: 'Pending' },
    { id: 2, product: 'Chilli Powder 100g', plannedQty: 300, startDate: '22/03/2023', endDate: '24/03/2023', status: 'In Progress' },
    { id: 3, product: 'Turmeric Powder 250g', plannedQty: 400, startDate: '25/03/2023', endDate: '28/03/2023', status: 'Pending' },
    { id: 4, product: 'Biryani Masala 500g', plannedQty: 200, startDate: '15/03/2023', endDate: '19/03/2023', status: 'Completed' },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <h2 className="text-xl font-medium">Production Schedule</h2>
        <button className="action-button">
          <Edit size={16} />
          Edit Schedule
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Product</th>
              <th>Planned Quantity</th>
              <th>Start Date</th>
              <th>End Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {productionPlans.map(plan => (
              <tr key={plan.id}>
                <td>{plan.product}</td>
                <td>{plan.plannedQty}</td>
                <td>{plan.startDate}</td>
                <td>{plan.endDate}</td>
                <td>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    plan.status === 'Completed' ? 'bg-green-100 text-green-800' :
                    plan.status === 'In Progress' ? 'bg-blue-100 text-blue-800' :
                    'bg-yellow-100 text-yellow-800'
                  }`}>
                    {plan.status}
                  </span>
                </td>
                <td>
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const ProductionProcessesTab = () => {
  const preProdProcesses = ['Cleaning', 'C & D', 'Seeds C & D', 'Roasting', 'RFP', 'Sample'];
  const prodProcesses = ['Grinding', 'Packing'];

  return (
    <div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Pre-Production Processes</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {preProdProcesses.map((process, index) => (
                <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>{process}</span>
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                </li>
              ))}
            </ul>
            <button className="mt-4 text-app-blue hover:text-blue-700 font-medium">
              + Add New Process
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium">Production Processes</h3>
          </div>
          <div className="p-4">
            <ul className="space-y-2">
              {prodProcesses.map((process, index) => (
                <li key={index} className="flex justify-between items-center p-2 hover:bg-gray-50 rounded">
                  <span>{process}</span>
                  <button className="p-1 text-blue-600 hover:text-blue-800">
                    <Edit size={18} />
                  </button>
                </li>
              ))}
            </ul>
            <button className="mt-4 text-app-blue hover:text-blue-700 font-medium">
              + Add New Process
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const ProductionStatusTab = () => {
  const [date, setDate] = useState('14-03-2023');
  const [processStage, setProcessStage] = useState('Pre-Prod');
  const [process, setProcess] = useState('Cleaning');
  const [month, setMonth] = useState('Mar-24');

  const materials = [
    { id: 'RM1', name: 'Red Chilli', category: 'Spices', openingBal: 10.00, assigned: 0.00, completed: 10.00, wastage: 0.00, pending: 0.00, adjustment: 0, closingBal: 20.00, minLevel: 5.00, status: 'normal' },
    { id: 'RM2', name: 'Turmeric', category: 'Spices', openingBal: 15.00, assigned: 5.00, completed: 10.00, wastage: 0.10, pending: 0.00, adjustment: 0, closingBal: 24.90, minLevel: 7.50, status: 'normal' },
    { id: 'RM3', name: 'Black Pepper', category: 'Spices', openingBal: 8.00, assigned: 2.00, completed: 6.00, wastage: 0.20, pending: 0.00, adjustment: 0, closingBal: 13.80, minLevel: 4.00, status: 'normal' },
  ];

  return (
    <div>
      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-4">Production Status Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
              Process Stage
            </label>
            <select
              value={processStage}
              onChange={(e) => setProcessStage(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Pre-Prod">Pre-Prod</option>
              <option value="Prod">Prod</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Process
            </label>
            <select
              value={process}
              onChange={(e) => setProcess(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Cleaning">Cleaning</option>
              <option value="C & D">C & D</option>
              <option value="Seeds C & D">Seeds C & D</option>
              <option value="Roasting">Roasting</option>
              <option value="RFP">RFP</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Month
            </label>
            <select
              value={month}
              onChange={(e) => setMonth(e.target.value)}
              className="w-full border border-gray-300 rounded-md p-2"
            >
              <option value="Mar-24">Mar-24</option>
              <option value="Feb-24">Feb-24</option>
              <option value="Jan-24">Jan-24</option>
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

      <div className="bg-white p-4 rounded-lg shadow-sm mb-6">
        <h3 className="text-lg font-medium mb-4">Pre-Production - Cleaning</h3>
        <p className="text-gray-600 mb-4">Month: Mar-24 | Date: 3/14/2025</p>

        <div className="flex items-center justify-end gap-6 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-app-blue"></div>
            <span className="text-sm">Assigned</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-app-normal"></div>
            <span className="text-sm">Completed</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-app-out"></div>
            <span className="text-sm">Wastage</span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Category</th>
                <th>Opening Bal</th>
                <th>Assigned</th>
                <th>Completed</th>
                <th>Wastage</th>
                <th>Pending</th>
                <th>Adj+/-</th>
                <th>Closing Bal</th>
                <th>Min Level</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {materials.map(material => (
                <tr key={material.id}>
                  <td>{material.id}</td>
                  <td>{material.name}</td>
                  <td>{material.category}</td>
                  <td>{material.openingBal.toFixed(2)}</td>
                  <td>{material.assigned.toFixed(2)}</td>
                  <td>{material.completed.toFixed(2)}</td>
                  <td>{material.wastage.toFixed(2)}</td>
                  <td>{material.pending.toFixed(2)}</td>
                  <td>
                    <input
                      type="number"
                      defaultValue={material.adjustment}
                      className="w-16 border border-gray-300 rounded p-1"
                    />
                  </td>
                  <td>{material.closingBal.toFixed(2)}</td>
                  <td>{material.minLevel.toFixed(2)}</td>
                  <td>
                    <StatusBadge status={material.status as 'normal' | 'low' | 'out'} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-4 flex justify-end">
          <button className="action-button">
            <Save size={16} />
            Save Adjustments
          </button>
        </div>
      </div>
    </div>
  );
};

export default Production;
