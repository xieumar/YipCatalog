import React, { useCallback, useState } from 'react';
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
import { LinearGradient } from 'expo-linear-gradient';
import ConfirmationModal from '../../components/ui/confirmation-modal';

export default function ProfileScreen() {
  const router = useRouter();
  const { user, logout } = useAuthStore();
  const { getProductsByUserId, fetchAllProducts, isLoading } = useProductStore();
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      fetchAllProducts();
    }, [fetchAllProducts])
  );

  const userProducts = user ? getProductsByUserId(user.id) : [];

  const handleLogout = () => {
    setModalVisible(true);
  };

  const onConfirmLogout = async () => {
    await logout();
    Toast.show({ type: 'success', text1: 'Logged out' });
    router.replace('/(auth)/login');
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() =>
        router.push({ pathname: '/products/[id]', params: { id: item.id ?? '' } })
      }
      activeOpacity={0.85}
    >
      <Image source={{ uri: item.image_base64 }} style={styles.cardImage} />
      <LinearGradient
        colors={['transparent', 'rgba(0,0,0,0.6)']}
        style={styles.cardOverlay}
      />
      <View style={styles.cardMeta}>
        <Text style={styles.cardName} numberOfLines={1}>{item.name}</Text>
        <View style={styles.cardPricePill}>
          <Text style={styles.cardPrice}>${item.price.toFixed(2)}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <>
      <SafeAreaView style={styles.container}>
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
      <ConfirmationModal
        visible={modalVisible}
        onCancel={() => setModalVisible(false)}
        onConfirm={onConfirmLogout}
        title="Log Out"
        message="Are you sure you want to log out?"
      />
    </>
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
  userCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: 24,
    padding: theme.spacing.lg,
    margin: theme.spacing.md,
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
    padding: theme.spacing.md,
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
