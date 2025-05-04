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
    if (order?.chi_tiet_don_hang) {
      const bookList = order.chi_tiet_don_hang.map(item => ({
        ...item.book,
        so_luong: item.details?.so_luong || 1, // Tránh lỗi nếu `so_luong` không có
      }));
      setBooks(bookList);
      console.log("j", order);

    }
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
            Trạng thái : {order.trang_thai}
          </Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Mã vận đơn : {order.id_don_hang}</Text>
        </View>

        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 }}>
          {/* Shipping Address */}
          <TouchableOpacity style={styles.diachi} >
            <View style={{ flexDirection: 'column' }}>
              <Text style={{ fontWeight: 'bold', fontSize: 17, marginBottom: 10 }}>Địa chỉ giao hàng</Text>
              <View style={{ flexDirection: 'row' }}>
                <Image source={require('../assets/icon_diachi.png')} />
                <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{user.username}</Text>
                <Text style={{ marginLeft: 20 }}>{formatPhoneNumber(user.sdt)}</Text>
              </View>
              <Text>{formatAddress(order.dia_chi)}</Text>
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
              <View
                key={index}
                style={{
                  flexDirection: 'row', // Sắp xếp hình ảnh và thông tin theo hàng ngang
                  marginBottom: 16,
                  alignItems: 'center', // Căn giữa các phần tử theo chiều dọc
                  backgroundColor: '#fff', // Nền trắng cho mỗi mục sách
                  padding: 10, // Thêm padding để tạo khoảng cách bên trong
                  borderRadius: 8, // Bo góc cho đẹp
                  elevation: 2, // Thêm bóng nhẹ (cho Android)
                  shadowColor: '#000', // Thêm bóng (cho iOS)
                  shadowOffset: { width: 0, height: 1 },
                  shadowOpacity: 0.1,
                  shadowRadius: 2,
                }}
              >
                <Image
                  source={{ uri: book.anh || 'https://via.placeholder.com/100' }}
                  style={{
                    width: 80, // Giảm kích thước hình ảnh để cân đối
                    height: 80,
                    borderRadius: 8,
                    marginRight: 12, // Khoảng cách giữa hình ảnh và thông tin
                  }}
                />
                <View style={{ flex: 1, justifyContent: 'center' }}>
                  <Text style={{
                    fontSize: 15,
                    fontWeight: 'bold', // Làm đậm tên sách
                    marginBottom: 4,
                    color: '#333', // Màu chữ tối hơn cho dễ đọc
                  }}>{book.ten_sach || "Chưa có tên sách"}</Text>
                  <Text>Số lượng : {order.chi_tiet_don_hang[index].details.so_luong}</Text>
                  {/* <Text style={{
                    fontSize: 14,
                    color: '#666', // Màu chữ nhạt hơn cho số lượng
                    marginBottom: 4,
                  }}>Số lượng: {book.so_luong}</Text> */}
                  <Text style={{
                    fontSize: 16,
                    fontWeight: 'bold',
                    color: '#d0021b', // Màu đỏ cho giá
                  }}>
                    {book.gia ? `₫${book.gia.toLocaleString()}` : "Đang cập nhật"}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text>Đang tải thông tin sách...</Text>
          )}

          <Text>Thời gian đặt hàng :
            {new Date(order.ngay_mua).toLocaleString('vi-VN', {
              day: '2-digit',
              month: '2-digit',
              year: 'numeric',
              hour: '2-digit',
              minute: '2-digit',
              second: '2-digit',
              hour12: false, // Định dạng 24 giờ
            })}
          </Text>
        </View>

        {/* Total & Actions */}
        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, elevation: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tổng thanh toán: <Text style={{ color: '#d0021b' }}>{order.tong_tien}</Text></Text>
          <Button mode="outlined" style={{ marginTop: 8, borderColor: '#888', borderRadius: 8 }} onPress={() => navigation.goBack()}>Đóng</Button>
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
