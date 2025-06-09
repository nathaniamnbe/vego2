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

export default function ForumScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('Newest');
  const [reviews, setReviews] = useState([
    {
      id: 1,
      author: 'Hanni Pham',
      rating: 5,
      text: 'Restoran ini adalah surga vegan dengan menu beragam, pelayanan cepat, dan suasana nyaman. Sangat direkomendasikan untuk mencoba makanan vegan.',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
      timestamp: new Date().toISOString()
    }
  ]);

  const filters = ['Newest', 'Popular', 'Most Liked'];

  const topSharing = [
    {
      id: 1,
      author: 'Olahraga & Vegetarian',
      text: 'Sebagai atlet, restoran ini mendukung pola makan seimbang saya dengan makanan sehat dan lezat seperti salad protein dan smoothie. Sangat mendukung gaya hidup aktif',
      image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100',
      likes: 0,
      comments: 0
    }
  ];

  const handleAddReview = () => {
    navigation.navigate('WriteReview', {
      onReviewSubmit: (newReview) => {
        setReviews(prevReviews => [newReview, ...prevReviews]);
      }
    });
  };

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
          <Text style={styles.headerTitle}>Forum</Text>
          <TouchableOpacity onPress={handleAddReview} style={styles.addButton}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="What topic are you looking for?"
            placeholderTextColor="#999"
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#FFA726" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Filter Buttons */}
        <View style={styles.filterContainer}>
          {filters.map((filter) => (
            <TouchableOpacity
              key={filter}
              style={[
                styles.filterButton,
                selectedFilter === filter && styles.activeFilterButton
              ]}
              onPress={() => setSelectedFilter(filter)}
            >
              <Text style={[
                styles.filterText,
                selectedFilter === filter && styles.activeFilterText
              ]}>
                {filter}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Top Review Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Review</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Image source={{ uri: review.image }} style={styles.reviewImage} />
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatar }} style={styles.avatar} />
                  <View style={styles.reviewAuthor}>
                    <Text style={styles.authorName}>{review.author}</Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Ionicons key={i} name="star" size={12} color="#FFA726" />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* Top Sharing Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Top Sharing</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          {topSharing.map((post) => (
            <View key={post.id} style={styles.postCard}>
              <View style={styles.postHeader}>
                <Image source={{ uri: post.avatar }} style={styles.avatar} />
                <Text style={styles.postAuthor}>{post.author}</Text>
              </View>
              <Text style={styles.postText}>{post.text}</Text>
              <Image source={{ uri: post.image }} style={styles.postImage} />
              <View style={styles.postActions}>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="heart-outline" size={20} color="#666" />
                  <Text style={styles.actionText}>{post.likes}</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionButton}>
                  <Ionicons name="chatbubble-outline" size={20} color="#666" />
                  <Text style={styles.actionText}>{post.comments}</Text>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* All Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>All</Text>
          {/* Display all reviews here */}
          {reviews.slice(1).map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <Image source={{ uri: review.image }} style={styles.reviewImage} />
              <View style={styles.reviewContent}>
                <View style={styles.reviewHeader}>
                  <Image source={{ uri: review.avatar }} style={styles.avatar} />
                  <View style={styles.reviewAuthor}>
                    <Text style={styles.authorName}>{review.author}</Text>
                    <View style={styles.ratingContainer}>
                      {[...Array(review.rating)].map((_, i) => (
                        <Ionicons key={i} name="star" size={12} color="#FFA726" />
                      ))}
                    </View>
                  </View>
                </View>
                <Text style={styles.reviewText}>{review.text}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab} onPress={handleAddReview}>
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
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
  addButton: {
    padding: 5,
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
  filterContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  filterButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
    marginRight: 10,
  },
  activeFilterButton: {
    backgroundColor: '#4CAF50',
  },
  filterText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  activeFilterText: {
    color: 'white',
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
  },
  viewAll: {
    fontSize: 14,
    color: '#4CAF50',
  },
  reviewCard: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  reviewImage: {
    width: 80,
    height: 80,
    borderRadius: 10,
    resizeMode: 'cover',
    marginRight: 15,
  },
  reviewContent: {
    flex: 1,
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  avatar: {
    width: 30,
    height: 30,
    borderRadius: 15,
    marginRight: 10,
  },
  reviewAuthor: {
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 2,
  },
  ratingContainer: {
    flexDirection: 'row',
  },
  reviewText: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  postCard: {
    paddingHorizontal: 20,
    marginBottom: 20,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  postAuthor: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#333',
  },
  postText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 10,
  },
  postImage: {
    width: '100%',
    height: 150,
    borderRadius: 10,
    resizeMode: 'cover',
    marginBottom: 10,
  },
  postActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 5,
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 30,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#FFA726',
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
});