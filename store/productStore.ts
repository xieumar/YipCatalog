import { create } from 'zustand';
import { supabase } from '../lib/supabase';
import { Product } from '../types';
import { decode } from 'base64-arraybuffer';
import * as FileSystem from 'expo-file-system';

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
  addProduct: async (data) => {
    set({ isLoading: true });
    try {
      const { name, price, imageUri } = data;
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) throw new Error('User not found');

      const fileBase64 = await FileSystem.readAsStringAsync(imageUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      const filePath = `${user.id}/${new Date().getTime()}.jpg`;
      const contentType = 'image/jpeg';

      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, decode(fileBase64), { contentType });

      if (uploadError) throw uploadError;

      const { data: publicUrlData } = supabase.storage
        .from('product-images')
        .getPublicUrl(uploadData.path);

      const newProduct: Product = {
        name,
        price,
        image_url: publicUrlData.publicUrl,
        user_id: user.id,
      };

      const { error: insertError } = await supabase
        .from('products')
        .insert([newProduct]);
      if (insertError) throw insertError;

      await get().fetchAllProducts();
    } catch (error) {
      throw error;
    } finally {
      set({ isLoading: false });
    }
  },
  removeProduct: async (id) => {
    set({ isLoading: true });
    try {
      const product = get().getProductById(id);
      if (!product) throw new Error('Product not found');

      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);
      if (deleteError) throw deleteError;

      const imageName = product.image_url.split('/').pop();
      if (imageName) {
        const user = (await supabase.auth.getUser()).data.user;
        if (user) {
          await supabase.storage
            .from('product-images')
            .remove([`${user.id}/${imageName}`]);
        }
      }

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
