import React, { useState, useEffect } from 'react';
import { View, Modal, StyleSheet, Text, TouchableOpacity } from 'react-native';
import ProductList from '@/components/products/product-list';
import AddProductForm from '@/components/products/add-product-form';
import useProductStore from '@/store/product-store';
import { ThemedText } from '@/components/themed-text';
import { SafeAreaView } from 'react-native-safe-area-context';

const ProductsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const { products, loadProducts } = useProductStore();

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ThemedText style={styles.header}>My Products</ThemedText>
      {products.length === 0 ? (
        <View style={styles.emptyContainer}>
          <ThemedText style={styles.emptyText}>No products yet.</ThemedText>
          <ThemedText style={styles.emptySubText}>
            Tap the '+' button to add your first product.
          </ThemedText>
        </View>
      ) : (
        <ProductList />
      )}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => setModalVisible(true)}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
      <Modal
        animationType="slide"
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <AddProductForm onAdd={() => setModalVisible(false)} />
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
  },
  header: {
    fontSize: 32,
    fontWeight: 'bold',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  emptySubText: {
    fontSize: 16,
    color: '#888',
    marginTop: 8,
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 24,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#007BFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 4.65,
  },
  fabText: {
    fontSize: 30,
    color: '#fff',
    lineHeight: 30,
  },
});

export default ProductsScreen;

