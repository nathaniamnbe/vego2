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
  Alert,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { supabase, authService } from '../supabase';
import { decode } from 'base64-arraybuffer';

export default function WriteReviewScreen({ navigation, route }) {
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState('');
  const [authorName, setAuthorName] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [selectedImageBase64, setSelectedImageBase64] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);

  const { onReviewSubmit } = route.params || {};

  useEffect(() => {
    checkUser();
  }, []);

  const checkUser = async () => {
    try {
      const user = await authService.getCurrentUser();
      setCurrentUser(user);
      
      if (user) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('full_name, avatar_url')
          .eq('id', user.id)
          .single();
        
        if (!error && profile) {
          setUserProfile(profile);
          setAuthorName(profile.full_name || user.email || '');
        } else {
          setAuthorName(user.email || '');
        }
      }
    } catch (error) {
      console.error('Error checking user:', error);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
      base64: true, 
    });

    if (!result.canceled) {
      setSelectedImage(result.assets[0].uri);
      setSelectedImageBase64(result.assets[0].base64);
    }
  };

  const uploadImageToSupabase = async (base64Image) => {
    try {
      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const fileName = `${currentUser.id}-${Date.now()}.jpg`;
      const filePath = `food_images/${fileName}`;
      
      const arrayBuffer = decode(base64Image);
      
      const { data, error } = await supabase
        .storage
        .from('food_images')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (error) {
        throw error;
      }
      
      const { data: { publicUrl } } = supabase
        .storage
        .from('food_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  };

  const handleSubmit = async () => {
    if (!currentUser) {
      Alert.alert('Authentication Required', 'Please login to submit a review', [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Login', onPress: () => navigation.navigate('Login') }
      ]);
      return;
    }

    if (!authorName.trim()) {
      Alert.alert('Error', 'Please enter your name');
      return;
    }
    if (rating === 0) {
      Alert.alert('Error', 'Please select a rating');
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert('Error', 'Please write your review');
      return;
    }

    setIsSubmitting(true);

    try {
      let imageUrl = null;
      
      if (selectedImageBase64) {
        try {
          imageUrl = await uploadImageToSupabase(selectedImageBase64);
        } catch (imageError) {
          console.error('Image upload failed:', imageError);
          Alert.alert(
            'Image Upload Failed', 
            'Your review will be posted without the image. Continue?',
            [
              { text: 'Cancel', style: 'cancel', onPress: () => setIsSubmitting(false) },
              { text: 'Continue', onPress: () => submitReview(null) }
            ]
          );
          return;
        }
      }
      
      await submitReview(imageUrl);
      
    } catch (error) {
      console.error('Error submitting review:', error);
      Alert.alert('Error', 'Failed to submit review. Please try again.');
      setIsSubmitting(false);
    }
  };

  const submitReview = async (imageUrl) => {
    try {
      const { data, error } = await supabase
        .from('food_reviews')
        .insert([
          {
            user_id: currentUser.id,
            author_name: authorName.trim(),
            rating: rating,
            review_text: reviewText.trim(),
            food_image_url: imageUrl,
            avatar_url: userProfile?.avatar_url || null,
            likes: 0,
            comments: 0
          }
        ])
        .select()
        .single();

      if (error) {
        throw error;
      }

      const newReview = {
        id: data.id,
        author: authorName.trim(),
        rating: rating,
        text: reviewText.trim(),
        image: imageUrl || 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
        avatar: userProfile?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100',
        timestamp: data.created_at,
        likes: 0,
        comments: 0
      };

      if (onReviewSubmit) {
        onReviewSubmit(newReview);
      }

      setIsSubmitting(false);
      Alert.alert('Success', 'Your review has been posted!', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);

    } catch (error) {
      console.error('Error saving review to database:', error);
      throw error;
    }
  };

  const renderStars = () => {
    return (
      <View style={styles.starsContainer}>
        <Text style={styles.ratingLabel}>Rating:</Text>
        <View style={styles.stars}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity
              key={star}
              onPress={() => setRating(star)}
              style={styles.starButton}
            >
              <Ionicons
                name={star <= rating ? "star" : "star-outline"}
                size={32}
                color={star <= rating ? "#FFA726" : "#ccc"}
              />
            </TouchableOpacity>
          ))}
        </View>
        {rating > 0 && (
          <Text style={styles.ratingText}>
            {rating === 1 && "Poor"}
            {rating === 2 && "Fair"}
            {rating === 3 && "Good"}
            {rating === 4 && "Very Good"}
            {rating === 5 && "Excellent"}
          </Text>
        )}
      </View>
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#FFA726', '#FF9800']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Write Review</Text>
          <TouchableOpacity 
            onPress={handleSubmit}
            disabled={isSubmitting}
            style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
          >
            {isSubmitting ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text style={styles.submitButtonText}>Post</Text>
            )}
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {currentUser && (
          <View style={styles.userInfoSection}>
            <Image 
              source={{ 
                uri: userProfile?.avatar_url || 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100' 
              }} 
              style={styles.userAvatar} 
            />
            <View style={styles.userInfo}>
              <Text style={styles.userEmail}>{currentUser.email}</Text>
              <Text style={styles.reviewingAs}>Reviewing as:</Text>
            </View>
          </View>
        )}

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Display Name</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Enter your display name"
            value={authorName}
            onChangeText={setAuthorName}
            maxLength={50}
          />
          <Text style={styles.helperText}>
            This name will be shown with your review
          </Text>
        </View>

        <View style={styles.inputSection}>
          {renderStars()}
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Add Photo (Optional)</Text>
          <TouchableOpacity style={styles.imagePickerButton} onPress={pickImage}>
            {selectedImage ? (
              <View style={styles.selectedImageContainer}>
                <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
                <TouchableOpacity 
                  style={styles.removeImageButton}
                  onPress={() => {
                    setSelectedImage(null);
                    setSelectedImageBase64(null);
                  }}
                >
                  <Ionicons name="close-circle" size={24} color="#ff4444" />
                </TouchableOpacity>
              </View>
            ) : (
              <View style={styles.imagePlaceholder}>
                <Ionicons name="camera" size={40} color="#ccc" />
                <Text style={styles.imagePlaceholderText}>Tap to add photo</Text>
                <Text style={styles.imageHelperText}>Show others what you ordered!</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>Your Review</Text>
          <TextInput
            style={styles.textArea}
            placeholder="Share your experience... What did you like? How was the taste, service, and atmosphere?"
            value={reviewText}
            onChangeText={setReviewText}
            multiline
            numberOfLines={6}
            textAlignVertical="top"
            maxLength={500}
          />
          <Text style={styles.characterCount}>
            {reviewText.length}/500 characters
          </Text>
        </View>

        <View style={styles.tipsSection}>
          <Text style={styles.tipsTitle}>💡 Tips for a great review:</Text>
          <Text style={styles.tipText}>• Be specific about your experience</Text>
          <Text style={styles.tipText}>• Mention what you liked or didn't like</Text>
          <Text style={styles.tipText}>• Include details about food, service, and atmosphere</Text>
          <Text style={styles.tipText}>• Be honest and helpful to other users</Text>
        </View>

        <TouchableOpacity 
          style={[styles.mobileSubmitButton, isSubmitting && styles.submitButtonDisabled]}
          onPress={handleSubmit}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <View style={styles.submittingContainer}>
              <ActivityIndicator size="small" color="white" style={styles.loadingIcon} />
              <Text style={styles.mobileSubmitButtonText}>Posting Review...</Text>
            </View>
          ) : (
            <Text style={styles.mobileSubmitButtonText}>Post Review</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
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
  submitButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    minWidth: 60,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  userInfoSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 12,
  },
  userInfo: {
    flex: 1,
  },
  userEmail: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  reviewingAs: {
    fontSize: 12,
    color: '#666',
    marginTop: 2,
  },
  inputSection: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
  },
  helperText: {
    fontSize: 12,
    color: '#666',
    marginTop: 4,
  },
  starsContainer: {
    alignItems: 'center',
  },
  ratingLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  stars: {
    flexDirection: 'row',
    justifyContent: 'center',
  },
  starButton: {
    padding: 4,
  },
  ratingText: {
    marginTop: 8,
    fontSize: 14,
    color: '#FFA726',
    fontWeight: 'bold',
  },
  imagePickerButton: {
    borderWidth: 2,
    borderColor: '#ddd',
    borderStyle: 'dashed',
    borderRadius: 12,
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
    position: 'relative',
  },
  selectedImageContainer: {
    width: '100%',
    height: '100%',
    position: 'relative',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
    borderRadius: 10,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: 'white',
    borderRadius: 12,
  },
  imagePlaceholder: {
    alignItems: 'center',
  },
  imagePlaceholderText: {
    marginTop: 8,
    color: '#999',
    fontSize: 14,
    fontWeight: 'bold',
  },
  imageHelperText: {
    marginTop: 4,
    color: '#ccc',
    fontSize: 12,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    backgroundColor: '#f9f9f9',
    minHeight: 120,
  },
  characterCount: {
    textAlign: 'right',
    color: '#999',
    fontSize: 12,
    marginTop: 4,
  },
  tipsSection: {
    backgroundColor: '#e8f5e8',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#4CAF50',
    marginBottom: 12,
  },
  tipText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
    lineHeight: 20,
  },
  mobileSubmitButton: {
    backgroundColor: '#FFA726',
    borderRadius: 25,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  mobileSubmitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  submittingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  loadingIcon: {
    marginRight: 8,
  },
});