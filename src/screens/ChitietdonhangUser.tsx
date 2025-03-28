import React, { useEffect, useState } from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { getAccessToken } from '../redux/storageHelper';

const OrderDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const order = route.params?.order;

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
            Chờ Người bán gửi hàng
          </Text>
          <Text style={{ marginTop: 4, color: '#666' }}>Thanh toán bằng Thanh toán khi nhận hàng</Text>
        </View>

        {/* Shipping Address */}
        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, marginBottom: 16, elevation: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 4 }}>Địa chỉ nhận hàng</Text>
          <Text style={{ fontWeight: 'bold' }}>Nguyễn Văn a</Text>
          <Text style={{ color: '#666' }}>(+84) 909 987 983</Text>
          <Text style={{ marginTop: 4, color: '#444' }}>Nhà số 4, ngách số 11, Xã Cẩm yên, Huyện Hoa Trung, Ninh Bình</Text>
          <Button mode="outlined" style={{ marginTop: 8, borderColor: '#888', borderRadius: 8 }}>Cập nhật</Button>
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

export default OrderDetails;
