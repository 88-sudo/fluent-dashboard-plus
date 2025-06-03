
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Dashboard from "./components/Dashboard";
import Customers from "./pages/customers/Customers";
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
            {/* 추가 라우트들은 여기에 구현 예정 */}
            <Route path="/contacts" element={<div className="p-6">연락처 페이지 (구현 예정)</div>} />
            <Route path="/products" element={<div className="p-6">제품 페이지 (구현 예정)</div>} />
            <Route path="/predictions" element={<div className="p-6">예측 페이지 (구현 예정)</div>} />
            <Route path="/segments" element={<div className="p-6">세그먼트 페이지 (구현 예정)</div>} />
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
