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
import Toast from 'react-native-toast-message';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import { AuthButton } from '../../components/auth/AuthButton';
import { Product } from '../../types';
import { theme } from '../../constants/theme';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getProductsByUserId, fetchAllProducts, isLoading } = useProductStore();

  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
    }, [fetchAllProducts])
  );

  const userProducts = user ? getProductsByUserId(user.id) : [];

  const handleLogout = async () => {
    await logout();
    Toast.show({ type: 'success', text1: 'Logged out' });
    router.replace('/(auth)/login');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.productCard}
      onPress={() => item.id && router.push({ pathname: '/products/[id]', params: { id: item.id } })}
      activeOpacity={0.85}
    >
                  <Image source={{ uri: item.image_base64 }} style={styles.productImage} />      <View style={styles.productInfo}>
        <Text style={styles.productName} numberOfLines={1}>{item.name}</Text>
        <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* User Card */}
      <View style={styles.userCard}>
        <View style={styles.userHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{user?.email?.[0].toUpperCase() ?? '?'}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userEmail}>{user?.email}</Text>
            <Text style={styles.productCount}>
              {userProducts.length} {userProducts.length === 1 ? 'product' : 'products'}
            </Text>
          </View>
        </View>
        <AuthButton title="Log Out" onPress={handleLogout} variant="secondary" style={styles.logoutButton} />
      </View>

      {isLoading ? (
        <View style={[styles.center, { flex: 1 }]}>
          <ActivityIndicator size="large" color={theme.colors.primary} />
        </View>
      ) : userProducts.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyText}>No products yet</Text>
          <Text style={styles.emptySubtext}>Products you create will appear here</Text>
        </View>
      ) : (
        <FlatList
          data={userProducts}
          renderItem={renderProduct}
          keyExtractor={(item) => item.id?.toString() ?? Math.random().toString()}
          contentContainerStyle={styles.listContent}
          numColumns={2}
          columnWrapperStyle={styles.row}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
  },
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  userCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  userHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.md,
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: theme.colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.spacing.md,
  },
  avatarText: {
    color: theme.colors.surface,
    fontSize: 24,
    fontWeight: '700',
  },
  userInfo: {
    flex: 1,
  },
 userEmail: {
  fontSize: 16,
  fontWeight: '600',
  lineHeight: 24,
  color: theme.colors.text,
},
  productCount: {
    ...theme.typography.body,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  logoutButton: {
    marginTop: theme.spacing.sm,
  },
  listContent: {
    paddingBottom: theme.spacing.md,
  },
  row: {
    gap: theme.spacing.md,
    marginBottom: theme.spacing.md,
  },
  productCard: {
    flex: 1,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  productImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: theme.colors.border,
  },
  productInfo: {
    padding: theme.spacing.md,
    gap: theme.spacing.xs,
  },
  productName: {
    ...theme.typography.body,
    color: theme.colors.text,
    fontWeight: '500',
  },
  productPrice: {
    ...theme.typography.caption,
    color: theme.colors.textSecondary,
    fontWeight: '600',
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
