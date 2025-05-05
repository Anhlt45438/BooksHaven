import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { getShopInfo } from '../redux/shopSlice';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack'; // Import StackNavigationProp
import { useFocusEffect } from '@react-navigation/native'; // Import useFocusEffect

type RootStackParamList = {
  MyShop: { user: any; shopData: any };
  ProductScreen: undefined;
  Statistical: undefined;
  Finance: undefined;
  EditShop: { shop: any; user: any };
  User: undefined;
  HomeTabBottom: undefined;
  QuanlydonhangShop: undefined;
};
type MyShopNavigationProp = StackNavigationProp<RootStackParamList, 'MyShop'>;

type MyShopRouteProp = RouteProp<RootStackParamList, 'MyShop'>;

interface MyShopProps {
  route: MyShopRouteProp;
  navigation: MyShopNavigationProp; // Khai báo navigation prop
}

const MyShop: React.FC<MyShopProps> = ({ route, navigation }) => {
  const dispatch = useAppDispatch();

  const user = route.params?.user || {
    _id: '',
    username: '',
    avatar: null,
    accessToken: '',
  };

  const shop = useAppSelector(state => state.shop.shop) || {
    _id: '',
    ten_shop: '',
    anh_shop: null,
    mo_ta: '',
  };
  const loading = useAppSelector(state => state.shop.loading);
  useFocusEffect(
    React.useCallback(() => {
      if (user._id) {
        const userId =
          typeof user._id === 'object' && user._id.$oid
            ? user._id.$oid
            : user._id;
        dispatch(getShopInfo(userId)); // Gửi yêu cầu để lấy thông tin shop
      }
    }, [dispatch, user._id]),
  );
  // Nếu đang tải, hiển thị ActivityIndicator
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Nếu không có dữ liệu shop hoặc có lỗi
  if (!shop) {
    return (
      <View style={{ margin: 50 }}>
        <Text>Không có dữ liệu shop.</Text>
      </View>
    );
  }
  return (
    <View style={{ flex: 1, alignItems: 'center' }}>
      <View style={styles.header}>
        <TouchableOpacity
          style={{ width: '33%' }}
          onPress={() => navigation.navigate('HomeTabBottom')}>
          <Image source={require('../assets/icons/aaa.png')} />
        </TouchableOpacity>
        <Text style={{ fontWeight: 'bold', fontSize: 20, width: '33%' }}>
          Shop của tôi
        </Text>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'flex-end',
            width: '33%',
          }}>
          <TouchableOpacity
            style={{ marginHorizontal: 3 }}
            onPress={() => navigation.navigate('EditShop', { shop, user })}>
            <Image source={require('../assets/icons/settings.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 3 }}>
            <Image source={require('../assets/icons/bell.png')} />
          </TouchableOpacity>
          <TouchableOpacity style={{ marginHorizontal: 3 }} onPress={() => {
            navigation.navigate('Message')
          }}>
            <Image source={require('../assets/icons/Vector1.png')} />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userInfo}>
        <Image
          style={{ width: 50, height: 50, borderRadius: 25, marginLeft: 20 }}
          source={
            shop.anh_shop &&
              (shop.anh_shop.startsWith('http') ||
                shop.anh_shop.startsWith('data:image/'))
              ? { uri: shop.anh_shop }
              : require('../assets/image/avatar.png')
          }
        />

        <View style={{ flexDirection: 'row', marginLeft: 20 }}>
          <View style={{ marginLeft: 10 }}>
            <Text style={styles.userName} numberOfLines={1}>
              {shop.ten_shop}
            </Text>
            <Text style={styles.userId} numberOfLines={1} ellipsizeMode="tail">
              ID: {shop._id}
            </Text>
          </View>
        </View>

        {/* <TouchableOpacity style={styles.viewShopButton}>
          <Text style={styles.viewShopText}>Xem shop</Text>
        </TouchableOpacity> */}
      </View>

      <Image
        source={require('../assets/image/imgbn1.png')}
        style={{ width: '95%', height: 120 }}
      />

      {/* Đơn hàng */}
      <View
        style={{
          backgroundColor: '#fff',
          marginVertical: 10,
          width: '95%',
          height: '14%',
          padding: 10,
        }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <Text style={{ fontWeight: 'bold', fontSize: 20 }}>Đơn hàng</Text>
          <TouchableOpacity
            onPress={() => navigation.navigate('QuanlydonhangShop')}>
            <Text style={{ color: 'gray' }}>Xem lịch sử đơn hàng</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <TouchableOpacity style={styles.box} onPress={()=>navigation.replace('QuanlydonhangShop', { initialTab: 'Chờ xác nhận' })}>
            <Image
              source={require('../assets/icons/wallet_user.png')}
              style={styles.iconImageLarge}
            />
            <Text>Chờ xác nhận</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={()=>navigation.replace('QuanlydonhangShop', { initialTab: 'Đang giao hàng' })}>
            <Image
              source={require('../assets/icons/truck_user.png')}
              style={styles.iconImageLarge}
            />
            <Text>Đang giao</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box} onPress={()=>navigation.replace('QuanlydonhangShop', { initialTab: 'Đã nhận hàng' })}>
            <Image
              source={require('../assets/image/delivered.png')}
              style={styles.iconImageLarge}
            />
            <Text>Đã giao</Text>
          </TouchableOpacity>


          <TouchableOpacity style={styles.box}>
            <Image
              source={require('../assets/icons/review_user.png')}
              style={styles.iconImageLarge}
            />
            <Text>Đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('ProductScreen')}>
          <Image source={require('../assets/icons/box.png')} />
          <Text style={{ textAlign: 'center' }}>Sản phẩm của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Statistical')}>
          <Image source={require('../assets/icons/bar-chart-2.png')} />
          <Text style={{ textAlign: 'center' }}>Hiệu quả bán hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.footerItem}
          onPress={() => navigation.navigate('Finance')}>
          <Image source={require('../assets/icons/briefcase.png')} />
          <Text style={{ textAlign: 'center' }}>Tài chính</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../assets/icons/help.png')} />
          <Text style={{ textAlign: 'center' }}>Trung tâm hỗ trợ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MyShop;

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    height: 60,
    backgroundColor: '#fff',
    flexDirection: 'row',
    alignItems: 'center',
    alignContent: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 20,
  },
  userInfo: {
    margin: 10,
    width: '95%',
    height: '10%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    // justifyContent: 'space-around',
    borderRadius: 20,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  userId: {
    fontSize: 14,
    color: 'gray',
  },
  viewShopButton: {
    marginTop: 5,
    marginRight: 20,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF5100',
    width: '30%',
  },
  viewShopText: {
    color: '#FF5100',
    fontSize: 20,
  },
  box: {
    backgroundColor: '#F0F0F0',
    width: '24%',
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
    alignContent: 'center',
    padding: 10,
  },
  footerItem: {
    width: '23%',
    alignItems: 'center',
    alignContent: 'center',
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#F0F0F0',
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginTop: 10,
  },
  iconImageLarge: {
    width: 28,
    height: 28,
  },
});
