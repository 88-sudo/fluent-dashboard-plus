
import React from 'react';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  BarElement, 
  Title, 
  Tooltip, 
  Legend,
  ArcElement,
  PointElement,
  LineElement
} from 'chart.js';
import { Bar, Pie, Line } from 'react-chartjs-2';
import MetricCard from './MetricCard';
import ChartCard from './ChartCard';
import LoadingSpinner from './LoadingSpinner';
import ErrorDisplay from './ErrorDisplay';
import { useSupabaseData } from '../hooks/useSupabaseData';
import { useDashboardMetrics } from '../hooks/useDashboardMetrics';
import { 
  Users, 
  Contact, 
  Package, 
  TrendingUp, 
  Activity,
  Mail,
  ShoppingCart,
  AlertTriangle,
  FileX,
  DollarSign,
  PieChart
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  PointElement,
  LineElement
);

const Dashboard = () => {
  const { data, loading, error } = useSupabaseData();
  const metrics = useDashboardMetrics(data);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  // 차트 데이터 준비
  const customersByTypeChart = {
    labels: Object.keys(metrics.customersByType),
    datasets: [{
      data: Object.values(metrics.customersByType),
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'],
    }]
  };

  const customersByRegionChart = {
    labels: Object.keys(metrics.customersByRegion),
    datasets: [{
      label: '고객 수',
      data: Object.values(metrics.customersByRegion),
      backgroundColor: '#3B82F6',
    }]
  };

  const predictionsByDateChart = {
    labels: Object.keys(metrics.predictionsByDate).slice(0, 6),
    datasets: [{
      label: '예측 수량',
      data: Object.values(metrics.predictionsByDate).slice(0, 6),
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  };

  const riskLevelChart = {
    labels: Object.keys(metrics.riskLevelDistribution),
    datasets: [{
      data: Object.values(metrics.riskLevelDistribution),
      backgroundColor: ['#EF4444', '#F59E0B', '#10B981'],
    }]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top' as const,
      },
    },
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">대시보드 개요</h1>
        <div className="text-sm text-gray-500">
          마지막 업데이트: {new Date().toLocaleDateString('ko-KR')}
        </div>
      </div>

      {/* 고객 관련 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 고객 수"
          value={metrics.totalCustomers.toLocaleString()}
          icon={Users}
          change={`${metrics.totalCustomers}개 고객`}
          changeType="neutral"
        />
        <MetricCard
          title="총 연락처"
          value={metrics.totalContacts.toLocaleString()}
          icon={Contact}
          change={`${metrics.totalContacts}개 연락처`}
          changeType="neutral"
        />
        <MetricCard
          title="주요 연락처"
          value={metrics.keymanContacts.toLocaleString()}
          icon={Contact}
          change={`전체의 ${((metrics.keymanContacts / metrics.totalContacts) * 100).toFixed(1)}%`}
          changeType="neutral"
        />
        <MetricCard
          title="임원 연락처"
          value={metrics.executiveContacts.toLocaleString()}
          icon={Contact}
          change={`전체의 ${((metrics.executiveContacts / metrics.totalContacts) * 100).toFixed(1)}%`}
          changeType="neutral"
        />
      </div>

      {/* 제품 및 예측 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 제품 수"
          value={metrics.totalProducts.toLocaleString()}
          icon={Package}
          change={`${metrics.totalProducts}개 제품`}
          changeType="neutral"
        />
        <MetricCard
          title="평균 판매가격"
          value={`₩${metrics.avgSellingPrice.toLocaleString()}`}
          icon={DollarSign}
          change="제품 평균가"
          changeType="neutral"
        />
        <MetricCard
          title="총 예측 수"
          value={metrics.totalPredictions.toLocaleString()}
          icon={TrendingUp}
          change={`${metrics.totalPredictions}건 예측`}
          changeType="neutral"
        />
        <MetricCard
          title="평균 예측 수량"
          value={Math.round(metrics.avgPredictedQuantity).toLocaleString()}
          icon={TrendingUp}
          change="평균 예측량"
          changeType="neutral"
        />
      </div>

      {/* 영업 및 참여 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 영업 활동"
          value={metrics.totalSalesActivities.toLocaleString()}
          icon={Activity}
          change={`${metrics.totalSalesActivities}건 활동`}
          changeType="neutral"
        />
        <MetricCard
          title="최근 30일 활동"
          value={metrics.recent30DaysActivities.toLocaleString()}
          icon={Activity}
          change="최근 활동"
          changeType="positive"
        />
        <MetricCard
          title="뉴스레터 오픈"
          value={metrics.totalNewsletterOpens.toLocaleString()}
          icon={Mail}
          change={`총 ${metrics.totalNewsletterOpens}회`}
          changeType="neutral"
        />
        <MetricCard
          title="활성 고객"
          value={metrics.activeCustomers.toLocaleString()}
          icon={Users}
          change="최근 30일 활성"
          changeType="positive"
        />
      </div>

      {/* 주문 및 이슈 지표 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 주문 수"
          value={metrics.totalOrders.toLocaleString()}
          icon={ShoppingCart}
          change={`${metrics.totalOrders}건 주문`}
          changeType="neutral"
        />
        <MetricCard
          title="평균 주문 금액"
          value={`₩${metrics.avgOrderAmount.toLocaleString()}`}
          icon={DollarSign}
          change="주문 평균"
          changeType="neutral"
        />
        <MetricCard
          title="총 이슈"
          value={metrics.totalIssues.toLocaleString()}
          icon={AlertTriangle}
          change={`${metrics.totalIssues}건 이슈`}
          changeType="negative"
        />
        <MetricCard
          title="총 매출"
          value={`₩${(metrics.totalRevenue / 100000000).toFixed(1)}억`}
          icon={DollarSign}
          change={`평균 마진 ${metrics.avgMargin.toFixed(1)}%`}
          changeType="positive"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="회사 유형별 고객 분포">
          <Pie data={customersByTypeChart} options={chartOptions} />
        </ChartCard>
        
        <ChartCard title="지역별 고객 분포">
          <Bar data={customersByRegionChart} options={chartOptions} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="날짜별 예측 수량 추이">
          <Line data={predictionsByDateChart} options={chartOptions} />
        </ChartCard>
        
        <ChartCard title="위험도별 세그먼트 분포">
          <Pie data={riskLevelChart} options={chartOptions} />
        </ChartCard>
      </div>

      {/* 추가 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="평균 CLV"
          value={`₩${(metrics.avgCLV / 1000000).toFixed(1)}M`}
          icon={TrendingUp}
          change="고객 생애 가치"
          changeType="positive"
        />
        <MetricCard
          title="고위험 세그먼트"
          value={metrics.riskLevelDistribution['High'] || 0}
          icon={FileX}
          change="고위험 고객"
          changeType="negative"
        />
        <MetricCard
          title="상위 제품 평균가"
          value={`₩${(metrics.topProducts.reduce((sum, p) => sum + (p.SELLINGPRICE || 0), 0) / 3).toLocaleString()}`}
          icon={Package}
          change="TOP 3 제품"
          changeType="positive"
        />
      </div>
    </div>
  );
};

export default Dashboard;
