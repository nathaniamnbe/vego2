import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Image,
  StatusBar,
  Dimensions,
  Alert,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { supabase, reviewService, authService } from '../supabase';

const { width } = Dimensions.get('window');

export default function ForumScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('newest');
  const [reviews, setReviews] = useState([]);
  const [topSharing, setTopSharing] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [currentUser, setCurrentUser] = useState(null);

  const filters = [
    { key: 'newest', label: 'Newest' },
    { key: 'popular', label: 'Popular' },
    { key: 'most_liked', label: 'Most Liked' }
  ];

  // Load data when component mounts
  useEffect(() => {
    checkUser();
    fetchReviews();
  }, []);

  // Fetch reviews when filter changes
  useEffect(() => {
    fetchReviews();
  }, [selectedFilter]);

  const checkUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const fetchReviews = async () => {
    try {
      setLoading(true);
      
      // Map filter keys to match reviewService expectations
      const filterMap = {
        'newest': 'newest',
        'popular': 'popular', 
        'most_liked': 'most_liked'
      };
      
      const data = await reviewService.getReviews(filterMap[selectedFilter], searchQuery);
      
      // Format the data to match component structure
      const formattedReviews = data.map(item => ({
        id: item.id,
        author: item.author_name,
        rating: item.rating,
        text: item.review_text,
        image: item.food_image_url,
        avatar: item.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        timestamp: item.created_at,
        likes: item.likes || 0,
        comments: item.comments || 0
      }));
      
      setReviews(formattedReviews);
      
      // Set top sharing (reviews with likes or comments)
      const topSharingData = formattedReviews
        .filter(r => r.comments > 0 || r.likes > 0)
        .slice(0, 3);
      setTopSharing(topSharingData);
      
    } catch (error) {
      console.error('Error fetching reviews:', error);
      Alert.alert('Error', 'Failed to load reviews. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchReviews();
    setRefreshing(false);
  };

  const handleSearch = () => {
    fetchReviews();
  };

  const handleAddReview = () => {
    if (!currentUser) {
      Alert.alert('Login Required', 'Please login to add a review', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }
    
    navigation.navigate('WriteReview', {
      onReviewSubmit: (newReview) => {
        // Refresh reviews after new review is added
        fetchReviews();
      }
    });
  };

  const handleLike = async (reviewId) => {
    try {
      if (!currentUser) {
        Alert.alert('Login Required', 'Please login to like a review');
        return;
      }
      
      // Find current review
      const currentReview = reviews.find(r => r.id === reviewId);
      if (!currentReview) return;
      
      const newLikesCount = currentReview.likes + 1;
      
      // Update in database
      await reviewService.updateLikes(reviewId, newLikesCount);
      
      // Update local state
      setReviews(reviews.map(review => 
        review.id === reviewId 
          ? { ...review, likes: newLikesCount } 
          : review
      ));
      
      // Also update topSharing if needed
      setTopSharing(topSharing.map(post => 
        post.id === reviewId 
          ? { ...post, likes: newLikesCount } 
          : post
      ));
      
    } catch (error) {
      console.error('Error liking review:', error);
      Alert.alert('Error', 'Failed to like review. Please try again.');
    }
  };

  const renderReviewCard = (review, showImage = true) => (
    <View key={review.id} style={styles.reviewCard}>
      {showImage && review.image && (
        <Image 
          source={{ uri: review.image }} 
          style={styles.reviewImage} 
        />
      )}
      <View style={styles.reviewContent}>
        <View style={styles.reviewHeader}>
          <Image 
            source={{ uri: review.avatar }} 
            style={styles.avatar} 
          />
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
        
        {/* Action buttons for likes and comments */}
        <View style={styles.reviewActions}>
          <TouchableOpacity 
            style={styles.actionButton}
            onPress={() => handleLike(review.id)}
          >
            <Ionicons name="heart-outline" size={16} color="#666" />
            <Text style={styles.actionText}>{review.likes}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Ionicons name="chatbubble-outline" size={16} color="#666" />
            <Text style={styles.actionText}>{review.comments}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

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
            value={searchQuery}
            onChangeText={setSearchQuery}
            onSubmitEditing={handleSearch}
          />
          <TouchableOpacity style={styles.searchButton} onPress={handleSearch}>
            <Ionicons name="search" size={20} color="#FFA726" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#FFA726" />
          <Text style={styles.loadingText}>Loading reviews...</Text>
        </View>
      ) : (
        <ScrollView 
          style={styles.content} 
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              colors={['#FFA726']}
            />
          }
        >
          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            {filters.map((filter) => (
              <TouchableOpacity
                key={filter.key}
                style={[
                  styles.filterButton,
                  selectedFilter === filter.key && styles.activeFilterButton
                ]}
                onPress={() => setSelectedFilter(filter.key)}
              >
                <Text style={[
                  styles.filterText,
                  selectedFilter === filter.key && styles.activeFilterText
                ]}>
                  {filter.label}
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

            {reviews.length > 0 ? (
              renderReviewCard(reviews[0])
            ) : (
              <View style={styles.emptyContainer}>
                <Ionicons name="restaurant-outline" size={48} color="#ccc" />
                <Text style={styles.emptyText}>No reviews yet</Text>
                <Text style={styles.emptySubText}>Be the first to share your food experience!</Text>
                <TouchableOpacity style={styles.addReviewButton} onPress={handleAddReview}>
                  <Text style={styles.addReviewButtonText}>Add Review</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Top Sharing Section */}
          {topSharing.length > 0 && (
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
                  {post.image && (
                    <Image source={{ uri: post.image }} style={styles.postImage} />
                  )}
                  <View style={styles.postActions}>
                    <TouchableOpacity 
                      style={styles.actionButton}
                      onPress={() => handleLike(post.id)}
                    >
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
          )}

          {/* All Reviews Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>All Reviews</Text>
            {reviews.length > 1 ? (
              reviews.slice(1).map((review) => renderReviewCard(review))
            ) : reviews.length === 1 ? (
              <Text style={styles.emptyText}>No additional reviews</Text>
            ) : (
              <Text style={styles.emptyText}>No reviews available</Text>
            )}
          </View>
        </ScrollView>
      )}

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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
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
    paddingHorizontal: 20,
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
    marginBottom: 8,
  },
  reviewActions: {
    flexDirection: 'row',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  actionText: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
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
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  emptyText: {
    fontSize: 16,
    color: '#666',
    marginTop: 10,
    textAlign: 'center',
  },
  emptySubText: {
    fontSize: 14,
    color: '#999',
    marginTop: 5,
    textAlign: 'center',
  },
  addReviewButton: {
    backgroundColor: '#FFA726',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    marginTop: 15,
  },
  addReviewButtonText: {
    color: 'white',
    fontWeight: 'bold',
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