
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, Download, Package, DollarSign } from 'lucide-react';
import { useSupabaseData } from '../../hooks/useSupabaseData';
import LoadingSpinner from '../../components/LoadingSpinner';
import ErrorDisplay from '../../components/ErrorDisplay';

const Products = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  const filteredProducts = useMemo(() => {
    return data.products.filter(product => {
      const matchesSearch = product.model?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           product.product_id?.toLowerCase().includes(searchTerm.toLowerCase()) || false;
      const matchesFilter = filterCategory === 'all' || product.category === filterCategory;
      return matchesSearch && matchesFilter;
    });
  }, [data.products, searchTerm, filterCategory]);

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedProducts = filteredProducts.slice(startIndex, startIndex + itemsPerPage);

  // 카테고리 목록
  const categories = [...new Set(data.products.map(p => p.category).filter(Boolean))];

  // 제품 통계
  const totalProducts = data.products.length;
  const avgSellingPrice = data.products.reduce((sum, p) => sum + (p.sellingprice || 0), 0) / totalProducts || 0;
  const totalRevenue = data.products.reduce((sum, p) => sum + (p.sellingprice || 0), 0);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">제품 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Download className="w-4 h-4 mr-2" />
          CSV 다운로드
        </Button>
      </div>

      {/* 제품 통계 */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Package className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">총 제품 수</p>
                <p className="text-2xl font-bold text-gray-900">{totalProducts}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <DollarSign className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">평균 판매가</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{avgSellingPrice.toLocaleString()}
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
                <p className="text-sm font-medium text-gray-600">총 상품 가치</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₩{totalRevenue.toLocaleString()}
                </p>
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
                placeholder="제품명 또는 ID로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={filterCategory} onValueChange={setFilterCategory}>
              <SelectTrigger className="w-full md:w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="카테고리" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 카테고리</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* 데이터 테이블 */}
      <Card>
        <CardHeader>
          <CardTitle>제품 목록 ({filteredProducts.length}개)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left p-4 font-semibold text-gray-900">제품 ID</th>
                  <th className="text-left p-4 font-semibold text-gray-900">모델명</th>
                  <th className="text-left p-4 font-semibold text-gray-900">카테고리</th>
                  <th className="text-left p-4 font-semibold text-gray-900">원가</th>
                  <th className="text-left p-4 font-semibold text-gray-900">판매가</th>
                  <th className="text-left p-4 font-semibold text-gray-900">마진율</th>
                  <th className="text-left p-4 font-semibold text-gray-900">사이즈</th>
                </tr>
              </thead>
              <tbody>
                {paginatedProducts.map((product) => {
                  const marginRate = product.originalprice && product.sellingprice 
                    ? ((product.sellingprice - product.originalprice) / product.sellingprice * 100)
                    : 0;
                  
                  return (
                    <tr key={product.product_id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-4 text-gray-900 font-medium">{product.product_id}</td>
                      <td className="p-4">
                        <div>
                          <p className="font-medium text-gray-900">{product.model}</p>
                          {product.notes && (
                            <p className="text-sm text-gray-500">{product.notes}</p>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {product.category || '-'}
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        ₩{(product.originalprice || 0).toLocaleString()}
                      </td>
                      <td className="p-4 text-gray-900 font-medium">
                        ₩{(product.sellingprice || 0).toLocaleString()}
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          marginRate > 20 ? 'bg-green-100 text-green-800' :
                          marginRate > 10 ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {marginRate.toFixed(1)}%
                        </span>
                      </td>
                      <td className="p-4 text-gray-600">
                        {product.inch ? `${product.inch}"` : '-'}
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

export default Products;
