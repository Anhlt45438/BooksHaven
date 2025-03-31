import React, {useEffect, useState} from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList, ImageBase,
} from "react-native";
import {getAccessToken} from "../redux/storageHelper";
import {useNavigation} from "@react-navigation/native";

const ToReviewScreen = () => {
    const [products, setProducts] = useState([]);
    const navigation = useNavigation();

    const getOrdersToReview = async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
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

            if (!Array.isArray(orderData.data)) {
                console.error("Lỗi: orderData.data không phải là một mảng!", orderData);
                setProducts([]);
                return;
            }

            // Lọc đơn hàng có trạng thái "đã nhận hàng"
            const filteredOrders = orderData.data.filter(
                (order) => order.trang_thai === "đã nhận hàng"
            );

            // Tách từng sản phẩm thành một item riêng, kèm thông tin shop
            const productList = [];
            for (const order of filteredOrders) {
                for (const detail of order.details) {
                    productList.push({
                        ...detail,
                        id_shop: order.id_shop,
                        orderId: order._id,
                    });
                }
            }

            setProducts(productList);
        } catch (error) {
            console.error("Lỗi khi lấy đơn hàng:", error.message);
        }
    };

    useEffect(() => {
        getOrdersToReview();
    }, []);

    const ShopDetail = ({shopId}) => {
        const [shopData, setShopData] = useState(null);

        useEffect(() => {
            const fetchShop = async () => {
                const accessToken = await getAccessToken();
                if (!accessToken) return;

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
                <Text style={styles.shopName}>
                    {shopData ? shopData.ten_shop : "Đang tải..."}
                </Text>
            </View>
        );
    };

    const ProductItem = ({item}) => {
        const [bookData, setBookData] = useState(null);

        useEffect(() => {
            const fetchBook = async () => {
                const accessToken = await getAccessToken();
                if (!accessToken) return;
                try {
                    const response = await fetch(
                        `http://14.225.206.60:3000/api/books/${item.id_sach}`,
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
                    // console.error("Lỗi khi tải sách:", error.message);
                }
            };
            fetchBook();
        }, [item.id_sach]);

        return (
            <View style={styles.container}>
                <View style={styles.productContainer}>
                    <Image
                        source={{uri: bookData?.anh || "https://via.placeholder.com/60"}}
                        style={styles.productImage}
                    />
                    <View style={styles.productInfo}>
                        <Text style={styles.productTitle} numberOfLines={2}>
                            {bookData ? bookData.ten_sach : "Đang tải..."}
                        </Text>
                        <Text style={styles.quantity}>x{item.so_luong}</Text>
                        {/* Hiển thị tên shop bên dưới */}
                        <ShopDetail shopId={item.id_shop}/>
                    </View>
                </View>
                <View style={styles.footer}>
                    <TouchableOpacity
                        style={styles.reviewButton}
                        onPress={() =>
                        navigation.navigate("ManDanhGia", {
                            bookImage: bookData?.anh || require('../assets/images/image3.png'),
                            bookName: bookData?.ten_sach || "Sản phẩm không xác định",
                            bookId: item.id_sach,
                        })
                    }
                    >
                        <Text style={styles.reviewText}>Đánh giá</Text>
                    </TouchableOpacity>
                </View>
            </View>
        );
    };

    return (
        <FlatList
            data={products}
            keyExtractor={(item) => item.id_ctdh}
            renderItem={({item}) => <ProductItem item={item}/>}
            ListEmptyComponent={
                <Text style={styles.emptyText}>Không có đơn hàng nào để đánh giá</Text>
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
    productContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'center',
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
    shopLogo: {
        width: 20,
        height: 20,
        borderRadius: 10,
        marginRight: 5,
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
});

export default ToReviewScreen;