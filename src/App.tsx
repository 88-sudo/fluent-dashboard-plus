
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Customers from "./pages/customers/Customers";
import Contacts from "./pages/contacts/Contacts";
import Products from "./pages/products/Products";
import Predictions from "./pages/predictions/Predictions";
import Segments from "./pages/segments/Segments";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/customers" element={<Customers />} />
            <Route path="/contacts" element={<Contacts />} />
            <Route path="/products" element={<Products />} />
            <Route path="/predictions" element={<Predictions />} />
            <Route path="/segments" element={<Segments />} />
            {/* 나머지 페이지들은 다음 메시지에서 구현 */}
            <Route path="/sales-activities" element={<div className="p-6">영업 활동 페이지 (구현 예정)</div>} />
            <Route path="/engagements" element={<div className="p-6">참여 페이지 (구현 예정)</div>} />
            <Route path="/orders" element={<div className="p-6">주문 페이지 (구현 예정)</div>} />
            <Route path="/issues" element={<div className="p-6">이슈 페이지 (구현 예정)</div>} />
            <Route path="/claims" element={<div className="p-6">클레임 페이지 (구현 예정)</div>} />
            <Route path="/sales-contact-forecast" element={<div className="p-6">영업 접촉 예측 페이지 (구현 예정)</div>} />
            <Route path="/customer-profit-grade" element={<div className="p-6">고객 수익 등급 페이지 (구현 예정)</div>} />
            <Route path="/customer-order-forecast" element={<div className="p-6">고객 주문 예측 페이지 (구현 예정)</div>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
