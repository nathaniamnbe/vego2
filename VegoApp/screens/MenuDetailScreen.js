import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function MenuDetailScreen({ navigation, route }) {
  const { item } = route.params || {};
  const [quantity, setQuantity] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectedAddons, setSelectedAddons] = useState([]);

  const daunOptions = [
    { id: 1, name: 'Daun Bawang', selected: false },
    { id: 2, name: 'Daun Teh', selected: false }
  ];

  const addons = [
    { id: 1, name: 'Telur Mata Kaki', selected: false },
    { id: 2, name: 'Perkedel', selected: false }
  ];

  const increaseQuantity = () => setQuantity(quantity + 1);
  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const getTotalPrice = () => {
    return item?.price * quantity || 50000;
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: item?.image || 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400' }}
          style={styles.headerImage}
        />
        <LinearGradient
          colors={['rgba(0,0,0,0.3)', 'transparent']}
          style={styles.headerOverlay}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
        </LinearGradient>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.menuInfo}>
          <Text style={styles.menuName}>Drumstick Vegetarian</Text>
          <Text style={styles.menuPrice}>50.000</Text>
          <Text style={styles.menuDescription}>
            Nasi, bunga melati, daun pisang, timun
          </Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Pilihan Menu Daun</Text>
          <Text style={styles.sectionSubtitle}>Optional, Max 1</Text>
          
          {daunOptions.map((option) => (
            <TouchableOpacity key={option.id} style={styles.optionItem}>
              <View style={styles.checkbox}>
                <View style={styles.checkboxInner} />
              </View>
              <Text style={styles.optionText}>{option.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Add on</Text>
          <Text style={styles.sectionSubtitle}>Optional, Max 1</Text>
          
          {addons.map((addon) => (
            <TouchableOpacity key={addon.id} style={styles.optionItem}>
              <View style={styles.checkbox}>
                <View style={styles.checkboxInner} />
              </View>
              <Text style={styles.optionText}>{addon.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Note to restaurant</Text>
          <Text style={styles.sectionSubtitle}>Optional, Max 1</Text>
          
          <View style={styles.noteContainer}>
            <Text style={styles.notePlaceholder}>Add request to restaurant</Text>
          </View>
        </View>

        <View style={styles.quantitySection}>
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={decreaseQuantity}
          >
            <Ionicons name="remove" size={20} color="#FFA726" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{quantity}</Text>
          
          <TouchableOpacity 
            style={styles.quantityButton}
            onPress={increaseQuantity}
          >
            <Ionicons name="add" size={20} color="#FFA726" />
          </TouchableOpacity>
        </View>
      </ScrollView>

      <TouchableOpacity 
        style={styles.addToCartButton}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.addToCartText}>Add To Cart - {getTotalPrice().toLocaleString('id-ID')}</Text>
        <Ionicons name="bag" size={24} color="white" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  headerContainer: {
    position: 'relative',
  },
  headerImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  headerOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: 100,
    justifyContent: 'flex-start',
    paddingTop: 50,
    paddingHorizontal: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0,0,0,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
  },
  menuInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  menuName: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA726',
    marginBottom: 10,
  },
  menuDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: '#666',
    marginBottom: 15,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 2,
    borderColor: '#DDD',
    borderRadius: 3,
    marginRight: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxInner: {
    width: 10,
    height: 10,
    backgroundColor: 'transparent',
    borderRadius: 2,
  },
  optionText: {
    fontSize: 14,
    color: '#333',
  },
  noteContainer: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 15,
    minHeight: 50,
  },
  notePlaceholder: {
    fontSize: 14,
    color: '#999',
  },
  quantitySection: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  quantityButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginHorizontal: 30,
  },
  addToCartButton: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFA726',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 25,
  },
  addToCartText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});