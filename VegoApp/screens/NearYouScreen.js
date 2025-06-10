import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';

const { width, height } = Dimensions.get('window');

export default function NearYouScreen({ navigation }) {
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);
    })();
  }, []);

  const restaurants = [
    {
      id: 1,
      name: 'Resto Salad Sayur',
      rating: 4.8,
      time: '20 MINS',
      distance: '1.5 km',
      tags: ['Best Resto', 'Cheap'],
      coordinate: {
        latitude: -6.2088,
        longitude: 106.8456,
      },
    },
    {
      id: 2,
      name: 'RM. Vegan Indo',
      rating: 4.7,
      time: '20 MINS',
      distance: '1.5 km',
      tags: ['Near You', 'Recommend'],
      coordinate: {
        latitude: -6.2000,
        longitude: 106.8400,
      },
    },
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      <LinearGradient
        colors={['#FFA726', '#FF9800']}
        style={styles.header}
      >
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Near You</Text>
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
        <View style={styles.locationInfo}>
          <Ionicons name="location" size={20} color="#F44336" />
          <Text style={styles.locationText}>Tangerang Selatan, Indonesia</Text>
        </View>

        <View style={styles.mapContainer}>
          {location ? (
            <MapView
              style={styles.map}
              initialRegion={{
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
              }}
            >
              <Marker
                coordinate={{
                  latitude: location.coords.latitude,
                  longitude: location.coords.longitude,
                }}
                title="Your Location"
                pinColor="blue"
              />
              {restaurants.map((restaurant) => (
                <Marker
                  key={restaurant.id}
                  coordinate={restaurant.coordinate}
                  title={restaurant.name}
                  description={`${restaurant.rating} ⭐ • ${restaurant.distance}`}
                />
              ))}
            </MapView>
          ) : (
            <View style={styles.mapPlaceholder}>
              <Text style={styles.mapPlaceholderText}>Loading map...</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Restaurant Near You</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCard}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
              >
                <View style={styles.restaurantImage}>
                  <Text style={styles.restaurantEmoji}>🥗</Text>
                </View>
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

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Near Tangerang Selatan</Text>
          
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {restaurants.map((restaurant) => (
              <TouchableOpacity
                key={restaurant.id}
                style={styles.restaurantCard}
                onPress={() => navigation.navigate('RestaurantDetail', { restaurant })}
              >
                <View style={styles.restaurantImage}>
                  <Text style={styles.restaurantEmoji}>🥗</Text>
                </View>
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
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 10,
  },
  locationText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 10,
    fontWeight: '500',
  },
  mapContainer: {
    height: 200,
    backgroundColor: 'white',
    marginBottom: 10,
  },
  map: {
    flex: 1,
  },
  mapPlaceholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  mapPlaceholderText: {
    fontSize: 16,
    color: '#666',
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
    backgroundColor: '#E8F5E8',
    justifyContent: 'center',
    alignItems: 'center',
  },
  restaurantEmoji: {
    fontSize: 40,
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