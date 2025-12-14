export interface Product {
  id: string;
  name: string;
  price: number;
  photo: string;
  userId: string;
  createdAt: string;
}

export interface ProductState {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'createdAt'>) => void;
  removeProduct: (id: string) => void;
  getProductById: (id: string) => Product | undefined;
  getProductsByUserId: (userId: string) => Product[];
  loadProducts: () => Promise<void>;
}