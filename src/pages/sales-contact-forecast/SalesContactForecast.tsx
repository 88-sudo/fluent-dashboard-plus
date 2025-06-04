
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
import { Phone, Calendar, TrendingUp, Target, BarChart3, Clock } from 'lucide-react';

const SalesContactForecast = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredForecasts = data.salesContactForecast.filter(forecast => {
    const customer = data.customers.find(c => c.customer_id === forecast.customer_id);
    const matchesSearch = 
      customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      forecast.scf_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = typeFilter === 'all' || forecast.scf_type === typeFilter;
    
    return matchesSearch && matchesType;
  });

  const totalPages = Math.ceil(filteredForecasts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedForecasts = filteredForecasts.slice(startIndex, startIndex + itemsPerPage);

  const getTypeBadgeVariant = (type: string) => {
    switch (type) {
      case 'High Priority': return 'destructive';
      case 'Medium Priority': return 'secondary';
      case 'Low Priority': return 'outline';
      default: return 'outline';
    }
  };

  const typeStats = data.salesContactForecast.reduce((acc, forecast) => {
    const type = forecast.scf_type || '미분류';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgMAPE = data.salesContactForecast.length > 0
    ? data.salesContactForecast.reduce((sum, forecast) => sum + (forecast.scf_mape || 0), 0) / data.salesContactForecast.length
    : 0;

  const upcomingContacts = data.salesContactForecast.filter(forecast => {
    if (!forecast.scf_recommended_date) return false;
    const recommendedDate = new Date(forecast.scf_recommended_date);
    const today = new Date();
    const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
    return recommendedDate >= today && recommendedDate <= nextWeek;
  }).length;

  const highPriorityContacts = data.salesContactForecast.filter(
    forecast => forecast.scf_type === 'High Priority'
  ).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">영업 접촉 예측</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Phone className="w-4 h-4 mr-2" />
          예측 분석 실행
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 예측 건수</CardTitle>
            <Phone className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.salesContactForecast.length}</div>
            <p className="text-xs text-muted-foreground">영업 접촉 예측</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">이번 주 접촉 예정</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{upcomingContacts}</div>
            <p className="text-xs text-muted-foreground">7일 내 접촉</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">고우선순위</CardTitle>
            <Target className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highPriorityContacts}</div>
            <p className="text-xs text-muted-foreground">즉시 접촉 필요</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 정확도</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(100 - avgMAPE * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">예측 정확도</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>영업 접촉 예측 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="고객사명, 예측 유형으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="우선순위 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 우선순위</SelectItem>
                <SelectItem value="High Priority">High Priority</SelectItem>
                <SelectItem value="Medium Priority">Medium Priority</SelectItem>
                <SelectItem value="Low Priority">Low Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>예측ID</TableHead>
                <TableHead>고객사</TableHead>
                <TableHead>우선순위</TableHead>
                <TableHead>권장 접촉일</TableHead>
                <TableHead>예측 생성일</TableHead>
                <TableHead>정확도 (MAPE)</TableHead>
                <TableHead>남은 시간</TableHead>
                <TableHead>상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedForecasts.map((forecast) => {
                const customer = data.customers.find(c => c.customer_id === forecast.customer_id);
                const recommendedDate = forecast.scf_recommended_date ? new Date(forecast.scf_recommended_date) : null;
                const today = new Date();
                const daysUntilContact = recommendedDate 
                  ? Math.ceil((recommendedDate.getTime() - today.getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                
                return (
                  <TableRow key={forecast.scf_id}>
                    <TableCell className="font-medium">#{forecast.scf_id}</TableCell>
                    <TableCell>{customer?.company_name || '알 수 없음'}</TableCell>
                    <TableCell>
                      <Badge variant={getTypeBadgeVariant(forecast.scf_type || '')}>
                        {forecast.scf_type || '미분류'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {recommendedDate ? recommendedDate.toLocaleDateString('ko-KR') : '미입력'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {forecast.scf_generated_at ? new Date(forecast.scf_generated_at).toLocaleDateString('ko-KR') : '미입력'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <span className={
                          (forecast.scf_mape || 0) < 0.1 ? 'text-green-600 font-medium' :
                          (forecast.scf_mape || 0) < 0.2 ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {((1 - (forecast.scf_mape || 0)) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        {daysUntilContact !== null ? (
                          <span className={
                            daysUntilContact <= 0 ? 'text-red-600 font-medium' :
                            daysUntilContact <= 3 ? 'text-yellow-600 font-medium' : 'text-green-600'
                          }>
                            {daysUntilContact <= 0 ? '지금' : `${daysUntilContact}일 후`}
                          </span>
                        ) : '미정'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {daysUntilContact !== null ? (
                        <Badge variant={
                          daysUntilContact <= 0 ? 'destructive' :
                          daysUntilContact <= 3 ? 'secondary' : 'outline'
                        }>
                          {daysUntilContact <= 0 ? '즉시 접촉' :
                           daysUntilContact <= 3 ? '곧 접촉' : '예정됨'}
                        </Badge>
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

export default SalesContactForecast;
