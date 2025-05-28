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

export default function RecipeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');

  const ingredients = [
    { name: 'Corn', image: 'https://images.unsplash.com/photo-1551754655-cd27e38d2076?w=200' },
    { name: 'Tomato', image: 'https://images.unsplash.com/photo-1546470427-e26264be0b0d?w=200' },
    { name: 'Oat', image: 'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=200' },
    { name: 'Tofu', image: 'https://images.unsplash.com/photo-1570197788417-0e82375c9371?w=200' },
    { name: 'Potato', image: 'https://images.unsplash.com/photo-1518977676601-b53f82aba655?w=200' },
    { name: 'Tempeh', image: 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200' }
  ];

  const bestRecipes = [
    {
      id: 1,
      name: 'Vegetable Stir Fry',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200',
      time: '30 mins',
      servings: '2 Serve'
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
          <Text style={styles.headerTitle}>Recipe</Text>
          <View style={{ width: 24 }} />
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="What do you want to cook?"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#FFA726" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Ingredient</Text>
          
          <View style={styles.ingredientsGrid}>
            {ingredients.map((ingredient, index) => (
              <TouchableOpacity
                key={index}
                style={styles.ingredientItem}
                onPress={() => navigation.navigate('RecipeDetail', { ingredient })}
              >
                <Image source={{ uri: ingredient.image }} style={styles.ingredientImage} />
                <Text style={styles.ingredientName}>{ingredient.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Best for You Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Best for You</Text>
          
          <TouchableOpacity
            style={styles.recipeCard}
            onPress={() => navigation.navigate('RecipeDetail', { recipe: bestRecipes[0] })}
          >
            <Image source={{ uri: bestRecipes[0].image }} style={styles.recipeImage} />
            <View style={styles.recipeOverlay}>
              <Text style={styles.recipeName}>{bestRecipes[0].name}</Text>
              <View style={styles.recipeInfo}>
                <View style={styles.recipeInfoItem}>
                  <Ionicons name="time" size={16} color="white" />
                  <Text style={styles.recipeInfoText}>{bestRecipes[0].time}</Text>
                </View>
                <View style={styles.recipeInfoItem}>
                  <Ionicons name="people" size={16} color="white" />
                  <Text style={styles.recipeInfoText}>{bestRecipes[0].servings}</Text>
                </View>
              </View>
            </View>
          </TouchableOpacity>
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
  section: {
    backgroundColor: 'white',
    paddingVertical: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  ingredientsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 20,
    justifyContent: 'space-between',
  },
  ingredientItem: {
    width: (width - 60) / 3,
    alignItems: 'center',
    marginBottom: 20,
  },
  ingredientImage: {
    width: 80,
    height: 80,
    borderRadius: 40,
    resizeMode: 'cover',
    marginBottom: 8,
  },
  ingredientName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
  recipeCard: {
    marginHorizontal: 20,
    borderRadius: 15,
    overflow: 'hidden',
    position: 'relative',
  },
  recipeImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recipeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 20,
  },
  recipeName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  recipeInfo: {
    flexDirection: 'row',
  },
  recipeInfoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 20,
  },
  recipeInfoText: {
    fontSize: 14,
    color: 'white',
    marginLeft: 5,
  },
});