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

export default function RestaurantDetailScreen({ navigation, route }) {
  const { restaurant } = route.params || {};
  const [cartItems, setCartItems] = useState([]);

  const menuItems = [
    {
      id: 1,
      name: 'Drumstick Vegetarian',
      price: 20000,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200',
      badge: '💰'
    },
    {
      id: 2,
      name: 'Gyoza Vegetarian',
      price: 25000,
      image: 'https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=200',
      badge: '💰'
    },
    {
      id: 3,
      name: 'Perkedel Vegetarian',
      price: 18000,
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200',
      badge: '💰'
    },
    {
      id: 4,
      name: 'Daging Vegetarian',
      price: 30000,
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
      badge: '💰'
    }
  ];

  const addToCart = (item) => {
    setCartItems([...cartItems, item]);
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + item.price, 0);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <View style={styles.headerContainer}>
        <Image
          source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' }}
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

      <View style={styles.restaurantInfo}>
        <Text style={styles.restaurantName}>Vegetarian Mak Ijoh - Gading Serpong</Text>
        <View style={styles.restaurantMeta}>
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={16} color="#FFA726" />
            <Text style={styles.rating}>4.7</Text>
            <Text style={styles.reviews}>(203 reviews)</Text>
          </View>
          <View style={styles.locationContainer}>
            <Ionicons name="location" size={16} color="#666" />
            <Text style={styles.distance}>3.01 km</Text>
          </View>
        </View>

        <View style={styles.deliveryContainer}>
          <View style={styles.deliveryOption}>
            <View style={styles.deliveryIcon}>
              <Ionicons name="bicycle" size={20} color="#4CAF50" />
            </View>
            <View>
              <Text style={styles.deliveryTitle}>Delivery Order</Text>
              <TouchableOpacity>
                <Text style={styles.changeText}>Change</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.promoContainer}>
            <Ionicons name="pricetag" size={20} color="#F44336" />
            <View style={styles.promoText}>
              <Text style={styles.promoTitle}>Food discount up to 50%</Text>
              <Text style={styles.promoSubtitle}>Buy 1 get 1</Text>
            </View>
            <TouchableOpacity style={styles.infoButton}>
              <Text style={styles.infoText}>Info</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <ScrollView style={styles.menuContainer} showsVerticalScrollIndicator={false}>
        <Text style={styles.menuTitle}>For You</Text>
        
        <View style={styles.menuGrid}>
          {menuItems.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={styles.menuItem}
              onPress={() => navigation.navigate('MenuDetail', { item })}
            >
              <Image source={{ uri: item.image }} style={styles.menuImage} />
              <View style={styles.menuBadge}>
                <Text style={styles.badgeText}>{item.badge}</Text>
              </View>
              <View style={styles.menuInfo}>
                <Text style={styles.menuName}>{item.name}</Text>
                <Text style={styles.menuPrice}>{item.price.toLocaleString('id-ID')}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {cartItems.length > 0 && (
        <TouchableOpacity 
          style={styles.cartButton}
          onPress={() => navigation.navigate('Checkout', { cartItems })}
        >
          <View style={styles.cartInfo}>
            <Text style={styles.cartCount}>{cartItems.length} Items</Text>
            <Text style={styles.cartTotal}>Rp. {getTotalPrice().toLocaleString('id-ID')}</Text>
          </View>
          <Ionicons name="bag" size={24} color="white" />
        </TouchableOpacity>
      )}
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
    height: 200,
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
  restaurantInfo: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  restaurantName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  restaurantMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 5,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  distance: {
    fontSize: 14,
    color: '#666',
    marginLeft: 5,
  },
  deliveryContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  deliveryIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  deliveryTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
  },
  changeText: {
    fontSize: 14,
    color: '#666',
    textDecorationLine: 'underline',
  },
  promoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF3E0',
    padding: 15,
    borderRadius: 10,
  },
  promoText: {
    flex: 1,
    marginLeft: 10,
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
  },
  promoSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  infoButton: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 15,
  },
  infoText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '500',
  },
  menuContainer: {
    flex: 1,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  menuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 20,
  },
  menuGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  menuItem: {
    width: (width - 60) / 2,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    marginBottom: 15,
    overflow: 'hidden',
  },
  menuImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  menuBadge: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    fontSize: 16,
  },
  menuInfo: {
    padding: 15,
  },
  menuName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  menuPrice: {
    fontSize: 14,
    color: '#FFA726',
    fontWeight: '500',
  },
  cartButton: {
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
  cartInfo: {
    flex: 1,
  },
  cartCount: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  cartTotal: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});