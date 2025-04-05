import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Switch, Image, ScrollView, StyleSheet, Alert } from "react-native";
import { getAccessToken } from "../redux/storageHelper";
import { useSelector } from "react-redux";

const WithdrawScreen = ({ route}) => {
  const [isChecked, setIsChecked] = useState(false);
  const [amount, setAmount] = useState("");
const navigation = useNavigation();
const selectedBank = route?.params?.selectedBank;
const stk = route?.params?.stk;
console.log(stk);

  const userr = useSelector((state: any) => state.user.user);
const [shop,setshop]=useState("");
const [monney,setmonney]=useState("");
useEffect(() => {
  const getinforshop = async () => {
    const accessToken = await getAccessToken(); // bạn phải có hàm này

    if (!userr?._id) {
      Alert.alert('Vui lòng đăng nhập trước khi thêm vào giỏ hàng!');
      return;
    }

    try {
      const response = await fetch(`http://14.225.206.60:3000/api/shops/get-shop-info-from-user-id/${userr._id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy thông tin shop');
      }

      const data = await response.json();
      console.log("Thông tin shop:", data);
      // setShopInfo(data); // nếu bạn có state
      setshop(data.data)
      console.log("shop : ",shop.tong_tien);
      
    } catch (error) {
      console.error("Lỗi khi lấy thông tin shop:", error);
      Alert.alert('Đã có lỗi xảy ra khi lấy thông tin shop.');
    }
  };

  getinforshop();
}, [userr]); // chạy lại khi userr thay đổi

// Đặt lại điều kiện khi nút bị disable
const isButtonDisabled = !selectedBank || !monney || parseInt(monney) < 50000;


  return (
    <View style={{ flex: 1, backgroundColor: "#fff" }}>
      <ScrollView contentContainerStyle={{ padding: 16, flexGrow: 1 }}>
        {/* Header */}
        <View style={styles.header}>
                       <View style={styles.headerContent}>
                           <TouchableOpacity onPress={() => navigation.goBack()}>
                               <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                           </TouchableOpacity>
                           <Text style={styles.title}>Xác nhận rút tiền</Text>
                       </View>
                   </View>

        {/* Bank Account */}
        <Text style={{ fontSize: 20, marginBottom: 8 ,fontWeight:"bold"}}>Rút tiền từ số dư tài khoản</Text>
        <View style={{ flexDirection: "row", alignItems: "center", padding: 12, backgroundColor: "#f5f5f5", borderRadius: 8 }}>
  <TouchableOpacity onPress={() => navigation.navigate('InforBank')} style={{ flexDirection: 'row', alignItems: 'center' }}>
    <Image
      source={selectedBank?.icon || require('../assets/image/banking.png')}
      style={{ width: 50, height: 50, resizeMode: 'contain' }}
    />
   
    <Text style={{ marginLeft: 8, fontSize: 16, fontWeight: "bold" }}>
  {"Ngân hàng " + (selectedBank?.name || "Chọn tài khoản ngân hàng")}
</Text>
  </TouchableOpacity>
</View>


        {/* Input Amount */}
        <Text style={{ fontSize: 16, marginTop: 16 }}>Số tiền muốn rút</Text>
        <TextInput
  style={{ borderWidth: 1, borderColor: "#ddd", padding: 10, borderRadius: 8, fontSize: 18, marginTop: 8 }}
  placeholder="Nhập số tiền"
  keyboardType="numeric"
  value={monney.toString()}  // Hiển thị giá trị monney
  onChangeText={setmonney}  // Cập nhật monney khi người dùng nhập
/>


        {/* Available Balance */}
        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 8 }}>
        <Switch 
  value={isChecked} 
  onValueChange={() => { 
    setIsChecked(!isChecked);
    if (isChecked) {
      setmonney("");  // Khi Switch tắt, set monney thành 0
    } else {
      setmonney(shop.tong_tien);  // Khi Switch bật, set monney thành số dư shop
    }
  }} 
/>

          <Text style={{ marginLeft: 8, fontSize: 16 }}>
  Số dư có thể rút: {shop.tong_tien?.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' })}
</Text>

        </View>

        {/* Fee Information */}
        <Text style={{ fontSize: 16, marginTop: 16 }}>Phí rút tiền: 10%</Text>
        <Text style={{ color: "gray", fontSize: 14 }}>Phí rút tiền chỉ áp dụng cho các giao dịch thành công.</Text>

        {/* Warning Message */}
       
      </ScrollView>
      
      {/* Amount Transferred to Bank */}
      <View style={{ padding: 16, backgroundColor: "#fff", borderTopWidth: 1, borderColor: "#ddd" }}>
        <Text style={{ fontSize: 16, marginBottom: 8 }}>Số tiền chuyển vào tài khoản ngân hàng </Text>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#FF4500" }}>
        {monney ? (parseInt(monney) * 0.9).toLocaleString('vi-VN') : "0"} đ

</Text>

      </View>
      
      {/* Confirm Button */}
      <View style={{ padding: 16, backgroundColor: "#fff" }}>
      <TouchableOpacity
          style={{
            backgroundColor: isButtonDisabled ? "#ddd" : "#FF4500",
            padding: 15,
            borderRadius: 8,
            alignItems: "center",
          }}
          onPress={() => {
            if (isButtonDisabled) return; // Disable button when conditions are not met
            if (parseInt(monney) > 11000) {
              navigation.replace('Ruttien2', { ruttien: monney, selectedBank: selectedBank, stk: stk });
            } else {
              Alert.alert("Bạn phải rút số tiền lớn hơn 11000 đ");
            }
          }}
          disabled={isButtonDisabled}
        >
          <Text style={{ color: "white", fontSize: 16, fontWeight: "bold" }}>Tiếp theo</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
header: {
  backgroundColor: '#fff',
  alignItems: 'center',
  padding: 20,
},
headerContent: {
  flexDirection: 'row',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
},
title: {
  fontSize: 24,
  fontWeight: 'bold',
  flex: 1,
  textAlign: 'center',
  right: 10,
},
})
export default WithdrawScreen;