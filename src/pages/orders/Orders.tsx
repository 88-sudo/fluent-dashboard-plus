
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
import { ShoppingCart, Package, DollarSign, TrendingUp, Calendar, Truck } from 'lucide-react';

const Orders = () => {
  const { data, loading, error } = useSupabaseData();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorDisplay error={error} />;

  const filteredOrders = data.orders.filter(order => {
    const contact = data.contacts.find(c => c.contact_id === order.contact_id);
    const customer = data.customers.find(c => c.customer_id === contact?.customer_id);
    const matchesSearch = 
      customer?.company_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.product_id?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.delivery_status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredOrders.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + itemsPerPage);

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case '배송완료': return 'default';
      case '배송중': return 'secondary';
      case '준비중': return 'outline';
      default: return 'outline';
    }
  };

  const getPaymentBadgeVariant = (status: string) => {
    switch (status) {
      case '결제완료': return 'default';
      case '결제대기': return 'destructive';
      default: return 'outline';
    }
  };

  const totalRevenue = data.orders.reduce((sum, order) => sum + (order.amount || 0), 0);
  const totalCost = data.orders.reduce((sum, order) => sum + (order.cost || 0), 0);
  const totalProfit = totalRevenue - totalCost;
  const avgMargin = data.orders.length > 0 
    ? data.orders.reduce((sum, order) => sum + (order.margin_rate || 0), 0) / data.orders.length 
    : 0;

  const statusStats = data.orders.reduce((acc, order) => {
    const status = order.delivery_status || '미분류';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const paymentStats = data.orders.reduce((acc, order) => {
    const status = order.payment_status || '미분류';
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">주문 관리</h1>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <ShoppingCart className="w-4 h-4 mr-2" />
          새 주문 등록
        </Button>
      </div>

      {/* 통계 카드 */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 주문 수</CardTitle>
            <ShoppingCart className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data.orders.length}</div>
            <p className="text-xs text-muted-foreground">전체 주문</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 매출</CardTitle>
            <DollarSign className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{(totalRevenue / 100000000).toFixed(1)}억</div>
            <p className="text-xs text-muted-foreground">총 주문 금액</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">총 수익</CardTitle>
            <TrendingUp className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">₩{(totalProfit / 100000000).toFixed(1)}억</div>
            <p className="text-xs text-muted-foreground">평균 마진 {avgMargin.toFixed(1)}%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">배송 완료</CardTitle>
            <Package className="w-4 h-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{statusStats['배송완료'] || 0}</div>
            <p className="text-xs text-muted-foreground">
              {((statusStats['배송완료'] || 0) / data.orders.length * 100).toFixed(1)}% 완료율
            </p>
          </CardContent>
        </Card>
      </div>

      {/* 필터 및 검색 */}
      <Card>
        <CardHeader>
          <CardTitle>주문 목록</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <Input
                placeholder="고객사명, 담당자명, 제품ID로 검색..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full md:w-48">
                <SelectValue placeholder="배송 상태 필터" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">모든 상태</SelectItem>
                <SelectItem value="배송완료">배송완료</SelectItem>
                <SelectItem value="배송중">배송중</SelectItem>
                <SelectItem value="준비중">준비중</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>주문ID</TableHead>
                <TableHead>고객사</TableHead>
                <TableHead>담당자</TableHead>
                <TableHead>제품</TableHead>
                <TableHead>수량</TableHead>
                <TableHead>주문금액</TableHead>
                <TableHead>마진율</TableHead>
                <TableHead>주문일</TableHead>
                <TableHead>결제상태</TableHead>
                <TableHead>배송상태</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedOrders.map((order) => {
                const contact = data.contacts.find(c => c.contact_id === order.contact_id);
                const customer = data.customers.find(c => c.customer_id === contact?.customer_id);
                const product = data.products.find(p => p.product_id === order.product_id);
                
                return (
                  <TableRow key={order.order_id}>
                    <TableCell className="font-medium">#{order.order_id}</TableCell>
                    <TableCell>{customer?.company_name || '알 수 없음'}</TableCell>
                    <TableCell>{contact?.name || '알 수 없음'}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="font-medium">{product?.model || order.product_id}</span>
                        <span className="text-sm text-gray-500">{product?.category}</span>
                      </div>
                    </TableCell>
                    <TableCell>{order.quantity?.toLocaleString() || 0}</TableCell>
                    <TableCell className="font-medium">
                      ₩{order.amount?.toLocaleString() || 0}
                    </TableCell>
                    <TableCell>
                      <span className={order.margin_rate && order.margin_rate > 0.15 ? 'text-green-600 font-medium' : 'text-gray-600'}>
                        {((order.margin_rate || 0) * 100).toFixed(1)}%
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        {order.order_date ? new Date(order.order_date).toLocaleDateString('ko-KR') : '미입력'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getPaymentBadgeVariant(order.payment_status || '')}>
                        {order.payment_status || '미분류'}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Truck className="w-4 h-4 text-gray-400" />
                        <Badge variant={getStatusBadgeVariant(order.delivery_status || '')}>
                          {order.delivery_status || '미분류'}
                        </Badge>
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
              {filteredOrders.length}개 중 {startIndex + 1}-{Math.min(startIndex + itemsPerPage, filteredOrders.length)} 표시
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

export default Orders;
