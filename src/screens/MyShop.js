import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';

const MyShop = ({navigation, route}) => {
  const shopId = route?.params?.cua_hang?._id;
  const token = route?.params?.token;
  const [shop, setShop] = useState(null);
  const [loading, setLoading] = useState(true);
  console.log('id Shop:', shopId);

  useEffect(() => {
    const fetchShopData = async () => {
      try {
        if (!shopId) {
          Alert.alert('Lỗi', 'Không có shop id được truyền.');
          return;
        }
        const response = await fetch(
          `http://192.123.99.100:3000/api/shops/${shopId}`,
          {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`,
            },
          },
        );
        const result = await response.json();
        if (response.ok) {
          setShop(result);
        } else {
          Alert.alert('Lỗi', result.message || 'Không thể lấy dữ liệu shop');
        }
      } catch (error) {
        Alert.alert('Lỗi', 'Lỗi mạng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchShopData();
  }, [shopId, token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (!shop) {
    return (
      <View style={styles.container}>
        <Text>Không có dữ liệu shop.</Text>
      </View>
    );
  }
  return (
    <View style={{flex: 1, alignItems: 'center'}}>
      <View style={styles.header}>
        <Text style={styles.headerText}>Shop của tôi</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity onPress={() => navigation.navigate('Setting')}>
            <Image
              source={require('../assets/icons/settings.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/icons/bell.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image
              source={require('../assets/icons/Vector1.png')}
              style={styles.icon}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.userInfo}>
        <View style={{flexDirection: 'row', marginRight: 80}}>
          <Image source={require('../assets/icons/user.png')} />
          <View style={{marginLeft: 10}}>
            <Text style={styles.userName}>{cua_hang.ten_shop}</Text>
            <Text style={styles.userId}>ID: {cua_hang._id}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.viewShopButton}>
          <Text style={styles.viewShopText}>Xem shop</Text>
        </TouchableOpacity>
      </View>
      <Image
        source={require('../assets/image/imgbn1.png')}
        style={{width: '95%', height: 120}}
      />
      <View style={styles.content}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={{fontWeight: 'bold', fontSize: 20}}>Đơn hàng</Text>
          <TouchableOpacity>
            <Text>Xem lịch sử đơn hàng</Text>
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <TouchableOpacity style={styles.box}>
            <Text>0</Text>
            <Text>Chờ lấy hàng</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text>0</Text>
            <Text>Đơn huỷ</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text>0</Text>
            <Text>Trả hàng/Hoàn tiền</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.box}>
            <Text>0</Text>
            <Text>Đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('ProductScreen')}>
          <Image source={require('../assets/icons/box.png')} />
          <Text>Sản phẩm của tôi</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Statistical')}>
          <Image source={require('../assets/icons/bar-chart-2.png')} />
          <Text>Hiệu quả bán hàng</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem} onPress={() => navigation.navigate('Finance')}>
          <Image source={require('../assets/icons/briefcase.png')} />
          <Text>Tài chính</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.footerItem}>
          <Image source={require('../assets/icons/help.png')} />
          <Text>Trung tâm hỗ trợ</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: 'white',
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    marginLeft: '40%',
  },
  headerIcons: {
    flexDirection: 'row',
    marginLeft: 40,
  },
  icon: {
    marginLeft: 13,
    width: 25,
    height: 25,
  },
  content: {
    backgroundColor: '#FFFFFF',
    width: '95%',
    margin: 10,
    padding: 10,
    borderRadius: 10,
  },
  userInfo: {
    margin: 10,
    width: '95%',
    height: '10%',
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
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
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#FF5100',
  },
  viewShopText: {
    color: '#FF5100',
    fontSize: 20,
  },
  box: {
    backgroundColor: '#F0F0F0',
    width: 95,
    height: 80,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingBottom: 20,
    width: '95%',
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  footerItem: {
    alignItems: 'center',
    paddingVertical: 10,
  },
});

export default MyShop;
