import { useRouter, Slot } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { TouchableOpacity, View, StyleSheet, Platform } from 'react-native';
import React, { useState, useCallback, useEffect } from 'react';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { theme } from '../../constants/theme';
import { useAuthStore } from '../../store/authStore';
import { useProductStore } from '../../store/productStore';
import InfoModal from '../../components/ui/info-modal';

const MAX_PRODUCTS = 5;

export default function TabsLayout() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { products, fetchAllProducts } = useProductStore();
  const [activeTab, setActiveTab] = useState<'home' | 'profile'>('home');
  const [isInfoModalVisible, setIsInfoModalVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    fetchAllProducts();
  }, [fetchAllProducts]);

  const handleAddPress = () => {
    if (user) {
      const userProducts = products.filter(p => p.user_id === user.id);
      if (userProducts.length >= MAX_PRODUCTS) {
        setIsInfoModalVisible(true);
      } else {
        router.push('/modal');
      }
    }
  };

  const navigate = (tab: 'home' | 'profile') => {
    setActiveTab(tab);
    router.push(`/(tabs)/${tab}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <Slot />
      <View
        style={[
          styles.navContainer,
          { bottom: insets.bottom > 0 ? insets.bottom - 8 : 16 },
        ]}
      >
        <TouchableOpacity
          onPress={() => navigate('home')}
          style={styles.navButton}
        >
          <Ionicons
            name={activeTab === 'home' ? 'grid' : 'grid-outline'}
            size={28}
            color={activeTab === 'home' ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>

        <TouchableOpacity style={styles.centerFab} activeOpacity={0.85} onPress={handleAddPress}>
          <Ionicons name="add" size={30} color={theme.colors.surface} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => navigate('profile')}
          style={styles.navButton}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={28}
            color={activeTab === 'profile' ? theme.colors.primary : theme.colors.textSecondary}
          />
        </TouchableOpacity>
      </View>

      <InfoModal
        visible={isInfoModalVisible}
        onClose={() => setIsInfoModalVisible(false)}
        title="Limit Reached"
        message={`You can only add up to ${MAX_PRODUCTS} products.`}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },

  navContainer: {
    position: 'absolute',
    left: 24,
    right: 24,
    height: 70,
    backgroundColor: theme.colors.surface,
    borderRadius: 35,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 10,
  },

  navButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },

  centerFab: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: theme.colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#0F172A',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
    elevation: 6,
  },
});
