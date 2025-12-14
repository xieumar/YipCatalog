import React, { useLayoutEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useNavigation, useRouter } from 'expo-router';
import { useProductStore } from '../../store/productStore';
import { theme } from '../../constants/theme';
import ConfirmationModal from '../../components/ui/confirmation-modal';
import { useAuthStore } from '../../store/authStore';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const getProductById = useProductStore((state) => state.getProductById);
  const removeProduct = useProductStore((state) => state.removeProduct);
  const router = useRouter();
  const navigation = useNavigation();
  const [modalVisible, setModalVisible] = useState(false);

  const product = id ? getProductById(id) : undefined;
  const currentUser = useAuthStore((state) => state.user);

  const handleDelete = () => {
    setModalVisible(true);
  };

  const onConfirmDelete = () => {
    if (id) {
      removeProduct(id);
      router.back();
    }
    setModalVisible(false);
  };

  useLayoutEffect(() => {
    if (product) {
      navigation.setOptions({
        title: product.name,
      });
    }
  }, [navigation, product]);

  if (!product) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Product not found</Text>
      </View>
    );
  }

  const isOwner = currentUser?.id === product.user_id; // <-- check ownership

  return (
    <>
      <ScrollView style={styles.container} contentContainerStyle={styles.content}>
        <Image source={{ uri: product.image_base64 }} style={styles.image} />
        <View style={styles.details}>
          <Text style={styles.name}>{product.name}</Text>
          <Text style={styles.price}>${product.price.toFixed(2)}</Text>
          <Text style={styles.date}>
            Added {product.created_at ? new Date(product.created_at).toLocaleDateString() : 'Unknown date'}
          </Text>

          {isOwner && (
            <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
              <Text style={styles.deleteButtonText}>Delete Product</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>

      <ConfirmationModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={onConfirmDelete}
        title="Delete Product"
        message="Are you sure you want to delete this product?"
      />
    </>
  );
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  content: {
    paddingBottom: theme.spacing.xl,
  },
  image: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.border,
  },
  details: {
    padding: theme.spacing.lg,
    gap: theme.spacing.md,
  },
  name: {
    ...theme.typography.h1,
    color: theme.colors.text,
  },
  price: {
    ...theme.typography.h2,
    color: theme.colors.primary,
    fontWeight: '600',
  },
  date: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
  },
  deleteButton: {
    backgroundColor: theme.colors.error,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    alignItems: 'center',
    marginTop: theme.spacing.lg,
  },
  deleteButtonText: {
    color: '#fff',
    ...theme.typography.body,
    fontWeight: '600',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.background,
  },
  errorText: {
    ...theme.typography.h2,
    color: theme.colors.textSecondary,
  },
});