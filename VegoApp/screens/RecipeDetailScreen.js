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

export default function RecipeDetailScreen({ navigation, route }) {
  const { recipe, ingredient } = route.params || {};

  const recipeData = {
    name: 'Sup Makaroni',
    image: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400',
    time: '30 mins',
    servings: '1 Serve',
    ingredients: [
      '200 gram daging ayam',
      '50 gram makaroni',
      '5 buah bakso',
      '50gr kacang polong',
      '1 buah wortel',
      '1 buah kentang',
      '1 batang daun bawang',
      '1 batang seledri',
      '1,5 sdt garam',
      '1 sdt gula',
      '1 sdt merica bubuk',
      '¼ sendok teh pala bubuk',
      'Bawang Goreng',
      '3 siung bawang putih',
      '3 cm jahe'
    ]
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
          <Text style={styles.headerTitle}>Recipe</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Recipe Image and Info */}
        <View style={styles.recipeHeader}>
          <Image source={{ uri: recipeData.image }} style={styles.recipeImage} />
          <LinearGradient
            colors={['transparent', 'rgba(255,167,38,0.9)']}
            style={styles.recipeOverlay}
          >
            <Text style={styles.recipeName}>{recipeData.name}</Text>
            <View style={styles.recipeInfo}>
              <View style={styles.recipeInfoItem}>
                <Ionicons name="time" size={16} color="white" />
                <Text style={styles.recipeInfoText}>{recipeData.time}</Text>
              </View>
              <View style={styles.recipeInfoItem}>
                <Ionicons name="people" size={16} color="white" />
                <Text style={styles.recipeInfoText}>{recipeData.servings}</Text>
              </View>
            </View>
          </LinearGradient>
        </View>

        {/* Ingredients Section */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Bahan-bahan:</Text>
          
          {recipeData.ingredients.map((ingredient, index) => (
            <View key={index} style={styles.ingredientItem}>
              <View style={styles.ingredientBullet} />
              <Text style={styles.ingredientText}>{ingredient}</Text>
            </View>
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
  recipeHeader: {
    position: 'relative',
    marginBottom: 20,
  },
  recipeImage: {
    width: '100%',
    height: 250,
    resizeMode: 'cover',
  },
  recipeOverlay: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    padding: 20,
  },
  recipeName: {
    fontSize: 24,
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
  section: {
    backgroundColor: 'white',
    padding: 20,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 15,
  },
  ingredientItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  ingredientBullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#FFA726',
    marginTop: 8,
    marginRight: 15,
  },
  ingredientText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
  },
});