export enum Role {
  USER = 'USER',
  RIDER = 'RIDER',
  MERCHANT = 'MERCHANT',
  ADMIN = 'ADMIN'
}

export enum OrderStatus {
  PENDING = '待接单',
  ACCEPTED = '已接单',
  PICKING_UP = '取货中',
  DELIVERING = '配送中',
  COMPLETED = '已完成',
  CANCELLED = '已取消'
}

export enum ServiceType {
  BUY = '帮我买',
  DELIVER = '帮我送',
  QUEUE = '代排队',
  CLEAN = '保洁'
}

export interface Location {
  address: string;
  lat: number;
  lng: number;
  detail?: string;
}

export interface Order {
  id: string;
  userId: string;
  riderId?: string;
  merchantId?: string;
  type: ServiceType;
  status: OrderStatus;
  description: string;
  price: number;
  distanceKm: number;
  pickupLocation: Location;
  dropoffLocation: Location;
  createdAt: number;
  tags: string[];
}

export interface User {
  id: string;
  name: string;
  role: Role;
  balance: number;
  avatar: string;
}

export interface AnalyticsData {
  name: string;
  value: number;
}