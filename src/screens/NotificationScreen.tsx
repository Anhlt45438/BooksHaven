import React from "react";
import { View, Text, FlatList, TouchableOpacity, Image, StyleSheet } from "react-native";


const notifications = [
  {
    id: "1",
    type: "order_completed",
    title: "Đơn hàng đã hoàn tất",
    description: "Đơn hàng 250119VJVFW9NG đã hoàn thành. Bạn hãy đánh giá sản phẩm trước ngày 25-02-2025 để nhận 200 xu!",
    time: "07:31 26-01-25",
    img: ""
  },
  {
    id: "2",
    type: "refund_approved",
    title: "Yêu cầu Trả Hàng/Hoàn Tiền được chấp nhận",
    description: "Yêu cầu hoàn tiền 2501250E4S20S69 được chấp nhận. Shopee sẽ hoàn đ 310.000 vào Ví ShopeePay trong vòng 24 giờ.",
    time: "20:53 25-01-25",
    img: ""
  },
  {
    id: "3",
    type: "return_required",
    title: "Bạn cần gửi trả hàng",
    description: "Shopee đã chấp nhận yêu cầu trả hàng 2501250E4S20S69. Vui lòng gửi trước 31-01-2025, nếu không yêu cầu sẽ bị hủy!",
    time: "13:36 25-01-25",
    img: ""
  },
  {
    id: "4",
    type: "order_received",
    title: "Nhắc nhở: Bạn đã nhận được hàng chưa?",
    description: "Nếu chưa nhận hàng đơn 2501212P0X0G6M, hãy nhấn Trả hàng trước ngày 25-01-2025. Sau thời gian này Shopee sẽ thanh toán cho người bán.",
    time: "10:00 25-01-25",
    img: ""
  },
];

const NotificationScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Thông báo</Text>
        <View style={styles.headerIcons}>
          <Image source={require('../assets/image/shoppingcart.jpg')}/>
          <Image source={require('../assets/image/conversation.png')}/>
        </View>
      </View>
      
      {/* Notification List */}
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card}>
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    backgroundColor: "#fff",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconSpacing: {
    marginRight: 15,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#fff",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    alignItems: "center",
  },
  icon: {
    width: 50,
    height: 50,
    marginRight: 15,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },
  description: {
    fontSize: 14,
    color: "gray",
  },
  time: {
    fontSize: 12,
    color: "#888",
    marginTop: 5,
  },
});

export default NotificationScreen;
