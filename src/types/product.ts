export interface Product {
  _id: string;
  nombre: string;
  name?: string; // Por compatibilidad si el backend envía name
  cantidad: number;
  precio: number;
  guestId?: string;
  createdAt?: string;
  updatedAt?: string;
  [key: string]: unknown; // Permite indexación flexible sin romper TypeScript
}