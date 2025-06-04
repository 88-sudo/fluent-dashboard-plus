
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import type { Tables } from '@/integrations/supabase/types';

export const useCustomerDetail = (customerId: number) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [customerData, setCustomerData] = useState({
    customer: null as Tables<'customers'> | null,
    contacts: [] as Tables<'contacts'>[],
    orderForecasts: [] as Tables<'customer_order_forecast'>[],
    profitAnalysis: [] as Tables<'customer_profit_analysis'>[],
    segments: [] as Tables<'segments'>[],
    orders: [] as Tables<'orders'>[]
  });

  useEffect(() => {
    const fetchCustomerData = async () => {
      try {
        setLoading(true);
        
        // 고객 정보 가져오기
        const { data: customer, error: customerError } = await supabase
          .from('customers')
          .select('*')
          .eq('customer_id', customerId)
          .single();

        if (customerError) throw customerError;

        // 해당 고객의 연락처 가져오기
        const { data: contacts, error: contactsError } = await supabase
          .from('contacts')
          .select('*')
          .eq('customer_id', customerId);

        if (contactsError) throw contactsError;

        // 고객 주문 예측 데이터 가져오기
        const { data: orderForecasts, error: orderForecastsError } = await supabase
          .from('customer_order_forecast')
          .select('*')
          .eq('customer_id', customerId);

        if (orderForecastsError) throw orderForecastsError;

        // 연락처 ID들 수집
        const contactIds = contacts?.map(c => c.contact_id) || [];

        // 수익 분석 데이터 가져오기 (연락처 기반)
        const { data: profitAnalysis, error: profitAnalysisError } = await supabase
          .from('customer_profit_analysis')
          .select('*')
          .in('contact_id', contactIds);

        if (profitAnalysisError) throw profitAnalysisError;

        // 세그먼트 데이터 가져오기 (연락처 기반)
        const { data: segments, error: segmentsError } = await supabase
          .from('segments')
          .select('*')
          .in('contact_id', contactIds);

        if (segmentsError) throw segmentsError;

        // 주문 데이터 가져오기 (연락처 기반)
        const { data: orders, error: ordersError } = await supabase
          .from('orders')
          .select('*')
          .in('contact_id', contactIds);

        if (ordersError) throw ordersError;

        setCustomerData({
          customer,
          contacts: contacts || [],
          orderForecasts: orderForecasts || [],
          profitAnalysis: profitAnalysis || [],
          segments: segments || [],
          orders: orders || []
        });
      } catch (err) {
        console.error('Error fetching customer data:', err);
        setError(err instanceof Error ? err.message : '고객 데이터를 가져오는 중 오류가 발생했습니다.');
      } finally {
        setLoading(false);
      }
    };

    if (customerId) {
      fetchCustomerData();
    }
  }, [customerId]);

  return { customerData, loading, error };
};
