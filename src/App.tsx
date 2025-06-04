
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
import SalesActivities from "./pages/sales-activities/SalesActivities";
import Engagements from "./pages/engagements/Engagements";
import Orders from "./pages/orders/Orders";
import Issues from "./pages/issues/Issues";
import Claims from "./pages/claims/Claims";
import SalesContactForecast from "./pages/sales-contact-forecast/SalesContactForecast";
import CustomerProfitGrade from "./pages/customer-profit-grade/CustomerProfitGrade";
import CustomerOrderForecast from "./pages/customer-order-forecast/CustomerOrderForecast";
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
            <Route path="/sales-activities" element={<SalesActivities />} />
            <Route path="/engagements" element={<Engagements />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/issues" element={<Issues />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/sales-contact-forecast" element={<SalesContactForecast />} />
            <Route path="/customer-profit-grade" element={<CustomerProfitGrade />} />
            <Route path="/customer-order-forecast" element={<CustomerOrderForecast />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
