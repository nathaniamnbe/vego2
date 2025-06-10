import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

class NotificationService {
  constructor() {
    this.expoPushToken = null;
  }

  async registerForPushNotificationsAsync() {
    let token;

    if (Platform.OS === 'android') {
      await Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
      });
    }

    if (Device.isDevice) {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;
      
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        alert('Gagal mendapatkan izin untuk push notifications!');
        return;
      }
      
      token = (await Notifications.getExpoPushTokenAsync()).data;
      console.log('Push Token:', token);
    } else {
      alert('Must use physical device for Push Notifications');
    }

    this.expoPushToken = token;
    return token;
  }

  async sendLocalNotification(title, body, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: 'default',
      },
      trigger: { seconds: 1 },
    });
  }

  async scheduleNotification(title, body, seconds, data = {}) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: title,
        body: body,
        data: data,
        sound: 'default',
      },
      trigger: { seconds: seconds },
    });
  }

  async cancelAllNotifications() {
    await Notifications.cancelAllScheduledNotificationsAsync();
  }

  async sendOrderNotification(orderStatus, orderDetails) {
    const notifications = {
      'order_placed': {
        title: '🍽️ Pesanan Berhasil!',
        body: `Pesanan Anda telah diterima. Estimasi: ${orderDetails.estimatedTime} menit`
      },
      'order_preparing': {
        title: '👨‍🍳 Sedang Dimasak',
        body: 'Chef sedang menyiapkan makanan vegan lezat Anda!'
      },
      'order_ready': {
        title: '✅ Pesanan Siap!',
        body: 'Makanan Anda sudah siap untuk diambil atau diantar'
      },
      'order_delivered': {
        title: '🚚 Pesanan Tiba!',
        body: 'Selamat menikmati makanan vegan Anda!'
      }
    };

    const notification = notifications[orderStatus];
    if (notification) {
      await this.sendLocalNotification(
        notification.title,
        notification.body,
        { orderStatus, ...orderDetails }
      );
    }
  }

  async sendRecipeNotification(recipeName) {
    await this.sendLocalNotification(
      '📖 Resep Baru!',
      `Resep "${recipeName}" telah ditambahkan ke Recipe Book`,
      { type: 'new_recipe', recipeName }
    );
  }

  async sendForumNotification(message, username) {
    await this.sendLocalNotification(
      '💬 Pesan Forum Baru',
      `${username}: ${message.substring(0, 50)}...`,
      { type: 'forum_message', username, message }
    );
  }

  async sendNearbyRestaurantNotification(restaurantName, distance) {
    await this.sendLocalNotification(
      '📍 Restoran Vegan Terdekat',
      `${restaurantName} hanya ${distance}km dari lokasi Anda!`,
      { type: 'nearby_restaurant', restaurantName, distance }
    );
  }
}

export default new NotificationService();