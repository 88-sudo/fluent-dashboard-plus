
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download } from 'lucide-react';

const Customers = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // 샘플 고객 데이터
  const customers = [
    { id: 1, company_name: '삼성전자', company_type: '대기업', region: '서울', created_at: '2024-01-15' },
    { id: 2, company_name: '네이버', company_type: '대기업', region: '경기', created_at: '2024-01-20' },
    { id: 3, company_name: '토스', company_type: '스타트업', region: '서울', created_at: '2024-02-01' },
    { id: 4, company_name: '카카오', company_type: '대기업', region: '서울', created_at: '2024-02-10' },
    { id: 5, company_name: '쿠팡', company_type: '대기업', region: '서울', created_at: '2024-02-15' },
  ];

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.company_name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || customer.company_type === filterType;
    return matchesSearch && matchesFilter;
  });

  const totalPages = Math.ceil(filteredCustomers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedCustomers = filteredCustomers.slice(startIndex, startIndex + itemsPerPage);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">고객 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          CSV 다운로드
        </Button>
      </div>

      {/* 검색 및 필터 */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <Input
                placeholder="회사명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterType} onValueChange={setFilterType}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="회사 유형" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 유형</SelectItem>
                <SelectItem value="대기업">대기업</SelectItem>
                <SelectItem value="중소기업">중소기업</SelectItem>
                <SelectItem value="스타트업">스타트업</SelectItem>
                <SelectItem value="개인사업자">개인사업자</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>고객 목록 ({filteredCustomers.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">ID</th>
                  <th className="text-left p-4 font-semibold text-gray-900">회사명</th>
                  <th className="text-left p-4 font-semibold text-gray-900">회사 유형</th>
                  <th className="text-left p-4 font-semibold text-gray-900">지역</th>
                  <th className="text-left p-4 font-semibold text-gray-900">등록일</th>
                </tr>
              </thead>
              <tbody>
                {paginatedCustomers.map((customer) => (
                  <tr key={customer.id} className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer">
                    <td className="p-4 text-gray-900">{customer.id}</td>
                    <td className="p-4 text-gray-900 font-medium">{customer.company_name}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        customer.company_type === '대기업' ? 'bg-blue-100 text-blue-800' :
                        customer.company_type === '중소기업' ? 'bg-green-100 text-green-800' :
                        customer.company_type === '스타트업' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {customer.company_type}
                      </span>
                    </td>
                    <td className="p-4 text-gray-600">{customer.region}</td>
                    <td className="p-4 text-gray-600">{customer.created_at}</td>
                  </tr>
                ))}
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

export default Customers;
