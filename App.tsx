import React, { useState, useEffect } from 'react';
import { User, RefreshCcw, LayoutDashboard, Truck, Store } from 'lucide-react';
import UserApp, { UserBottomNav } from './views/UserApp';
import RiderApp, { RiderBottomNav } from './views/RiderApp';
import MerchantApp from './views/MerchantApp';
import AdminDashboard from './views/AdminDashboard';
import { Role, Order, OrderStatus, ServiceType } from './types';

// Initial Mock Data
const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord_12345',
    userId: 'user_1',
    merchantId: 'mer_1',
    type: ServiceType.BUY,
    status: OrderStatus.PENDING,
    description: '帮我买一杯瑞幸生椰拿铁，少冰半糖',
    price: 24,
    distanceKm: 1.2,
    pickupLocation: { address: '瑞幸咖啡(科技园店)', lat: 0, lng: 0 },
    dropoffLocation: { address: '科技园大厦A座1203', lat: 0, lng: 0 },
    createdAt: Date.now() - 1000 * 60 * 5,
    tags: ['饮品', '加急']
  },
  {
    id: 'ord_67890',
    userId: 'user_2',
    riderId: 'rider_1',
    type: ServiceType.DELIVER,
    status: OrderStatus.DELIVERING,
    description: '送一份加急文件到市民中心',
    price: 45,
    distanceKm: 8.5,
    pickupLocation: { address: '天安数码城', lat: 0, lng: 0 },
    dropoffLocation: { address: '市民中心B区', lat: 0, lng: 0 },
    createdAt: Date.now() - 1000 * 60 * 30,
    tags: ['文件', '高价值']
  }
];

const App: React.FC = () => {
  const [currentRole, setCurrentRole] = useState<Role>(Role.USER);
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [activeTab, setActiveTab] = useState('home'); // For Mobile Nav
  
  // Current User (Mocked)
  const currentUserId = 'user_1';
  const currentRiderId = 'rider_1';

  // Role Switcher UI Helper
  const RoleButton: React.FC<{ role: Role; icon: React.ReactNode; label: string }> = ({ role, icon, label }) => (
    <button 
      onClick={() => { setCurrentRole(role); setActiveTab('home'); }}
      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all w-full mb-1 ${currentRole === role ? 'bg-amber-400 font-bold shadow-md' : 'hover:bg-gray-100 text-gray-600'}`}
    >
      {icon}
      <span>{label}</span>
    </button>
  );

  // Actions
  const handleCreateOrder = (orderData: Partial<Order>) => {
    const newOrder: Order = {
      id: `ord_${Date.now()}`,
      userId: currentUserId,
      type: ServiceType.BUY,
      status: OrderStatus.PENDING,
      description: '',
      price: 0,
      distanceKm: 0,
      pickupLocation: { address: '当前位置', lat: 0, lng: 0 },
      dropoffLocation: { address: '目的地', lat: 0, lng: 0 },
      createdAt: Date.now(),
      tags: [],
      ...orderData
    };
    setOrders(prev => [newOrder, ...prev]);
  };

  const handleUpdateStatus = (orderId: string, status: OrderStatus) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status } : o));
  };

  const handleAcceptOrder = (orderId: string) => {
    setOrders(prev => prev.map(o => o.id === orderId ? { ...o, status: OrderStatus.ACCEPTED, riderId: currentRiderId } : o));
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden relative">
      
      {/* Main Content Area */}
      <main className="flex-1 h-full relative">
        {/* Render based on role. 
            Note: For User and Rider, we wrap in a container to simulate mobile dimensions on desktop if needed, 
            but for this demo we'll make them responsive full width for mobile-first feel. 
        */}
        <div className={`h-full mx-auto ${currentRole === Role.MERCHANT || currentRole === Role.ADMIN ? 'w-full' : 'max-w-md w-full shadow-2xl border-x border-gray-100'}`}>
          
          {currentRole === Role.USER && (
            <>
              <UserApp 
                orders={orders} 
                onCreateOrder={handleCreateOrder} 
                userId={currentUserId} 
              />
              <UserBottomNav active={activeTab} onChange={setActiveTab} />
            </>
          )}

          {currentRole === Role.RIDER && (
            <>
              <RiderApp 
                orders={orders} 
                onUpdateStatus={handleUpdateStatus} 
                onAcceptOrder={handleAcceptOrder}
                riderId={currentRiderId}
              />
              <RiderBottomNav active={activeTab} onChange={setActiveTab} />
            </>
          )}

          {currentRole === Role.MERCHANT && (
            <MerchantApp orders={orders} onUpdateStatus={handleUpdateStatus} />
          )}

          {currentRole === Role.ADMIN && (
            <AdminDashboard orders={orders} />
          )}
        </div>
      </main>

      {/* Role Switcher Floating Panel */}
      <div className="fixed bottom-24 right-4 z-50 group">
         <button className="bg-gray-900 text-white p-4 rounded-full shadow-xl hover:scale-110 transition-transform">
           <RefreshCcw className="w-6 h-6" />
         </button>
         <div className="absolute bottom-14 right-0 bg-white p-2 rounded-xl shadow-2xl border border-gray-200 w-48 hidden group-hover:block animate-fade-in mb-2">
            <div className="text-xs font-bold text-gray-400 px-4 py-2 uppercase tracking-wider">Switch View</div>
            <RoleButton role={Role.USER} icon={<User className="w-4 h-4" />} label="用户端 (User)" />
            <RoleButton role={Role.RIDER} icon={<Truck className="w-4 h-4" />} label="骑手端 (Rider)" />
            <RoleButton role={Role.MERCHANT} icon={<Store className="w-4 h-4" />} label="商家端 (Merchant)" />
            <RoleButton role={Role.ADMIN} icon={<LayoutDashboard className="w-4 h-4" />} label="管理后台 (Admin)" />
         </div>
      </div>

    </div>
  );
};

export default App;