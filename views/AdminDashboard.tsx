import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Card, Badge } from '../components/ui';
import { Order, OrderStatus } from '../types';

interface AdminDashboardProps {
  orders: Order[];
}

const AdminDashboard: React.FC<AdminDashboardProps> = ({ orders }) => {
  // Process data for charts
  const ordersByStatus = Object.values(OrderStatus).map(status => ({
    name: status,
    count: orders.filter(o => o.status === status).length
  }));

  const revenueData = [
    { name: '00:00', val: 120 }, { name: '04:00', val: 50 },
    { name: '08:00', val: 800 }, { name: '12:00', val: 2400 },
    { name: '16:00', val: 1800 }, { name: '20:00', val: 3200 },
    { name: '23:59', val: 500 }
  ];

  return (
    <div className="min-h-screen bg-slate-50 p-8">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">运营指挥中心</h1>
        <p className="text-slate-500">System Monitoring & Dispatch Console</p>
      </header>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <Card className="p-6 border-l-4 border-l-amber-500">
           <h3 className="text-slate-500 mb-2">今日总单量</h3>
           <p className="text-4xl font-bold">{orders.length + 1240}</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-green-500">
           <h3 className="text-slate-500 mb-2">总交易额 (GMV)</h3>
           <p className="text-4xl font-bold">¥42,890</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-blue-500">
           <h3 className="text-slate-500 mb-2">活跃骑手</h3>
           <p className="text-4xl font-bold">156</p>
        </Card>
        <Card className="p-6 border-l-4 border-l-red-500">
           <h3 className="text-slate-500 mb-2">异常订单</h3>
           <p className="text-4xl font-bold">2</p>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Real-time Revenue */}
        <Card className="p-6 h-80">
          <h3 className="font-bold text-lg mb-4">实时交易趋势</h3>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={revenueData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
              <YAxis fontSize={12} tickLine={false} axisLine={false} tickFormatter={(v) => `¥${v}`} />
              <Tooltip />
              <Line type="monotone" dataKey="val" stroke="#f59e0b" strokeWidth={3} dot={{r:4}} />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Order Status Distribution */}
        <Card className="p-6 h-80">
           <h3 className="font-bold text-lg mb-4">订单状态分布</h3>
           <ResponsiveContainer width="100%" height="100%">
             <BarChart data={ordersByStatus}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="name" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: 'transparent'}} />
                <Bar dataKey="count" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={40} />
             </BarChart>
           </ResponsiveContainer>
        </Card>
      </div>

      {/* Recent Activity Table */}
      <Card className="overflow-hidden">
        <div className="p-4 bg-slate-100 border-b border-slate-200">
           <h3 className="font-bold">最新系统日志</h3>
        </div>
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 text-slate-500">
            <tr>
              <th className="p-4">时间</th>
              <th className="p-4">事件类型</th>
              <th className="p-4">详情</th>
              <th className="p-4">操作人</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {orders.slice(0, 5).map(o => (
               <tr key={o.id}>
                 <td className="p-4">{new Date(o.createdAt).toLocaleTimeString()}</td>
                 <td className="p-4"><Badge color="blue">订单更新</Badge></td>
                 <td className="p-4">订单 #{o.id.slice(-6)} 状态变更为 {o.status}</td>
                 <td className="p-4">System</td>
               </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
};

export default AdminDashboard;