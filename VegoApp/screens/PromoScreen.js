import React from 'react';
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

export default function PromoScreen({ navigation }) {
  const vouchers = [
    {
      id: 1,
      title: 'Promo Cashback Tomoro...',
      subtitle: 'Tomoro Coffe - Cashback 45% Min. 50000',
      amount: 'Rp5.000',
      status: 'Claim'
    }
  ];

  const restaurants = [
    {
      id: 1,
      name: 'Dharma Kitchen',
      rating: 4.7,
      reviews: 203,
      time: '40 MINS',
      distance: '3.5 km',
      tags: ['Flexitarian', 'Cheap'],
      discount: 'Up to 50%',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200'
    },
    {
      id: 2,
      name: 'Fedwell',
      rating: 4.6,
      reviews: 150,
      time: '35 MINS',
      distance: '2.8 km',
      tags: ['Best Resto', 'Flexitarian'],
      discount: 'Up to 40%',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'
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
          <Text style={styles.headerTitle}>Promo</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Voucher Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Voucher</Text>
          
          {vouchers.map((voucher) => (
            <View key={voucher.id} style={styles.voucherCard}>
              <View style={styles.voucherContent}>
                <Text style={styles.voucherTitle}>{voucher.title}</Text>
                <Text style={styles.voucherSubtitle}>{voucher.subtitle}</Text>
                <Text style={styles.voucherAmount}>{voucher.amount}</Text>
              </View>
              <TouchableOpacity style={styles.claimButton}>
                <Text style={styles.claimText}>{voucher.status}</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        {/* Big Discount Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Big Discount</Text>
            <TouchableOpacity>
              <Text style={styles.seeMore}>See More</Text>
            </TouchableOpacity>
          </View>

          {restaurants.map((restaurant) => (
            <TouchableOpacity
              key={restaurant.id}
              style={styles.restaurantCard}
              onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
            >
              <Image source={{ uri: restaurant.image }} style={styles.restaurantImage} />
              <View style={styles.restaurantInfo}>
                <Text style={styles.restaurantName}>{restaurant.name}</Text>
                <View style={styles.restaurantMeta}>
                  <View style={styles.ratingContainer}>
                    <Ionicons name="star" size={14} color="#FFA726" />
                    <Text style={styles.rating}>{restaurant.rating}</Text>
                    <Text style={styles.reviews}>({restaurant.reviews})</Text>
                  </View>
                  <Text style={styles.timeDistance}>{restaurant.time} • {restaurant.distance}</Text>
                </View>
                <View style={styles.restaurantTags}>
                  {restaurant.tags.map((tag, index) => (
                    <View key={index} style={styles.tag}>
                      <Text style={styles.tagText}>{tag}</Text>
                    </View>
                  ))}
                </View>
              </View>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{restaurant.discount}</Text>
              </View>
            </TouchableOpacity>
          ))}
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
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 10,
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
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeMore: {
    fontSize: 14,
    color: '#4CAF50',
    backgroundColor: '#E8F5E8',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  voucherCard: {
    flexDirection: 'row',
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    borderRadius: 15,
    padding: 20,
    alignItems: 'center',
    marginBottom: 10,
  },
  voucherContent: {
    flex: 1,
  },
  voucherTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  voucherSubtitle: {
    fontSize: 12,
    color: 'white',
    opacity: 0.9,
    marginBottom: 5,
  },
  voucherAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: 'white',
  },
  claimButton: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 15,
  },
  claimText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
  },
  restaurantCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
    alignItems: 'center',
  },
  restaurantImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 15,
  },
  restaurantInfo: {
    flex: 1,
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 5,
  },
  restaurantMeta: {
    marginBottom: 8,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  rating: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginLeft: 3,
  },
  reviews: {
    fontSize: 12,
    color: '#666',
    marginLeft: 3,
  },
  timeDistance: {
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
  discountBadge: {
    backgroundColor: '#F44336',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
  },
  discountText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
});