import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, Modal, Alert, ActivityIndicator } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ItemSauDatHang from '../components/ItemSauDatHang';
import { getAccessToken } from '../redux/storageHelper';

const ManSauDatHang = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [order, setOrder] = useState([]);
  const [tongtiendonhang, setTongTienDonHang] = useState();
  const [modalVisible, setModalVisible] = useState(false); // State for modal visibility

  useEffect(() => {
    const fetchOrder = async () => {
      const accessToken = await getAccessToken();
      try {
        const response = await fetch(`http://14.225.206.60:3000/api/orders/recent`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const donhang = await response.json();
        console.log('don hang:', donhang);

        setOrder(donhang.data.orders);
        setTongTienDonHang(donhang.data.payment_info.so_tien);
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng', error);
      }
    };

    fetchOrder();
  }, []);

  // const formatPrice = (price) => {
  //   return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  // };

  const formatPrice = (price) => {
    return price != null
      ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
      : 'Đang tải';
  };
  const idCtdhList = order.map((item) => item.chi_tiet_don_hang[0].id_ctdh);
  console.log('tong tien: ', tongtiendonhang);
  console.log('order: ', order);

  // Function to handle order cancellation
  const handleCancelOrder = async () => {
    const accessToken = await getAccessToken();
    try {
      // Assuming you have an API endpoint to cancel the order
      const response = await fetch(`http://14.225.206.60:3000/api/orders/cancel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ orderId: order[0]._id }), // Adjust based on your API
      });

      if (response.ok) {
        Alert.alert( 'Đơn hàng đã được hủy.');
        navigation.navigate('HomeTabBottom', { screen: 'HomeScreen' });
      } else {
        Alert.alert('Lỗi', 'Không thể hủy đơn hàng.');
      }
    } catch (error) {
      console.error('Lỗi khi hủy đơn hàng', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi hủy đơn hàng.');
    }
    setModalVisible(false); // Close modal after action
  };

  return (
    <View style={{ flex: 1, backgroundColor: '#E7E7E7' }}>
      <View style={{ flexDirection: 'row', padding: 10 }}></View>
      <View
        style={{
          justifyContent: 'center',
          height: 330,
          alignItems: 'center',
          borderColor: '#D9D9D9',
          borderBottomWidth: 1,
        }}
      >
        <Image style={{ height: 60, width: 60 }} source={require('../assets/icon_tichto.png')} />
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginTop: 15 }}>Cảm ơn bạn đã đặt hàng</Text>
        <TouchableOpacity
          style={styles.nut}
          onPress={() => {
            navigation.navigate('HomeTabBottom', { screen: 'HomeScreen' });
          }}
        >
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Trở về trang chủ</Text>
        </TouchableOpacity>
        <Image style={{ height: 140, width: '95%', marginTop: 10 }} source={require('../assets/banner.jpg')} />
      </View>
      <View style={{ padding: 10, flex: 1 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 19, marginLeft: 10 }}>Đơn hàng của bạn</Text>
        </View>
        {order.length === 0 ? (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
    <ActivityIndicator size="large" color="#0000ff" />
  </View>
) : (
  <FlatList
    style={{ marginTop: 5 }}
    data={order}
    renderItem={({ item }) => <ItemSauDatHang item={item} />}
    keyExtractor={(item) => item._id}
  />
)}
      </View>
      <View style={{ justifyContent: 'center', alignItems: 'center', padding: 15, backgroundColor: 'white' }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginBottom: 3 }}>
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>Tổng tiền thanh toán</Text>
          <Text style={{ fontWeight: 'bold', fontSize: 17 }}>{formatPrice(tongtiendonhang)}</Text>
        </View>
      </View>

      {/* Modal for cancellation confirmation */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', marginBottom: 20 }}>
              Bạn có chắc muốn hủy đơn hàng?
            </Text>
            <View style={{ flexDirection: 'row',width:'100%', justifyContent: 'space-around' }}>
            <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#D9D9D9' }]}
                onPress={() => setModalVisible(false)} // Close modal
              >
                <Text style={{ fontWeight: 'bold' }}>Không</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, { backgroundColor: '#FF0000' }]}
                onPress={handleCancelOrder} // Confirm cancellation
              >
                <Text style={{ color: 'white', fontWeight: 'bold' }}>Có</Text>
              </TouchableOpacity>
              
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManSauDatHang;

const styles = StyleSheet.create({
  nut: {
    height: 40,
    width: 200,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  nut2: {
    height: 40,
    width: 200,
    backgroundColor: '#E7E7E7',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
    borderColor: 'black',
    borderWidth: 1,
  },
  chu: {
    fontSize: 16,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Semi-transparent background
  },
  modalContent: {
    width: 300,
    padding: 20,
    backgroundColor: 'white',
    borderRadius: 10,
    alignItems: 'center',
  },
  modalButton: {
    width: 100,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
});