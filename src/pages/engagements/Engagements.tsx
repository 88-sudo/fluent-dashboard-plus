
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
import { Mail, MousePointer, Users, Calendar, TrendingUp, Activity } from 'lucide-react';

const Engagements = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [responseFilter, setResponseFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredEngagements = data.engagements.filter(engagement => {
    const customer = data.customers.find(c => c.customer_id === engagement.customer_id);
    const matchesSearch = 
      customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      engagement.survey_response?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesResponse = responseFilter === 'all' || engagement.survey_response === responseFilter;
    
    return matchesSearch && matchesResponse;
  });

  const totalPages = Math.ceil(filteredEngagements.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedEngagements = filteredEngagements.slice(startIndex, startIndex + itemsPerPage);

  const getResponseBadgeVariant = (response: string) => {
    switch (response) {
      case '매우 만족': return 'default';
      case '만족': return 'secondary';
      case '보통': return 'outline';
      case '불만족': return 'destructive';
      default: return 'outline';
    }
  };

  const totalNewsletterOpens = data.engagements.reduce((sum, eng) => sum + (eng.newsletter_opens || 0), 0);
  const totalSiteVisits = data.engagements.reduce((sum, eng) => sum + (parseInt(eng.site_visits || '0') || 0), 0);
  
  const activeCustomers = data.engagements.filter(engagement => {
    if (!engagement.last_active_date) return false;
    const lastActive = new Date(engagement.last_active_date);
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    return lastActive >= thirtyDaysAgo;
  }).length;

  const satisfactionStats = data.engagements.reduce((acc, engagement) => {
    const response = engagement.survey_response || '미응답';
    acc[response] = (acc[response] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgNewsletterOpens = data.engagements.length > 0 
    ? Math.round(totalNewsletterOpens / data.engagements.length) 
    : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">고객 참여 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Mail className="w-4 h-4 mr-2" />
          참여 활동 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 뉴스레터 오픈</CardTitle>
            <Mail className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalNewsletterOpens.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">평균 {avgNewsletterOpens}회/고객</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 사이트 방문</CardTitle>
            <MousePointer className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSiteVisits.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              평균 {Math.round(totalSiteVisits / data.engagements.length)}회/고객
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">활성 고객</CardTitle>
            <Users className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{activeCustomers}</div>
            <p className="text-xs text-muted-foreground">최근 30일 활성</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">만족도</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {(satisfactionStats['매우 만족'] || 0) + (satisfactionStats['만족'] || 0)}
            </div>
            <p className="text-xs text-muted-foreground">만족 고객 수</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 참여 현황</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="고객사명, 설문 응답으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={responseFilter} onValueChange={setResponseFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="만족도 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 응답</SelectItem>
                <SelectItem value="매우 만족">매우 만족</SelectItem>
                <SelectItem value="만족">만족</SelectItem>
                <SelectItem value="보통">보통</SelectItem>
                <SelectItem value="불만족">불만족</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객사</TableHead>
                <TableHead>뉴스레터 오픈</TableHead>
                <TableHead>사이트 방문</TableHead>
                <TableHead>마지막 활동일</TableHead>
                <TableHead>설문 응답</TableHead>
                <TableHead>참여도</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedEngagements.map((engagement) => {
                const customer = data.customers.find(c => c.customer_id === engagement.customer_id);
                const siteVisits = parseInt(engagement.site_visits || '0');
                const newsletterOpens = engagement.newsletter_opens || 0;
                const engagementScore = siteVisits + newsletterOpens;
                
                return (
                  <TableRow key={engagement.engagement_id}>
                    <TableCell className="font-medium">
                      {customer?.company_name || '알 수 없음'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4 text-gray-400" />
                        {newsletterOpens}회
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <MousePointer className="w-4 h-4 text-gray-400" />
                        {siteVisits}회
                      </div>
                    </TableCell>
                    <TableCell>
                      {engagement.last_active_date 
                        ? new Date(engagement.last_active_date).toLocaleDateString('ko-KR')
                        : '미기록'
                      }
                    </TableCell>
                    <TableCell>
                      <Badge variant={getResponseBadgeVariant(engagement.survey_response || '')}>
                        {engagement.survey_response || '미응답'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4 text-gray-400" />
                        <span className={engagementScore > 10 ? 'text-green-600 font-medium' : 
                                       engagementScore > 5 ? 'text-yellow-600' : 'text-red-600'}>
                          {engagementScore > 10 ? '높음' : 
                           engagementScore > 5 ? '보통' : '낮음'}
                        </span>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {filteredEngagements.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredEngagements.length)} 표시
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

export default Engagements;
