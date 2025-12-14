import React, { useState } from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProductStore } from '@/store/productStore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import InfoModal from '@/components/ui/info-modal';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '@/constants/theme';

export default function AddProductScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; price?: string; imageUri?: string }>({});
  const [modalVisible, setModalVisible] = useState(false);

  const { addProduct } = useProductStore();
  const { user } = useAuthStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled && result.assets?.length) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validate = () => {
    const next: typeof errors = {};
    if (!name) next.name = 'Name is required';
    if (!price) next.price = 'Price is required';
    else if (isNaN(Number(price))) next.price = 'Must be a number';
    if (!imageUri) next.imageUri = 'Image is required';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleAddProduct = async () => {
    if (!validate() || !user) return;

    try {
      await addProduct({
        name,
        price: Number(price),
        imageUri: imageUri!,
      });

      Toast.show({
        type: 'success',
        text1: 'Product added',
      });

      router.back();
    } catch (e) {
      Toast.show({
        type: 'error',
        text1: 'Failed to add product',
      });
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top App Bar */}
      <View style={styles.appBar}>
        <TouchableOpacity onPress={router.back} hitSlop={12}>
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={styles.title}>Add Product</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Image Section */}
        <TouchableOpacity
          onPress={pickImage}
          style={[
            styles.imagePicker,
            errors.imageUri && styles.errorBorder,
          ]}
          activeOpacity={0.85}
        >
          {imageUri ? (
            <Image source={{ uri: imageUri }} style={styles.image} />
          ) : (
            <View style={styles.imagePlaceholder}>
              <Ionicons name="camera-outline" size={32} color={theme.colors.textSecondary} />
              <Text style={styles.imageHint}>Add product image</Text>
            </View>
          )}
        </TouchableOpacity>
        {errors.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}

        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.label}>Product name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.errorBorder]}
            placeholder="e.g. Wireless Headphones"
            placeholderTextColor={theme.colors.textSecondary}
            value={name}
            onChangeText={setName}
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}

          <Text style={styles.label}>Price</Text>
          <TextInput
            style={[styles.input, errors.price && styles.errorBorder]}
            placeholder="e.g. 49.99"
            placeholderTextColor={theme.colors.textSecondary}
            value={price}
            onChangeText={setPrice}
            keyboardType="decimal-pad"
          />
          {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={styles.button}
          onPress={handleAddProduct}
          activeOpacity={0.9}
        >
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </ScrollView>

      <InfoModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Limit reached"
        message="You can only add up to 5 products."
      />
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  appBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },

  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.colors.text,
  },

  content: {
    padding: 16,
    paddingBottom: 32,
  },

  imagePicker: {
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    height: 200,
    marginBottom: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },

  image: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
  },

  imagePlaceholder: {
    alignItems: 'center',
    gap: 8,
  },

  imageHint: {
    color: theme.colors.textSecondary,
    fontSize: 14,
  },

  formCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    padding: 16,
    marginTop: 16,
  },

  label: {
    fontSize: 13,
    fontWeight: '600',
    color: theme.colors.textSecondary,
    marginBottom: 6,
    marginTop: 12,
  },

  input: {
    height: 48,
    backgroundColor: theme.colors.background,
    borderRadius: 12,
    paddingHorizontal: 14,
    fontSize: 16,
    color: theme.colors.text,
  },

  button: {
    height: 52,
    backgroundColor: theme.colors.primary,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 24,
  },

  buttonText: {
    color: theme.colors.surface,
    fontSize: 16,
    fontWeight: '700',
  },

  errorText: {
    color: theme.colors.error,
    fontSize: 12,
    marginTop: 4,
  },

  errorBorder: {
    borderWidth: 1,
    borderColor: theme.colors.error,
  },
});
