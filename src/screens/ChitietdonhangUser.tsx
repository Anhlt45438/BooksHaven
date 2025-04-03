import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAccessToken } from '../redux/storageHelper';
import { useAppSelector } from '../redux/hooks';

const OrderDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order;
  const user = useAppSelector(state => state.user.user);
  const [shopData, setShopData] = useState(null);
  const [books, setBooks] = useState([]);

  useEffect(() => {
    fetchShop();
    fetchBookDetails();
  }, []);

  const fetchShop = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) return;
    console.log("ID Shop cần fetch:", order.id_shop);

    try {
      const response = await fetch(
        `http://14.225.206.60:3000/api/shops/get-shop-info/${order.id_shop}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({}),
        }
      );

      if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

      const data = await response.json();
      console.log("Dữ liệu shop:", data);

      if (!data || !data.data) {
        console.error("API không trả về dữ liệu hợp lệ");
        return;
      }

      setShopData(data.data);
    } catch (error) {
      console.error("Lỗi khi tải thông tin shop:", error.message);
    }
  };

  const fetchBookDetails = async () => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) return;

      if (!order.details || order.details.length === 0) {
        console.warn("Không có sách nào trong đơn hàng.");
        return;
      }

      // Lấy tất cả ID sách từ mảng order.details
      const bookIds = order.details.map((detail) => detail.id_sach).filter(Boolean);
      console.log("Danh sách ID sách cần fetch:", bookIds);

      // Gọi API để lấy thông tin tất cả sách
      const fetchPromises = bookIds.map((bookId) =>
        fetch(`http://14.225.206.60:3000/api/books/${bookId}`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }).then((res) => res.json())
      );

      const bookDataArray = await Promise.all(fetchPromises);
      console.log("Dữ liệu sách:", bookDataArray);

      // Lưu danh sách sách vào state
      setBooks(bookDataArray.map((data) => data.data));
    } catch (error) {
      console.error("Lỗi khi lấy sách:", error.message);
    }
  };

  const formatPhoneNumber = (phone) => {
    if (!phone) return '';
    const cleanedPhone = phone.replace(/\D/g, '');
    return cleanedPhone.startsWith('0') ? `(+84) ${cleanedPhone.slice(1)}` : `(+84) ${cleanedPhone}`;
};

const formatAddress = (address) => {
    if (!address) return '';
    const parts = address.split(', ');
    const street = parts[0];
    const rest = parts.slice(1).join(', ');
    return `${street},\n${rest}`;
};

  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, elevation: 3 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/image/back1.png')} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: 'bold', marginLeft: 16 }}>Thông tin đơn hàng</Text>
      </View>

      <ScrollView style={{ flex: 1, padding: 16 }}>
        {/* Order Status */}
        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: '#008000' }}>
          Đơn hàng đang : {order.trang_thai}
          </Text>
          <Text style={{ marginTop: 4, color: '#666' }}>Mã vận đơn : {order.id_don_hang}</Text>
        </View>

        {/* Shipping Address */}
        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 }}>
            {/* Shipping Address */}
                   <TouchableOpacity style={styles.diachi} >
                                    <View style={{ flexDirection: 'column' }}>
                                        <View style={{ flexDirection: 'row' }}>
                                            <Image source={require('../assets/icon_diachi.png')} />
                                            <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{user.username}</Text>
                                            <Text style={{ marginLeft: 20 }}>{formatPhoneNumber(user.sdt)}</Text>
                                        </View>
                                        <Text>{formatAddress(user.dia_chi)}</Text>
                                    </View>
                                    <Image source={require('../assets/icon_muitenphai.png')} />
                                </TouchableOpacity>
        </View>

        {/* Order Item */}
        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>
            {shopData ? shopData.ten_shop : "Đang tải tên Shop..."}
          </Text>

          {books.length > 0 ? (
            books.map((book, index) => (
              <View key={index} style={{ marginBottom: 16 }}>
                <Image 
                  source={{ uri: book.anh || 'https://via.placeholder.com/100' }}
                  style={{ width: 100, height: 100, marginVertical: 8, borderRadius: 8 }}
                />
                <Text style={{ fontSize: 15, marginBottom: 4 }}>{book.ten_sach || "Chưa có tên sách"}</Text>
                {/* <Text style={{ textDecorationLine: 'line-through', color: '#888' }}>₫38.000</Text> */}
                <Text>{order.details.so_luong}</Text>
                <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#d0021b' }}>{book.gia || "Đang cập nhật"}</Text>
              </View>
            ))
          ) : (
            <Text>Đang tải thông tin sách...</Text>
          )}

          <Text>{order.ngay_mua}</Text>
        </View>

        {/* Total & Actions */}
        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, elevation: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tổng thanh toán: <Text style={{ color: '#d0021b' }}>{order.tong_tien}</Text></Text>
          <Button mode="outlined" style={{ marginTop: 8, borderColor: '#888', borderRadius: 8 }}>Hủy đơn hàng</Button>
        </View>
      </ScrollView>
    </View>
  );
};
const styles = StyleSheet.create({
  diachi: {
   
    width: '100%',
    backgroundColor: '#FFFFFF',
    padding: 10,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
   
},
})
export default OrderDetails;