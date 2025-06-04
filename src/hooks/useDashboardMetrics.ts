
import { useMemo } from 'react';
import type { Tables } from '@/integrations/supabase/types';

interface DashboardData {
  customers: Tables<'customers'>[];
  contacts: Tables<'contacts'>[];
  products: Tables<'products'>[];
  predictions: Tables<'predictions'>[];
  segments: Tables<'segments'>[];
  salesActivities: Tables<'sales_activities'>[];
  engagements: Tables<'engagements'>[];
  orders: Tables<'orders'>[];
  issues: Tables<'issues'>[];
}

export const useDashboardMetrics = (data: DashboardData) => {
  return useMemo(() => {
    // 고객 관련 지표
    const totalCustomers = data.customers.length;
    const customersByType = data.customers.reduce((acc, customer) => {
      const type = customer.company_type || '기타';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const customersByRegion = data.customers.reduce((acc, customer) => {
      const region = customer.region || '기타';
      acc[region] = (acc[region] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 연락처 관련 지표
    const totalContacts = data.contacts.length;
    const keymanContacts = data.contacts.filter(contact => contact.is_keyman === 'Y' || contact.is_keyman === '1').length;
    const executiveContacts = data.contacts.filter(contact => contact.is_executive === 'Y' || contact.is_executive === '1').length;

    // 제품 관련 지표
    const totalProducts = data.products.length;
    const avgSellingPrice = data.products.reduce((sum, product) => sum + (product.sellingprice || 0), 0) / totalProducts || 0;
    const topProducts = data.products
      .filter(product => product.sellingprice)
      .sort((a, b) => (b.sellingprice || 0) - (a.sellingprice || 0))
      .slice(0, 3);

    // 예측 관련 지표
    const totalPredictions = data.predictions.length;
    const avgPredictedQuantity = data.predictions.reduce((sum, prediction) => sum + (prediction.predicted_quantity || 0), 0) / totalPredictions || 0;
    const predictionsByDate = data.predictions.reduce((acc, prediction) => {
      const date = prediction.predicted_date || '기타';
      acc[date] = (acc[date] || 0) + (prediction.predicted_quantity || 0);
      return acc;
    }, {} as Record<string, number>);

    // 세그먼트 관련 지표
    const riskLevelDistribution = data.segments.reduce((acc, segment) => {
      const risk = segment.predicted_risk_level || '기타';
      acc[risk] = (acc[risk] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const avgCLV = data.segments.reduce((sum, segment) => sum + (segment.clv || 0), 0) / data.segments.length || 0;

    // 영업 활동 관련 지표
    const totalSalesActivities = data.salesActivities.length;
    const activitiesByType = data.salesActivities.reduce((acc, activity) => {
      const type = activity.activity_type || '기타';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const recent30DaysActivities = data.salesActivities.filter(activity => {
      if (!activity.activity_date) return false;
      const activityDate = new Date(activity.activity_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return activityDate >= thirtyDaysAgo;
    }).length;

    // 참여 관련 지표
    const totalNewsletterOpens = data.engagements.reduce((sum, engagement) => sum + (engagement.newsletter_opens || 0), 0);
    const activeCustomers = data.engagements.filter(engagement => {
      if (!engagement.last_active_date) return false;
      const lastActive = new Date(engagement.last_active_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return lastActive >= thirtyDaysAgo;
    }).length;

    // 주문 관련 지표
    const totalOrders = data.orders.length;
    const avgOrderAmount = data.orders.reduce((sum, order) => sum + (order.amount || 0), 0) / totalOrders || 0;
    const ordersByPaymentStatus = data.orders.reduce((acc, order) => {
      const status = order.payment_status || '기타';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const ordersByDeliveryStatus = data.orders.reduce((acc, order) => {
      const status = order.delivery_status || '기타';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 이슈 관련 지표
    const totalIssues = data.issues.length;
    const issuesBySeverity = data.issues.reduce((acc, issue) => {
      const severity = issue.severity || '기타';
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const issuesByStatus = data.issues.reduce((acc, issue) => {
      const status = issue.status || '기타';
      acc[status] = (acc[status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // 총 매출 계산
    const totalRevenue = data.orders.reduce((sum, order) => sum + (order.amount || 0), 0);
    const avgMargin = data.orders.reduce((sum, order) => sum + (order.margin_rate || 0), 0) / totalOrders || 0;

    return {
      // 고객 지표
      totalCustomers,
      customersByType,
      customersByRegion,
      
      // 연락처 지표
      totalContacts,
      keymanContacts,
      executiveContacts,
      
      // 제품 지표
      totalProducts,
      avgSellingPrice,
      topProducts,
      
      // 예측 지표
      totalPredictions,
      avgPredictedQuantity,
      predictionsByDate,
      
      // 세그먼트 지표
      riskLevelDistribution,
      avgCLV,
      
      // 영업 활동 지표
      totalSalesActivities,
      activitiesByType,
      recent30DaysActivities,
      
      // 참여 지표
      totalNewsletterOpens,
      activeCustomers,
      
      // 주문 지표
      totalOrders,
      avgOrderAmount,
      ordersByPaymentStatus,
      ordersByDeliveryStatus,
      
      // 이슈 지표
      totalIssues,
      issuesBySeverity,
      issuesByStatus,
      
      // 매출 지표
      totalRevenue,
      avgMargin
    };
  }, [data]);
};
