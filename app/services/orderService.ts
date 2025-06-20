import axios from 'axios';
import { Order, CreateOrderRequest, PaymentRequest, PaymentResponse } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:3000/api';

export const OrderService = {
  // Create new order
  async createOrder(orderData: CreateOrderRequest): Promise<Order> {
    try {
      const response = await axios.post(`${API_URL}/orders`, orderData);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get user's orders
  async getUserOrders(): Promise<Order[]> {
    try {
      const response = await axios.get(`${API_URL}/orders`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Get order by ID
  async getOrderById(orderId: string): Promise<Order> {
    try {
      const response = await axios.get(`${API_URL}/orders/${orderId}`);
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Process payment
  async processPayment(paymentData: PaymentRequest): Promise<PaymentResponse> {
    try {
      const response = await axios.post(`${API_URL}/payment`, paymentData);
      return response.data;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw error;
    }
  }
};
