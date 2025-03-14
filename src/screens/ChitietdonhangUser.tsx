import React from 'react';
import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import { Card, Button } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';


const OrderDetails = () => {
//   const navigation = useNavigation();
  
  return (
    <View style={{ flex: 1, backgroundColor: '#f5f5f5' }}>
      {/* Header */}
      <View style={{ flexDirection: 'row', alignItems: 'center', backgroundColor: '#ffffff', padding: 16, elevation: 3 }}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
         <Image source={require('../assets/image/back1.png')}/>
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
          <Text style={{ fontSize: 16, fontWeight: 'bold', marginBottom: 8 }}>HocoMall</Text>
          <Image 
            source={{ uri: 'https://via.placeholder.com/100' }}
            style={{ width: 100, height: 100, marginVertical: 8, borderRadius: 8 }}
          />
          <Text style={{ fontSize: 15, marginBottom: 4 }}>Dây sạc type C Hoco siêu nhanh 3A - Cáp bọc dù, 1M</Text>
          <Text style={{ textDecorationLine: 'line-through', color: '#888' }}>₫38.000</Text>
          <Text style={{ fontSize: 16, fontWeight: 'bold', color: '#d0021b' }}>₫26.000</Text>
        </View>
        
        {/* Total & Actions */}
        <View style={{ backgroundColor: '#ffffff', padding: 16, borderRadius: 12, elevation: 3 }}>
          <Text style={{ fontSize: 16, fontWeight: 'bold' }}>Tổng thanh toán: <Text style={{ color: '#d0021b' }}>₫26.900</Text></Text>
          <Button mode="outlined" style={{ marginTop: 8, borderColor: '#888', borderRadius: 8 }}>Hủy đơn hàng</Button>
        </View>
      </ScrollView>
    </View>
  );
};

export default OrderDetails;
