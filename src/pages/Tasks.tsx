
import React, { useState } from 'react';
import PageHeader from '@/components/PageHeader';
import TabButton from '@/components/TabButton';
import { Edit, Trash, Plus, Download, Upload } from 'lucide-react';

const Tasks = () => {
  const [activeTab, setActiveTab] = useState('staffManagement');

  return (
    <div>
      <PageHeader 
        title="Tasks" 
        description="Manage staff and assign production tasks" 
      />
      
      <div className="bg-white rounded-lg shadow-sm mb-6">
        <div className="p-4 flex gap-2">
          <TabButton 
            active={activeTab === 'staffManagement'} 
            label="Staff Management" 
            onClick={() => setActiveTab('staffManagement')} 
          />
          <TabButton 
            active={activeTab === 'taskManagement'} 
            label="Task Management" 
            onClick={() => setActiveTab('taskManagement')} 
          />
        </div>
      </div>
      
      {activeTab === 'staffManagement' && <StaffManagementTab />}
      {activeTab === 'taskManagement' && <TaskManagementTab />}
    </div>
  );
};

const StaffManagementTab = () => {
  const staff = [
    { id: 1, staffId: 'EMP001', name: 'Rajesh Kumar', phone: '9876543210', address: '123 Main Street, Bangalore', aadhaar: '1234-5678-9012', bloodGroup: 'O+' },
    { id: 2, staffId: 'EMP002', name: 'Priya Sharma', phone: '8765432109', address: '456 Park Avenue, Chennai', aadhaar: '2345-6789-0123', bloodGroup: 'A+' },
    { id: 3, staffId: 'EMP003', name: 'Amit Patel', phone: '7654321098', address: '789 Lake View, Mumbai', aadhaar: '3456-7890-1234', bloodGroup: 'B+' },
    { id: 4, staffId: 'EMP004', name: 'Deepa Singh', phone: '6543210987', address: '321 River Road, Delhi', aadhaar: '4567-8901-2345', bloodGroup: 'AB-' },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search staff..."
            className="search-input max-w-md"
          />
        </div>
        <button className="action-button">
          <Plus size={16} />
          Add Staff
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        <table className="data-table">
          <thead>
            <tr>
              <th>Staff ID</th>
              <th>Staff Name</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Aadhaar</th>
              <th>Blood Group</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {staff.map(person => (
              <tr key={person.id}>
                <td>{person.staffId}</td>
                <td>{person.name}</td>
                <td>{person.phone}</td>
                <td>{person.address}</td>
                <td>{person.aadhaar}</td>
                <td>{person.bloodGroup}</td>
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

const TaskManagementTab = () => {
  const tasks = [
    { 
      id: 1, 
      taskId: 'T001', 
      dateAssigned: '10/03/2023', 
      rmName: 'Red Chilli', 
      process: 'Cleaning', 
      assignedQty: 25, 
      staffName: 'Rajesh Kumar',
      dateCompleted: '12/03/2023',
      wastageQty: 2,
      taskDescription: 'Clean and remove stems from red chillies'
    },
    { 
      id: 2, 
      taskId: 'T002', 
      dateAssigned: '11/03/2023', 
      rmName: 'Turmeric', 
      process: 'Roasting', 
      assignedQty: 15, 
      staffName: 'Priya Sharma',
      dateCompleted: '13/03/2023',
      wastageQty: 1,
      taskDescription: 'Roast turmeric roots before grinding'
    },
    { 
      id: 3, 
      taskId: 'T003', 
      dateAssigned: '12/03/2023', 
      rmName: 'Coriander Seeds', 
      process: 'C & D', 
      assignedQty: 30, 
      staffName: 'Amit Patel',
      dateCompleted: '14/03/2023',
      wastageQty: 3,
      taskDescription: 'Clean and dry coriander seeds'
    },
  ];

  return (
    <div>
      <div className="mb-4 flex justify-between items-center">
        <div>
          <input
            type="text"
            placeholder="Search tasks..."
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
            Add New Task
          </button>
        </div>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th>Task ID</th>
              <th>Date Assigned</th>
              <th>RM/Stock Name</th>
              <th>Process</th>
              <th>Assigned Qty</th>
              <th>Staff Name</th>
              <th>Date Completed</th>
              <th>Wastage Qty</th>
              <th>Task Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {tasks.map(task => (
              <tr key={task.id}>
                <td>{task.taskId}</td>
                <td>{task.dateAssigned}</td>
                <td>{task.rmName}</td>
                <td>{task.process}</td>
                <td>{task.assignedQty}</td>
                <td>{task.staffName}</td>
                <td>{task.dateCompleted}</td>
                <td>{task.wastageQty}</td>
                <td>{task.taskDescription}</td>
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

export default Tasks;
