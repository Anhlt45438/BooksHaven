import { useNavigation } from "@react-navigation/native";
import React, { useState } from "react";
import { View, Text, TextInput, ScrollView, TouchableOpacity, Image, StyleSheet } from "react-native";


const CustomerSupportScreen = () => {
  const navigation =useNavigation()
  const faqList = [
    "[Cảnh báo lừa đảo] Mua sắm an toàn cùng BookHaven",
    "[Thành viên mới] Tại sao tôi không thể đăng ký tạo tài khoản bằng số điện thoại của mình?",
    "[Quy định] Tiêu chuẩn hoạt động của người dùng",
    "[Thông báo] Cam kết của chúng tôi",
    "[Ứng dụng] Tại sao phải cập nhật ứng dụng thường xuyên",
  ];
  const faqListShopping = [
    "[Hướng dẫn] Cách đặt hàng trên BookHaven",
    "[Thanh toán] Các phương thức thanh toán hiện có",
    "[Vận chuyển] Chính sách giao hàng",
    "[Cảnh báo lừa đảo] Mua sắm an toàn cùng BookHaven",
    
  ];
  const faqListApp = [
    "[Ứng dụng] Tại sao phải cập nhật ứng dụng thường xuyên",
    "[Quy định] Tiêu chuẩn hoạt động của người dùng",
   
  ];
  const faqListInfor = [
    "[Cảnh báo lừa đảo] Mua sắm an toàn cùng BookHaven",
    "[Thao tác] Cần làm gì khi gặp lỗi khi dùng ứng dụng",
  ];
  const [activeTab, setActiveTab] = useState("Gợi ý");
  const [faqData, setFaqData] = useState(faqList);

  const tabs = ["Gợi ý", "Mua Sắm Cùng BookHaven", "Ứng dụng","Thông tin chung"];
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "Mua Sắm Cùng BookHaven") {
      setFaqData(faqListShopping);
    }if(tab === "Gợi ý") {
      setFaqData(faqList);
    }if(tab === "Ứng dụng"){
      setFaqData(faqListApp)
    }if(tab === "Thông tin chung"){
      setFaqData(faqListInfor)
    }
  };
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
                            // navigation.navigate('HomeTabBottom', { screen: 'ShopcartScreen' })
                            navigation.navigate('Quanlyfeedback')
                            
                        }>
                        <Image
                                   source={require('../assets/image/feedback1.png')}
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
       
      </View>

      {/* Nút phí rút tiền */}
      <TouchableOpacity onPress={()=>    navigation.navigate('Quanlyfeedback', { screen: 'Đã phản hồi' })}
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
            onPress={() => handleTabChange(tab)}
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
        {faqData.map((item, index) => (
          <TouchableOpacity  key={index}
          style={{ paddingVertical: 6 }}
          onPress={() => {
            if(activeTab=="Gợi ý"){
            if (index === 0) {
              navigation.navigate('SafeShopping');
            } else {
             if(index===1){
              navigation.navigate('Goiy1');
             }else{
              if(index===2){
                navigation.navigate('Goiy2');
               }else{
                if(index===3){
                  navigation.navigate('CSKHUngdung1');
                }if(index===4){
                  navigation.navigate('CSKHUngdung');
                }
               }
             }
            }
          }else{
            if(activeTab=="Mua Sắm Cùng BookHaven"){
              if (index === 0) {
                navigation.navigate('CSKHMuasam');
              } if (index === 1) {
                navigation.navigate('CSKHMuasam1');
              } if (index === 2) {
                navigation.navigate('CSKHMuasam2');
              }
            }else{
              if(activeTab=="Ứng dụng"){
                if(index===0){
                  navigation.navigate('CSKHUngdung');
                } if(index===1){
                  navigation.navigate('CSKHUngdung1');
                }
               
              }else{
                if(activeTab=="Thông tin chung"){
                  if(index===0){
                    navigation.navigate('SafeShopping');
                  }
                  if(index===1){
                    navigation.navigate('CSKHUngdung2');
                  }
                }
              }
            }
          }}}
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
