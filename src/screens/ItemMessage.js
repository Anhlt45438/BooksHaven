import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {useAppSelector, useAppDispatch} from '../redux/hooks';
import {useNavigation} from '@react-navigation/native';
import {fetchUserData} from '../redux/userSlice';

const ItemMessage = ({item, index}) => {
  const [shop, setShop] = useState({});
  const [loading, setLoading] = useState(false);
  const [hasShopRole, setHasShopRole] = useState(false);
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const user = useAppSelector(state => state.user.user);

  useEffect(() => {
    let idUser;
    if (user._id === item.id_user_1) {
      idUser = item.id_user_2;
    } else {
      idUser = item.id_user_1;
    }

    if (idUser) {
      const fetchUserRole = async () => {
        try {
          const response = await fetch(
            `http://14.225.206.60:3000/api/users/user-info-account?user_id=${idUser}`,
            {
              method: 'GET',
              headers: {
                'Content-Type': 'application/json',
                Accept: 'application/json',
              },
            },
          );

          if (!response.ok) {
            throw new Error('Server error');
          }

          const result = await response.json();
          let isShop = false;
          for (const item of result.vai_tro) {
            if (item.ten_role === 'shop') {
              isShop = true;
              break;
            }
          }

          setHasShopRole(isShop);

          // Fetch shop details if role is 'shop'
          if (isShop) {
            const fetchShop = async () => {
              try {
                const shopResponse = await fetch(
                  `http://14.225.206.60:3000/api/shops/get-shop-info-from-user-id/${idUser}`,
                  {
                    method: 'GET',
                    headers: {
                      'Content-Type': 'application/json',
                    },
                  },
                );

                if (!shopResponse.ok) {
                  throw new Error('Lỗi khi tải tin nhắn');
                }

                const shopData = await shopResponse.json();
                setShop(shopData.data);
              } catch (err) {
                console.error(err.message);
              }
            };
            fetchShop();
          } else {
            setShop(result);
          }
        } catch (error) {
          Alert.alert('Lỗi', error.message || 'Không thể lấy dữ liệu vai trò.');
        }
      };
      fetchUserRole();
    }
  }, [item.id_user_1, item.id_user_2]);

  return (
    <TouchableOpacity
      style={styles.messageContainer}
      activeOpacity={0.7}
      onPress={() => {
        const id_conversation = item._id;
        navigation.navigate('MessageDetail', {
          shop,
          id_conversation,
          index,
        });
      }}>
      <Image
        source={
          hasShopRole
            ? shop.anh_shop &&
              (shop.anh_shop.startsWith('http') ||
                shop.anh_shop.startsWith('data:image/'))
              ? {uri: shop.anh_shop}
              : require('../assets/image/avatar.png')
            : shop.avatar &&
              (shop.avatar.startsWith('http') ||
                shop.avatar.startsWith('data:image/'))
            ? {uri: shop.avatar}
            : require('../assets/image/avatar.png')
        }
        style={styles.avatar}
      />
      <View style={styles.messageContent}>
        <Text style={styles.name}>
          {hasShopRole ? shop.ten_shop : shop.username}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginHorizontal: 10,
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            {item.id_nguoi_gui_cuoi === user._id && <Text>Bạn: </Text>}

            {item.tin_nhan_cuoi === '' ? (
              <Text style={styles.message}>Đã gửi ảnh</Text>
            ) : (
              <Text
                style={[
                  item.id_nguoi_gui_cuoi !== user._id &&
                  item.nguoi_nhan_da_doc === false
                    ? {color: 'black', fontWeight: 'bold'}
                    : styles.message,
                ]}
                numberOfLines={1}
                ellipsizeMode="tail">
                {item.tin_nhan_cuoi}
              </Text>
            )}
          </View>
          {item.id_nguoi_gui_cuoi !== user._id &&
            item.nguoi_nhan_da_doc === false && (
              <Image
                source={require('../assets/icons/cham1.png')}
                style={{width: 10, height: 10, marginLeft: 20}}
              />
            )}
          {item.id_nguoi_gui_cuoi === user._id &&
            item.nguoi_nhan_da_doc === true && (
              <Image
                source={
                  shop.anh_shop &&
                  (shop.anh_shop.startsWith('http') ||
                    shop.anh_shop.startsWith('data:image/'))
                    ? {uri: shop.anh_shop}
                    : require('../assets/image/avatar.png')
                }
                style={{width: 20, height: 20, borderRadius: 10}}
              />
            )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default ItemMessage;

const styles = StyleSheet.create({
  messageContainer: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 10,
  },
  messageContent: {
    flex: 1,
  },
  name: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  message: {
    fontSize: 14,
    color: '#666',
  },
});
