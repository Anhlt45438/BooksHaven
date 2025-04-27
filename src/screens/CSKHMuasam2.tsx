import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";

const ShippingPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
     
      <View
        style={{
          backgroundColor: "#f85606",
          flexDirection: "row",
          alignItems: "center",
          paddingTop: 40,
          paddingBottom: 12,
          paddingHorizontal: 16,
          justifyContent: "space-between",
        }}
      >
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/image/back1.png")} />
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: "bold", color: "#fff" }}>
          Chính Sách Giao Hàng
        </Text>
        <View style={{ width: 24 }} />
      </View>

      
      <View style={{ padding: 16 }}>
        <Text style={styles.title}>1. Phạm vi giao hàng</Text>
        <Text style={styles.content}>
          BookHaven hỗ trợ giao hàng trên toàn quốc. Một số khu vực vùng sâu, vùng xa có thể cần thêm thời gian giao hàng.
        </Text>

        <Text style={styles.title}>2. Thời gian giao hàng</Text>
        <Text style={styles.content}>
          • Khu vực nội thành: 1-3 ngày làm việc.{"\n"}
          • Khu vực ngoại thành và tỉnh thành khác: 3-7 ngày làm việc.
        </Text>

        <Text style={styles.title}>3. Phí giao hàng</Text>
        <Text style={styles.content}>
          • Đơn hàng từ 300.000đ trở lên: Miễn phí giao hàng.{"\n"}
          • Đơn hàng dưới 300.000đ: Phí giao động từ 20.000đ - 35.000đ tùy địa chỉ.
        </Text>

        <Text style={styles.title}>4. Chính sách kiểm hàng</Text>
        <Text style={styles.content}>
          Quý khách vui lòng kiểm tra tình trạng sản phẩm trước khi thanh toán. Nếu có vấn đề (sai sản phẩm, hỏng hóc...), xin từ chối nhận hàng và liên hệ chúng tôi ngay.
        </Text>

        <Text style={styles.title}>5. Các lưu ý khác</Text>
        <Text style={styles.content}>
          • Thời gian giao hàng có thể chậm trễ do thiên tai, dịch bệnh hoặc các sự kiện bất khả kháng.{"\n"}
          • Bộ phận CSKH luôn sẵn sàng hỗ trợ nếu đơn hàng gặp trục trặc.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 16,
    color: "#f85606",
  },
  content: {
    fontSize: 14,
    color: "#333",
    marginTop: 8,
    lineHeight: 22,
  },
});

export default ShippingPolicyScreen;
