import React, { useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { useProductStore } from '../../store/productStore';
import { Product } from '../../types';
import { theme } from '../../constants/theme';

export default function FeedScreen() {
  const router = useRouter();
  const { products, fetchAllProducts, isLoading } = useProductStore();

  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
    }, [fetchAllProducts])
  );

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() =>
        router.push({
          pathname: '/products/[id]',
          params: { id: item.id?.toString() ?? '' },
        })
      }
      activeOpacity={0.85}
    >
       <Image source={{ uri: item.image_base64 }} style={styles.productImage} /> 
      <View style={styles.productOverlay} />
      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>
          {item.name}
        </Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  if (isLoading) {
    return (
      <View style={[styles.container, styles.center]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (products.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyText}>No products yet</Text>
        <Text style={styles.emptySubtext}>
          Products will appear here once created
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) =>
          item.id?.toString() ?? Math.random().toString()
        }
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContent: {
    padding: theme.spacing.md,
  },
  row: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  productCard: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
    marginBottom: theme.spacing.md,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    borderTopLeftRadius: theme.borderRadius.lg,
    borderTopRightRadius: theme.borderRadius.lg,
  },
  productOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.04)',
  },
  productInfo: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  productName: {
    ...theme.typography.body,
    fontWeight: '600',
    color: theme.colors.text,
  },
  productPrice: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: theme.colors.primary,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.spacing.xl,
    gap: theme.spacing.sm,
  },
  emptyText: {
    ...theme.typography.h2,
    color: theme.colors.text,
  },
  emptySubtext: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    textAlign: 'center',
  },
});
