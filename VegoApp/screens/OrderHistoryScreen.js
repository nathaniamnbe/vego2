"use client"

import { useState } from "react"
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, StatusBar, FlatList } from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

export default function OrderHistoryScreen({ navigation }) {
  // Data dummy untuk order history
  const [orderHistory] = useState([
    {
      id: "ORD001",
      restaurantName: "Warung Padang Vegan",
      date: "2024-01-15",
      time: "14:30",
      status: "Completed",
      total: 45000,
      items: [
        { name: "Nasi Padang", quantity: 1, price: 25000 },
        { name: "Rendang Vegan", quantity: 1, price: 20000 }
      ]
    },
    {
      id: "ORD002", 
      restaurantName: "Bakso Malang Vegan",
      date: "2024-01-14",
      time: "19:15",
      status: "Completed",
      total: 32000,
      items: [
        { name: "Bakso Spesial", quantity: 2, price: 16000 }
      ]
    },
    {
      id: "ORD003",
      restaurantName: "Ayam Geprek Vegan",
      date: "2024-01-13", 
      time: "12:45",
      status: "Cancelled",
      total: 28000,
      items: [
        { name: "Ayam Geprek Level 3", quantity: 1, price: 18000 },
        { name: "Es Teh Manis", quantity: 1, price: 5000 },
        { name: "Kerupuk", quantity: 1, price: 5000 }
      ]
    },
    {
      id: "ORD004",
      restaurantName: "Sate Ayam Vgean",
      date: "2024-01-12",
      time: "18:20",
      status: "Completed", 
      total: 55000,
      items: [
        { name: "Sate Ayam Vegan", quantity: 20, price: 2500 },
        { name: "Lontong", quantity: 1, price: 5000 }
      ]
    },
  ])

  const getStatusColor = (status) => {
    switch (status) {
      case "Completed":
        return "#4CAF50"
      case "Cancelled":
        return "#F44336"
      case "Processing":
        return "#FF9800"
      default:
        return "#666"
    }
  }

  const getStatusText = (status) => {
    switch (status) {
      case "Completed":
        return "Selesai"
      case "Cancelled":
        return "Dibatalkan"
      case "Processing":
        return "Diproses"
      default:
        return status
    }
  }

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long', 
      year: 'numeric'
    })
  }

  const renderOrderItem = ({ item }) => (
    <TouchableOpacity style={styles.orderCard}>
      <View style={styles.orderHeader}>
        <View style={styles.orderInfo}>
          <Text style={styles.restaurantName}>{item.restaurantName}</Text>
          <Text style={styles.orderDate}>{formatDate(item.date)} • {item.time}</Text>
          <Text style={styles.orderId}>Order ID: {item.id}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: getStatusColor(item.status) }]}>
            {getStatusText(item.status)}
          </Text>
        </View>
      </View>

      <View style={styles.itemsContainer}>
        {item.items.map((orderItem, index) => (
          <View key={index} style={styles.itemRow}>
            <Text style={styles.itemName}>
              {orderItem.quantity}x {orderItem.name}
            </Text>
            <Text style={styles.itemPrice}>
              {formatCurrency(orderItem.price * orderItem.quantity)}
            </Text>
          </View>
        ))}
      </View>

      <View style={styles.orderFooter}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total Pembayaran:</Text>
          <Text style={styles.totalAmount}>{formatCurrency(item.total)}</Text>
        </View>
        
        <View style={styles.actionButtons}>
          {item.status === "Completed" && (
            <TouchableOpacity style={styles.reorderButton}>
              <Ionicons name="refresh-outline" size={16} color="#FFA726" />
              <Text style={styles.reorderText}>Pesan Lagi</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity style={styles.detailButton}>
            <Text style={styles.detailText}>Lihat Detail</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  )

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#FFA726", "#FF9800"]} style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Ionicons name="arrow-back" size={24} color="white" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Riwayat Pesanan</Text>
          <View style={{ width: 24 }} />
        </View>
      </LinearGradient>

      <View style={styles.content}>
        {orderHistory.length > 0 ? (
          <FlatList
            data={orderHistory}
            renderItem={renderOrderItem}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.listContainer}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="bag-outline" size={80} color="#ccc" />
            <Text style={styles.emptyTitle}>Belum Ada Pesanan</Text>
            <Text style={styles.emptySubtitle}>
              Anda belum memiliki riwayat pesanan. Mulai pesan makanan favorit Anda!
            </Text>
            <TouchableOpacity 
              style={styles.startOrderButton}
              onPress={() => navigation.navigate('Home')}
            >
              <Text style={styles.startOrderText}>Mulai Pesan</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5"
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "white",
    textAlign: "center"
  },
  content: {
    flex: 1
  },
  listContainer: {
    padding: 15
  },
  orderCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2
  },
  orderHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 12
  },
  orderInfo: {
    flex: 1
  },
  restaurantName: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 4
  },
  orderDate: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2
  },
  orderId: {
    fontSize: 12,
    color: "#999"
  },
  statusContainer: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    backgroundColor: "#f8f8f8"
  },
  statusText: {
    fontSize: 12,
    fontWeight: "600"
  },
  itemsContainer: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    marginBottom: 12
  },
  itemRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 6
  },
  itemName: {
    fontSize: 14,
    color: "#333",
    flex: 1
  },
  itemPrice: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500"
  },
  orderFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12
  },
  totalLabel: {
    fontSize: 14,
    color: "#333",
    fontWeight: "500"
  },
  totalAmount: {
    fontSize: 16,
    color: "#FFA726",
    fontWeight: "bold"
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 8
  },
  reorderButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#FFA726",
    backgroundColor: "transparent"
  },
  reorderText: {
    fontSize: 12,
    color: "#FFA726",
    fontWeight: "500",
    marginLeft: 4
  },
  detailButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
    backgroundColor: "#FFA726"
  },
  detailText: {
    fontSize: 12,
    color: "white",
    fontWeight: "500"
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 40
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
    marginTop: 20,
    marginBottom: 8
  },
  emptySubtitle: {
    fontSize: 14,
    color: "#666",
    textAlign: "center",
    lineHeight: 20,
    marginBottom: 30
  },
  startOrderButton: {
    backgroundColor: "#FFA726",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8
  },
  startOrderText: {
    fontSize: 16,
    color: "white",
    fontWeight: "600"
  }
})
