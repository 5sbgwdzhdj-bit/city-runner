import React from 'react';
import { ClipboardList, Archive, TrendingUp } from 'lucide-react';
import { Card, Button, Badge } from '../components/ui';
import { Order, OrderStatus } from '../types';

interface MerchantAppProps {
  orders: Order[];
  onUpdateStatus: (id: string, status: OrderStatus) => void;
}

const MerchantApp: React.FC<MerchantAppProps> = ({ orders, onUpdateStatus }) => {
  // Mock filter for merchant's orders
  const merchantOrders = orders.filter(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED);

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <header className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">商家工作台</h1>
          <p className="text-gray-500">好味当餐饮连锁（科技园店）</p>
        </div>
        <div className="flex gap-4">
           <Button variant="outline">暂停营业</Button>
           <Button>店铺设置</Button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-blue-100 rounded-full text-blue-600">
             <ClipboardList />
          </div>
          <div>
            <p className="text-gray-500">待处理订单</p>
            <p className="text-2xl font-bold">{merchantOrders.length}</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-amber-100 rounded-full text-amber-600">
             <TrendingUp />
          </div>
          <div>
            <p className="text-gray-500">今日营业额</p>
            <p className="text-2xl font-bold">¥2,340</p>
          </div>
        </Card>
        <Card className="flex items-center gap-4">
          <div className="p-3 bg-purple-100 rounded-full text-purple-600">
             <Archive />
          </div>
          <div>
             <p className="text-gray-500">库存预警</p>
             <p className="text-2xl font-bold">3</p>
          </div>
        </Card>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-4 border-b border-gray-200 bg-gray-50 flex justify-between items-center">
          <h2 className="font-bold text-lg">实时订单</h2>
          <div className="flex gap-2">
             <Button size="sm" variant="ghost">全部</Button>
             <Button size="sm" variant="secondary">待接单</Button>
             <Button size="sm" variant="ghost">配送中</Button>
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {merchantOrders.length === 0 ? (
             <div className="p-8 text-center text-gray-500">暂无新订单</div>
          ) : (
            merchantOrders.map(order => (
              <div key={order.id} className="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-gray-50">
                <div>
                   <div className="flex items-center gap-2 mb-1">
                      <span className="font-mono text-lg font-bold">#{order.id.slice(-4)}</span>
                      <Badge color="yellow">{order.status}</Badge>
                      <span className="text-sm text-gray-400">{new Date(order.createdAt).toLocaleTimeString()}</span>
                   </div>
                   <p className="text-gray-800 font-medium">{order.description}</p>
                   <div className="flex gap-2 mt-2">
                      {order.tags.map(t => <span key={t} className="text-xs bg-gray-100 px-2 py-1 rounded text-gray-600">{t}</span>)}
                   </div>
                </div>
                
                <div className="flex items-center gap-6">
                   <div className="text-right">
                      <p className="font-bold text-lg">¥{order.price}</p>
                      <p className="text-sm text-gray-500">含配送费 ¥5</p>
                   </div>
                   {order.status === OrderStatus.PENDING && (
                     <Button className="w-full md:w-auto" onClick={() => onUpdateStatus(order.id, OrderStatus.ACCEPTED)}>接单打印</Button>
                   )}
                   {order.status === OrderStatus.ACCEPTED && (
                     <Button variant="outline" disabled className="w-full md:w-auto">等待骑手</Button>
                   )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default MerchantApp;