import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import useProductStore from '@/store/product-store';
import { Product } from '@/types';
import { ThemedText } from '../themed-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import WarningModal from '../ui/warning-modal';

const AddProductForm = ({ onAdd }: { onAdd: () => void }) => {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [photo, setPhoto] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; price?: string; photo?: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const { addProduct, products } = useProductStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const validate = () => {
    const newErrors: { name?: string; price?: string; photo?: string } = {};
    if (!name) {
      newErrors.name = 'Name is required.';
    }
    if (!price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(parseFloat(price))) {
      newErrors.price = 'Price must be a number.';
    }
    if (!photo) {
      newErrors.photo = 'Photo is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = () => {
    if (products.length >= 5) {
      setModalVisible(true);
      return;
    }

    if (validate()) {
      const newProduct: Product = {
        id: Math.random().toString(),
        name,
        price: parseFloat(price),
        photo: photo!,
      };
      addProduct(newProduct);
      Toast.show({
        type: 'success',
        text1: 'Product Added',
        text2: `${name} has been added to your catalog.`,
      });
      onAdd();
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ThemedText style={styles.title}>Add a New Product</ThemedText>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, errors.photo ? styles.errorBorder : null]}>
            <Text style={styles.imagePlaceholderText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.photo && <Text style={styles.errorText}>{errors.photo}</Text>}
      <TextInput
        style={[styles.input, errors.name ? styles.errorBorder : null]}
        placeholder="Product Name"
        placeholderTextColor="#999"
        value={name}
        onChangeText={setName}
      />
      {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
      <TextInput
        style={[styles.input, errors.price ? styles.errorBorder : null]}
        placeholder="Product Price"
        placeholderTextColor="#999"
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      {errors.price && <Text style={styles.errorText}>{errors.price}</Text>}
      <TouchableOpacity style={styles.button} onPress={handleAddProduct}>
        <Text style={styles.buttonText}>Add Product</Text>
      </TouchableOpacity>
      <WarningModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        title="Limit Reached"
        message="You can only add up to 5 products."
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  imagePicker: {
    alignSelf: 'center',
    marginBottom: 8,
  },
  image: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  imagePlaceholder: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
  },
  imagePlaceholderText: {
    fontSize: 48,
    color: '#ccc',
  },
  input: {
    height: 50,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 16,
    marginBottom: 8,
    fontSize: 16,
  },
  button: {
    height: 50,
    backgroundColor: '#007BFF',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  errorText: {
    color: 'red',
    marginBottom: 8,
    marginLeft: 4,
  },
  errorBorder: {
    borderColor: 'red',
    borderWidth: 1,
  },
});

export default AddProductForm;