
import React, { ReactNode } from 'react';
import { Sidebar } from './Sidebar';
import { Bell } from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="flex min-h-screen w-full">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <header className="border-b bg-white p-4 flex justify-between items-center">
          <div className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-app-blue"
              />
              <div className="absolute left-3 top-2.5 text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" />
                  <path d="m21 21-4.3-4.3" />
                </svg>
              </div>
            </div>
          </div>
          <div className="relative">
            <button className="p-2 rounded-full hover:bg-gray-100">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">3</span>
            </button>
          </div>
        </header>
        <main className="flex-1 p-6 bg-gray-50 overflow-auto">
          {children}
        </main>
        <footer className="border-t p-4 bg-white">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-app-blue text-white rounded-full flex items-center justify-center font-medium">
              AK
            </div>
            <div className="text-sm">
              <div className="font-medium">Admin User</div>
              <div className="text-gray-500 text-xs">admin@spice.com</div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default Layout;
