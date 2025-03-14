
import React from 'react';
import { NavLink } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingCart, 
  CheckSquare, 
  Factory, 
  Store, 
  Settings, 
  ChevronDown,
  Package,
  FileText,
  BarChart,
  Users,
  ClipboardList,
  Workflow,
  Activity,
  Landmark,
  Receipt,
  PackageOpen,
  LineChart 
} from 'lucide-react';

export const Sidebar = () => {
  const [purchasesOpen, setPurchasesOpen] = React.useState(true);
  const [tasksOpen, setTasksOpen] = React.useState(false);
  const [productionOpen, setProductionOpen] = React.useState(false);
  const [salesOpen, setSalesOpen] = React.useState(false);

  const navItems = [
    { 
      title: 'Dashboard', 
      icon: <LayoutDashboard size={20} />, 
      href: '/',
      submenu: false 
    },
    {
      title: 'Purchases',
      icon: <ShoppingCart size={20} />,
      submenu: true,
      open: purchasesOpen,
      setOpen: setPurchasesOpen,
      items: [
        { title: 'Vendors', icon: <Landmark size={16} />, href: '/purchases/vendors' },
        { title: 'Raw Materials', icon: <Package size={16} />, href: '/purchases/raw-materials' },
        { title: 'Stock Purchases', icon: <FileText size={16} />, href: '/purchases/stock-purchases' },
        { title: 'Stock Status', icon: <BarChart size={16} />, href: '/purchases/stock-status' }
      ]
    },
    {
      title: 'Tasks',
      icon: <CheckSquare size={20} />,
      submenu: true,
      open: tasksOpen,
      setOpen: setTasksOpen,
      items: [
        { title: 'Staff Management', icon: <Users size={16} />, href: '/tasks/staff' },
        { title: 'Task Management', icon: <ClipboardList size={16} />, href: '/tasks/management' }
      ]
    },
    {
      title: 'Production',
      icon: <Factory size={20} />,
      submenu: true,
      open: productionOpen,
      setOpen: setProductionOpen,
      items: [
        { title: 'Process', icon: <Workflow size={16} />, href: '/production/process' },
        { title: 'Production Status', icon: <Activity size={16} />, href: '/production/status' }
      ]
    },
    {
      title: 'Sales',
      icon: <Store size={20} />,
      submenu: true,
      open: salesOpen,
      setOpen: setSalesOpen,
      items: [
        { title: 'Sales Channels', icon: <Landmark size={16} />, href: '/sales/channels' },
        { title: 'Sales Records', icon: <Receipt size={16} />, href: '/sales/records' },
        { title: 'Inventory', icon: <PackageOpen size={16} />, href: '/sales/inventory' },
        { title: 'Inventory Status', icon: <LineChart size={16} />, href: '/sales/inventory-status' }
      ]
    },
    { 
      title: 'Settings', 
      icon: <Settings size={20} />, 
      href: '/settings',
      submenu: false 
    }
  ];

  return (
    <div className="w-64 bg-white border-r h-full min-h-screen">
      <div className="p-4 border-b">
        <div className="flex items-center space-x-2">
          <div className="bg-app-blue text-white p-1 rounded">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="m12 14 4-4" />
              <path d="M3.34 19a10 10 0 1 1 17.32 0" />
            </svg>
          </div>
          <h1 className="text-xl font-bold">Spice ERP</h1>
        </div>
      </div>
      <nav className="p-2">
        <ul className="space-y-1">
          {navItems.map((item, index) => (
            <li key={index}>
              {!item.submenu ? (
                <NavLink
                  to={item.href}
                  className={({ isActive }) =>
                    cn(
                      "flex items-center gap-3 rounded-md px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                      isActive ? "bg-gray-100 text-gray-900" : ""
                    )
                  }
                >
                  {item.icon}
                  <span>{item.title}</span>
                </NavLink>
              ) : (
                <div>
                  <button
                    onClick={() => item.setOpen(!item.open)}
                    className="flex items-center justify-between w-full rounded-md px-3 py-2 text-gray-500 transition-all hover:text-gray-900"
                  >
                    <div className="flex items-center gap-3">
                      {item.icon}
                      <span>{item.title}</span>
                    </div>
                    <ChevronDown
                      size={16}
                      className={cn(
                        "transition-transform",
                        item.open ? "rotate-180" : ""
                      )}
                    />
                  </button>
                  {item.open && (
                    <ul className="mt-1 space-y-1 pl-10">
                      {item.items.map((subItem, subIndex) => (
                        <li key={subIndex}>
                          <NavLink
                            to={subItem.href}
                            className={({ isActive }) =>
                              cn(
                                "flex items-center gap-2 rounded-md px-3 py-2 text-gray-500 transition-all hover:text-gray-900",
                                isActive ? "bg-gray-100 text-gray-900" : ""
                              )
                            }
                          >
                            {subItem.icon}
                            <span className="text-sm">{subItem.title}</span>
                          </NavLink>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
