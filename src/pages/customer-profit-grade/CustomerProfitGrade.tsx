
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
import { DollarSign, TrendingUp, Award, BarChart3, Calculator, Target } from 'lucide-react';

const CustomerProfitGrade = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [gradeFilter, setGradeFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredGrades = data.customerProfitGrade.filter(grade => {
    const contact = data.contacts.find(c => c.contact_id === grade.contact_id);
    const customer = data.customers.find(c => c.customer_id === contact?.customer_id);
    const matchesSearch = 
      customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      grade.customer_grade?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGrade = gradeFilter === 'all' || grade.customer_grade === gradeFilter;
    
    return matchesSearch && matchesGrade;
  });

  const totalPages = Math.ceil(filteredGrades.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedGrades = filteredGrades.slice(startIndex, startIndex + itemsPerPage);

  const getGradeBadgeVariant = (grade: string) => {
    switch (grade) {
      case 'A': return 'default';
      case 'B': return 'secondary';
      case 'C': return 'outline';
      case 'D': return 'destructive';
      default: return 'outline';
    }
  };

  const gradeStats = data.customerProfitGrade.reduce((acc, grade) => {
    const gradeLevel = grade.customer_grade || '미분류';
    acc[gradeLevel] = (acc[gradeLevel] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const totalSales = data.customerProfitGrade.reduce((sum, grade) => sum + (grade.total_sales || 0), 0);
  const totalCost = data.customerProfitGrade.reduce((sum, grade) => sum + (grade.total_cost || 0), 0);
  const totalProfit = data.customerProfitGrade.reduce((sum, grade) => sum + (grade.total_profit || 0), 0);

  const avgProfitMargin = data.customerProfitGrade.length > 0
    ? data.customerProfitGrade.reduce((sum, grade) => sum + (grade.profit_margin || 0), 0) / data.customerProfitGrade.length
    : 0;

  const topGradeCustomers = gradeStats['A'] || 0;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">고객 수익 등급</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Award className="w-4 h-4 mr-2" />
          등급 재계산
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{(totalSales / 100000000).toFixed(1)}억</div>
            <p className="text-xs text-muted-foreground">전체 고객 매출</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수익</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{(totalProfit / 100000000).toFixed(1)}억</div>
            <p className="text-xs text-muted-foreground">순 수익</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">평균 수익률</CardTitle>
            <BarChart3 className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{(avgProfitMargin * 100).toFixed(1)}%</div>
            <p className="text-xs text-muted-foreground">평균 마진</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">A등급 고객</CardTitle>
            <Award className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{topGradeCustomers}</div>
            <p className="text-xs text-muted-foreground">
              {((topGradeCustomers / data.customerProfitGrade.length) * 100).toFixed(1)}% 비율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 수익 등급 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="고객사명, 담당자명, 등급으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={gradeFilter} onValueChange={setGradeFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="등급 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 등급</SelectItem>
                <SelectItem value="A">A등급</SelectItem>
                <SelectItem value="B">B등급</SelectItem>
                <SelectItem value="C">C등급</SelectItem>
                <SelectItem value="D">D등급</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>고객사</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>고객 등급</TableHead>
                <TableHead>총 매출</TableHead>
                <TableHead>총 비용</TableHead>
                <TableHead>총 수익</TableHead>
                <TableHead>수익률</TableHead>
                <TableHead>수익성</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedGrades.map((grade) => {
                const contact = data.contacts.find(c => c.contact_id === grade.contact_id);
                const customer = data.customers.find(c => c.customer_id === contact?.customer_id);
                const profitMarginPercent = (grade.profit_margin || 0) * 100;
                
                return (
                  <TableRow key={grade.contact_id}>
                    <TableCell className="font-medium">
                      {customer?.company_name || '알 수 없음'}
                    </TableCell>
                    <TableCell>{contact?.name || '알 수 없음'}</TableCell>
                    <TableCell>
                      <Badge variant={getGradeBadgeVariant(grade.customer_grade || '')} className="text-lg font-bold">
                        {grade.customer_grade || '미분류'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-gray-400" />
                        ₩{(grade.total_sales || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calculator className="w-4 h-4 text-gray-400" />
                        ₩{(grade.total_cost || 0).toLocaleString()}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-gray-400" />
                        <span className={
                          (grade.total_profit || 0) > 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'
                        }>
                          ₩{(grade.total_profit || 0).toLocaleString()}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-gray-400" />
                        <span className={
                          profitMarginPercent > 20 ? 'text-green-600 font-medium' :
                          profitMarginPercent > 10 ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {profitMarginPercent.toFixed(1)}%
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Target className="w-4 h-4 text-gray-400" />
                        <span className={
                          profitMarginPercent > 20 ? 'text-green-600 font-medium' :
                          profitMarginPercent > 10 ? 'text-yellow-600' : 'text-red-600'
                        }>
                          {profitMarginPercent > 20 ? '매우 우수' :
                           profitMarginPercent > 10 ? '양호' : '개선 필요'}
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
              {filteredGrades.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredGrades.length)} 표시
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

export default CustomerProfitGrade;
