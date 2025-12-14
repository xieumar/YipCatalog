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
import { LinearGradient } from 'expo-linear-gradient';

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
      style={styles.card}
      onPress={() =>
        router.push({
          pathname: '/products/[id]',
          params: { id: item.id?.toString() ?? '' },
        })
      }
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image_base64 }} style={styles.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.cardOverlay}
      />
      <View style={styles.cardMeta}>
        <Text style={styles.cardName} numberOfLines={1}>
          {item.name}
        </Text>
        <View style={styles.cardPricePill}>
          <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
        </View>
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>YipCatalog</Text>
        <View style={styles.headerCurve} />
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
        contentContainerStyle={styles.listContent}
        numColumns={2}
        columnWrapperStyle={styles.row}
      />
    </View>
  );
}

const HEADER_HEIGHT = 140;
const CURVE_HEIGHT = 20;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: HEADER_HEIGHT,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    paddingHorizontal: theme.spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
    zIndex: 1,
    overflow: 'visible',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: '700',
    zIndex: 2,
  },
  headerCurve: {
    position: 'absolute',
    bottom: -CURVE_HEIGHT + 10,
    left: 0,
    right: 0,
    height: CURVE_HEIGHT * 2,
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    zIndex: 0,
  },
  listContent: {
    padding: theme.spacing.md,
    paddingTop: CURVE_HEIGHT,
  },
  row: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  card: {
    flex: 1,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    backgroundColor: theme.colors.surface,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    marginBottom: theme.spacing.md,
  },
  cardImage: {
    width: '100%',
    aspectRatio: 1,
  },
  cardOverlay: {
    ...StyleSheet.absoluteFillObject,
  },
  cardMeta: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    right: 12,
    justifyContent: 'flex-end',
    gap: 6,
  },
  cardName: {
    ...theme.typography.body,
    fontWeight: '700',
    color: '#fff',
    fontSize: 16,
  },
  cardPricePill: {
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 999,
  },
  cardPrice: {
    ...theme.typography.caption,
    fontWeight: '700',
    color: '#fff',
    fontSize: 12,
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
