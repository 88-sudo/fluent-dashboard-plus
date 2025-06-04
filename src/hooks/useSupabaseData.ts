
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export const useSupabaseData = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState({
    customers: [] as Tables<'customers'>[],
    contacts: [] as Tables<'contacts'>[],
    products: [] as Tables<'products'>[],
    predictions: [] as Tables<'predictions'>[],
    segments: [] as Tables<'segments'>[],
    salesActivities: [] as Tables<'sales_activities'>[],
    engagements: [] as Tables<'engagements'>[],
    orders: [] as Tables<'orders'>[],
    issues: [] as Tables<'issues'>[],
    claims: [] as Tables<'claims'>[],
    customerOrderForecast: [] as Tables<'customer_order_forecast'>[],
    customerProfitGrade: [] as Tables<'customer_profit_grade'>[],
    customerProfitAnalysis: [] as Tables<'customer_profit_analysis'>[],
    salesContactForecast: [] as Tables<'sales_contact_forecast'>[]
  });

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        
        const [
          customersResult,
          contactsResult,
          productsResult,
          predictionsResult,
          segmentsResult,
          salesActivitiesResult,
          engagementsResult,
          ordersResult,
          issuesResult,
          claimsResult,
          customerOrderForecastResult,
          customerProfitGradeResult,
          customerProfitAnalysisResult,
          salesContactForecastResult
        ] = await Promise.all([
          supabase.from('customers').select('*'),
          supabase.from('contacts').select('*'),
          supabase.from('products').select('*'),
          supabase.from('predictions').select('*'),
          supabase.from('segments').select('*'),
          supabase.from('sales_activities').select('*'),
          supabase.from('engagements').select('*'),
          supabase.from('orders').select('*'),
          supabase.from('issues').select('*'),
          supabase.from('claims').select('*'),
          supabase.from('customer_order_forecast').select('*'),
          supabase.from('customer_profit_grade').select('*'),
          supabase.from('customer_profit_analysis').select('*'),
          supabase.from('sales_contact_forecast').select('*')
        ]);

        if (customersResult.error) throw customersResult.error;
        if (contactsResult.error) throw contactsResult.error;
        if (productsResult.error) throw productsResult.error;
        if (predictionsResult.error) throw predictionsResult.error;
        if (segmentsResult.error) throw segmentsResult.error;
        if (salesActivitiesResult.error) throw salesActivitiesResult.error;
        if (engagementsResult.error) throw engagementsResult.error;
        if (ordersResult.error) throw ordersResult.error;
        if (issuesResult.error) throw issuesResult.error;
        if (claimsResult.error) throw claimsResult.error;
        if (customerOrderForecastResult.error) throw customerOrderForecastResult.error;
        if (customerProfitGradeResult.error) throw customerProfitGradeResult.error;
        if (customerProfitAnalysisResult.error) throw customerProfitAnalysisResult.error;
        if (salesContactForecastResult.error) throw salesContactForecastResult.error;

        setData({
          customers: customersResult.data || [],
          contacts: contactsResult.data || [],
          products: productsResult.data || [],
          predictions: predictionsResult.data || [],
          segments: segmentsResult.data || [],
          salesActivities: salesActivitiesResult.data || [],
          engagements: engagementsResult.data || [],
          orders: ordersResult.data || [],
          issues: issuesResult.data || [],
          claims: claimsResult.data || [],
          customerOrderForecast: customerOrderForecastResult.data || [],
          customerProfitGrade: customerProfitGradeResult.data || [],
          customerProfitAnalysis: customerProfitAnalysisResult.data || [],
          salesContactForecast: salesContactForecastResult.data || []
        });
      } catch (err) {
        console.error('Error fetching data:', err);
        setError(err instanceof Error ? err.message : '데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  return { data, loading, error };
};
