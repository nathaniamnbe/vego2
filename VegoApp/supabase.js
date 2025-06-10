import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://gfqsttzrjphlivtcepdw.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdmcXN0dHpyanBobGl2dGNlcGR3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDkzOTE5NzEsImV4cCI6MjA2NDk2Nzk3MX0.7fJh3W6YDEL-tct2KnT9REGp2EgOVb0PHZSP4V7r8X8'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Address service functions - YANG SUDAH ADA
export const addressService = {
  // Get all addresses for current user
  async getAddresses() {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .order('is_default', { ascending: false })
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching addresses:', error);
      throw error;
    }
  },

  // Add new address
  async addAddress(addressData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('addresses')
        .insert([{
          user_id: user.id,
          label: addressData.label,
          name: addressData.name,
          phone: addressData.phone,
          address: addressData.address,
          city: addressData.city,
          postal_code: addressData.postalCode,
          is_default: addressData.isDefault,
          latitude: addressData.coordinates?.latitude || null,
          longitude: addressData.coordinates?.longitude || null,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding address:', error);
      throw error;
    }
  },

  // Update address
  async updateAddress(addressId, addressData) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update({
          label: addressData.label,
          name: addressData.name,
          phone: addressData.phone,
          address: addressData.address,
          city: addressData.city,
          postal_code: addressData.postalCode,
          is_default: addressData.isDefault,
          latitude: addressData.coordinates?.latitude || null,
          longitude: addressData.coordinates?.longitude || null,
          updated_at: new Date().toISOString(),
        })
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating address:', error);
      throw error;
    }
  },

  // Delete address
  async deleteAddress(addressId) {
    try {
      const { error } = await supabase
        .from('addresses')
        .delete()
        .eq('id', addressId);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting address:', error);
      throw error;
    }
  },

  // Set default address
  async setDefaultAddress(addressId) {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .update({ is_default: true })
        .eq('id', addressId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error setting default address:', error);
      throw error;
    }
  },

  // Get default address
  async getDefaultAddress() {
    try {
      const { data, error } = await supabase
        .from('addresses')
        .select('*')
        .eq('is_default', true)
        .single();

      if (error && error.code !== 'PGRST116') throw error; // PGRST116 = no rows returned
      return data;
    } catch (error) {
      console.error('Error getting default address:', error);
      throw error;
    }
  },
};

// Auth helper functions - YANG SUDAH ADA
export const authService = {
  // Get current user
  async getCurrentUser() {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      return user;
    } catch (error) {
      console.error('Error getting current user:', error);
      throw error;
    }
  },

  // Check if user is authenticated
  async isAuthenticated() {
    try {
      const user = await this.getCurrentUser();
      return !!user;
    } catch (error) {
      return false;
    }
  },

  // Sign out
  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error signing out:', error);
      throw error;
    }
  },
};

// Review service functions - BARU DITAMBAHKAN
export const reviewService = {
  // Get all reviews
  async getReviews(filter = 'newest', searchQuery = '') {
    try {
      let query = supabase
        .from('food_reviews')
        .select('*');
      
      // Apply search filter
      if (searchQuery) {
        query = query.ilike('review_text', `%${searchQuery}%`);
      }
      
      // Apply sorting
      if (filter === 'newest') {
        query = query.order('created_at', { ascending: false });
      } else if (filter === 'popular') {
        query = query.order('comments', { ascending: false });
      } else if (filter === 'most_liked') {
        query = query.order('likes', { ascending: false });
      }
      
      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching reviews:', error);
      throw error;
    }
  },

  // Add new review
  async addReview(reviewData) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { data, error } = await supabase
        .from('food_reviews')
        .insert([{
          user_id: user.id,
          author_name: reviewData.authorName,
          rating: reviewData.rating,
          review_text: reviewData.reviewText,
          food_image_url: reviewData.imageUrl,
          avatar_url: reviewData.avatarUrl,
          likes: 0,
          comments: 0
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error adding review:', error);
      throw error;
    }
  },

  // Update review likes
  async updateLikes(reviewId, newLikesCount) {
    try {
      const { data, error } = await supabase
        .from('food_reviews')
        .update({ likes: newLikesCount })
        .eq('id', reviewId)
        .select()
        .single();

      if (error) throw error;
      return data;
    } catch (error) {
      console.error('Error updating likes:', error);
      throw error;
    }
  },

  // Delete review (only by owner)
  async deleteReview(reviewId) {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('User not authenticated');

      const { error } = await supabase
        .from('food_reviews')
        .delete()
        .eq('id', reviewId)
        .eq('user_id', user.id); // Ensure only owner can delete

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting review:', error);
      throw error;
    }
  },

  // Get reviews by user
  async getUserReviews(userId) {
    try {
      const { data, error } = await supabase
        .from('food_reviews')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    } catch (error) {
      console.error('Error fetching user reviews:', error);
      throw error;
    }
  },
};

// Storage service functions - BARU DITAMBAHKAN
export const storageService = {
  // Upload image to food_images bucket
  async uploadFoodImage(base64Image, userId) {
    try {
      const { decode } = require('base64-arraybuffer');
      const fileName = `${userId}-${Date.now()}.jpg`;
      const filePath = `food_images/${fileName}`;
      
      // Convert base64 to ArrayBuffer
      const arrayBuffer = decode(base64Image);
      
      // Upload to Supabase Storage
      const { data, error } = await supabase
        .storage
        .from('food_images')
        .upload(filePath, arrayBuffer, {
          contentType: 'image/jpeg',
          upsert: false
        });
      
      if (error) throw error;
      
      // Get public URL
      const { data: { publicUrl } } = supabase
        .storage
        .from('food_images')
        .getPublicUrl(filePath);
      
      return publicUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      throw error;
    }
  },

  // Delete image from storage
  async deleteImage(imagePath) {
    try {
      const { error } = await supabase
        .storage
        .from('food_images')
        .remove([imagePath]);

      if (error) throw error;
      return true;
    } catch (error) {
      console.error('Error deleting image:', error);
      throw error;
    }
  },
};

// Real-time subscription helper - YANG SUDAH ADA
export const subscribeToAddresses = (callback) => {
  return supabase
    .channel('addresses')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'addresses',
      },
      callback
    )
    .subscribe();
};

// Real-time subscription untuk reviews - BARU DITAMBAHKAN
export const subscribeToReviews = (callback) => {
  return supabase
    .channel('food_reviews')
    .on(
      'postgres_changes',
      {
        event: '*',
        schema: 'public',
        table: 'food_reviews',
      },
      callback
    )
    .subscribe();
};