import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import * as FileSystem from 'expo-file-system/legacy';

interface AddProductInput {
  name: string;
  price: number;
  imageUri: string;
}

interface ProductState {
  products: Product[];
  isLoading: boolean;
  addProduct: (data: AddProductInput) => Promise<void>;
  removeProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByUserId: (userId: string) => Product[];
  fetchAllProducts: () => Promise<void>;
}

export const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  isLoading: false,
  fetchAllProducts: async () => {
    set({ isLoading: true });
    try {
      const { data, error } = await supabase.from('products').select('*');
      if (error) throw error;
      set({ products: data });
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
 addProduct: async ({ name, price, imageUri }) => {
  set({ isLoading: true });
  try {
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      throw new Error('User not authenticated');
    }

    const fileBase64 = await FileSystem.readAsStringAsync(imageUri, {
      encoding: 'base64',
    });

    const newProduct = {
      name,
      price,
      image_base64: `data:image/jpeg;base64,${fileBase64}`,
      user_id: user.id,
    };

    const { error: insertError } = await supabase
      .from('products')
      .insert(newProduct);

    if (insertError) {
      console.error(insertError);
      throw insertError;
    }

    await get().fetchAllProducts();
  } catch (error) {
    console.error('Add product failed:', error);
    throw error;
  } finally {
    set({ isLoading: false });
  }
},
  removeProduct: async (id) => {
    set({ isLoading: true });
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data: product, error: fetchError } = await supabase
        .from('products')
        .select('user_id')
        .eq('id', id)
        .single();

      if (fetchError) throw fetchError;
      if (!product) throw new Error('Product not found');
      if (product.user_id !== user.id) {
        throw new Error('You are not authorized to delete this product');
      }

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;

      await get().fetchAllProducts();
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  getProductById: (id) => {
    return get().products.find((p) => p.id === id);
  },
  getProductsByUserId: (userId) => {
    return get().products.filter((p) => p.user_id === userId);
  },
}));
