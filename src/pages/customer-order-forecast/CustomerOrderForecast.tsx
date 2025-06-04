
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import LoadingSpinner from '@/components/LoadingSpinner';
import ErrorDisplay from '@/components/ErrorDisplay';
import { Calendar, TrendingUp, Package, BarChart3, Clock, Target } from 'lucide-react';

const CustomerOrderForecast = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [modelFilter, setModelFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredForecasts = data.customerOrderForecast.filter(forecast => {
    const customer = data.customers.find(c => c.customer_id === forecast.customer_id);
    const matchesSearch = 
      customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forecast.prediction_model?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesModel = modelFilter === 'all' || forecast.prediction_model === modelFilter;
    
    return matchesSearch && matchesModel;
  });

  const totalPages = Math.ceil(filteredForecasts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedForecasts = filteredForecasts.slice(startIndex, startIndex + itemsPerPage);

  const getAccuracyBadgeVariant = (mape: number) => {
    if (mape < 0.1) return 'default';
    if (mape < 0.2) return 'secondary';
    return 'destructive';
  };

  const modelStats = data.customerOrderForecast.reduce((acc, forecast) => {
    const model = forecast.prediction_model || '미분류';
    acc[model] = (acc[model] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgMAPE = data.customerOrderForecast.length > 0
    ? data.customerOrderForecast.reduce((sum, forecast) => sum + (forecast.mape || 0), 0) / data.customerOrderForecast.length
    : 0;

  const totalPredictedQuantity = data.customerOrderForecast.reduce(
    (sum, forecast) => sum + (forecast.predicted_quantity || 0), 0
  );

  const upcomingOrders = data.customerOrderForecast.filter(forecast => {
    if (!forecast.predicted_date) return false;
    const predictedDate = new Date(forecast.predicted_date);
    const today = new Date();
    const nextMonth = new Date(today.getTime() + 30 * 24 * 60 * 60 * 1000);
    return predictedDate >= today && predictedDate <= nextMonth;
  }).length;

  const highAccuracyForecasts = data.customerOrderForecast.filter(
    forecast => (forecast.mape || 0) < 0.1
  ).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">고객 주문 예측</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <TrendingUp className="w-4 h-4 mr-2" />
          예측 모델 실행
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 예측 건수</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.customerOrderForecast.length}</div>
            <p className="text-xs text-muted-foreground">주문 예측</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">다음 달 예정 주문</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingOrders}</div>
            <p className="text-xs text-muted-foreground">30일 내 예상</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">예측 수량 합계</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalPredictedQuantity.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">총 예측 수량</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 정확도</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(100 - avgMAPE * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">MAPE 기준</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 주문 예측 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="고객사명, 예측 모델로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={modelFilter} onValueChange={setModelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="모델 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 모델</SelectItem>
                {Object.keys(modelStats).map(model => (
                  <SelectItem key={model} value={model}>
                    {model}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>예측ID</TableHead>
                <TableHead>고객사</TableHead>
                <TableHead>예측 모델</TableHead>
                <TableHead>예측 날짜</TableHead>
                <TableHead>예측 수량</TableHead>
                <TableHead>정확도 (MAPE)</TableHead>
                <TableHead>생성 일시</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedForecasts.map((forecast) => {
                const customer = data.customers.find(c => c.customer_id === forecast.customer_id);
                const predictedDate = forecast.predicted_date ? new Date(forecast.predicted_date) : null;
                const today = new Date();
                const daysUntilOrder = predictedDate 
                  ? Math.ceil((predictedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                
                return (
                  <TableRow key={forecast.cof_id}>
                    <TableCell className="font-medium">#{forecast.cof_id}</TableCell>
                    <TableCell>{customer?.company_name || '알 수 없음'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        {forecast.prediction_model || '미분류'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {predictedDate ? predictedDate.toLocaleDateString('ko-KR') : '미입력'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Package className="w-4 h-4 text-gray-400" />
                        <span className="font-medium">
                          {forecast.predicted_quantity?.toLocaleString() || 0}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getAccuracyBadgeVariant(forecast.mape || 0)}>
                        {((1 - (forecast.mape || 0)) * 100).toFixed(1)}%
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {forecast.forecast_generation_datetime 
                          ? new Date(forecast.forecast_generation_datetime).toLocaleDateString('ko-KR')
                          : '미입력'
                        }
                      </div>
                    </TableCell>
                    <TableCell>
                      {daysUntilOrder !== null ? (
                        <div className="flex items-center gap-2">
                          <Target className="w-4 h-4 text-gray-400" />
                          <Badge variant={
                            daysUntilOrder <= 0 ? 'destructive' :
                            daysUntilOrder <= 7 ? 'secondary' : 'outline'
                          }>
                            {daysUntilOrder <= 0 ? '주문 예정일' :
                             daysUntilOrder <= 7 ? `${daysUntilOrder}일 후` : '예정됨'}
                          </Badge>
                        </div>
                      ) : (
                        <Badge variant="outline">미정</Badge>
                      )}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {filteredForecasts.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredForecasts.length)} 표시
            </div>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
              >
                다음
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerOrderForecast;
