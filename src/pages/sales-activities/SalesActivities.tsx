
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
import { Activity, Calendar, Phone, Mail, Users, TrendingUp } from 'lucide-react';

const SalesActivities = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredActivities = data.salesActivities.filter(activity => {
    const matchesSearch = 
      activity.activity_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.activity_details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      activity.outcome?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || activity.outcome === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredActivities.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedActivities = filteredActivities.slice(startIndex, startIndex + itemsPerPage);

  const getOutcomeBadgeVariant = (outcome: string) => {
    switch (outcome) {
      case '매우 긍정적': return 'default';
      case '긍정적': return 'secondary';
      case '보통': return 'outline';
      case '해결됨': return 'default';
      default: return 'outline';
    }
  };

  const getActivityTypeIcon = (type: string) => {
    switch (type) {
      case '전화상담': return <Phone className="w-4 h-4" />;
      case '이메일': return <Mail className="w-4 h-4" />;
      case '방문상담': return <Users className="w-4 h-4" />;
      case '화상회의': return <Activity className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  const activityTypeStats = data.salesActivities.reduce((acc, activity) => {
    const type = activity.activity_type || '기타';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const outcomeStats = data.salesActivities.reduce((acc, activity) => {
    const outcome = activity.outcome || '미분류';
    acc[outcome] = (acc[outcome] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const recentActivities = data.salesActivities
    .filter(activity => {
      if (!activity.activity_date) return false;
      const activityDate = new Date(activity.activity_date);
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
      return activityDate >= thirtyDaysAgo;
    }).length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">영업 활동 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Activity className="w-4 h-4 mr-2" />
          새 활동 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 활동 수</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.salesActivities.length}</div>
            <p className="text-xs text-muted-foreground">전체 영업 활동</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">최근 30일 활동</CardTitle>
            <Calendar className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{recentActivities}</div>
            <p className="text-xs text-muted-foreground">최근 한 달</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">긍정적 결과</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(outcomeStats['긍정적'] || 0) + (outcomeStats['매우 긍정적'] || 0)}
            </div>
            <p className="text-xs text-muted-foreground">성공적인 활동</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">주요 활동 유형</CardTitle>
            <Activity className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Object.keys(activityTypeStats).length}
            </div>
            <p className="text-xs text-muted-foreground">활동 유형 수</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>영업 활동 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="활동 유형, 세부사항, 결과로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="결과 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 결과</SelectItem>
                <SelectItem value="매우 긍정적">매우 긍정적</SelectItem>
                <SelectItem value="긍정적">긍정적</SelectItem>
                <SelectItem value="보통">보통</SelectItem>
                <SelectItem value="해결됨">해결됨</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>활동 유형</TableHead>
                <TableHead>고객사</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>활동 날짜</TableHead>
                <TableHead>세부사항</TableHead>
                <TableHead>결과</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedActivities.map((activity) => {
                const customer = data.customers.find(c => c.customer_id === activity.customer_id);
                const contact = data.contacts.find(c => c.contact_id === activity.contact_id);
                
                return (
                  <TableRow key={activity.activity_id}>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getActivityTypeIcon(activity.activity_type || '')}
                        {activity.activity_type || '미분류'}
                      </div>
                    </TableCell>
                    <TableCell>{customer?.company_name || '알 수 없음'}</TableCell>
                    <TableCell>{contact?.name || '알 수 없음'}</TableCell>
                    <TableCell>
                      {activity.activity_date ? new Date(activity.activity_date).toLocaleDateString('ko-KR') : '미입력'}
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {activity.activity_details || '세부사항 없음'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={getOutcomeBadgeVariant(activity.outcome || '')}>
                        {activity.outcome || '미분류'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {filteredActivities.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredActivities.length)} 표시
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

export default SalesActivities;
