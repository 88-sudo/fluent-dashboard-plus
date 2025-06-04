
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
import { AlertTriangle, Clock, CheckCircle, XCircle, Calendar, FileText } from 'lucide-react';

const Issues = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [severityFilter, setSeverityFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredIssues = data.issues.filter(issue => {
    const matchesSearch = 
      issue.issue_type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    const matchesSeverity = severityFilter === 'all' || issue.severity === severityFilter;
    
    return matchesSearch && matchesStatus && matchesSeverity;
  });

  const totalPages = Math.ceil(filteredIssues.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedIssues = filteredIssues.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case '해결됨': return 'default';
      case '처리중': return 'secondary';
      case '미해결': return 'destructive';
      default: return 'outline';
    }
  };

  const getSeverityBadgeVariant = (severity: string) => {
    switch (severity) {
      case 'High': return 'destructive';
      case 'Medium': return 'secondary';
      case 'Low': return 'outline';
      default: return 'outline';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case '해결됨': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case '처리중': return <Clock className="w-4 h-4 text-yellow-600" />;
      case '미해결': return <XCircle className="w-4 h-4 text-red-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const statusStats = data.issues.reduce((acc, issue) => {
    const status = issue.status || '미분류';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const severityStats = data.issues.reduce((acc, issue) => {
    const severity = issue.severity || '미분류';
    acc[severity] = (acc[severity] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const resolvedIssues = statusStats['해결됨'] || 0;
  const resolvedRate = data.issues.length > 0 ? (resolvedIssues / data.issues.length * 100) : 0;

  const avgResolutionTime = data.issues
    .filter(issue => issue.status === '해결됨' && issue.issue_date && issue.resolved_date)
    .reduce((acc, issue) => {
      const issueDate = new Date(issue.issue_date!);
      const resolvedDate = new Date(issue.resolved_date!);
      const days = Math.ceil((resolvedDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24));
      return acc + days;
    }, 0);

  const avgDays = resolvedIssues > 0 ? Math.round(avgResolutionTime / resolvedIssues) : 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">이슈 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <AlertTriangle className="w-4 h-4 mr-2" />
          새 이슈 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 이슈 수</CardTitle>
            <AlertTriangle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.issues.length}</div>
            <p className="text-xs text-muted-foreground">전체 이슈</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">해결된 이슈</CardTitle>
            <CheckCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{resolvedIssues}</div>
            <p className="text-xs text-muted-foreground">해결률 {resolvedRate.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">미해결 이슈</CardTitle>
            <XCircle className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats['미해결'] || 0}</div>
            <p className="text-xs text-muted-foreground">즉시 처리 필요</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 해결 시간</CardTitle>
            <Clock className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{avgDays}일</div>
            <p className="text-xs text-muted-foreground">평균 처리 기간</p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>이슈 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="이슈 유형, 설명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="해결됨">해결됨</SelectItem>
                <SelectItem value="처리중">처리중</SelectItem>
                <SelectItem value="미해결">미해결</SelectItem>
              </SelectContent>
            </Select>
            <Select value={severityFilter} onValueChange={setSeverityFilter}>
              <SelectTrigger className="w-full md:w-40">
                <SelectValue placeholder="심각도 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 심각도</SelectItem>
                <SelectItem value="High">High</SelectItem>
                <SelectItem value="Medium">Medium</SelectItem>
                <SelectItem value="Low">Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>이슈ID</TableHead>
                <TableHead>이슈 유형</TableHead>
                <TableHead>심각도</TableHead>
                <TableHead>상태</TableHead>
                <TableHead>설명</TableHead>
                <TableHead>발생일</TableHead>
                <TableHead>해결일</TableHead>
                <TableHead>소요 시간</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedIssues.map((issue) => {
                const issueDate = issue.issue_date ? new Date(issue.issue_date) : null;
                const resolvedDate = issue.resolved_date ? new Date(issue.resolved_date) : null;
                const resolutionDays = issueDate && resolvedDate 
                  ? Math.ceil((resolvedDate.getTime() - issueDate.getTime()) / (1000 * 60 * 60 * 24))
                  : null;
                
                return (
                  <TableRow key={issue.issue_id}>
                    <TableCell className="font-medium">#{issue.issue_id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-400" />
                        {issue.issue_type || '미분류'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSeverityBadgeVariant(issue.severity || '')}>
                        {issue.severity || '미분류'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        {getStatusIcon(issue.status || '')}
                        <Badge variant={getStatusBadgeVariant(issue.status || '')}>
                          {issue.status || '미분류'}
                        </Badge>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">
                      {issue.description || '설명 없음'}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {issueDate ? issueDate.toLocaleDateString('ko-KR') : '미입력'}
                      </div>
                    </TableCell>
                    <TableCell>
                      {resolvedDate ? resolvedDate.toLocaleDateString('ko-KR') : '-'}
                    </TableCell>
                    <TableCell>
                      {resolutionDays ? (
                        <span className={resolutionDays <= 3 ? 'text-green-600 font-medium' : 
                                       resolutionDays <= 7 ? 'text-yellow-600' : 'text-red-600'}>
                          {resolutionDays}일
                        </span>
                      ) : '-'}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-4">
            <div className="text-sm text-gray-500">
              {filteredIssues.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredIssues.length)} 표시
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

export default Issues;
