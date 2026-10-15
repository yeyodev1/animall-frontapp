import APIBase from './httpBase'
import type { AdminStats, Order, OrderStatus, Paginated, Product, ProductQuery } from '@/types'

class AdminService extends APIBase {
  async stats(): Promise<AdminStats> {
    const { data } = await this.get<AdminStats>('admin/stats')
    return data
  }

  async products(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>('admin/products', undefined, { params: query })
    return data
  }

  async createProduct(input: Partial<Product>): Promise<Product> {
    const { data } = await this.post<Product>('admin/products', input)
    return data
  }

  async updateProduct(id: string, input: Partial<Product>): Promise<Product> {
    const { data } = await this.patch<Product>(`admin/products/${id}`, input)
    return data
  }

  async deleteProduct(id: string): Promise<void> {
    await this.delete(`admin/products/${id}`)
  }

  async uploadImage(id: string, file: File): Promise<Product> {
    const form = new FormData()
    form.append('image', file)
    const { data } = await this.post<Product>(`admin/products/${id}/image`, form)
    return data
  }

  async orders(status = '', page = 1): Promise<Paginated<Order>> {
    const { data } = await this.get<Paginated<Order>>('admin/orders', undefined, { params: { status, page } })
    return data
  }

  async setOrderStatus(id: string, status: OrderStatus): Promise<Order> {
    const { data } = await this.patch<Order>(`admin/orders/${id}`, { status })
    return data
  }
}

export const adminService = new AdminService()
