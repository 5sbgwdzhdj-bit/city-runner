import React, { useState, useEffect } from 'react';
import { ShoppingBag, Package, Users, Coffee, Sparkles, MapPin, Clock, Search, Star } from 'lucide-react';
import { Button, Card, Badge, Input } from '../components/ui';
import MapVisual from '../components/MapVisual';
import { Order, OrderStatus, ServiceType } from '../types';
import { analyzeOrderRequest, suggestTags } from '../services/geminiService';

interface UserAppProps {
  orders: Order[];
  onCreateOrder: (order: Partial<Order>) => void;
  userId: string;
}

const UserApp: React.FC<UserAppProps> = ({ orders, onCreateOrder, userId }) => {
  const [activeTab, setActiveTab] = useState<'home' | 'orders' | 'profile'>('home');
  const [requestText, setRequestText] = useState('');
  const [aiAnalyzing, setAiAnalyzing] = useState(false);
  const [aiSuggestion, setAiSuggestion] = useState<string | null>(null);

  const myOrders = orders.filter(o => o.userId === userId);
  const activeOrder = myOrders.find(o => o.status !== OrderStatus.COMPLETED && o.status !== OrderStatus.CANCELLED);

  const handleSmartOrder = async () => {
    if (!requestText.trim()) return;
    setAiAnalyzing(true);
    try {
      const [analysis, tags] = await Promise.all([
        analyzeOrderRequest(requestText),
        suggestTags(requestText)
      ]);
      setAiSuggestion(analysis);
      
      // Simulate creating order after review
      setTimeout(() => {
         onCreateOrder({
            type: ServiceType.BUY,
            description: analysis,
            price: Math.floor(Math.random() * 20) + 10,
            distanceKm: 2.5,
            tags: tags
         });
         setRequestText('');
         setAiSuggestion(null);
         setActiveTab('orders');
         setAiAnalyzing(false);
      }, 1500);

    } catch (e) {
      setAiAnalyzing(false);
    }
  };

  if (activeTab === 'home') {
    return (
      <div className="h-full flex flex-col bg-gray-50 overflow-y-auto no-scrollbar pb-20">
        {/* Header */}
        <header className="bg-amber-400 p-4 pb-8 rounded-b-[2rem] shadow-sm sticky top-0 z-10">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-2 text-gray-900">
              <MapPin className="w-5 h-5" />
              <span className="font-bold text-lg">当前位置: 科技园大厦A座</span>
            </div>
            <Users className="w-6 h-6 text-gray-800" />
          </div>
          <div className="bg-white rounded-full p-2 flex items-center shadow-inner">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <input 
              placeholder="想喝什么？想送什么？" 
              className="flex-1 ml-2 outline-none text-gray-700 bg-transparent"
              value={requestText}
              onChange={(e) => setRequestText(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSmartOrder()}
            />
            <Button 
              size="sm" 
              className="rounded-full px-6 py-1.5 text-sm"
              onClick={handleSmartOrder}
              disabled={aiAnalyzing}
            >
              {aiAnalyzing ? '分析中...' : '一键下单'}
            </Button>
          </div>
          {aiSuggestion && (
            <div className="mt-2 bg-white/90 p-3 rounded-xl text-sm text-gray-700 animate-fade-in">
              <div className="flex items-center gap-2 mb-1 text-amber-600 font-bold">
                <Sparkles className="w-4 h-4" /> AI 智能摘要
              </div>
              {aiSuggestion}
            </div>
          )}
        </header>

        {/* Quick Actions */}
        <div className="px-4 -mt-6 grid grid-cols-4 gap-3">
          {[
            { icon: ShoppingBag, label: ServiceType.BUY, color: 'bg-pink-100 text-pink-600' },
            { icon: Package, label: ServiceType.DELIVER, color: 'bg-blue-100 text-blue-600' },
            { icon: Users, label: ServiceType.QUEUE, color: 'bg-purple-100 text-purple-600' },
            { icon: Coffee, label: '帮我送', color: 'bg-orange-100 text-orange-600' }
          ].map((item, idx) => (
            <div key={idx} className="flex flex-col items-center bg-white p-3 rounded-xl shadow-sm border border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                 onClick={() => onCreateOrder({ type: item.label as ServiceType, description: '快捷下单', price: 15, distanceKm: 3.2, tags: ['日常'] })}>
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mb-2 ${item.color}`}>
                <item.icon className="w-6 h-6" />
              </div>
              <span className="text-xs font-medium text-gray-700">{item.label}</span>
            </div>
          ))}
        </div>

        {/* Active Order Tracking */}
        {activeOrder && (
          <div className="px-4 mt-6">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-bold text-lg text-gray-800">进行中的订单</h3>
              <Badge color="yellow">{activeOrder.status}</Badge>
            </div>
            <Card className="overflow-hidden p-0">
              <MapVisual className="h-32 w-full" showRider={true} />
              <div className="p-4">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="font-bold text-gray-900">{activeOrder.type}</h4>
                    <p className="text-gray-500 text-sm mt-1">{activeOrder.description}</p>
                  </div>
                  <div className="text-right">
                    <span className="block font-bold text-lg">¥{activeOrder.price}</span>
                    <span className="text-xs text-gray-400">预计 15:30 送达</span>
                  </div>
                </div>
                <div className="flex gap-2">
                   {activeOrder.tags.map((tag, i) => <Badge key={i} color="blue">{tag}</Badge>)}
                </div>
                {activeOrder.riderId && (
                  <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center">
                        <Users className="w-6 h-6 text-gray-500" />
                      </div>
                      <div>
                        <p className="font-medium text-sm">李骑手</p>
                        <div className="flex items-center text-xs text-amber-500">
                          <Star className="w-3 h-3 fill-current" /> 4.9
                        </div>
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      <Button variant="outline" className="py-1 px-3 text-sm rounded-full">电话</Button>
                      <Button variant="secondary" className="py-1 px-3 text-sm rounded-full">消息</Button>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </div>
        )}

        {/* Banner */}
        <div className="px-4 mt-6">
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-xl p-4 text-white shadow-lg">
                <div className="flex justify-between items-center">
                    <div>
                        <h3 className="font-bold text-lg">新人专享</h3>
                        <p className="text-white/80 text-sm">首单立减 10 元</p>
                    </div>
                    <Button variant="primary" className="bg-white text-indigo-600 hover:bg-gray-100">立即领取</Button>
                </div>
            </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'orders') {
    return (
      <div className="h-full flex flex-col bg-gray-50 overflow-y-auto pb-20">
        <header className="bg-white p-4 shadow-sm sticky top-0 z-10">
          <h1 className="text-xl font-bold text-center">我的订单</h1>
        </header>
        <div className="p-4 space-y-4">
          {myOrders.length === 0 ? (
            <div className="text-center text-gray-400 py-10">暂无订单</div>
          ) : (
            myOrders.map(order => (
              <Card key={order.id}>
                <div className="flex justify-between items-center mb-2 border-b border-gray-50 pb-2">
                  <span className="text-sm text-gray-500">{new Date(order.createdAt).toLocaleTimeString()}</span>
                  <Badge color={order.status === OrderStatus.COMPLETED ? 'green' : 'yellow'}>{order.status}</Badge>
                </div>
                <div className="flex gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center shrink-0 ${order.type === ServiceType.BUY ? 'bg-pink-100 text-pink-500' : 'bg-blue-100 text-blue-500'}`}>
                    {order.type === ServiceType.BUY ? <ShoppingBag /> : <Package />}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold">{order.type}</h4>
                    <p className="text-sm text-gray-600 line-clamp-2">{order.description}</p>
                    <div className="mt-2 flex justify-between items-center">
                       <span className="font-bold">¥{order.price}</span>
                       <Button variant="outline" className="text-xs py-1 px-2 h-auto">再来一单</Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-white">
      <div className="p-4 text-center mt-10">个人中心 - 仅演示核心流程</div>
    </div>
  );
};

export const UserBottomNav: React.FC<{ active: string; onChange: (t: any) => void }> = ({ active, onChange }) => (
  <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 py-2 px-6 flex justify-between items-center z-50 pb-safe">
    {[
      { id: 'home', icon: MapPin, label: '首页' },
      { id: 'orders', icon: Clock, label: '订单' },
      { id: 'profile', icon: Users, label: '我的' }
    ].map(item => (
      <button 
        key={item.id}
        onClick={() => onChange(item.id)}
        className={`flex flex-col items-center space-y-1 ${active === item.id ? 'text-amber-500' : 'text-gray-400'}`}
      >
        <item.icon className="w-6 h-6" />
        <span className="text-xs">{item.label}</span>
      </button>
    ))}
  </div>
);

export default UserApp;