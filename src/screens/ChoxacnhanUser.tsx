import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { getAccessToken } from "../redux/storageHelper";
import { useNavigation } from "@react-navigation/native";

const Cholayhang = () => {
  const [data, setData] = useState([]);
   const navigation = useNavigation();

   const getOrder = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log("Không có accessToken");
      return;
    }
     
     
    try {
      const response = await fetch(
        "http://14.225.206.60:3000/api/orders/user?page=1&limit=10",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (!response.ok) {
        throw new Error("Không thể lấy dữ liệu đơn hàng");
      }

      const orderData = await response.json();
      console.log("Dữ liệu đơn hàng:", orderData);

      if (!Array.isArray(orderData.data)) {
        console.error("Lỗi: orderData.data không phải là một mảng!", orderData);
        setData([]);
        return;
      }

      // Lọc đơn hàng chỉ hiển thị những đơn có trang_thai là "chờ xác nhận"
      const filteredOrders = orderData.data.filter(
        (order) => order.trang_thai === "chờ xác nhận"
      );

      setData(filteredOrders);
      console.log("Dữ liệu đơn hàng:", data);

    } catch (error) {
      console.error("Lỗi khi tải đơn hàng:", error.message);
    }
  };

  useEffect(() => {
    getOrder();
  }, []);

  useEffect(() => {
    getOrder();
  }, []);

  const ShopDetail = ({ shopId }) => {
    const [shopData, setShopData] = useState(null);

    useEffect(() => {
      const fetchShop = async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        console.log("ID Shop cần fetch:", shopId);

        try {
          const response = await fetch(
            `http://14.225.206.60:3000/api/shops/get-shop-info/${shopId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({}),
            }
          );

          if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

          const data = await response.json();
          console.log("Dữ liệu shop:", data);

          if (!data || !data.data) {
            console.error("API không trả về dữ liệu hợp lệ");
            return;
          }

          setShopData(data.data);
        } catch (error) {
          console.error("Lỗi khi tải thông tin shop:", error.message);
        }
      };

      fetchShop();
    }, [shopId]);

    return (
      <View style={styles.shopInfo}>
        <Image
          source={{ uri: shopData?.logo || "https://via.placeholder.com/20" }}
          style={styles.shopLogo}
        />
        <Text style={styles.shopName}>
          {shopData ? shopData.ten_shop : "Đang tải..."}
        </Text>
      </View>
    );
  };

  const BookDetail = ({ detail }) => {
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
      const fetchBook = async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        try {
          const response = await fetch(
            `http://14.225.206.60:3000/api/books/${detail.id_sach}`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );
          if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);
          const data = await response.json();
          setBookData(data.data);
        } catch (error) {
          console.error("Lỗi khi tải sách:", error.message);
        }
      };
      fetchBook();
    }, [detail.id_sach]);

    return (
      <View style={styles.productContainer}>
        <Image
          source={{ uri: bookData?.anh || "https://via.placeholder.com/60" }}
          style={styles.productImage}
        />
        <View style={styles.productInfo}>
          <Text style={styles.productTitle} numberOfLines={2}>
            {bookData ? bookData.ten_sach : "Đang tải..."}
          </Text>
          <Text style={styles.quantity}>x{detail.so_luong}</Text>
        </View>
      </View>
    );
  };

  const ProductCard = ({ item }) => {
    return (
      <View style={styles.container}>
        <TouchableOpacity onPress={() => navigation.navigate('ChitietdonhangUser', { order: item })}>
        <View style={styles.header}>
          {/* Hiển thị tên Shop từ ShopDetail */}
          <ShopDetail shopId={item.id_shop} />
          <Text style={styles.status}>{item.trang_thai}</Text>
        </View>
        <FlatList
          data={item.details}
          keyExtractor={(detail) => detail.id_ctdh}
          renderItem={({ item: detail }) => <BookDetail detail={detail} />}
        />
        <View style={styles.footer}>
          <Text style={styles.totalPrice}>
            Tổng số tiền ({item.details.length} sản phẩm):{" "}
            <Text style={styles.highlight}>{item.tong_tien}</Text>
          </Text>
           <View >
          <TouchableOpacity
                         style={styles.cancelButton}
                       >
                         <Text style={styles.buttonText}>Hủy</Text>
                       </TouchableOpacity>
          
                        <TouchableOpacity style={styles.contactButton}>
            <Text style={styles.contactText}>Liên hệ Shop</Text>
          </TouchableOpacity>
                      </View>
         
        </View>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => <ProductCard item={item} />}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
      }
    />
  );
};

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
  quantity: {
    fontSize: 12,
    color: "gray",
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
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "gray",
  }, cancelButton: {
    backgroundColor: "#FF5252",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 5, // Khoảng cách giữa nút "Hủy" và "Xác nhận"
  },  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default Cholayhang;
