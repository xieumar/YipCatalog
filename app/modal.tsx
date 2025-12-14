import React, { useState } from 'react';
import { View, TextInput, StyleSheet, Image, Text, TouchableOpacity } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useProductStore } from '@/store/productStore';
import { ThemedText } from '@/components/themed-text';
import { SafeAreaView } from 'react-native-safe-area-context';
import Toast from 'react-native-toast-message';
import InfoModal from '@/components/ui/info-modal';
import { useAuthStore } from '@/store/authStore';
import { useRouter } from 'expo-router';

export default function AddProductModal() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUri, setImageUri] = useState<string | null>(null);
  const [errors, setErrors] = useState<{ name?: string; price?: string; imageUri?: string }>({});
  const [modalVisible, setModalVisible] = useState(false);
  const { addProduct, products } = useProductStore();
  const { user } = useAuthStore();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const validate = () => {
    const newErrors: { name?: string; price?: string; imageUri?: string } = {};
    if (!name) {
      newErrors.name = 'Name is required.';
    }
    if (!price) {
      newErrors.price = 'Price is required.';
    } else if (isNaN(parseFloat(price))) {
      newErrors.price = 'Price must be a number.';
    }
    if (!imageUri) {
      newErrors.imageUri = 'Photo is required.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleAddProduct = async () => {
    if (validate() && user) {
      try {
        await addProduct({
          name,
          price: parseFloat(price),
          imageUri: imageUri!,
        });
        Toast.show({
          type: 'success',
          text1: 'Product Added',
          text2: `${name} has been added to your catalog.`,
        });
        router.back();
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Failed to add product';
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: message,
        });
      }
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ThemedText style={styles.title}>Add a New Product</ThemedText>
      <TouchableOpacity onPress={pickImage} style={styles.imagePicker}>
        {imageUri ? (
          <Image source={{ uri: imageUri }} style={styles.image} />
        ) : (
          <View style={[styles.imagePlaceholder, errors.imageUri ? styles.errorBorder : null]}>
            <Text style={styles.imagePlaceholderText}>+</Text>
          </View>
        )}
      </TouchableOpacity>
      {errors.imageUri && <Text style={styles.errorText}>{errors.imageUri}</Text>}
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
      <InfoModal
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          router.back();
        }}
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
