import APIBase from './httpBase'
import type { Paginated, Product, ProductFilters, ProductQuery } from '@/types'

class ProductService extends APIBase {
  async list(query: ProductQuery = {}): Promise<Paginated<Product>> {
    const { data } = await this.get<Paginated<Product>>('products', undefined, { params: query })
    return data
  }

  async filters(): Promise<ProductFilters> {
    const { data } = await this.get<ProductFilters>('products/filters')
    return data
  }

  async featured(): Promise<Product[]> {
    const { data } = await this.get<Product[]>('products/featured')
    return data
  }

  async bySlug(slug: string): Promise<{ product: Product; related: Product[] }> {
    const { data } = await this.get<{ product: Product; related: Product[] }>(`products/${slug}`)
    return data
  }
}

export const productService = new ProductService()
