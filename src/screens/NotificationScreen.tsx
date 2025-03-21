import React, { useEffect, useState } from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { useAppSelector } from '../redux/hooks';




const NotificationScreen = () => {
    const [notification, setNotifications] = useState([]);
const [loading, setLoading] = useState(true);
const accessToken = useAppSelector(state => state.user.user?.accessToken);

useEffect(() => {
    fetchNotification();
    console.log(accessToken);
    
  }, []);

  const fetchNotification = async () => {
    try {
      if (!accessToken) {
        console.error("❌ Không có accessToken, hãy đăng nhập lại!");
        return;
      }
  
      console.log("📢 Token đang sử dụng:", accessToken);
  
      const response = await fetch(
        "http://14.225.206.60:3000/api/notifications/user-notifications?page=1&limit=10",
        {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${accessToken.trim()}`,
            "Content-Type": "application/json",
            "Accept": "application/json"
          },
        }
      );
  
      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }
  
      const data = await response.json();
      console.log("✅ Dữ liệu từ API:", data);
      setNotifications(data.data);
    } catch (error) {
      console.error("❌ Lỗi khi gọi API:", error.message);
    } finally {
      setLoading(false);
    }
  };
  
  
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/image/shoppingcart.jpg')}
                            style={styles.icon}
                        />
                        <View style={styles.badge}><Text style={styles.badgeText}>16</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/image/conversation.png')}
                            style={styles.icon}
                        />
                        <View style={styles.badge}><Text style={styles.badgeText}>9</Text></View>
                    </TouchableOpacity>
                </View>
            </View>
             {/* Hiển thị loading khi đang fetch dữ liệu */}
      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : (
        <FlatList
          data={notification}
          keyExtractor={(item) => item.id_thong_bao.toString()}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <View style={styles.notificationItem}>
                 <Image
                                source={require('../assets/images/logo.png')}
                                style={styles.icon}
                                
                            />
                
                <View style={styles.textContainer}>
                  <Text style={styles.title}>Thông báo</Text>
                  <Text style={styles.message}>{item.noi_dung_thong_bao}</Text>
                </View>
              </View>
            </View>
          )}
        />
      )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#f5f5f5'},
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 3
    },
    loadingText: { textAlign: "center", marginTop: 20, fontSize: 16 },
    headerTitle: {fontSize: 20, fontWeight: 'bold', color: '#333'},
    headerIcons: {flexDirection: 'row', gap: 15},
    badge: {position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 6},
    badgeText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
    card: {backgroundColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 10},
    notificationItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
    orderItem: {flexDirection: 'row', alignItems: 'center'},
    icon: {width: 50, height: 50,marginRight: 10},
    image: {width: 50, height: 50, borderRadius: 10, marginRight: 10},
    textContainer: {flex: 1},
    title: {fontSize: 16, fontWeight: 'bold'},
    message: {fontSize: 14, color: '#757575'},
    countBubble: {backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 6, alignSelf: 'center'},
    countText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
});

export default NotificationScreen;