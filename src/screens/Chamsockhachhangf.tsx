import React from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Image } from "react-native";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useNavigation } from "@react-navigation/native";


const FAQScreen = () => {
  const categories = ["Gợi ý", "Mua Sắm Cùng Shopee", "Khuyến Mãi & Ưu Đãi"];
  const navigation = useNavigation();

  const faqs = [
    { title: "[Cảnh báo lừa đảo] Mua sắm an toàn cùng Shopee" },
    { title: "[Trả hàng] Cách đóng gói đơn hàng hoàn trả" },
    { title: "[Trả hàng/Hoàn tiền] Hướng dẫn trả hàng sau khi yêu cầu Trả hàng/Hoàn tiền được chấp nhận" },
    { title: "[Thành viên mới] Tại sao tôi không thể đăng ký tài khoản Shopee bằng số điện thoại?" },
    { title: "[Thành viên mới] Điều kiện Trả hàng/Hoàn tiền của Shopee" },
    { title: "[Hoàn tiền] Tôi cần làm gì nếu không nhận được tiền hoàn qua Ví ShopeePay?", hot: true },
    { title: "[Hoàn tiền] Mất bao lâu để nhận lại tiền sau khi gửi trả hàng?", hot: true },
    { title: "[Cảnh báo lừa đảo] Nên làm gì để tránh nhận phải đơn hàng giả mạo?", hot: true },
  ];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={()=>navigation.goBack()}>
          <Image source={require('../assets/image/backwhite.png')}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ Chăm Sóc Khách Hàng</Text>
        <TouchableOpacity>
          <Icon name="file-copy" size={24} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Danh mục */}
      <View style={styles.categoryContainer}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index}>
            <Text style={[styles.categoryText, index === 0 && styles.activeCategory]}>{category}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Danh sách câu hỏi */}
      <FlatList
        data={faqs}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={styles.faqItem}>
            <Text style={styles.faqText}>{item.title}</Text>
            {item.hot && <Text style={styles.hotBadge}>HOT</Text>}
          </View>
        )}
      />

      {/* Hỗ trợ */}
      <View style={styles.supportContainer}>
        <Text style={styles.supportText}>Bạn có muốn tìm thêm thông tin gì không?</Text>
        <TouchableOpacity style={styles.supportItem}>
          <Icon name="chat" size={20} color="#ff5722" />
          <Text style={styles.supportItemText}>Trò chuyện với Shopee</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.supportItem}>
          <Icon name="phone" size={20} color="#ff5722" />
          <Text style={styles.supportItemText}>Gọi tổng đài Shopee</Text>
          <Text style={styles.freeBadge}>Miễn phí</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f8f8",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#ff5722",
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  headerTitle: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  categoryContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
    paddingVertical: 10,
    paddingHorizontal: 15,
  },
  categoryText: {
    fontSize: 16,
    color: "gray",
    marginRight: 15,
  },
  activeCategory: {
    color: "#ff5722",
    fontWeight: "bold",
    borderBottomWidth: 2,
    borderBottomColor: "#ff5722",
    paddingBottom: 5,
  },
  faqItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  faqText: {
    flex: 1,
    fontSize: 15,
    color: "#333",
  },
  hotBadge: {
    backgroundColor: "#ffccbc",
    color: "#ff5722",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    marginLeft: 5,
  },
  viewMore: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    backgroundColor: "#fff",
  },
  viewMoreText: {
    fontSize: 15,
    color: "gray",
    marginRight: 5,
  },
  supportContainer: {
    backgroundColor: "#fff",
    marginTop: 10,
    padding: 15,
  },
  supportText: {
    fontSize: 16,
    color: "#333",
    marginBottom: 10,
  },
  supportItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
  },
  supportItemText: {
    fontSize: 15,
    color: "#333",
    marginLeft: 10,
  },
  freeBadge: {
    marginLeft: "auto",
    backgroundColor: "#ffccbc",
    color: "#ff5722",
    fontSize: 12,
    fontWeight: "bold",
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
  },
});

export default FAQScreen;
