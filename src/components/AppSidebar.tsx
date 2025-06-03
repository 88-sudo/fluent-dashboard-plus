
import React from 'react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { 
  Users, 
  Contact, 
  Package, 
  TrendingUp, 
  PieChart,
  Activity,
  Mail,
  ShoppingCart,
  AlertTriangle,
  FileX,
  Phone,
  DollarSign,
  Calendar
} from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';

const menuItems = [
  { title: "대시보드", url: "/", icon: PieChart },
  { title: "고객", url: "/customers", icon: Users },
  { title: "연락처", url: "/contacts", icon: Contact },
  { title: "제품", url: "/products", icon: Package },
  { title: "예측", url: "/predictions", icon: TrendingUp },
  { title: "세그먼트", url: "/segments", icon: PieChart },
  { title: "영업 활동", url: "/sales-activities", icon: Activity },
  { title: "참여", url: "/engagements", icon: Mail },
  { title: "주문", url: "/orders", icon: ShoppingCart },
  { title: "이슈", url: "/issues", icon: AlertTriangle },
  { title: "클레임", url: "/claims", icon: FileX },
  { title: "영업 접촉 예측", url: "/sales-contact-forecast", icon: Phone },
  { title: "고객 수익 등급", url: "/customer-profit-grade", icon: DollarSign },
  { title: "고객 주문 예측", url: "/customer-order-forecast", icon: Calendar },
];

export function AppSidebar() {
  const location = useLocation();

  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="border-b border-gray-200 p-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <PieChart className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-xl text-gray-900">CRM Dashboard</span>
        </div>
        <SidebarTrigger className="ml-auto" />
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-gray-500 font-medium px-3 py-2">
            메뉴
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="w-full justify-start gap-3 px-3 py-2.5 text-gray-700 hover:bg-blue-50 hover:text-blue-700 transition-colors"
                  >
                    <Link to={item.url}>
                      <item.icon className="w-5 h-5" />
                      <span className="font-medium">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
