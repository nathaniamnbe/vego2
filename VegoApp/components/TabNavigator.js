import { createBottomTabNavigator } from "@react-navigation/bottom-tabs"
import { createStackNavigator } from "@react-navigation/stack"
import { Ionicons } from "@expo/vector-icons"

import HomeScreen from "../screens/HomeScreen"
import PromoScreen from "../screens/PromoScreen"
import PaymentScreen from "../screens/PaymentScreen"
import ProfileScreen from "../screens/ProfileScreen"
import AddressScreen from "../screens/AddressScreen" // Import AddressScreen
import OrderScreen from "../screens/OrderScreen"
import RestaurantDetailScreen from "../screens/RestaurantDetailScreen"
import MenuDetailScreen from "../screens/MenuDetailScreen"
import CheckoutScreen from "../screens/CheckoutScreen"
import NearYouScreen from "../screens/NearYouScreen"
import RecipeScreen from "../screens/RecipeScreen"
import RecipeDetailScreen from "../screens/RecipeDetailScreen"
import ForumScreen from "../screens/ForumScreen"
import WriteReviewScreen from "../screens/WriteReviewScreen"
import CartScreen from "../screens/CartScreen"
import OrderHistoryScreen from "../screens/OrderHistoryScreen"

const Tab = createBottomTabNavigator()
const Stack = createStackNavigator()

// Stack navigator untuk tab Home
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="HomeMain" component={HomeScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="MenuDetail" component={MenuDetailScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="NearYou" component={NearYouScreen} />
      <Stack.Screen name="Recipe" component={RecipeScreen} />
      <Stack.Screen name="RecipeDetail" component={RecipeDetailScreen} />
      <Stack.Screen name="Forum" component={ForumScreen} />
      <Stack.Screen name="WriteReview" component={WriteReviewScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  )
}

// Stack navigator untuk tab Promo
function PromoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="PromoMain" component={PromoScreen} />
      <Stack.Screen name="RestaurantDetail" component={RestaurantDetailScreen} />
      <Stack.Screen name="Cart" component={CartScreen} />
    </Stack.Navigator>
  )
}

// Stack navigator untuk tab Profile
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="ProfileMain" component={ProfileScreen} />
      <Stack.Screen name="AddressScreen" component={AddressScreen} />
      <Stack.Screen name="OrderHistoryScreen" component={OrderHistoryScreen} />
    </Stack.Navigator>
  )
}

export default function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        /* ---------- ikon ---------- */
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "Home") iconName = focused ? "home" : "home-outline"
          else if (route.name === "Promo") iconName = focused ? "pricetag" : "pricetag-outline"
          else if (route.name === "Payment") iconName = focused ? "card" : "card-outline"
          else if (route.name === "Profile") iconName = focused ? "person" : "person-outline"

          return <Ionicons name={iconName} size={size} color={color} />
        },

        /* ---------- warna & efek ---------- */
        tabBarActiveTintColor: "#FFFFFF", // ikon + label saat aktif
        tabBarInactiveTintColor: "#FFFFFF", // ikon + label saat tidak aktif
        /**  ⬆ jika ingin sedikit dibedakan, ganti jadi rgba(255,255,255,0.7) */

        tabBarPressColor: "rgba(255,255,255,0.15)", // ripple Android (supaya tidak "hilang")

        /* ---------- style bar ---------- */
        tabBarStyle: {
          backgroundColor: "#FFA726",
          height: 60,
          paddingBottom: 5,
          borderTopWidth: 0, // hilangkan garis atas default
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "500",
        },
        headerShown: false,
      })}
    >
      <Tab.Screen name="Home" component={HomeStack} />
      <Tab.Screen name="Promo" component={PromoStack} />
      <Tab.Screen name="Payment" component={PaymentScreen} />
      <Tab.Screen name="Profile" component={ProfileStack} />
    </Tab.Navigator>
  )
}
