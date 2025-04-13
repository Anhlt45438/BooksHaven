import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";


const CustomerSupportScreen = () => {
  const navigation =useNavigation()
  const faqList = [
    "[Cảnh báo lừa đảo] Mua sắm an toàn cùng BookHaven",
    "[Thành viên mới] Tại sao tôi không thể đăng ký tạo tài khoản Shopee bằng số điện thoại của mình?",
    "[Trả hàng] Cách đóng gói đơn hàng hoàn trả",
    "[Trả hàng/Hoàn tiền] Hướng dẫn trả hàng sau khi yêu cầu Trả hàng/Hoàn tiền của bạn được chấp nhận",
    "[Thành viên mới] Điều kiện Trả hàng/Hoàn tiền của BookHaven",
  ];
  const [activeTab, setActiveTab] = useState("Gợi ý");

  const tabs = ["Gợi ý", "Mua Sắm Cùng Shopee", "Khuyến Mãi & Ưu Đãi"];
  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header giống hình */}
      <View
        style={{
          backgroundColor: "#f85606",
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          paddingTop: 40,
          paddingHorizontal: 16,
          paddingBottom: 12,
        }}
      >
       
        <TouchableOpacity onPress={() => navigation.goBack()}>
                 <Image source={require("../assets/image/back1.png")} />
               </TouchableOpacity>
        {/* Title */}
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
          Dịch vụ Chăm Sóc Khách Hàng
        </Text>

 <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() =>
                            navigation.navigate('HomeTabBottom', { screen: 'ShopcartScreen' })
                        }>
                        <Image
                                   source={require('../assets/image/shoppingcart.jpg')}
                                   style={{  width: 26,
                                    height: 26,
                                    tintColor: '#fff',}}
                                                              
                               />
                    </TouchableOpacity>
      
      </View>

      {/* Search Section */}
      <View style={{ backgroundColor: "#f85606", padding: 16 }}>
        <Text style={{ fontSize: 16, color: "#fff", marginBottom: 8 }}>
          Xin chào, chúng tôi có thể giúp gì cho bạn?
        </Text>
        <View
          style={{
            flexDirection: "row",
            backgroundColor: "#fff",
            borderRadius: 8,
            alignItems: "center",
            paddingHorizontal: 10,
          }}
        >
          {/* <Ionicons name="search" size={20} color="gray" /> */}
          <TextInput
            placeholder="Nhập từ khóa hoặc nội dung cần tìm"
            style={{ flex: 1, height: 40, marginLeft: 8 }}
          />
        </View>
      </View>

      {/* Nút phí rút tiền */}
      <TouchableOpacity onPress={()=>navigation.replace('FeedbacktoUser')}
        style={{
          backgroundColor: "#FFF7E6",
          padding: 12,
          borderColor: "#FFD700",
          borderWidth: 1,
          marginHorizontal: 16,
          borderRadius: 8,
          marginTop: 12,
        }}
      >
        <Text style={{ color: "#d35400", fontWeight: "bold" }}>
          🔊 CÂU TRẢ LỜI FEEDBACK
        </Text>
      </TouchableOpacity>

      {/* Đơn hàng */}
      {/* <View style={{ padding: 16 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 8 }}>
          <Text style={{ fontSize: 16, fontWeight: "bold" }}>Cần hỗ trợ đơn hàng?</Text>
          <Text style={{ color: "#f85606" }}>Thay đổi đơn hàng</Text>
        </View>

        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Image
            source={{ uri: "https://cf.shopee.vn/file/26b38b0110fef8897c9f0fd6a2a9b89b_tn" }}
            style={{ width: 50, height: 50, borderRadius: 8, marginRight: 12 }}
          />
          <View>
            <Text>Móc khóa Hình Thỏ Lông Xù Siêu Cute</Text>
            <Text style={{ color: "gray", fontSize: 12 }}>Hoàn thành</Text>
          </View>
        </View>

        <TouchableOpacity
          style={{
            borderWidth: 1,
            borderColor: "#f85606",
            padding: 8,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#f85606", textAlign: "center" }}>
            Yêu cầu Trả hàng/Hoàn tiền
          </Text>
        </TouchableOpacity>
      </View> */}

      {/* Hỗ trợ tài khoản */}
      <View style={{ paddingHorizontal: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold" }}>Hỗ trợ về tài khoản</Text>
        <TouchableOpacity onPress={() => navigation.navigate('ManSuaHoSo')}
          style={{
            borderWidth: 1,
            borderColor: "#f85606",
            padding: 8,
            borderRadius: 6,
            marginTop: 10,
          }}
        >
          <Text style={{ color: "#f85606", textAlign: "center" }}>Đổi thông tin cá nhân</Text>
        </TouchableOpacity>
      </View>

      {/* Câu hỏi thường gặp */}
      <View style={{ padding: 16 }}>
        <Text style={{ fontSize: 16, fontWeight: "bold", marginBottom: 8 }}>
          Câu hỏi thường gặp
        </Text>

        {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {tabs.map((tab, index) => (
          <TouchableOpacity
            key={index}
            onPress={() => setActiveTab(tab)}
            style={{
              marginRight: 16,
              borderBottomWidth: activeTab === tab ? 2 : 0,
              borderColor: "#f85606",
              paddingBottom: 6,
            }}
          >
            <Text
              style={{
                color: activeTab === tab ? "#f85606" : "#333",
                fontWeight: activeTab === tab ? "bold" : "normal",
              }}
            >
              {tab}
            </Text>
          </TouchableOpacity>
        ))}
        <TouchableOpacity style={{ justifyContent: "center" }}>
          <Text style={{ marginLeft: 10, color: "#999" }}>Danh mục &gt;</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Danh sách câu hỏi */}
      <View style={{ marginTop: 16 }}>
        {faqList.map((item, index) => (
          <TouchableOpacity  key={index}
          style={{ paddingVertical: 6 }}
          onPress={() => {
            if (index === 0) {
              navigation.navigate('SafeShopping');
            } else {
              // có thể xử lý các câu hỏi khác sau nếu cần
            }
          }}
          >
            <Text style={{ fontSize: 14 }}>{item}</Text>
          </TouchableOpacity>
        ))}
      </View>
      </View>
    </ScrollView>
  );
};
const styles =  StyleSheet.create({
iconWrapper: {
  position: 'relative',
  marginLeft: 10,
},
icon: {
  width: 26,
  height: 26,
  tintColor: '#fff',
},
badge: {
  position: 'absolute',
  top: -5,
  right: -5,
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
},})
export default CustomerSupportScreen;
