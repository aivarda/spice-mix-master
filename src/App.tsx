
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Layout from "./components/Layout";

// Creating module pages
import PurchasesVendors from "./pages/purchases/Vendors";
import PurchasesRawMaterials from "./pages/purchases/RawMaterials";
import PurchasesStockPurchases from "./pages/purchases/StockPurchases";
import PurchasesStockStatus from "./pages/purchases/StockStatus";

import TasksStaff from "./pages/tasks/Staff";
import TasksManagement from "./pages/tasks/Management";

import ProductionProcess from "./pages/production/Process";
import ProductionStatus from "./pages/production/Status";

import SalesChannels from "./pages/sales/Channels";
import SalesRecords from "./pages/sales/Records";
import SalesInventory from "./pages/sales/Inventory";
import SalesInventoryStatus from "./pages/sales/InventoryStatus";

import Settings from "./pages/Settings";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          
          {/* Purchases Module */}
          <Route path="/purchases/vendors" element={<PurchasesVendors />} />
          <Route path="/purchases/raw-materials" element={<PurchasesRawMaterials />} />
          <Route path="/purchases/stock-purchases" element={<PurchasesStockPurchases />} />
          <Route path="/purchases/stock-status" element={<PurchasesStockStatus />} />
          
          {/* Tasks Module */}
          <Route path="/tasks/staff" element={<TasksStaff />} />
          <Route path="/tasks/management" element={<TasksManagement />} />
          
          {/* Production Module */}
          <Route path="/production/process" element={<ProductionProcess />} />
          <Route path="/production/status" element={<ProductionStatus />} />
          
          {/* Sales Module */}
          <Route path="/sales/channels" element={<SalesChannels />} />
          <Route path="/sales/records" element={<SalesRecords />} />
          <Route path="/sales/inventory" element={<SalesInventory />} />
          <Route path="/sales/inventory-status" element={<SalesInventoryStatus />} />
          
          {/* Settings */}
          <Route path="/settings" element={<Settings />} />
          
          {/* 404 Page */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
