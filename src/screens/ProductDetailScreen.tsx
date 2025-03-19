import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, FlatList, ScrollView } from "react-native";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useNavigation } from '@react-navigation/native';
import { useRoute } from '@react-navigation/native';

const ProductDetailScreen = () => {
  const reviews = [
    { id: "1", user: "Công Vũ", comment: "Sản phẩm rất đáng tiền." },
    { id: "2", user: "Nguyễn An", comment: "Chất lượng tốt, sẽ mua lại!" },
    { id: "3", user: "Trần Hải", comment: "Sách hay, giao hàng nhanh." },
  ];

  const bottomSheetRef = useRef<BottomSheet>(null);
  const snapPoints = ["40%"]
  const [isopen, setisopen] = useState(true);
  const navigation = useNavigation(); // Hook điều hướng
  const route = useRoute();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  interface Book {
    _id: string;
    ten_sach: string;
    gia: string;
    anh: string;
    // ... các field khác nếu cần
}

  const id = route.params?.id; // Kiểm tra tránh lỗi undefined
  useEffect(() => {
    fetchData();
    console.log(id);
}, []);
  

  const fetchData = async () => {
    try {
      const response = await fetch(`http://10.0.2.2:3000/api/books/${id}`); // Gọi API theo id
      const data = await response.json();
      console.log("Dữ liệu API trả về:", data); // Kiểm tra dữ liệu
      setProduct(data.data);
      setLoading(false);
    } catch (error) {
      console.error("Lỗi fetchData:", error);
      setLoading(false);
    }
  };

  const handleSnapPress = useCallback((index) => {
    bottomSheetRef.current?.snapToIndex(index)
    setisopen(true)
  }, [])

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        {/* Hình ảnh sản phẩm */}
        <View style={styles.imageContainer}>
          <Image
            source={{ uri: product?.anh}}
            style={styles.productImage}
          />
          <View style={styles.overlay}>
            <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
              <Image source={require("../assets/image/back.png")} />
            </TouchableOpacity>
            <View style={styles.rightIcons}>
            <TouchableOpacity>
  <View style={styles.iconContainer}>
    <Image source={require("../assets/image/share.png")} style={styles.icon} />
  </View>
</TouchableOpacity>

<TouchableOpacity onPress={() => handleSnapPress(0)}>
  <View style={styles.iconContainer}>
    <Image source={require("../assets/image/shoppingcart.jpg")} style={styles.icon} />
  </View>
</TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Nội dung cuộn */}
        <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
          <View style={styles.infoContainer}>
           
            <Text style={styles.price}>{product?.ten_sach}</Text>
            <Text style={styles.price}>Loại Sách</Text>
            <Text>Tác giả : {product?.tac_gia}</Text>
            <Text style={styles.price}>Giá : {product?.gia}</Text>
            <Text style={styles.productName}>Sách sự im lặng của bầy cú</Text>
            <Text style={styles.productName}>{product?.mo_ta}</Text>

            {/* Đánh giá sản phẩm */}
            <Text style={styles.reviewTitle}>Đánh giá sản phẩm</Text>
            <FlatList
              data={reviews}
              keyExtractor={(item) => item.id}
              nestedScrollEnabled={true} // Thêm để FlatList hoạt động trong ScrollView
              renderItem={({ item }) => (
                <View style={styles.reviewContainer}>
                  <Image source={require('../assets/image/avatar.png')} style={{ paddingEnd: '5%' }} />
                  <View>
                    <Text style={styles.userName}>{item.user}</Text>
                    <Text style={styles.reviewText}>{item.comment}</Text>
                    <Image source={require('../assets/image/book1.jpg')} />
                  </View>
                </View>
              )}
            />
          </View>
        </ScrollView>

        {/* Nút "Chat ngay" & "Mua ngay" */}
        <View style={styles.container1}>
          <View style={styles.container11}>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../assets/image/bubble-chat.png')} style={styles.icon} />
              <Text>Chat ngay</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button}>
              <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon} />
              <Text>Giỏ hàng</Text>
            </TouchableOpacity>
          </View>
          <TouchableOpacity style={styles.button11}>
            <Text style={styles.buyText}>Mua ngay</Text>
            <Text style={styles.buyText}>3000</Text>
          </TouchableOpacity>
        </View>

        {/* BottomSheet */}

      
        
         <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} enablePanDownToClose={true}>
  <BottomSheetView style={styles.bottomSheetContainer}>
    {/* Hàng ngang chứa ảnh và nội dung */}
    <View style={styles.sheetContent1}>
      {/* Ảnh sách */}
      <Image
        source={{ uri: product?.anh }}
        style={styles.bookImage}
      />

      {/* Nội dung */}
      <View style={styles.textContainer}>
        <Text style={styles.bookTitle}>{product?.ten_sach}</Text>
        <Text style={styles.price1}>{product?.gia} đ</Text>
      </View>

      {/* Nút đóng */}
      <TouchableOpacity style={styles.closeButton1} onPress={() => bottomSheetRef.current?.close()}>
        <Image source={require("../assets/image/close.png")} style={styles.closeIcon} />
      </TouchableOpacity>
    </View>

    {/* Chọn số lượng sản phẩm */}
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>Số lượng</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity>
          <Image source={require("../assets/image/minus.png")} 
          style={styles.quantityButton} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>1</Text>
        <TouchableOpacity>
          <Image source={require("../assets/image/plus.png")} style={styles.quantityButton} />
        </TouchableOpacity>
      </View>
    </View>

    {/* Nút mua hàng */}
    <TouchableOpacity style={styles.buyButton}>
      <Text style={styles.buyButtonText}>Mua hàng</Text>
    </TouchableOpacity>
  </BottomSheetView>
</BottomSheet>

      </View>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  container1: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#fff",
  },
    bottomSheetContainer: {
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 15,
    },
    sheetContent1: {
      flexDirection: "row",
      alignItems: "",
      justifyContent: "space-between",
      width: "100%",
    },
    bookImage: {
      width: 80,
      height: 120,
      borderRadius: 10,
    },
    textContainer: {
      flex: 1,
      marginLeft: 15,
    },
    bookTitle: {
      fontSize: 18,
      fontWeight: "bold",
      color: "#333",
    },
    price1: {
      fontSize: 16,
      color: "purple",
      marginTop: 5,
    },
    closeButton1: {
      position: "absolute",
      top: 10,
      right: 10,
      padding: 5,
    },
    closeIcon: {
      width: 24,
      height: 24,
    },
    quantityContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 0,
      paddingHorizontal: 10,
    },
    quantityLabel: {
      fontSize: 16,
      fontWeight: "bold",
    },
    quantityControls: {
      flexDirection: "row",
      alignItems: "center",
      backgroundColor: "#F5F5F5",
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 10,
    },
    quantityButton: {
      width: 30,
      height: 30,
      marginHorizontal: 10,
    },
    quantityText: {
      fontSize: 18,
      fontWeight: "bold",
    },
    buyButton: {
      marginTop: 10,
      backgroundColor: "#08B05C",
      paddingVertical: 12,
      alignItems: "center",
      borderRadius: 8,
    },
    buyButtonText: {
      color: "#fff",
      fontSize: 18,
      fontWeight: "bold",
    },
  
  container11: { flexDirection: "row", width: "60%", alignItems: "center" },
  button: {
    flex: 1,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#DCDCDC",
    marginRight: 5,
    borderRadius: 5,
  }, iconContainer: {
    width: 50, // Kích thước vòng tròn
    height: 50,
    borderRadius: 25, // Biến thành hình tròn
    backgroundColor: "white", // Màu nền trắng
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000", // Đổ bóng
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 5, // Bóng trên Android
    marginHorizontal: 5, // Khoảng cách giữa các icon
  },
  button11: { width: "40%", height: 50, alignItems: "center", justifyContent: "center", backgroundColor: "#08B05C", borderRadius: 5 },
  icon: { width: 25, height: 25, marginBottom: 5 },
  buyText: { color: "white", fontWeight: "bold" },
  scrollView: { flex: 1 },
  imageContainer: { position: "relative" },
  productImage: { width: "100%", height: 250, resizeMode: "cover" },
  overlay: { position: "absolute", top: 10, left: 10, right: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  iconButton: { backgroundColor: "rgba(255, 255, 255, 0.8)", padding: 8, borderRadius: 20, margin: 5 },
  rightIcons: { flexDirection: "row" },
  infoContainer: { padding: 15 },
  price: { fontSize: 20, fontWeight: "bold", color: "purple" },
  productName: { fontSize: 16, marginVertical: 5 },
  reviewTitle: { fontSize: 16, fontWeight: "bold", marginTop: 10 },
  reviewContainer: { flexDirection: "row", alignItems: "flex-start", marginVertical: 10, paddingVertical: 5, borderBottomWidth: 0.5, borderBottomColor: "#ccc" },
  userName: { fontWeight: "bold" },
  reviewText: { fontSize: 14, color: "gray" },
  sheetContent: { flex: 1, alignItems: "center", justifyContent: "center" },
  sheetText: { fontSize: 18, fontWeight: "bold" },
  closeButton: { marginTop: 10, backgroundColor: "red", padding: 10, borderRadius: 5 },
  closeButtonText: { color: "white", fontWeight: "bold" },
});

export default ProductDetailScreen;
