export type Role = "ADMIN" | "CUSTOMER";
export type OrderStatus = "PENDING" | "CONFIRMED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
export type PaymentStatus = "UNPAID" | "PARTIAL" | "PAID" | "REFUNDED";
export type InvoiceStatus = "PENDING" | "SENT" | "PAID" | "OVERDUE" | "CANCELLED";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: Role;
  createdAt: string;
}

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  available: boolean;
  createdAt: string;
}

export interface CartItem {
  menuItem: MenuItem;
  quantity: number;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItem: MenuItem;
  quantity: number;
  price: number;
  notes?: string;
}

export interface Order {
  id: string;
  user: User;
  items: OrderItem[];
  total: number;
  status: OrderStatus;
  eventDate?: string;
  eventType?: string;
  guestCount?: number;
  notes?: string;
  paymentStatus: PaymentStatus;
  invoice?: Invoice;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  order?: Order;
  amount: number;
  deposit?: number;
  status: InvoiceStatus;
  stripeUrl?: string;
  dueDate?: string;
  paidAt?: string;
  createdAt: string;
}

export interface GalleryImage {
  id: string;
  title: string;
  description?: string;
  imageUrl: string;
  category?: string;
  createdAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  sender: User;
  senderId: string;
  content: string;
  read: boolean;
  createdAt: string;
}

export interface Conversation {
  id: string;
  customer: User;
  messages: Message[];
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}
