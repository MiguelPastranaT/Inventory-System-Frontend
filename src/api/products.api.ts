import { apiClient } from './axiosClient';
import type { Product } from '../types/product';

export interface CreateProductDto {
  nombre: string;
  cantidad: number;
  precio: number;
}

export type UpdateProductDto = Partial<CreateProductDto>;

export const productsApi = {
  // Obtiene los productos del guestId actual
  getAll: async (): Promise<Product[]> => {
    const { data } = await apiClient.get<Product[]>('/products');
    return data;
  },

  // Crea un nuevo producto
  create: async (productData: CreateProductDto): Promise<Product> => {
    const { data } = await apiClient.post<Product>('/products', productData);
    return data;
  },

  // Actualiza un producto existente por ID
  update: async (id: string, productData: UpdateProductDto): Promise<Product> => {
    const { data } = await apiClient.patch<Product>(`/products/${id}`, productData);
    return data;
  },

  // Elimina un producto por ID
  delete: async (id: string): Promise<void> => {
    await apiClient.delete(`/products/${id}`);
  },
};