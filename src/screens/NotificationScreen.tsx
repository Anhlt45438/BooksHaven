import React, {useEffect, useState} from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Button,
} from 'react-native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getAccessToken} from '../redux/storageHelper.ts';
import {useFocusEffect, useNavigation} from '@react-navigation/native';
import {fetchCart} from '../redux/cartSlice.tsx';
import notifee from '@notifee/react-native';

const NotificationScreen = () => {
  const [notification, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const dispatch = useAppDispatch();
  const navigation = useNavigation();
  const [messagesCount, setMessagesCount] = useState();
  const user = useAppSelector(state => state.user.user);

  // const accessToken = useAppSelector(state => state.user.user);
  // console.log('a',accessToken);

  useFocusEffect(
    React.useCallback(() => {
      const intervalId = setInterval(async () => {
        const accessToken = await getAccessToken();

        try {
          const response = await fetch(
            'http://14.225.206.60:3000/api/conversations?page=1&limit=20',
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${accessToken}`,
              },
            },
          );

          if (!response.ok) {
            throw new Error('Lỗi khi tải tin nhắn');
          }

          const data = await response.json();
          const sortedMessages = data.data.sort((a, b) => {
            return (
              new Date(b.ngay_cap_nhat).getTime() -
              new Date(a.ngay_cap_nhat).getTime()
            );
          });

          // Đếm số lượng tin nhắn chưa đọc (nguoi_nhan_da_doc = false và không phải người gửi)
          const readMessagesCount = sortedMessages.filter(
            message =>
              message.nguoi_nhan_da_doc === false &&
              message.id_nguoi_gui_cuoi !== user._id,
          ).length;

          setMessagesCount(readMessagesCount); // Cập nhật số tin nhắn chưa đọc
        } catch (err) {
          setError(err.message);
        }
      }, 2000); // Đặt thời gian lặp lại là 5 giây

      // Dọn dẹp khi component unmount
      return () => clearInterval(intervalId);
    }, []),
  );

  const cartItemCount = useAppSelector(state => state.cart.totalItems);
  useFocusEffect(
    React.useCallback(() => {
      dispatch(fetchCart());
    }, []),
  );

  useFocusEffect(
    React.useCallback(() => {
      fetchNotification();
    }, []),
  );

  const fetchNotification = async () => {
    const accessToken = await getAccessToken();
    try {
      console.log(accessToken);
      if (!accessToken) {
        console.error('❌ Không có accessToken, hãy đăng nhập lại!');
        return;
      }

      console.log('📢 Token đang sử dụng:', accessToken);

      const response = await fetch(
        'http://14.225.206.60:3000/api/notifications/user-notifications?page=1&limit=10',
        {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${accessToken.trim()}`,
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      );

      if (!response.ok) {
        throw new Error(`Lỗi API: ${response.status} - ${response.statusText}`);
      }

      const data = await response.json();
      setNotifications(data.data);
    } catch (error) {
      console.error('❌ Lỗi khi gọi API:', error.message);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };
  const onRefresh = () => {
    setRefreshing(true); // Bật trạng thái refreshing
    fetchNotification(); // Gọi lại API
  };

  //   async function onDisplayNotification() {
  //     // Request permissions (required for iOS)
  //     await notifee.requestPermission()

  //     // Create a channel (required for Android)
  //     const channelId = await notifee.createChannel({
  //       id: 'default',
  //       name: 'Default Channel',
  //     });

  //     // Display a notification
  //     await notifee.displayNotification({
  //       title: 'Notification Title',
  //       body: 'Main body content of the notification',
  //       android: {
  //         channelId,
  //         smallIcon: 'ic_launcher', // optional, defaults to 'ic_launcher'.
  //         // pressAction is needed if you want the notification to open the app when pressed
  //         pressAction: {
  //           id: 'default',
  //         },
  //       },
  //     });
  //   }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity
            onPress={() =>
              navigation.navigate('HomeTabBottom', {screen: 'ShopcartScreen'})
            }>
            <Image
              source={require('../assets/image/shoppingcart.jpg')}
              style={styles.icon}
            />
            {cartItemCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{cartItemCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          <TouchableOpacity onPress={() => navigation.navigate('Message')}>
            <Image
              source={require('../assets/image/conversation.png')}
              style={styles.icon}
            />
            {messagesCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{messagesCount}</Text>
              </View>
            )}
          </TouchableOpacity>
          {/* <Button title="Display Notification" onPress={() => onDisplayNotification()} /> */}
        </View>
      </View>
      {/* Hiển thị loading khi đang fetch dữ liệu */}
      {loading ? (
        <Text style={styles.loadingText}>Đang tải...</Text>
      ) : (
        <FlatList
          data={notification}
          keyExtractor={item => item.id_thong_bao.toString()}
          renderItem={({item}) => (
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
          refreshing={refreshing} // Trạng thái loading khi kéo xuống
          onRefresh={onRefresh}
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
    elevation: 3,
  },
  loadingText: {textAlign: 'center', marginTop: 20, fontSize: 16},
  headerTitle: {fontSize: 20, fontWeight: 'bold', color: '#333'},
  headerIcons: {flexDirection: 'row', gap: 15},
  badge: {
    position: 'absolute',
    top: -3,
    right: 2,
    backgroundColor: '#ff4242',
    borderRadius: 10,
    width: 13,
    height: 13,
    justifyContent: 'center',
    alignItems: 'center',
  },
  badgeText: {
    color: 'white',
    fontSize: 10,
    fontWeight: 'bold',
  },
  card: {
    backgroundColor: '#fff',
    padding: 10,
    marginVertical: 5,
    borderRadius: 10,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  orderItem: {flexDirection: 'row', alignItems: 'center'},
  icon: {width: 24, height: 24, marginRight: 10},
  image: {width: 50, height: 50, borderRadius: 10, marginRight: 10},
  textContainer: {flex: 1},
  title: {fontSize: 16, fontWeight: 'bold'},
  message: {fontSize: 14, color: '#757575'},
  countBubble: {
    backgroundColor: 'red',
    borderRadius: 10,
    paddingHorizontal: 6,
    alignSelf: 'center',
  },
  countText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
});

export default NotificationScreen;
