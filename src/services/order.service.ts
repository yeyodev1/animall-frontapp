import APIBase from './httpBase'
import type { CreateOrderInput, Order } from '@/types'

class OrderService extends APIBase {
  async create(input: CreateOrderInput): Promise<{ order: Order; whatsappUrl: string }> {
    const { data } = await this.post<{ order: Order; whatsappUrl: string }>('orders', input)
    return data
  }
}

export const orderService = new OrderService()
