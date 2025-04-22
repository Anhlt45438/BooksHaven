import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { getAccessToken } from "../redux/storageHelper";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "../redux/hooks";

const ToReviewScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null); // Add error state
  const navigation = useNavigation();
  const user = useAppSelector((state) => state.user.user);
  const userId = user?._id || "67d65042accb77562503bfb2";
  const baseUrl = "http://14.225.206.60:3000/api";

  const checkIfRated = async (bookId) => {
    const accessToken = await getAccessToken();
    if (!accessToken || !userId) return true;

    try {
      const response = await fetch(
        `${baseUrl}/ratings/book/${bookId}?page=1&limit=10&user_id=${userId}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await response.json();
      return data.is_rated_from_user_id || false;
    } catch (error) {
      console.error("Error checking review status:", error.message);
      return true;
    }
  };

  const getOrdersToReview = useCallback(async () => {
    setLoading(true);
    setError(null);
    const accessToken = await getAccessToken();
    if (!accessToken) {
      setLoading(false);
      setError("Missing access token");
      return;
    }

    try {
      const response = await fetch(`${baseUrl}/orders/user?page=1&limit=10`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch orders");
      }

      const orderData = await response.json();

      if (!Array.isArray(orderData.data)) {
        console.error("Error: orderData.data is not an array!", orderData);
        setProducts([]);
        setLoading(false);
        return;
      }

      const filteredOrders = orderData.data.filter(
        (order) => order.trang_thai === "đã nhận hàng"
      );

      const productList = [];
      for (const order of filteredOrders) {
        for (const detail of order.details) {
          const isRated = await checkIfRated(detail.id_sach);
          if (!isRated) {
            productList.push({
              ...detail,
              id_shop: order.id_shop,
              orderId: order._id,
            });
          }
        }
      }

      setProducts(productList);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error.message);
      setError(error.message);
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    getOrdersToReview();
  }, [getOrdersToReview]);

  const ShopDetail = React.memo(({ shopId }) => {
    const [shopData, setShopData] = useState(null);

    useEffect(() => {
      const fetchShop = async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) return;

        try {
          const response = await fetch(
            `${baseUrl}/shops/get-shop-info/${shopId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({}),
            }
          );

          if (!response.ok) throw new Error(`HTTP error: ${response.status}`);

          const data = await response.json();
          if (!data || !data.data) {
            console.error("API did not return valid data");
            return;
          }

          setShopData(data.data);
        } catch (error) {
          console.error("Error fetching shop info:", error.message);
        }
      };

      fetchShop();
    }, [shopId]);

    return (
      <View style={styles.shopInfo}>
        <Text style={styles.shopName}>
          {shopData ? shopData.ten_shop : "Loading..."}
        </Text>
      </View>
    );
  });

  const ProductItem = React.memo(({ item, onReviewSuccess }) => {
    const [bookData, setBookData] = useState(null);

    useEffect(() => {
      const fetchBook = async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        try {
          const response = await fetch(`${baseUrl}/books/${item.id_sach}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          });
          if (!response.ok) throw new Error(`HTTP error: ${response.status}`);
          const data = await response.json();
          setBookData(data.data);
        } catch (error) {
          console.error("Error fetching book:", error.message);
        }
      };
      fetchBook();
    }, [item.id_sach]);

    const handlePress = () => {
      if (bookData) {
        navigation.navigate('ProductDetailScreen', { book: bookData });
      }
    };

    return (
      <View style={styles.container}>
        <View style={styles.productContainer}>
          <TouchableOpacity onPress={handlePress}>
            <Image
              source={{ uri: bookData?.anh || "https://via.placeholder.com/60" }}
              style={styles.productImage}
            />
          </TouchableOpacity>
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {bookData ? bookData.ten_sach : "Loading..."}
            </Text>
            <Text style={styles.quantity}>x{item.so_luong}</Text>
            <ShopDetail shopId={item.id_shop} />
          </View>
        </View>
        <View style={styles.footer}>
          <TouchableOpacity
            style={styles.reviewButton}
            onPress={() =>
              navigation.navigate("ManDanhGia", {
                bookImage: bookData?.anh || "https://via.placeholder.com/60",
                bookName: bookData?.ten_sach || "Unknown Product",
                bookId: item.id_sach,
                onReviewSuccess, // Pass callback
              })
            }
          >
            <Text style={styles.reviewText}>Đánh giá</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  });

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#ff4500" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
        <TouchableOpacity onPress={getOrdersToReview} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id_ctdh.toString()} // Ensure stable keys
      renderItem={({ item }) => (
        <ProductItem
          item={item}
          onReviewSuccess={() =>
            setProducts((prev) =>
              prev.filter((product) => product.id_ctdh !== item.id_ctdh)
            )
          }
        />
      )}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không có đơn hàng nào để đánh giá</Text>
      }
      initialNumToRender={5} // Render fewer items initially
      windowSize={5} // Reduce the number of items rendered outside the viewport
      removeClippedSubviews={true} // Optimize memory usage
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
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  productImage: {
    width: 60,
    height: 80,
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
    marginVertical: 5,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  shopName: {
    fontSize: 12,
    color: "gray",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 10,
  },
  reviewButton: {
    backgroundColor: "#ff4500",
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  reviewText: {
    color: "#fff",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "gray",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: "#ff4500",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  retryText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default ToReviewScreen;