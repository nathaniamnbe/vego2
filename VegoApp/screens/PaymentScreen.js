import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  StatusBar,
  Dimensions
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function PaymentScreen({ navigation }) {
  const [selectedBank, setSelectedBank] = useState(null);

  const paymentMethods = [
    { id: 1, name: 'Transfer Bank', icon: 'card-outline' },
    { id: 2, name: 'Alfamart', icon: 'storefront-outline' },
    { id: 3, name: 'Indomaret', icon: 'storefront-outline' },
    { id: 4, name: 'Mitra Vego', icon: 'people-outline' }
  ];

  const banks = [
  ];

  const transactions = [
    {
      id: 1,
      type: 'order',
      title: 'Nasi Goreng Kucing Bu Marni, Tangerang',
      subtitle: 'Jl. Scientia Boulevard No 11',
      amount: '-Rp. 50.000',
      date: 'Rabu, 01 Mei 2024',
      status: 'completed'
    },
    {
      id: 2,
      type: 'order',
      title: 'Rujak Buah Luffy, Jakarta Timur',
      subtitle: 'Jl. Kebon jeruk No 5, Priok',
      amount: '-Rp. 52.000',
      date: 'Rabu, 01 Mei 2024',
      status: 'completed'
    },
    {
      id: 3,
      type: 'refund',
      title: 'Ketoprak Jas (cabang golden dawn), Serpong',
      subtitle: 'Dibatalkan & salah di-refund',
      amount: '-Rp. 50.000',
      date: 'Rabu, 01 Mei 2024',
      status: 'refunded'
    }
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
          <Text style={styles.headerTitle}>Payment</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.vCashCard}>
          <View style={styles.vCashHeader}>
            <Text style={styles.vCashTitle}>VEGAN Cash</Text>
            <Text style={styles.vCashLogo}>Vcash</Text>
          </View>
          <Text style={styles.vCashLabel}>Total Saldo</Text>
          <Text style={styles.vCashAmount}>Rp. 100.000,00</Text>
          <Text style={styles.vCashType}>Basic</Text>
          
          <View style={styles.vCashActions}>
            <TouchableOpacity style={styles.vCashAction}>
              <Ionicons name="add-circle" size={24} color="white" />
              <Text style={styles.vCashActionText}>Top up</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.vCashAction}>
              <Ionicons name="swap-horizontal" size={24} color="white" />
              <Text style={styles.vCashActionText}>Transfer</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.vCashAction}>
              <Ionicons name="card" size={24} color="white" />
              <Text style={styles.vCashActionText}>ATM</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Top Up V-Cash</Text>
          
          <View style={styles.paymentMethodsContainer}>
            {paymentMethods.map((method) => (
              <TouchableOpacity
                key={method.id}
                style={styles.paymentMethod}
                onPress={() => setSelectedBank(method.id)}
              >
                <Ionicons name={method.icon} size={20} color="#FFA726" />
                <Text style={styles.paymentMethodText}>{method.name}</Text>
                <Ionicons name="chevron-down" size={20} color="#666" />
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.bankContainer}>
            {banks.map((bank) => (
              <TouchableOpacity
                key={bank.id}
                style={[
                  styles.bankItem,
                  selectedBank === bank.id && styles.selectedBank
                ]}
                onPress={() => setSelectedBank(bank.id)}
              >
                <Ionicons name={bank.icon} size={20} color="#666" />
                <Text style={styles.bankText}>{bank.name}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>History Pembayaran :</Text>
          <Text style={styles.historyDate}>Rabu, 01 Mei 2024</Text>
          
          {transactions.map((transaction) => (
            <View key={transaction.id} style={styles.transactionItem}>
              <View style={styles.transactionIcon}>
                <Ionicons 
                  name={transaction.type === 'order' ? 'bag' : 'refresh'} 
                  size={20} 
                  color={transaction.type === 'order' ? '#FFA726' : '#666'} 
                />
              </View>
              <View style={styles.transactionInfo}>
                <Text style={styles.transactionTitle}>{transaction.title}</Text>
                <Text style={styles.transactionSubtitle}>{transaction.subtitle}</Text>
              </View>
              <Text style={[
                styles.transactionAmount,
                transaction.status === 'refunded' && styles.refundedAmount
              ]}>
                {transaction.amount}
              </Text>
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
  vCashCard: {
    backgroundColor: '#4CAF50',
    marginHorizontal: 20,
    marginVertical: 20,
    borderRadius: 15,
    padding: 20,
  },
  vCashHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  vCashTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
  },
  vCashLogo: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    fontStyle: 'italic',
  },
  vCashLabel: {
    fontSize: 12,
    color: 'white',
    opacity: 0.8,
    marginBottom: 5,
  },
  vCashAmount: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  vCashType: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  vCashActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  vCashAction: {
    alignItems: 'center',
  },
  vCashActionText: {
    fontSize: 12,
    color: 'white',
    marginTop: 5,
  },
  section: {
    backgroundColor: 'white',
    marginBottom: 10,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFA726',
    marginBottom: 15,
  },
  paymentMethodsContainer: {
    marginBottom: 20,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  paymentMethodText: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    marginLeft: 15,
  },
  bankContainer: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 15,
  },
  bankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 8,
    marginBottom: 8,
  },
  selectedBank: {
    backgroundColor: '#FFF3E0',
  },
  bankText: {
    fontSize: 14,
    color: '#333',
    marginLeft: 15,
  },
  historyDate: {
    fontSize: 14,
    color: '#FFA726',
    marginBottom: 15,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#f8f8f8',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  transactionInfo: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#333',
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 12,
    color: '#666',
  },
  transactionAmount: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#F44336',
  },
  refundedAmount: {
    color: '#666',
  },
});