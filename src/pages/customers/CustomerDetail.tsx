
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useCustomerDetail } from '@/hooks/useCustomerDetail';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { 
  ArrowLeft, 
  Building2, 
  Calendar, 
  TrendingUp, 
  DollarSign, 
  Package, 
  Target,
  Award,
  BarChart3
} from 'lucide-react';

const CustomerDetail = () => {
  const { customerId } = useParams<{ customerId: string }>();
  const { customerData, loading, error } = useCustomerDetail(Number(customerId));

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;
  if (!customerData.customer) return <div>고객 정보를 찾을 수 없습니다.</div>;

  const { customer, contacts, orderForecasts, profitAnalysis, segments, orders } = customerData;

  // 통계 계산
  const totalOrderValue = orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalProfit = profitAnalysis.reduce((sum, analysis) => sum + (analysis.total_profit || 0), 0);
  const avgCLV = segments.length > 0 ? segments.reduce((sum, seg) => sum + (seg.clv || 0), 0) / segments.length : 0;
  const nextPredictedOrder = orderForecasts
    .filter(forecast => forecast.predicted_date && new Date(forecast.predicted_date) > new Date())
    .sort((a, b) => new Date(a.predicted_date!).getTime() - new Date(b.predicted_date!).getTime())[0];

  const getGradeBadgeVariant = (grade: string) => {
    switch (grade) {
      case 'A': return 'default';
      case 'B': return 'secondary';
      case 'C': return 'outline';
      case 'D': return 'destructive';
      default: return 'outline';
    }
  };

  const getRiskBadgeVariant = (risk: string) => {
    switch (risk) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'default';
      default: return 'outline';
    }
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/customers">
            <Button variant="outline" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              고객 목록으로
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{customer.company_name}</h1>
            <p className="text-gray-600">{customer.company_type} • {customer.region}</p>
          </div>
        </div>
      </div>

      {/* 고객 기본 정보 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            고객 정보
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">회사 정보</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">업종:</span> {customer.industry_type || '미입력'}</p>
                <p><span className="font-medium">규모:</span> {customer.company_size || '미입력'}</p>
                <p><span className="font-medium">국가:</span> {customer.country || '미입력'}</p>
                <p><span className="font-medium">등록일:</span> {customer.reg_date || '미입력'}</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">연락처 정보</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">총 연락처:</span> {contacts.length}개</p>
                <p><span className="font-medium">임원:</span> {contacts.filter(c => c.is_executive === 'Y').length}명</p>
                <p><span className="font-medium">키맨:</span> {contacts.filter(c => c.is_keyman === 'Y').length}명</p>
              </div>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 mb-2">요약 통계</h4>
              <div className="space-y-2 text-sm text-gray-600">
                <p><span className="font-medium">총 주문 금액:</span> ₩{totalOrderValue.toLocaleString()}</p>
                <p><span className="font-medium">총 수익:</span> ₩{totalProfit.toLocaleString()}</p>
                <p><span className="font-medium">평균 CLV:</span> ₩{avgCLV.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 주요 지표 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">다음 예상 주문</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {nextPredictedOrder ? new Date(nextPredictedOrder.predicted_date!).toLocaleDateString('ko-KR') : '없음'}
            </div>
            <p className="text-xs text-muted-foreground">
              {nextPredictedOrder ? `${nextPredictedOrder.predicted_quantity?.toLocaleString()}개 예상` : '예측 없음'}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 주문 수</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{orders.length}</div>
            <p className="text-xs text-muted-foreground">주문 건수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예측 정확도</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {orderForecasts.length > 0 
                ? `${((1 - orderForecasts.reduce((sum, f) => sum + (f.mape || 0), 0) / orderForecasts.length) * 100).toFixed(1)}%`
                : '데이터 없음'
              }
            </div>
            <p className="text-xs text-muted-foreground">평균 MAPE 기준</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">고객 등급</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {profitAnalysis.length > 0 
                ? profitAnalysis[0].customer_grade
                : '미분류'
              }
            </div>
            <p className="text-xs text-muted-foreground">수익성 등급</p>
          </CardContent>
        </Card>
      </div>

      {/* 주문 예측 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            주문 예측 현황
          </CardTitle>
        </CardHeader>
        <CardContent>
          {orderForecasts.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>예측 날짜</TableHead>
                  <TableHead>예측 수량</TableHead>
                  <TableHead>정확도 (MAPE)</TableHead>
                  <TableHead>생성 일시</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orderForecasts.map((forecast) => (
                  <TableRow key={forecast.cof_id}>
                    <TableCell>
                      {forecast.predicted_date 
                        ? new Date(forecast.predicted_date).toLocaleDateString('ko-KR')
                        : '미입력'
                      }
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        {forecast.predicted_quantity?.toLocaleString() || 0}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={forecast.mape && forecast.mape < 0.1 ? 'default' : 'secondary'}>
                        {forecast.mape ? `${((1 - forecast.mape) * 100).toFixed(1)}%` : '미입력'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {forecast.forecast_generation_datetime 
                        ? new Date(forecast.forecast_generation_datetime).toLocaleDateString('ko-KR')
                        : '미입력'
                      }
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">주문 예측 데이터가 없습니다.</p>
          )}
        </CardContent>
      </Card>

      {/* 수익 분석 & 세그먼트 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              수익 분석
            </CardTitle>
          </CardHeader>
          <CardContent>
            {profitAnalysis.length > 0 ? (
              <div className="space-y-4">
                {profitAnalysis.map((analysis, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant={getGradeBadgeVariant(analysis.customer_grade)} className="text-lg font-bold">
                        {analysis.customer_grade}등급
                      </Badge>
                    </div>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">총 매출</p>
                        <p className="font-semibold">₩{(analysis.total_sales || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">총 수익</p>
                        <p className={`font-semibold ${(analysis.total_profit || 0) > 0 ? 'text-green-600' : 'text-red-600'}`}>
                          ₩{(analysis.total_profit || 0).toLocaleString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-gray-600">수익률</p>
                        <p className="font-semibold">
                          {analysis.profit_margin ? `${(analysis.profit_margin * 100).toFixed(1)}%` : '미입력'}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">수익 분석 데이터가 없습니다.</p>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              고객 세그먼트
            </CardTitle>
          </CardHeader>
          <CardContent>
            {segments.length > 0 ? (
              <div className="space-y-4">
                {segments.map((segment, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <span className="font-medium">{segment.segment_label || '미분류'}</span>
                      <Badge variant={getRiskBadgeVariant(segment.predicted_risk_level)}>
                        {segment.predicted_risk_level} 위험
                      </Badge>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">CLV</p>
                        <p className="font-semibold">₩{(segment.clv || 0).toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">ARR</p>
                        <p className="font-semibold">₩{(segment.arr || 0).toLocaleString()}</p>
                      </div>
                    </div>
                    {segment.high_risk_probability && (
                      <div className="mt-2">
                        <p className="text-gray-600 text-sm">고위험 확률</p>
                        <p className="font-semibold text-red-600">
                          {(segment.high_risk_probability * 100).toFixed(1)}%
                        </p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-500 py-8">세그먼트 데이터가 없습니다.</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CustomerDetail;
