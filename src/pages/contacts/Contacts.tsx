
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, User, Crown, Mail, Phone } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const Contacts = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterKeyman, setFilterKeyman] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredContacts = useMemo(() => {
    return data.contacts.filter(contact => {
      const matchesSearch = contact.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                           contact.email?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesFilter = filterKeyman === 'all' || 
                           (filterKeyman === 'keyman' && contact.is_keyman === 'Y') ||
                           (filterKeyman === 'executive' && contact.is_executive === 'Y');
      return matchesSearch && matchesFilter;
    });
  }, [data.contacts, searchTerm, filterKeyman]);

  const totalPages = Math.ceil(filteredContacts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedContacts = filteredContacts.slice(startIndex, startIndex + itemsPerPage);

  // 고객 정보 매핑
  const customerMap = useMemo(() => {
    return data.customers.reduce((acc, customer) => {
      acc[customer.customer_id] = customer;
      return acc;
    }, {} as Record<number, any>);
  }, [data.customers]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">연락처 관리</h1>
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
                placeholder="이름 또는 이메일로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterKeyman} onValueChange={setFilterKeyman}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">전체</SelectItem>
                <SelectItem value="keyman">키맨</SelectItem>
                <SelectItem value="executive">경영진</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 연락처 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <User className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 연락처</p>
                <p className="text-2xl font-bold text-gray-900">{data.contacts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">키맨</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.contacts.filter(c => c.is_keyman === 'Y').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Crown className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">경영진</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.contacts.filter(c => c.is_executive === 'Y').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Mail className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">이메일 보유</p>
                <p className="text-2xl font-bold text-gray-900">
                  {data.contacts.filter(c => c.email).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>연락처 목록 ({filteredContacts.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">이름</th>
                  <th className="text-left p-4 font-semibold text-gray-900">회사</th>
                  <th className="text-left p-4 font-semibold text-gray-900">부서/직책</th>
                  <th className="text-left p-4 font-semibold text-gray-900">연락처</th>
                  <th className="text-left p-4 font-semibold text-gray-900">역할</th>
                  <th className="text-left p-4 font-semibold text-gray-900">선호 채널</th>
                </tr>
              </thead>
              <tbody>
                {paginatedContacts.map((contact) => (
                  <tr key={contact.contact_id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="p-4">
                      <div>
                        <p className="font-medium text-gray-900">{contact.name}</p>
                        <p className="text-sm text-gray-500">{contact.position || '-'}</p>
                      </div>
                    </td>
                    <td className="p-4">
                      <p className="text-gray-900">{customerMap[contact.customer_id]?.company_name || '-'}</p>
                      <p className="text-sm text-gray-500">{contact.department || '-'}</p>
                    </td>
                    <td className="p-4 text-gray-600">{contact.department} / {contact.position}</td>
                    <td className="p-4">
                      <div className="space-y-1">
                        {contact.email && (
                          <div className="flex items-center text-sm">
                            <Mail className="w-3 h-3 mr-1" />
                            {contact.email}
                          </div>
                        )}
                        {contact.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="w-3 h-3 mr-1" />
                            {contact.phone}
                          </div>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex gap-1">
                        {contact.is_keyman === 'Y' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                            키맨
                          </span>
                        )}
                        {contact.is_executive === 'Y' && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                            경영진
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4 text-gray-600">{contact.preferred_channel || '-'}</td>
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

export default Contacts;
