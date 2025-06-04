
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, TrendingUp, Calendar, Package } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const Predictions = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterProduct, setFilterProduct] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredPredictions = useMemo(() => {
    return data.predictions.filter(prediction => {
      const contact = data.contacts.find(c => c.contact_id === prediction.contact_id);
      const matchesSearch = contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           prediction.predicted_product?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesFilter = filterProduct === 'all' || prediction.predicted_product === filterProduct;
      return matchesSearch && matchesFilter;
    });
  }, [data.predictions, data.contacts, searchTerm, filterProduct]);

  const totalPages = Math.ceil(filteredPredictions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedPredictions = filteredPredictions.slice(startIndex, startIndex + itemsPerPage);

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

  // 제품 목록
  const products = [...new Set(data.predictions.map(p => p.predicted_product).filter(Boolean))];

  // 예측 통계
  const totalPredictions = data.predictions.length;
  const totalQuantity = data.predictions.reduce((sum, p) => sum + (p.predicted_quantity || 0), 0);
  const avgQuantity = totalQuantity / totalPredictions || 0;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">예측 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          CSV 다운로드
        </Button>
      </div>

      {/* 예측 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <TrendingUp className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 예측 건수</p>
                <p className="text-2xl font-bold text-gray-900">{totalPredictions}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 예측 수량</p>
                <p className="text-2xl font-bold text-gray-900">{totalQuantity.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 예측 수량</p>
                <p className="text-2xl font-bold text-gray-900">{avgQuantity.toFixed(1)}</p>
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
                placeholder="담당자명 또는 제품명으로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterProduct} onValueChange={setFilterProduct}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="제품" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 제품</SelectItem>
                {products.map(product => (
                  <SelectItem key={product} value={product}>{product}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>예측 목록 ({filteredPredictions.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">담당자</th>
                  <th className="text-left p-4 font-semibold text-gray-900">회사</th>
                  <th className="text-left p-4 font-semibold text-gray-900">예측 제품</th>
                  <th className="text-left p-4 font-semibold text-gray-900">예측 수량</th>
                  <th className="text-left p-4 font-semibold text-gray-900">예측 날짜</th>
                  <th className="text-left p-4 font-semibold text-gray-900">상태</th>
                </tr>
              </thead>
              <tbody>
                {paginatedPredictions.map((prediction) => {
                  const contact = contactMap[prediction.contact_id];
                  const customer = contact ? customerMap[contact.customer_id] : null;
                  const isNearFuture = prediction.predicted_date && 
                    new Date(prediction.predicted_date) <= new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
                  
                  return (
                    <tr key={prediction.prediction_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{contact?.name || '-'}</p>
                          <p className="text-sm text-gray-500">{contact?.position || '-'}</p>
                        </div>
                      </td>
                      <td className="p-4 text-gray-900">{customer?.company_name || '-'}</td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {prediction.predicted_product || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-900 font-medium">
                        {(prediction.predicted_quantity || 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-600">{prediction.predicted_date || '-'}</td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isNearFuture ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}>
                          {isNearFuture ? '임박' : '일반'}
                        </span>
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

export default Predictions;
