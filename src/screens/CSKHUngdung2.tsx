import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";

const AppIssueGuideScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: "#fff" }}>
      {/* Header */}
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
          Xử Lý Lỗi Ứng Dụng
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung hướng dẫn */}
      <View style={{ padding: 16 }}>
        {/* 1. Liên quan đến Ứng dụng */}
        <Text style={styles.sectionTitle}>1. Vấn đề liên quan đến Ứng dụng</Text>
        <Text style={styles.item}>• Cập nhật ứng dụng lên phiên bản mới nhất.</Text>
        <Text style={styles.item}>• Đóng ứng dụng hoàn toàn và mở lại.</Text>
        <Text style={styles.item}>• Xóa bộ nhớ cache của ứng dụng.</Text>
        <Text style={styles.item}>• Gỡ cài đặt và tải lại ứng dụng từ cửa hàng chính thức.</Text>

        {/* 2. Liên quan đến Kết nối */}
        <Text style={styles.sectionTitle}>2. Vấn đề liên quan đến Kết nối Mạng</Text>
        <Text style={styles.item}>• Kiểm tra tín hiệu Wi-Fi hoặc 4G/5G.</Text>
        <Text style={styles.item}>• Thử đổi sang mạng khác (ví dụ chuyển từ Wi-Fi sang 4G).</Text>
        <Text style={styles.item}>• Tắt và bật lại chế độ Máy bay để reset kết nối.</Text>
        <Text style={styles.item}>• Kiểm tra xem các ứng dụng khác có vào mạng bình thường không.</Text>

        {/* 3. Liên quan đến Thiết bị */}
        <Text style={styles.sectionTitle}>3. Vấn đề liên quan đến Thiết bị Di Động</Text>
        <Text style={styles.item}>• Khởi động lại điện thoại.</Text>
        <Text style={styles.item}>• Kiểm tra dung lượng bộ nhớ trống của thiết bị.</Text>
        <Text style={styles.item}>• Đảm bảo hệ điều hành điện thoại đã được cập nhật mới nhất.</Text>
        <Text style={styles.item}>• Kiểm tra cấp quyền cho ứng dụng (Bộ nhớ, Internet, Thông báo...)</Text>

        {/* Gợi ý gửi feedback */}
        <TouchableOpacity
          style={styles.feedbackButton}
          onPress={() => navigation.navigate('Quanlyfeedback')}
        >
          <Text style={{ color: "#f85606", fontWeight: "bold" }}>
            Gửi Yêu Cầu Hỗ Trợ
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#f85606",
    marginTop: 20,
    marginBottom: 8,
  },
  item: {
    fontSize: 14,
    color: "#333",
    marginBottom: 6,
    lineHeight: 22,
  },
  feedbackButton: {
    marginTop: 30,
    backgroundColor: "#FFF7E6",
    padding: 12,
    borderColor: "#FFD700",
    borderWidth: 1,
    borderRadius: 8,
    alignItems: "center",
  },
});

export default AppIssueGuideScreen;
