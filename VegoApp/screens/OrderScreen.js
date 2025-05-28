import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function OrderScreen({ navigation }) {
  const [selectedCategory, setSelectedCategory] = useState('Heavy Meal');

  const categories = [
    { name: 'Heavy Meal', icon: '🍽️' },
    { name: 'Snack', icon: '🥨' },
    { name: 'Groceries', icon: '🛒' },
    { name: 'Drink', icon: '🥤' }
  ];

  const features = [
    { title: 'Open 24 Hours', subtitle: 'Ready anytime', icon: '⏰', color: '#4CAF50' },
    { title: 'Fast Serve', subtitle: 'Serve for u', icon: '🚀', color: '#F44336' },
    { title: 'Big Discount', subtitle: 'Discount up to 50%', icon: '💰', color: '#2196F3' },
    { title: 'Best Seller', subtitle: 'Recommended', icon: '⭐', color: '#FF9800' }
  ];

  const restaurants = [
    {
      name: 'Resto Salad Sayur',
      rating: 4.8,
      time: '20 MINS',
      distance: '1.5 km',
      tags: ['Best Resto', 'Cheap'],
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200'
    },
    {
      name: 'RM. Vegan Indo',
      rating: 4.7,
      time: '20 MINS',
      distance: '1.5 km',
      tags: ['Near You', 'Recommend'],
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
    },
    {
      name: 'Vegetarian Mak Ijoh',
      rating: 4.6,
      time: '20 MINS',
      distance: '1.5 km',
      tags: ['Best Resto', 'Cheap'],
      image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=200'
    }
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Header */}
      <LinearGradient
        colors={['#FFA726', '#FF9800']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Online Order</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Let's order something!"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#FFA726" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <View style={styles.categoriesContainer}>
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.categoryItem}
              onPress={() => setSelectedCategory(category.name)}
            >
              <View style={[
                styles.categoryIcon,
                selectedCategory === category.name && styles.selectedCategory
              ]}>
                <Text style={styles.categoryEmoji}>{category.icon}</Text>
              </View>
              <Text style={styles.categoryText}>{category.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Features Grid */}
        <View style={styles.featuresGrid}>
          {features.map((feature, index) => (
            <TouchableOpacity key={index} style={styles.featureItem}>
              <View style={[styles.featureIcon, { backgroundColor: feature.color }]}>
                <Text style={styles.featureEmoji}>{feature.icon}</Text>
              </View>
              <View style={styles.featureText}>
                <Text style={styles.featureTitle}>{feature.title}</Text>
                <Text style={styles.featureSubtitle}>{feature.subtitle}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Order Now Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Now</Text>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400' }}
            style={styles.orderImage}
          />
          <View style={styles.orderInfo}>
            <Text style={styles.orderTitle}>Salad Buah Murah, Cuma 10k</Text>
            <Text style={styles.orderSubtitle}>Ad - Salad Buah Fri</Text>
          </View>
        </View>

        {/* 24 Hours Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>24 Hours</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurants.map((restaurant, index) => (
              <TouchableOpacity
                key={index}
                style={styles.restaurantCard}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.restaurantMeta}>
                    <Text style={styles.restaurantRating}>⭐ {restaurant.rating}</Text>
                    <Text style={styles.restaurantTime}>{restaurant.time} • {restaurant.distance}</Text>
                  </View>
                  <View style={styles.restaurantTags}>
                    {restaurant.tags.map((tag, tagIndex) => (
                      <View key={tagIndex} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Fast Serve Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Fast Serve</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurants.map((restaurant, index) => (
              <TouchableOpacity
                key={index}
                style={styles.restaurantCard}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.restaurantMeta}>
                    <Text style={styles.restaurantRating}>⭐ {restaurant.rating}</Text>
                    <Text style={styles.restaurantTime}>{restaurant.time} • {restaurant.distance}</Text>
                  </View>
                  <View style={styles.restaurantTags}>
                    {restaurant.tags.map((tag, tagIndex) => (
                      <View key={tagIndex} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        {/* Big Discount Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Big Discount</Text>
            <TouchableOpacity>
              <Text style={styles.seeAll}>See All</Text>
            </TouchableOpacity>
          </View>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurants.map((restaurant, index) => (
              <TouchableOpacity
                key={index}
                style={styles.restaurantCard}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
              >
                <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
                <View style={styles.restaurantInfo}>
                  <Text style={styles.restaurantName}>{restaurant.name}</Text>
                  <View style={styles.restaurantMeta}>
                    <Text style={styles.restaurantRating}>⭐ {restaurant.rating}</Text>
                    <Text style={styles.restaurantTime}>{restaurant.time} • {restaurant.distance}</Text>
                  </View>
                  <View style={styles.restaurantTags}>
                    {restaurant.tags.map((tag, tagIndex) => (
                      <View key={tagIndex} style={styles.tag}>
                        <Text style={styles.tagText}>{tag}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 25,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 10,
  },
  searchButton: {
    padding: 5,
  },
  content: {
    flex: 1,
  },
  categoriesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 20,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  categoryItem: {
    alignItems: 'center',
  },
  categoryIcon: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  selectedCategory: {
    backgroundColor: '#FFA726',
  },
  categoryEmoji: {
    fontSize: 24,
  },
  categoryText: {
    fontSize: 12,
    color: '#333',
    textAlign: 'center',
  },
  featuresGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 10,
  },
  featureItem: {
    width: (width - 60) / 2,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    backgroundColor: '#f8f8f8',
    padding: 15,
    borderRadius: 10,
    marginHorizontal: 5,
  },
  featureIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  featureEmoji: {
    fontSize: 16,
  },
  featureText: {
    flex: 1,
  },
  featureTitle: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#333',
  },
  featureSubtitle: {
    fontSize: 10,
    color: '#666',
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    paddingVertical: 20,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  seeAll: {
    fontSize: 14,
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  orderImage: {
    width: width - 40,
    height: 150,
    borderRadius: 15,
    marginHorizontal: 20,
    marginBottom: 10,
  },
  orderInfo: {
    paddingHorizontal: 20,
  },
  orderTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  orderSubtitle: {
    fontSize: 14,
    color: '#666',
  },
  restaurantCard: {
    width: 200,
    marginLeft: 20,
    backgroundColor: '#f8f8f8',
    borderRadius: 15,
    overflow: 'hidden',
  },
  restaurantImage: {
    width: '100%',
    height: 120,
    resizeMode: 'cover',
  },
  restaurantInfo: {
    padding: 15,
  },
  restaurantName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantMeta: {
    marginBottom: 8,
  },
  restaurantRating: {
    fontSize: 12,
    color: '#666',
  },
  restaurantTime: {
    fontSize: 12,
    color: '#666',
  },
  restaurantTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    marginRight: 5,
    marginBottom: 5,
  },
  tagText: {
    fontSize: 10,
    color: 'white',
    fontWeight: '500',
  },
});