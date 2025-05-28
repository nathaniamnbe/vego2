import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';

export default function ProfileScreen({ navigation }) {
  const [isEditing, setIsEditing] = useState(false);
  const [image, setImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: 'Nathan',
    email: 'nathan@gmail.com',
    phone: '081215841253',
    birthDate: '01 / 2 / 3004'
  });

  const menuItems = [
    { icon: 'person-outline', title: 'Your Profile', color: '#FFA726' },
    { icon: 'location-outline', title: 'Address', color: '#FFA726' },
    { icon: 'card-outline', title: 'Payment Method', color: '#FFA726' },
    { icon: 'bag-outline', title: 'Order', color: '#FFA726' },
    { icon: 'notifications-outline', title: 'Notification', color: '#FFA726' },
    { icon: 'settings-outline', title: 'Setting', color: '#FFA726' },
    { icon: 'help-circle-outline', title: 'Help Center', color: '#FFA726' },
    { icon: 'log-out-outline', title: 'Log out', color: '#F44336' }
  ];

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Sorry, we need camera roll permissions to make this work!');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
      Alert.alert('Success', 'Profile picture updated!');
    }
  };

  const handleSave = () => {
    setIsEditing(false);
    Alert.alert('Success', 'Profile updated successfully!');
  };

  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Logout', style: 'destructive', onPress: () => {
          Alert.alert('Logged out', 'You have been logged out successfully');
        }}
      ]
    );
  };

  if (isEditing) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" />
        <LinearGradient colors={['#FFA726', '#FF9800']} style={styles.header}>
          <View style={styles.headerTop}>
            <TouchableOpacity onPress={() => setIsEditing(false)}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>My Profile</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.applyText}>Apply</Text>
            </TouchableOpacity>
          </View>
        </LinearGradient>

        <ScrollView style={styles.content}>
          <View style={styles.profilePictureContainer}>
            <TouchableOpacity style={styles.profilePicture} onPress={pickImage}>
              {image ? (
                <Image source={{ uri: image }} style={styles.profilePictureImage} />
              ) : (
                <Ionicons name="person" size={60} color="white" />
              )}
            </TouchableOpacity>
            <Text style={styles.profileName}>{profileData.name}</Text>
          </View>

          <View style={styles.formContainer}>
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Name</Text>
              <TextInput
                style={styles.input}
                value={profileData.name}
                onChangeText={(text) => setProfileData({...profileData, name: text})}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email</Text>
              <TextInput
                style={styles.input}
                value={profileData.email}
                onChangeText={(text) => setProfileData({...profileData, email: text})}
                keyboardType="email-address"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={profileData.phone}
                onChangeText={(text) => setProfileData({...profileData, phone: text})}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Birth Date</Text>
              <TextInput
                style={styles.input}
                value={profileData.birthDate}
                onChangeText={(text) => setProfileData({...profileData, birthDate: text})}
              />
            </View>
          </View>
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#FFA726', '#FF9800']} style={styles.header}>
        <Text style={styles.headerTitle}>Profile</Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.profileContainer}>
          <View style={styles.profileInfo}>
            <View style={styles.avatar}>
              {image ? (
                <Image source={{ uri: image }} style={styles.avatarImage} />
              ) : (
                <Ionicons name="person" size={30} color="white" />
              )}
            </View>
            <View style={styles.profileText}>
              <Text style={styles.profileName}>{profileData.name}</Text>
              <Text style={styles.profileBalance}>Rp 100.000</Text>
              <TouchableOpacity>
                <Text style={styles.changeText}>Ubah</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={styles.menuSection}>
          <Text style={styles.menuSectionTitle}>Akun</Text>

          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={index}
              style={styles.menuItem}
              onPress={() => {
                if (item.title === 'Your Profile') {
                  setIsEditing(true);
                } else if (item.title === 'Log out') {
                  handleLogout();
                } else {
                  Alert.alert('Feature', `${item.title} feature coming soon!`);
                }
              }}
            >
              <View style={styles.menuItemLeft}>
                <Ionicons name={item.icon} size={24} color={item.color} />
                <Text style={[styles.menuItemText, { color: item.color }]}>
                  {item.title}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#ccc" />
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { paddingTop: 50, paddingBottom: 20, paddingHorizontal: 20 },
  headerTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: 'white', textAlign: 'center' },
  applyText: { fontSize: 16, color: '#4CAF50', fontWeight: '500' },
  content: { flex: 1 },
  profileContainer: { backgroundColor: 'white', padding: 20, marginBottom: 20 },
  profileInfo: { flexDirection: 'row', alignItems: 'center' },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    overflow: 'hidden',
  },
  avatarImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  profileText: { flex: 1 },
  profileName: { fontSize: 18, fontWeight: 'bold', color: '#333', marginBottom: 5 },
  profileBalance: { fontSize: 14, color: '#666', marginBottom: 5 },
  changeText: { fontSize: 14, color: '#4CAF50', textDecorationLine: 'underline' },
  profilePictureContainer: {
    alignItems: 'center',
    paddingVertical: 30,
    backgroundColor: 'white',
    marginBottom: 20,
  },
  profilePicture: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: '#FFA726',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 15,
    overflow: 'hidden',
  },
  profilePictureImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  formContainer: { backgroundColor: 'white', padding: 20 },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 16, fontWeight: '500', color: '#FFA726', marginBottom: 8 },
  input: { borderBottomWidth: 1, borderBottomColor: '#E0E0E0', paddingVertical: 10, fontSize: 16, color: '#333' },
  menuSection: { backgroundColor: 'white', paddingVertical: 10 },
  menuSectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#FFA726', paddingHorizontal: 20, paddingVertical: 15 },
  menuItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuItemLeft: { flexDirection: 'row', alignItems: 'center' },
  menuItemText: { fontSize: 16, marginLeft: 15, fontWeight: '500' },
});
