import React, { useState } from 'react';
import { RefreshCw, MapPin, Navigation, DollarSign, CheckCircle, Package } from 'lucide-react';
import { Button, Card, Badge } from '../components/ui';
import MapVisual from '../components/MapVisual';
import { Order, OrderStatus } from '../types';

interface RiderAppProps {
  orders: Order[];
  onUpdateStatus: (orderId: string, status: OrderStatus) => void;
  onAcceptOrder: (orderId: string) => void;
  riderId: string;
}

const RiderApp: React.FC<RiderAppProps> = ({ orders, onUpdateStatus, onAcceptOrder, riderId }) => {
  const [activeTab, setActiveTab] = useState<'hall' | 'delivering' | 'wallet'>('hall');

  // Filter orders
  const availableOrders = orders.filter(o => o.status === OrderStatus.PENDING);
  const myActiveOrders = orders.filter(o => o.riderId === riderId && o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED);
  
  const handleStatusProgress = (order: Order) => {
    if (order.status === OrderStatus.ACCEPTED) onUpdateStatus(order.id, OrderStatus.PICKING_UP);
    else if (order.status === OrderStatus.PICKING_UP) onUpdateStatus(order.id, OrderStatus.DELIVERING);
    else if (order.status === OrderStatus.DELIVERING) onUpdateStatus(order.id, OrderStatus.COMPLETED);
  };

  const getNextActionLabel = (status: OrderStatus) => {
    switch (status) {
      case OrderStatus.ACCEPTED: return '确认到店';
      case OrderStatus.PICKING_UP: return '确认取货';
      case OrderStatus.DELIVERING: return '确认送达';
      default: return '完成';
    }
  };

  if (activeTab === 'hall') {
    return (
      <div className="h-full flex flex-col bg-gray-100 overflow-hidden">
        <header className="bg-blue-600 text-white p-4 pb-12 rounded-b-[2rem] shadow-lg relative">
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-xl font-bold italic">SpeedyRider</h1>
            <div className="flex items-center gap-2 bg-blue-700/50 px-3 py-1 rounded-full text-sm">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                听单中
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold">12</div>
              <div className="text-xs opacity-80">今日完成</div>
            </div>
            <div>
              <div className="text-2xl font-bold">¥186</div>
              <div className="text-xs opacity-80">今日收入</div>
            </div>
            <div>
              <div className="text-2xl font-bold">100%</div>
              <div className="text-xs opacity-80">准时率</div>
            </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto -mt-8 px-4 pb-20 space-y-4 no-scrollbar">
          <div className="flex justify-between items-center px-2">
            <h2 className="font-bold text-gray-800">任务大厅 ({availableOrders.length})</h2>
            <button className="text-blue-600 text-sm flex items-center gap-1">
               <RefreshCw className="w-3 h-3" /> 刷新
            </button>
          </div>
          
          {availableOrders.map(order => (
            <Card key={order.id} className="animate-slide-up hover:border-blue-300 transition-colors border-l-4 border-l-blue-500">
              <div className="flex justify-between items-start mb-3">
                <div className="flex gap-2">
                   <Badge color="blue">{order.type}</Badge>
                   {order.tags.map(t => <Badge key={t} color="red">{t}</Badge>)}
                </div>
                <span className="text-xl font-bold text-red-500">¥{order.price}</span>
              </div>
              
              <div className="space-y-3 mb-4">
                <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-green-500 shrink-0"></div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{order.pickupLocation.address}</p>
                        <p className="text-xs text-gray-500">距您 0.5km</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <div className="mt-1 w-2 h-2 rounded-full bg-red-500 shrink-0"></div>
                    <div>
                        <p className="text-sm font-medium text-gray-900 line-clamp-1">{order.dropoffLocation.address}</p>
                        <p className="text-xs text-gray-500">全程 {order.distanceKm}km</p>
                    </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
                <span className="text-xs text-gray-500">{order.description || "暂无备注"}</span>
                <Button onClick={() => onAcceptOrder(order.id)} className="bg-blue-600 text-white hover:bg-blue-700 w-24">
                  抢单
                </Button>
              </div>
            </Card>
          ))}
          {availableOrders.length === 0 && (
             <div className="flex flex-col items-center justify-center py-10 text-gray-400">
                 <Package className="w-12 h-12 mb-2 opacity-20" />
                 <p>附近暂无新订单</p>
             </div>
          )}
        </div>
      </div>
    );
  }

  if (activeTab === 'delivering') {
    return (
        <div className="h-full flex flex-col bg-gray-50 overflow-y-auto pb-20">
             <header className="bg-white p-4 shadow-sm">
                <h1 className="text-lg font-bold text-center">进行中 ({myActiveOrders.length})</h1>
             </header>
             <div className="p-4 space-y-4">
                 {myActiveOrders.map(order => (
                     <Card key={order.id} className="border-l-4 border-l-amber-400">
                         <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-500">订单号: {order.id.slice(-6)}</span>
                            <span className="font-bold text-amber-600">{order.status}</span>
                         </div>
                         <MapVisual className="h-24 w-full mb-3 rounded-lg" showRider />
                         <div className="mb-4 space-y-2">
                             <div className="flex items-center gap-2">
                                 <span className="bg-green-100 text-green-700 text-xs px-1 rounded">取</span>
                                 <span className="text-sm">{order.pickupLocation.address}</span>
                             </div>
                             <div className="flex items-center gap-2">
                                 <span className="bg-red-100 text-red-700 text-xs px-1 rounded">送</span>
                                 <span className="text-sm">{order.dropoffLocation.address}</span>
                             </div>
                         </div>
                         <div className="flex gap-2">
                             <Button variant="outline" className="flex-1 text-sm">联系客户</Button>
                             <Button 
                                className="flex-1 bg-amber-400 text-gray-900 text-sm"
                                onClick={() => handleStatusProgress(order)}
                             >
                                {getNextActionLabel(order.status)}
                             </Button>
                         </div>
                     </Card>
                 ))}
                 {myActiveOrders.length === 0 && <div className="text-center text-gray-400 mt-10">当前没有配送中的订单，快去抢单吧！</div>}
             </div>
        </div>
    )
  }

  return (
    <div className="h-full bg-white flex flex-col items-center justify-center">
        <DollarSign className="w-16 h-16 text-amber-400 mb-4" />
        <h2 className="text-2xl font-bold">本月收入</h2>
        <p className="text-4xl font-bold text-gray-900 mt-2">¥4,285.00</p>
        <p className="text-gray-500 mt-2">击败了 85% 的骑手</p>
    </div>
  )
};

export const RiderBottomNav: React.FC<{ active: string; onChange: (t: any) => void }> = ({ active, onChange }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50 pb-safe">
    {[
      { id: 'hall', icon: RefreshCw, label: '抢单' },
      { id: 'delivering', icon: Navigation, label: '配送' },
      { id: 'wallet', icon: DollarSign, label: '钱包' }
    ].map(item => (
      <button 
        key={item.id}
        onClick={() => onChange(item.id)}
        className={`flex flex-col items-center space-y-1 ${active === item.id ? 'text-blue-600' : 'text-gray-400'}`}
      >
        <item.icon className="w-6 h-6" />
        <span className="text-xs">{item.label}</span>
      </button>
    ))}
  </div>
);

export default RiderApp;