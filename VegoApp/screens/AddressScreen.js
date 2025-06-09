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
  Modal,
  KeyboardAvoidingView,
  Platform,
  Dimensions,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as Location from 'expo-location';

const { height: screenHeight } = Dimensions.get('window');

export default function AddressScreen({ navigation }) {
  const [addresses, setAddresses] = useState([
    {
      id: 1,
      label: 'Rumah',
      name: 'Nathan',
      phone: '081215841253',
      address: 'Jl. Merdeka No. 123, RT 01/RW 02',
      city: 'Jakarta Pusat',
      postalCode: '10110',
      isDefault: true,
      coordinates: {
        latitude: -6.2088,
        longitude: 106.8456,
      },
    },
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [editingAddress, setEditingAddress] = useState(null);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);
  const [formData, setFormData] = useState({
    label: '',
    name: '',
    phone: '',
    address: '',
    city: '',
    postalCode: '',
    isDefault: false,
    coordinates: null,
  });

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert(
          'Izin Lokasi',
          'Aplikasi memerlukan izin lokasi untuk fitur geotag. Anda dapat mengaktifkannya di pengaturan.'
        );
      }
    } catch (error) {
      console.error('Error requesting location permission:', error);
    }
  };

  const getCurrentLocation = async () => {
    try {
      setIsLoadingLocation(true);
      
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Error', 'Izin lokasi diperlukan untuk menggunakan fitur geotag');
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      const { latitude, longitude } = location.coords;
      
      // Reverse geocoding to get address from coordinates
      const reverseGeocode = await Location.reverseGeocodeAsync({
        latitude,
        longitude,
      });

      if (reverseGeocode.length > 0) {
        const locationInfo = reverseGeocode[0];
        const autoAddress = `${locationInfo.street || ''} ${locationInfo.streetNumber || ''}`.trim();
        const autoCity = `${locationInfo.city || locationInfo.subregion || ''}, ${locationInfo.region || ''}`.trim();
        const autoPostalCode = locationInfo.postalCode || '';

        setFormData(prev => ({
          ...prev,
          address: autoAddress || prev.address,
          city: autoCity || prev.city,
          postalCode: autoPostalCode || prev.postalCode,
          coordinates: { latitude, longitude },
        }));

        Alert.alert(
          'Lokasi Berhasil Diambil',
          `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}\n\nAlamat otomatis telah diisi berdasarkan lokasi Anda.`
        );
      } else {
        setFormData(prev => ({
          ...prev,
          coordinates: { latitude, longitude },
        }));
        
        Alert.alert(
          'Lokasi Berhasil Diambil',
          `Koordinat: ${latitude.toFixed(6)}, ${longitude.toFixed(6)}`
        );
      }
    } catch (error) {
      console.error('Error getting location:', error);
      Alert.alert('Error', 'Gagal mendapatkan lokasi. Pastikan GPS aktif dan coba lagi.');
    } finally {
      setIsLoadingLocation(false);
    }
  };

  const resetForm = () => {
    setFormData({
      label: '',
      name: '',
      phone: '',
      address: '',
      city: '',
      postalCode: '',
      isDefault: false,
      coordinates: null,
    });
  };

  const handleAddAddress = () => {
    setEditingAddress(null);
    resetForm();
    setShowAddModal(true);
  };

  const handleEditAddress = (address) => {
    setEditingAddress(address);
    setFormData(address);
    setShowAddModal(true);
  };

  const handleSaveAddress = () => {
    if (!formData.label || !formData.name || !formData.phone || !formData.address || !formData.city || !formData.postalCode) {
      Alert.alert('Error', 'Mohon lengkapi semua field yang diperlukan');
      return;
    }

    if (editingAddress) {
      // Update existing address
      setAddresses(addresses.map(addr => 
        addr.id === editingAddress.id ? { ...formData, id: editingAddress.id } : addr
      ));
      Alert.alert('Berhasil', 'Alamat berhasil diperbarui!');
    } else {
      // Add new address
      const newAddress = {
        ...formData,
        id: Date.now(),
      };
      setAddresses([...addresses, newAddress]);
      Alert.alert('Berhasil', 'Alamat berhasil ditambahkan!');
    }

    setShowAddModal(false);
    resetForm();
  };

  const handleDeleteAddress = (addressId) => {
    Alert.alert(
      'Hapus Alamat',
      'Apakah Anda yakin ingin menghapus alamat ini?',
      [
        { text: 'Batal', style: 'cancel' },
        {
          text: 'Hapus',
          style: 'destructive',
          onPress: () => {
            setAddresses(addresses.filter(addr => addr.id !== addressId));
            Alert.alert('Berhasil', 'Alamat berhasil dihapus!');
          },
        },
      ]
    );
  };

  const handleSetDefault = (addressId) => {
    setAddresses(addresses.map(addr => ({
      ...addr,
      isDefault: addr.id === addressId,
    })));
    Alert.alert('Berhasil', 'Alamat utama berhasil diubah!');
  };

  const showLocationInfo = (coordinates) => {
    if (coordinates) {
      Alert.alert(
        'Informasi Lokasi',
        `Latitude: ${coordinates.latitude.toFixed(6)}\nLongitude: ${coordinates.longitude.toFixed(6)}`,
        [
          { text: 'Tutup', style: 'cancel' },
          {
            text: 'Buka di Maps',
            onPress: () => {
              const url = Platform.select({
                ios: `maps:${coordinates.latitude},${coordinates.longitude}`,
                android: `geo:${coordinates.latitude},${coordinates.longitude}`,
              });
              Linking.openURL(url);
            },
          },
        ]
      );
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={['#FFA726', '#FF9800']} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Alamat Saya</Text>
          <TouchableOpacity onPress={handleAddAddress}>
            <Ionicons name="add" size={24} color="white" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView 
        style={styles.content} 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {addresses.map((address) => (
          <View key={address.id} style={styles.addressCard}>
            <View style={styles.addressHeader}>
              <View style={styles.labelContainer}>
                <Text style={styles.addressLabel}>{address.label}</Text>
                {address.isDefault && (
                  <View style={styles.defaultBadge}>
                    <Text style={styles.defaultText}>Utama</Text>
                  </View>
                )}
                {address.coordinates && (
                  <TouchableOpacity
                    onPress={() => showLocationInfo(address.coordinates)}
                    style={styles.locationBadge}
                  >
                    <Ionicons name="location" size={12} color="white" />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.actionButtons}>
                <TouchableOpacity
                  onPress={() => handleEditAddress(address)}
                  style={styles.actionButton}
                >
                  <Ionicons name="pencil" size={16} color="#FFA726" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleDeleteAddress(address.id)}
                  style={styles.actionButton}
                >
                  <Ionicons name="trash" size={16} color="#F44336" />
                </TouchableOpacity>
              </View>
            </View>

            <Text style={styles.addressName}>{address.name}</Text>
            <Text style={styles.addressPhone}>{address.phone}</Text>
            <Text style={styles.addressText}>
              {address.address}, {address.city} {address.postalCode}
            </Text>

            {address.coordinates && (
              <Text style={styles.coordinatesText}>
                📍 {address.coordinates.latitude.toFixed(4)}, {address.coordinates.longitude.toFixed(4)}
              </Text>
            )}

            {!address.isDefault && (
              <TouchableOpacity
                onPress={() => handleSetDefault(address.id)}
                style={styles.setDefaultButton}
              >
                <Text style={styles.setDefaultText}>Jadikan Alamat Utama</Text>
              </TouchableOpacity>
            )}
          </View>
        ))}

        <TouchableOpacity onPress={handleAddAddress} style={styles.addButton}>
          <Ionicons name="add-circle-outline" size={24} color="#FFA726" />
          <Text style={styles.addButtonText}>Tambah Alamat Baru</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Add/Edit Address Modal */}
      <Modal
        visible={showAddModal}
        animationType="slide"
        presentationStyle="pageSheet"
      >
        <KeyboardAvoidingView 
          style={styles.modalContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <LinearGradient colors={['#FFA726', '#FF9800']} style={styles.modalHeader}>
            <View style={styles.headerTop}>
              <TouchableOpacity onPress={() => setShowAddModal(false)}>
                <Ionicons name="close" size={24} color="white" />
              </TouchableOpacity>
              <Text style={styles.headerTitle}>
                {editingAddress ? 'Edit Alamat' : 'Tambah Alamat'}
              </Text>
              <TouchableOpacity onPress={handleSaveAddress}>
                <Text style={styles.saveText}>Simpan</Text>
              </TouchableOpacity>
            </View>
          </LinearGradient>

          <ScrollView 
            style={styles.modalContent}
            contentContainerStyle={styles.modalScrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.formContainer}>
              {/* Geotag Section */}
              <View style={styles.geotagSection}>
                <Text style={styles.sectionTitle}>📍 Geotag Lokasi</Text>
                <TouchableOpacity
                  onPress={getCurrentLocation}
                  style={[styles.geotagButton, isLoadingLocation && styles.geotagButtonDisabled]}
                  disabled={isLoadingLocation}
                >
                  <Ionicons 
                    name={isLoadingLocation ? "hourglass" : "location"} 
                    size={20} 
                    color="white" 
                  />
                  <Text style={styles.geotagButtonText}>
                    {isLoadingLocation ? 'Mengambil Lokasi...' : 'Ambil Lokasi Saat Ini'}
                  </Text>
                </TouchableOpacity>
                
                {formData.coordinates && (
                  <View style={styles.coordinatesDisplay}>
                    <Text style={styles.coordinatesLabel}>Koordinat Tersimpan:</Text>
                    <Text style={styles.coordinatesValue}>
                      {formData.coordinates.latitude.toFixed(6)}, {formData.coordinates.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Label Alamat *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.label}
                  onChangeText={(text) => setFormData({ ...formData, label: text })}
                  placeholder="Contoh: Rumah, Kantor, Kos"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nama Penerima *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => setFormData({ ...formData, name: text })}
                  placeholder="Masukkan nama penerima"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Nomor Telepon *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.phone}
                  onChangeText={(text) => setFormData({ ...formData, phone: text })}
                  placeholder="Masukkan nomor telepon"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Alamat Lengkap *</Text>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  value={formData.address}
                  onChangeText={(text) => setFormData({ ...formData, address: text })}
                  placeholder="Masukkan alamat lengkap (Jalan, RT/RW, Kelurahan)"
                  multiline
                  numberOfLines={3}
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kota *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.city}
                  onChangeText={(text) => setFormData({ ...formData, city: text })}
                  placeholder="Masukkan nama kota"
                />
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.inputLabel}>Kode Pos *</Text>
                <TextInput
                  style={styles.input}
                  value={formData.postalCode}
                  onChangeText={(text) => setFormData({ ...formData, postalCode: text })}
                  placeholder="Masukkan kode pos"
                  keyboardType="numeric"
                />
              </View>

              <TouchableOpacity
                style={styles.checkboxContainer}
                onPress={() => setFormData({ ...formData, isDefault: !formData.isDefault })}
              >
                <Ionicons
                  name={formData.isDefault ? 'checkbox' : 'checkbox-outline'}
                  size={24}
                  color="#FFA726"
                />
                <Text style={styles.checkboxText}>Jadikan sebagai alamat utama</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </Modal>
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
    textAlign: 'center',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 40,
  },
  addressCard: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  addressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  addressLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFA726',
    marginRight: 8,
  },
  defaultBadge: {
    backgroundColor: '#4CAF50',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
    marginRight: 4,
  },
  defaultText: {
    fontSize: 12,
    color: 'white',
    fontWeight: '500',
  },
  locationBadge: {
    backgroundColor: '#2196F3',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 10,
    marginLeft: 4,
  },
  actionButtons: {
    flexDirection: 'row',
  },
  actionButton: {
    padding: 8,
    marginLeft: 4,
  },
  addressName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  addressPhone: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  addressText: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20,
    marginBottom: 8,
  },
  coordinatesText: {
    fontSize: 12,
    color: '#2196F3',
    fontStyle: 'italic',
    marginBottom: 12,
  },
  setDefaultButton: {
    alignSelf: 'flex-start',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: '#FFA726',
    borderRadius: 6,
  },
  setDefaultText: {
    fontSize: 12,
    color: '#FFA726',
    fontWeight: '500',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    borderWidth: 2,
    borderColor: '#FFA726',
    borderStyle: 'dashed',
  },
  addButtonText: {
    fontSize: 16,
    color: '#FFA726',
    fontWeight: '500',
    marginLeft: 8,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  modalHeader: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  saveText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '500',
  },
  modalContent: {
    flex: 1,
  },
  modalScrollContent: {
    paddingBottom: 40,
  },
  formContainer: {
    backgroundColor: 'white',
    margin: 20,
    borderRadius: 12,
    padding: 20,
  },
  geotagSection: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA726',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 12,
  },
  geotagButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFA726',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  geotagButtonDisabled: {
    backgroundColor: '#ccc',
  },
  geotagButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 8,
  },
  coordinatesDisplay: {
    backgroundColor: '#e3f2fd',
    padding: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#2196F3',
  },
  coordinatesLabel: {
    fontSize: 12,
    color: '#1976D2',
    fontWeight: '500',
    marginBottom: 4,
  },
  coordinatesValue: {
    fontSize: 14,
    color: '#1976D2',
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFA726',
    marginBottom: 8,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    paddingVertical: 10,
    fontSize: 16,
    color: '#333',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    textAlignVertical: 'top',
    minHeight: 80,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 10,
  },
  checkboxText: {
    fontSize: 16,
    color: '#333',
    marginLeft: 8,
  },
});