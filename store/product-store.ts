import { create } from 'zustand';
import { Product } from '@/types';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  loadProducts: () => void;
}

const PRODUCT_STORAGE_KEY = 'products';

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  addProduct: (product) => {
    const { products } = get();
    if (products.length >= 5) {
      Notifications.scheduleNotificationAsync({
        content: {
          title: 'Limit Reached',
          body: 'You can only add up to 5 products.',
        },
        trigger: null,
      });
      return;
    }
    const newProducts = [...products, product];
    set({ products: newProducts });
    AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(newProducts));
  },
  removeProduct: (id) => {
    const { products } = get();
    const newProducts = products.filter((p) => p.id !== id);
    set({ products: newProducts });
    AsyncStorage.setItem(PRODUCT_STORAGE_KEY, JSON.stringify(newProducts));
  },
  loadProducts: async () => {
    const products = await AsyncStorage.getItem(PRODUCT_STORAGE_KEY);
    if (products) {
      set({ products: JSON.parse(products) });
    }
  },
}));

export default useProductStore;
