import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    FlatList,
    Alert,
} from "react-native";

import { getAccessToken } from "../redux/storageHelper";
import { useNavigation } from "@react-navigation/native";
import { useAppSelector } from "../redux/hooks";
import { useSelector } from "react-redux";

const DanggiaohangUser = () => {
    const [data, setData] = useState([]);
    const navigation = useNavigation();
    const shopState = useAppSelector(state => state.shop);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
 const [totalPages, setTotalPages] = useState(1);
   const [currentPage, setCurrentPage] = useState(1);
   const [bookData, setBookData] = useState(null);
   const userr = useSelector((state: any) => state.user.user);
    const getOrder = async (page) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            console.log("Không có accessToken");
            return;
        }

        try {
            const response = await fetch(
                `http://14.225.206.60:3000/api/orders/user?page=${page}&limit=10&status_order=đã nhận hàng`,
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
                (order) => order.trang_thai === "đã nhận hàng"
            );

            setData(filteredOrders);
            setTotalPages(orderData.pagination.totalPages)
            console.log("Dữ liệu đơn hàng:", data);

        } catch (error) {
            console.error("Lỗi khi tải đơn hàng:", error.message);
        }
    };


    useEffect(() => {
        getOrder(currentPage);
    }, [currentPage]);

    const createConversation = async () => {
        const accessToken = await getAccessToken();

        try {
            setLoading(true);
            // Lấy danh sách các cuộc hội thoại hiện có
            const response = await fetch(
                'http://14.225.206.60:3000/api/conversations?page=1&limit=20',
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );

            if (!response.ok) {
                throw new Error('Lỗi khi tải tin nhắn');
            }

            const data = await response.json();

            // Kiểm tra xem có cuộc hội thoại nào với id_user_2 === shopState.shop.id_user không
            const foundConversation = data.data.find(
                (conv: any) => conv.id_user_2 === shopState.shop.id_user,
            );

            if (foundConversation) {
                // Nếu đã có thì chuyển sang MessageDetail với cuộc hội thoại hiện có
                navigation.navigate('MessageDetail', {
                    shop: shopState.shop,
                    id_conversation: foundConversation.id_hoi_thoai, // hoặc: foundConversation.id_conversation nếu cần truyền id cụ thể
                });
            } else {
                // Nếu chưa có, tạo cuộc hội thoại mới
                const newConversation = {
                    id_user_2: shopState.shop.id_user,
                };

                const responseNew = await fetch(
                    'http://14.225.206.60:3000/api/conversations',
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${accessToken}`,
                        },
                        body: JSON.stringify(newConversation),
                    },
                );

                if (!responseNew.ok) {
                    throw new Error('Lỗi khi tạo cuộc trò chuyện');
                }

                const dataNew = await responseNew.json();
                console.log('datanew: ', dataNew);

                navigation.navigate('MessageDetail', {
                    shop: shopState.shop,
                    id_conversation: dataNew.data.id_hoi_thoai,
                });
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };


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
    const handleRebuy = async (orderDetails) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            Alert.alert('Không tìm thấy token!');
            return;
        }
    
        try {
            for (const detail of orderDetails) {
                const response = await fetch('http://14.225.206.60:3000/api/cart/add', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        id_sach: detail.id_sach,
                        id_user: userr._id,
                        so_luong: detail.so_luong,
                    }),
                });
    
                const result = await response.json();
    
                if (!response.ok) {
                    console.error("Lỗi khi thêm sản phẩm vào giỏ:", result.message);
                }else{
                    Alert.alert(
                        'Thành công',
                        'Đã thêm các sản phẩm vào giỏ hàng!',
                        [
                          {
                            text: 'OK',
                            onPress: () =>
                                navigation.navigate('HomeTabBottom', {
                                    screen: 'ShopcartScreen',
                                  })                                  
                          },
                        ]
                      );
                      
                      
                }
            }
        } catch (error) {
            console.error('Lỗi khi thực hiện mua lại:', error);
            Alert.alert('Lỗi kết nối khi mua lại!');
        }
    };
    const ProductCard = ({ item }) => {

        const formatPrice = (price) => {
            return price != null
              ? new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price)
              : 'Đang tải';
          };
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
                            <Text style={styles.highlight}>{formatPrice(item.tong_tien)}</Text>
                        </Text>
                        <View style={styles.buttonContainer}>
                        <TouchableOpacity
  style={styles.cancelButton}
  onPress={() => handleRebuy(item.details)}
>
  <Text style={styles.buttonText}>Mua lại</Text>
</TouchableOpacity>


              <TouchableOpacity style={styles.contactButton} onPress={createConversation}>
                            <Text style={styles.contactText}>Liên hệ Shop</Text>
                        </TouchableOpacity>
            </View>
                        
                    </View>
                </TouchableOpacity>
            </View>
        );
    };

    return (
 <View style={{ flex: 1 }}>
        <FlatList
            data={data}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <ProductCard item={item} />}
            ListEmptyComponent={
                <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
            }
        />
 <View style={styles.pagination}>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <TouchableOpacity
                key={page}
                onPress={() => setCurrentPage(page)}
                style={[
                  styles.pageButton,
                  currentPage === page && styles.pageButtonActive,
                ]}
              >
                <Text style={styles.pageText}>{page}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        </View>
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
    },pagination: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 16,
        flexWrap: 'wrap',
      },
      pageButton: {
        padding: 10,
        margin: 4,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: '#ccc',
      },
      pageButtonActive: {
        backgroundColor: '#007bff',
      },
      pageText: {
        color: '#000',
      },  buttonContainer: {
        flexDirection: "column", // Chuyển nút "Hủy" lên trên
        marginTop: 10,
        alignItems: "center",
      },
      cancelButton: {
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

export default DanggiaohangUser;