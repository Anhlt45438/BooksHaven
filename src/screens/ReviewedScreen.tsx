import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { getAccessToken } from "../redux/storageHelper";
import { useAppSelector } from "../redux/hooks";
import { useNavigation } from "@react-navigation/native";

const ReviewedScreen = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const user = useAppSelector((state) => state.user.user);
  const userId = user?._id || "67d65042accb77562503bfb2";
  const navigation = useNavigation();
  const baseUrl = "http://14.225.206.60:3000/api";

  const checkIfRated = async (bookId) => {
    const accessToken = await getAccessToken();
    if (!accessToken || !userId) return null;

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
      if (data.is_rated_from_user_id) {
        const userReview = data.data.find((review) => review.id_user === userId);
        return userReview ? { ...userReview, is_rated: true } : null;
      }
      return null;
    } catch (error) {
      console.error("Error checking review status:", error.message);
      return null;
    }
  };

  const getReviewedProducts = useCallback(async () => {
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
          const reviewData = await checkIfRated(detail.id_sach);
          if (reviewData && reviewData.is_rated) {
            productList.push({
              ...detail,
              id_shop: order.id_shop,
              orderId: order._id,
              danh_gia: reviewData.danh_gia,
              binh_luan: reviewData.binh_luan,
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
    const unsubscribe = navigation.addListener("focus", () => {
      getReviewedProducts();
    });

    return unsubscribe;
  }, [navigation, getReviewedProducts]);

  useEffect(() => {
    getReviewedProducts();
  }, [getReviewedProducts]);

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

  const ReviewCard = React.memo(({ item }) => {
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

    const saovang = require('../assets/icon_saovang.png');
    const saorong = require('../assets/icon_saorong.png');

    const handlePress = () => {
      if (bookData) {
        navigation.navigate('ProductDetailScreen', { book: bookData });
      }
    };

    return (
      <TouchableOpacity style={styles.container} onPress={handlePress}>
        <View style={styles.productContainer}>
          <Image
            source={{ uri: bookData?.anh || "https://via.placeholder.com/60" }}
            style={styles.productImage}
          />
          <View style={styles.productInfo}>
            <Text style={styles.productTitle} numberOfLines={2}>
              {bookData ? bookData.ten_sach : "Loading..."}
            </Text>
            <ShopDetail shopId={item.id_shop} />
            <View style={styles.stars}>
              {[1, 2, 3, 4, 5].map((star) => (
                <Image
                  key={star}
                  source={star <= item.danh_gia ? saovang : saorong}
                  style={styles.star}
                />
              ))}
            </View>
          </View>
        </View>
      </TouchableOpacity>
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
        <TouchableOpacity onPress={getReviewedProducts} style={styles.retryButton}>
          <Text style={styles.retryText}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <FlatList
      data={products}
      keyExtractor={(item) => item.id_ctdh.toString()}
      renderItem={({ item }) => <ReviewCard item={item} />}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không có đánh giá nào</Text>
      }
      initialNumToRender={5}
      windowSize={5}
      removeClippedSubviews={true}
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
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 5,
  },
  shopName: {
    fontSize: 12,
    color: "gray",
  },
  stars: {
    flexDirection: "row",
    marginVertical: 5,
  },
  star: {
    width: 20,
    height: 20,
    marginRight: 2,
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

export default ReviewedScreen;