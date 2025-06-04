
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
import { FileX, TrendingUp, AlertTriangle, Calendar, BarChart3 } from 'lucide-react';

const Claims = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [levelFilter, setLevelFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredClaims = data.claims.filter(claim => {
    const contact = data.contacts.find(c => c.contact_id === claim.contact_id);
    const customer = data.customers.find(c => c.customer_id === contact?.customer_id);
    const matchesSearch = 
      customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      claim.predicted_claim_type?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesLevel = levelFilter === 'all' || claim.predicted_claim_level === levelFilter;
    
    return matchesSearch && matchesLevel;
  });

  const totalPages = Math.ceil(filteredClaims.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedClaims = filteredClaims.slice(startIndex, startIndex + itemsPerPage);

  const getLevelBadgeVariant = (level: string) => {
    switch (level) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const levelStats = data.claims.reduce((acc, claim) => {
    const level = claim.predicted_claim_level || '미분류';
    acc[level] = (acc[level] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const typeStats = data.claims.reduce((acc, claim) => {
    const type = claim.predicted_claim_type || '미분류';
    acc[type] = (acc[type] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const avgClaimProbability = data.claims.length > 0
    ? data.claims.reduce((sum, claim) => sum + (claim.predicted_claim_probability || 0), 0) / data.claims.length
    : 0;

  const avgConfidenceScore = data.claims.length > 0
    ? data.claims.reduce((sum, claim) => sum + (claim.confidence_score || 0), 0) / data.claims.length
    : 0;

  const highRiskClaims = data.claims.filter(claim => claim.predicted_claim_level === 'High').length;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">클레임 예측 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <FileX className="w-4 h-4 mr-2" />
          클레임 분석
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 클레임 예측</CardTitle>
            <FileX className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.claims.length}</div>
            <p className="text-xs text-muted-foreground">예측 건수</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">고위험 클레임</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{highRiskClaims}</div>
            <p className="text-xs text-muted-foreground">즉시 관리 필요</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 클레임 확률</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgClaimProbability * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">예측 확률</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 신뢰도</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgConfidenceScore * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">예측 신뢰도</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>클레임 예측 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="고객사명, 담당자명, 클레임 유형으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={levelFilter} onValueChange={setLevelFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="위험도 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 위험도</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>클레임ID</TableHead>
                <TableHead>고객사</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>예측 유형</TableHead>
                <TableHead>위험도</TableHead>
                <TableHead>클레임 확률</TableHead>
                <TableHead>신뢰도 점수</TableHead>
                <TableHead>예측 날짜</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedClaims.map((claim) => {
                const contact = data.contacts.find(c => c.contact_id === claim.contact_id);
                const customer = data.customers.find(c => c.customer_id === contact?.customer_id);
                
                return (
                  <TableRow key={claim.claim_id}>
                    <TableCell className="font-medium">#{claim.claim_id}</TableCell>
                    <TableCell>{customer?.company_name || '알 수 없음'}</TableCell>
                    <TableCell>{contact?.name || '알 수 없음'}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileX className="w-4 h-4 text-gray-400" />
                        {claim.predicted_claim_type || '미분류'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getLevelBadgeVariant(claim.predicted_claim_level || '')}>
                        {claim.predicted_claim_level || '미분류'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className={
                          (claim.predicted_claim_probability || 0) > 0.7 ? 'text-red-600 font-medium' :
                          (claim.predicted_claim_probability || 0) > 0.5 ? 'text-yellow-600' : 'text-green-600'
                        }>
                          {((claim.predicted_claim_probability || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <span className={
                          (claim.confidence_score || 0) > 0.8 ? 'text-green-600 font-medium' :
                          (claim.confidence_score || 0) > 0.6 ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {((claim.confidence_score || 0) * 100).toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {claim.prediction_date ? new Date(claim.prediction_date).toLocaleDateString('ko-KR') : '미입력'}
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
              {filteredClaims.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredClaims.length)} 표시
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

export default Claims;
