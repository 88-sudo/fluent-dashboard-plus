
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, PieChart, DollarSign, AlertTriangle } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const Segments = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRisk, setFilterRisk] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredSegments = useMemo(() => {
    return data.segments.filter(segment => {
      const contact = data.contacts.find(c => c.contact_id === segment.contact_id);
      const matchesSearch = contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           segment.segment_label?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesFilter = filterRisk === 'all' || segment.predicted_risk_level === filterRisk;
      return matchesSearch && matchesFilter;
    });
  }, [data.segments, data.contacts, searchTerm, filterRisk]);

  const totalPages = Math.ceil(filteredSegments.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedSegments = filteredSegments.slice(startIndex, startIndex + itemsPerPage);

  // 연락처 및 고객 정보 매핑
  const contactMap = useMemo(() => {
    return data.contacts.reduce((acc, contact) => {
      acc[contact.contact_id] = contact;
      return acc;
    }, {} as Record<number, any>);
  }, [data.contacts]);

  const customerMap = useMemo(() => {
    return data.customers.reduce((acc, customer) => {
      acc[customer.customer_id] = customer;
      return acc;
    }, {} as Record<number, any>);
  }, [data.customers]);

  // 위험도 수준 목록
  const riskLevels = [...new Set(data.segments.map(s => s.predicted_risk_level).filter(Boolean))];

  // 세그먼트 통계
  const totalSegments = data.segments.length;
  const avgCLV = data.segments.reduce((sum, s) => sum + (s.clv || 0), 0) / totalSegments || 0;
  const avgARR = data.segments.reduce((sum, s) => sum + (s.arr || 0), 0) / totalSegments || 0;
  const highRiskCount = data.segments.filter(s => s.predicted_risk_level === 'High').length;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">세그먼트 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          CSV 다운로드
        </Button>
      </div>

      {/* 세그먼트 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 세그먼트</p>
                <p className="text-2xl font-bold text-gray-900">{totalSegments}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 CLV</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{avgCLV.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 ARR</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{avgARR.toLocaleString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">고위험 고객</p>
                <p className="text-2xl font-bold text-gray-900">{highRiskCount}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="담당자명 또는 세그먼트명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterRisk} onValueChange={setFilterRisk}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="위험도" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 위험도</SelectItem>
                {riskLevels.map(level => (
                  <SelectItem key={level} value={level}>{level}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>세그먼트 목록 ({filteredSegments.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">담당자</th>
                  <th className="text-left p-4 font-semibold text-gray-900">회사</th>
                  <th className="text-left p-4 font-semibold text-gray-900">세그먼트</th>
                  <th className="text-left p-4 font-semibold text-gray-900">위험도</th>
                  <th className="text-left p-4 font-semibold text-gray-900">CLV</th>
                  <th className="text-left p-4 font-semibold text-gray-900">ARR</th>
                  <th className="text-left p-4 font-semibold text-gray-900">위험 확률</th>
                </tr>
              </thead>
              <tbody>
                {paginatedSegments.map((segment) => {
                  const contact = contactMap[segment.contact_id];
                  const customer = contact ? customerMap[contact.customer_id] : null;
                  
                  return (
                    <tr key={segment.contact_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{contact?.name || '-'}</p>
                          <p className="text-sm text-gray-500">{contact?.position || '-'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900">{customer?.company_name || '-'}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {segment.segment_label || '-'}
                        </span>
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          segment.predicted_risk_level === 'High' ? 'bg-red-100 text-red-800' :
                          segment.predicted_risk_level === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-green-100 text-green-800'
                        }`}>
                          {segment.predicted_risk_level || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-900 font-medium">
                        ₩{(segment.clv || 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-900 font-medium">
                        ₩{(segment.arr || 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-600">
                        {segment.high_risk_probability ? 
                          `${(segment.high_risk_probability * 100).toFixed(1)}%` : '-'}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className="flex items-center justify-between mt-6">
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-600">페이지당</span>
              <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(Number(value))}>
                <SelectTrigger className="w-20">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                </SelectContent>
              </Select>
              <span className="text-sm text-gray-600">개 항목</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                이전
              </Button>
              <span className="px-4 py-2 text-sm text-gray-600">
                {currentPage} / {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
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

export default Segments;
