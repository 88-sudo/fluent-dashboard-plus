
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
  DollarSign
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
  // 샘플 데이터 (실제로는 API에서 가져올 데이터)
  const customersByType = {
    labels: ['대기업', '중소기업', '스타트업', '개인사업자'],
    datasets: [{
      data: [150, 300, 120, 80],
      backgroundColor: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444'],
    }]
  };

  const customersByRegion = {
    labels: ['서울', '경기', '부산', '대구', '기타'],
    datasets: [{
      label: '고객 수',
      data: [280, 180, 90, 70, 30],
      backgroundColor: '#3B82F6',
    }]
  };

  const predictionsByDate = {
    labels: ['1월', '2월', '3월', '4월', '5월', '6월'],
    datasets: [{
      label: '예측 수량',
      data: [1200, 1400, 1100, 1600, 1300, 1500],
      borderColor: '#3B82F6',
      backgroundColor: 'rgba(59, 130, 246, 0.1)',
      tension: 0.4,
    }]
  };

  const riskLevelData = {
    labels: ['High Risk', 'Medium Risk', 'Low Risk'],
    datasets: [{
      data: [25, 45, 30],
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

      {/* 주요 지표 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 고객 수"
          value="650"
          icon={Users}
          change="+12% 전월 대비"
          changeType="positive"
        />
        <MetricCard
          title="총 연락처"
          value="2,340"
          icon={Contact}
          change="+8% 전월 대비"
          changeType="positive"
        />
        <MetricCard
          title="주요 연락처"
          value="456"
          icon={Contact}
          change="전체의 19.5%"
          changeType="neutral"
        />
        <MetricCard
          title="임원 연락처"
          value="128"
          icon={Contact}
          change="전체의 5.5%"
          changeType="neutral"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 제품 수"
          value="89"
          icon={Package}
          change="+3 신규 제품"
          changeType="positive"
        />
        <MetricCard
          title="평균 판매가격"
          value="₩125,000"
          icon={DollarSign}
          change="+5% 전월 대비"
          changeType="positive"
        />
        <MetricCard
          title="총 예측 수"
          value="1,245"
          icon={TrendingUp}
          change="이번 달"
          changeType="neutral"
        />
        <MetricCard
          title="평균 예측 수량"
          value="850"
          icon={TrendingUp}
          change="+12% 증가"
          changeType="positive"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard
          title="총 영업 활동"
          value="5,670"
          icon={Activity}
          change="최근 30일"
          changeType="neutral"
        />
        <MetricCard
          title="뉴스레터 오픈"
          value="3,240"
          icon={Mail}
          change="+15% 오픈률"
          changeType="positive"
        />
        <MetricCard
          title="총 주문 수"
          value="1,890"
          icon={ShoppingCart}
          change="평균 ₩85,000"
          changeType="neutral"
        />
        <MetricCard
          title="미해결 이슈"
          value="23"
          icon={AlertTriangle}
          change="-5 해결됨"
          changeType="positive"
        />
      </div>

      {/* 차트 섹션 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="회사 유형별 고객 분포">
          <Pie data={customersByType} options={chartOptions} />
        </ChartCard>
        
        <ChartCard title="지역별 고객 분포">
          <Bar data={customersByRegion} options={chartOptions} />
        </ChartCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="월별 예측 수량 추이">
          <Line data={predictionsByDate} options={chartOptions} />
        </ChartCard>
        
        <ChartCard title="위험도별 세그먼트 분포">
          <Pie data={riskLevelData} options={chartOptions} />
        </ChartCard>
      </div>

      {/* 추가 요약 카드들 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard
          title="High Risk 클레임"
          value="45"
          icon={FileX}
          change="전체의 18%"
          changeType="negative"
        />
        <MetricCard
          title="총 매출"
          value="₩2.4억"
          icon={DollarSign}
          change="+22% 전년 대비"
          changeType="positive"
        />
        <MetricCard
          title="평균 수익 마진"
          value="24.5%"
          icon={TrendingUp}
          change="+2.1% 개선"
          changeType="positive"
        />
      </div>
    </div>
  );
};

export default Dashboard;
