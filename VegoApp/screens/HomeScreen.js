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
} from "react-native"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"

const { width } = Dimensions.get("window")

export default function HomeScreen({ navigation }) {
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Header */}
      <LinearGradient colors={["#FFA726", "#FF9800"]} style={styles.header}>
        <View style={styles.headerTop}>
          <Text style={styles.logo}>Vego</Text>
          <View style={styles.headerIcons}>
            <TouchableOpacity style={styles.cartButton} onPress={() => navigation.navigate("Cart")}>
              <Ionicons name="cart" size={28} color="white" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>3</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.searchContainer}>
          <TextInput style={styles.searchInput} placeholder="What are you looking for?" placeholderTextColor="#999" />
          <TouchableOpacity style={styles.searchButton}>
            <Ionicons name="search" size={20} color="#FFA726" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Banner */}
        <View style={styles.bannerContainer}>
          <Image
            source={{ uri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" }}
            style={styles.bannerImage}
          />
          <View style={styles.bannerDots}>
            <View style={[styles.dot, styles.activeDot]} />
            <View style={styles.dot} />
            <View style={styles.dot} />
          </View>
        </View>

        {/* Menu Options */}
        <View style={styles.menuGrid}>
          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Order")}>
            <View style={[styles.menuIcon, { backgroundColor: "#4CAF50" }]}>
              <Ionicons name="restaurant" size={24} color="white" />
            </View>
            <Text style={styles.menuText}>Online Order</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("NearYou")}>
            <View style={[styles.menuIcon, { backgroundColor: "#8BC34A" }]}>
              <Ionicons name="location" size={24} color="white" />
            </View>
            <Text style={styles.menuText}>Restaurant Near You</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Recipe")}>
            <View style={[styles.menuIcon, { backgroundColor: "#4CAF50" }]}>
              <Ionicons name="book" size={24} color="white" />
            </View>
            <Text style={styles.menuText}>Recipe Book</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate("Forum")}>
            <View style={[styles.menuIcon, { backgroundColor: "#8BC34A" }]}>
              <Ionicons name="chatbubbles" size={24} color="white" />
            </View>
            <Text style={styles.menuText}>Forum Chat</Text>
          </TouchableOpacity>
        </View>

        {/* From the Vegans Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>From the Vegans</Text>
            <TouchableOpacity>
              <Text style={styles.viewAll}>View All</Text>
            </TouchableOpacity>
          </View>

          <Image
            source={{ uri: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400" }}
            style={styles.veganImage}
          />
        </View>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    paddingTop: 50,
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  logo: {
    fontSize: 28,
    fontWeight: "bold",
    color: "white",
    fontStyle: "italic",
  },
  headerIcons: {
    flexDirection: "row",
  },
  cartButton: {
    position: "relative",
    padding: 5,
  },
  cartBadge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: "#FF5722",
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  cartBadgeText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
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
  bannerContainer: {
    margin: 20,
    borderRadius: 15,
    overflow: "hidden",
  },
  bannerImage: {
    width: "100%",
    height: 150,
    resizeMode: "cover",
  },
  bannerDots: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,255,255,0.5)",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "white",
  },
  menuGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    paddingHorizontal: 20,
    justifyContent: "space-between",
  },
  menuItem: {
    width: (width - 60) / 2,
    backgroundColor: "white",
    borderRadius: 15,
    padding: 20,
    alignItems: "center",
    marginBottom: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  menuIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
  },
  menuText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
    color: "#333",
  },
  section: {
    paddingHorizontal: 20,
    marginTop: 20,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  viewAll: {
    fontSize: 14,
    color: "#FFA726",
  },
  veganImage: {
    width: "100%",
    height: 120,
    borderRadius: 15,
    resizeMode: "cover",
  },
})
