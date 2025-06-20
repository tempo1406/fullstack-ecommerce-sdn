export interface CartItem {
  id: string;
  name: string;
  price: number;
  image?: string;
  quantity: number;
  stock: number;
}

export interface Order {
  id: string;
  userId: string;
  totalAmount: number;
  status: 'PENDING' | 'PAID' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  createdAt: string;
  updatedAt: string;
  orderItems: OrderItem[];
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId: string;
  quantity: number;
  price: number;
  product: {
    id: string;
    name: string;
    image?: string;
  };
}

export interface CreateOrderRequest {
  items: {
    productId: string;
    quantity: number;
    price: number;
  }[];
  totalAmount: number;
}

export interface PaymentRequest {
  orderId: string;
  amount: number;
  paymentMethod: 'STRIPE' | 'PAYOS' | 'MOCK';
}

export interface PaymentResponse {
  success: boolean;
  paymentId?: string;
  message: string;
  orderId: string;
}
