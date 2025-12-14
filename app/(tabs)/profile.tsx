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
        Toast.show({
            type: 'success',
            text1: 'Logged out',
        });
        router.replace('/(auth)/login');
    };

    const renderProduct = ({ item }: { item: Product }) => (
        <TouchableOpacity
            style={styles.productCard}
            onPress={() => {
              if (item.id) {
                router.push({ pathname: '/products/[id]', params: { id: item.id } });
              }
            }}
            activeOpacity={0.9}
        >
            <Image source={{ uri: item.image_url }} style={styles.productImage} />
            <View style={styles.productInfo}>
                <Text style={styles.productName} numberOfLines={1}>
                    {item.name}
                </Text>
                <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.userInfo}>
                    <Text style={styles.userEmail}>{user?.email}</Text>
                    <Text style={styles.productCount}>
                        {userProducts.length} {userProducts.length === 1 ? 'product' : 'products'}
                    </Text>
                </View>
                <AuthButton
                    title="Log Out"
                    onPress={handleLogout}
                    variant="secondary"
                    style={styles.logoutButton}
                />
            </View>

            {isLoading ? (
                <View style={[styles.container, styles.center]}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                </View>
            ) : userProducts.length === 0 ? (
                <View style={styles.emptyContainer}>
                    <Text style={styles.emptyText}>No products yet</Text>
                    <Text style={styles.emptySubtext}>
                        Products you create will appear here
                    </Text>
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
    header: {
        backgroundColor: theme.colors.surface,
        padding: theme.spacing.lg,
        borderBottomWidth: 1,
        borderBottomColor: theme.colors.border,
        gap: theme.spacing.md,
    },
    userInfo: {
        gap: theme.spacing.xs,
    },
    userEmail: {
        ...theme.typography.h2,
        color: theme.colors.text,
    },
    productCount: {
        ...theme.typography.caption,
        color: theme.colors.textSecondary,
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
    productCard: {
        flex: 1,
        backgroundColor: theme.colors.surface,
        borderRadius: theme.borderRadius.lg,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: theme.colors.border,
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