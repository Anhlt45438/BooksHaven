import React from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";

// Dữ liệu danh sách sản phẩm
const productList = [
  {
    id: "1",
    shopName: "HocoMall",
    status: "Chờ giao hàng",
    image: "https://via.placeholder.com/60", // Thay bằng ảnh thật
    title: "Dây sạc type C Hoco siêu nhanh 3A - Cáp bọc dù 1M",
    variant: "CÁP BỌC DÙ, 1M",
    quantity: 1,
    oldPrice: "đ38.000",
    newPrice: "đ26.000",
    total: "đ26.900",
  },
  {
    id: "2",
    shopName: "Xiaomi Store",
    status: "Chờ giao hàng",
    image: "https://via.placeholder.com/60",
    title: "Sạc nhanh Xiaomi 33W - Hỗ trợ QC 3.0",
    variant: "Màu Trắng",
    quantity: 1,
    oldPrice: "đ250.000",
    newPrice: "đ199.000",
    total: "đ199.900",
  },
];

// Component ProductCard để hiển thị mỗi sản phẩm
const ProductCard = ({ item }) => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.shopInfo}>
          <Image
            source={{ uri: "https://via.placeholder.com/20" }} // Logo shop
            style={styles.shopLogo}
          />
          <Text style={styles.shopName}>{item.shopName}</Text>
          <Text style={styles.liveTag}>🔴 LIVE</Text>
        </View>
        <Text style={styles.status}>{item.status}</Text>
      </View>

      {/* Product Details */}
      <View style={styles.productContainer}>
        <Image source={{ uri: item.image }} style={styles.productImage} />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.variant}>{item.variant}</Text>
          <Text style={styles.quantity}>x{item.quantity}</Text>
        </View>
      </View>

      {/* Pricing */}
      <View style={styles.priceContainer}>
        <Text style={styles.oldPrice}>{item.oldPrice}</Text>
        <Text style={styles.newPrice}>{item.newPrice}</Text>
      </View>

      {/* Total & Contact */}
      <View style={styles.footer}>
        <Text style={styles.totalPrice}>
          Tổng số tiền ({item.quantity} sản phẩm):{" "}
          <Text style={styles.highlight}>{item.total}</Text>
        </Text>
        <TouchableOpacity style={styles.contactButton}>
          <Text style={styles.contactText}>Liên hệ Shop</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// Component chính chứa FlatList
const Cholayhang = () => {
  return (
    <FlatList
      data={productList}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => <ProductCard item={item} />}
    />
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  shopLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  shopName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  liveTag: {
    color: "red",
    marginLeft: 5,
  },
  status: {
    color: "red",
    fontWeight: "bold",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  variant: {
    fontSize: 12,
    color: "gray",
  },
  quantity: {
    fontSize: 12,
    color: "gray",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    marginVertical: 5,
  },
  oldPrice: {
    textDecorationLine: "line-through",
    color: "gray",
    marginRight: 5,
  },
  newPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "red",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 14,
  },
  highlight: {
    color: "red",
    fontWeight: "bold",
  },
  contactButton: {
    borderColor: "#ff4500",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  contactText: {
    color: "#ff4500",
    fontWeight: "bold",
  },
});

export default Cholayhang;
