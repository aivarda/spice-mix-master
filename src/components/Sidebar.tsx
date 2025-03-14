
import React from 'react';
import { NavLink } from 'react-router-dom';
import { ChevronLeft, 
  LayoutDashboard, 
  ShoppingCart, 
  ClipboardList, 
  Factory, 
  BarChart4, 
  Settings 
} from 'lucide-react';

export const Sidebar = () => {
  const [collapsed, setCollapsed] = React.useState(false);

  return (
    <div className={`bg-app-blue text-white ${collapsed ? 'w-16' : 'w-60'} transition-all duration-300 flex flex-col`}>
      <div className="p-4 flex items-center justify-between border-b border-app-light-blue/20">
        {!collapsed && <div className="font-bold text-lg">Management System</div>}
        <button 
          onClick={() => setCollapsed(!collapsed)} 
          className="p-1 rounded-lg hover:bg-blue-600"
        >
          <ChevronLeft size={20} className={`transition-transform ${collapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>
      <nav className="flex-1 py-4">
        <ul className="space-y-1">
          <SidebarLink to="/" icon={<LayoutDashboard size={20} />} label="Dashboard" collapsed={collapsed} />
          <SidebarLink to="/purchases" icon={<ShoppingCart size={20} />} label="Purchases" collapsed={collapsed} />
          <SidebarLink to="/tasks" icon={<ClipboardList size={20} />} label="Tasks" collapsed={collapsed} />
          <SidebarLink to="/production" icon={<Factory size={20} />} label="Production" collapsed={collapsed} />
          <SidebarLink to="/sales" icon={<BarChart4 size={20} />} label="Sales" collapsed={collapsed} />
          <SidebarLink to="/settings" icon={<Settings size={20} />} label="Settings" collapsed={collapsed} />
        </ul>
      </nav>
    </div>
  );
};

type SidebarLinkProps = {
  to: string;
  icon: React.ReactNode;
  label: string;
  collapsed: boolean;
};

const SidebarLink = ({ to, icon, label, collapsed }: SidebarLinkProps) => {
  return (
    <li>
      <NavLink
        to={to}
        className={({ isActive }) =>
          `flex items-center px-4 py-2 ${
            isActive ? 'bg-blue-600' : 'hover:bg-blue-600'
          } transition-colors ${collapsed ? 'justify-center' : 'space-x-3'}`
        }
      >
        <div>{icon}</div>
        {!collapsed && <span>{label}</span>}
      </NavLink>
    </li>
  );
};
