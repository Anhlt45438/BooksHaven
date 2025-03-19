import React, {useCallback, useEffect, useRef, useState} from 'react';
import {View, Text, Image, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useRoute, RouteProp, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {getShopInfo} from '../redux/shopSlice';
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { useSelector } from 'react-redux';

interface TheLoai {
    _id: string;
    id_the_loai: string;
    ten_the_loai: string;
}

interface UserType {
    _id?:  ObjectId;
    username: string;
    password: string; 
    sdt?: string, 
    email: string,
    dia_chi?: string, 
    avatar?: string, 
    trang_thai: AccountStatus,
    accessToken: string;
}

interface Book {
    _id: string;
    id_sach: string;
    ten_sach: string;
    tac_gia: string;
    mo_ta: string;
    gia: number;
    so_luong: number;
    anh: string;
    trang_thai: string | null;
    so_trang: number;
    kich_thuoc: string;
    id_shop: string;
    the_loai: TheLoai[];
}

type RootStackParamList = {
    ProductDetailScreen: { book: Book };
};



const ProductDetailScreen: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'ProductDetailScreen'>>();
    const {book} = route.params;
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const shopState = useAppSelector((state) => state.shop);
    const [quantity, setQuantity] = useState(1);
    
// Tăng / giảm số lượng sản phẩm
const increaseQuantity = () => setQuantity((prev) => prev + 1);
const decreaseQuantity = () => setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    useEffect(() => {
        if (book.id_shop) {
            dispatch(getShopInfo(book.id_shop));
        }
    }, [dispatch, book.id_shop]);

    const handleSnapPress = useCallback((index) => {
      bottomSheetRef.current?.snapToIndex(index)
      setisopen(true)
    }, [])

    const formatPrice = (price: number) => price.toLocaleString('vi-VN');

    // Rating section (dummy data for now)
    const averageRating = 4.0;
    const fullStars = Math.floor(averageRating);
    const starFilled = require('../assets/icon_saovang.png');
    const starOutline = require('../assets/icon_saorong.png');
    const userr = useSelector((state: any) => state.user.user); // Lấy user từ Redux Store
    console.log("user id : "+userr?._id);
    
  
    const addToCart = async () => {
        if (!userr?._id) {
            alert("Vui lòng đăng nhập trước khi thêm vào giỏ hàng!");
            return;
        }
    
        try {
            const response = await fetch("http://10.0.2.2:3000/api/cart/add", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${userr?.accessToken}`, // Truyền token từ user
                },
                body: JSON.stringify({
                    id_sach: book._id,
                    id_user: userr._id,  // Nếu cần ID user
                    so_luong: quantity,  // Số lượng sản phẩm
                }),
            });
    
            const data = await response.json();
            if (response.ok) {
                alert("Thêm vào giỏ hàng thành công!");
            } else {
                alert(`Lỗi: ${data.message}`);
            }
        } catch (error) {
            console.error("Error adding to cart:", error);
            alert("Lỗi kết nối đến server!");
        }
    };
    
    const bottomSheetRef = useRef<BottomSheet>(null);
    const snapPoints = ["40%"]
    const [isopen, setisopen] = useState(true);
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView style={styles.container}>
            {/* Product Image */}
            <View style={styles.productImageContainer}>
                <Image source={{uri: book.anh}} style={styles.productImage}/>
            </View>

            {/* Overlay Icons */}
            <View style={styles.iconOverlay}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/back.png')} style={styles.icon}/>
                </TouchableOpacity>
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={require('../assets/icons/support.png')} style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton} 
                    onPress={navigation.navigate('ManGioHang')}>
                        <Image source={require('../assets/icons/cart_user.png')} style={styles.icon}/>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={require('../assets/icons/menu-dots.png')} style={styles.icon}/>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Product Info */}
            <View style={styles.infoContainer}>
                <Text style={styles.bookTitle}>{book.ten_sach}</Text>
                <Text style={styles.author}>Tác giả: {book.tac_gia}</Text>
                <Text style={styles.price}>Giá: {formatPrice(book.gia)}đ</Text>

                {/* Shop Info */}
                <View style={styles.shopInfoContainer}>
                    {shopState.loading ? (
                        <Text style={styles.loadingText}>Đang tải thông tin shop...</Text>
                    ) : shopState.error ? (
                        <Text style={styles.errorText}>{shopState.error}</Text>
                    ) : shopState.shop ? (
                        <View style={styles.shopInfo}>
                            <Image source={{uri: shopState.shop.anh_shop}} style={styles.shopImage}/>
                            <Text style={styles.shopName}>{shopState.shop.ten_shop}</Text>
                        </View>
                    ) : (
                        <Text style={styles.noShopText}>Không có thông tin shop</Text>
                    )}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.addToCartButton} 
                    // onPress={handleAddToCart}
                    onPress={() => handleSnapPress(0)}>
                        <Text style={styles.addToCartButtonText}>Thêm vào giỏ hàng</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.buyNowButton}>
                        <Text style={styles.buyNowButtonText}>Mua Ngay</Text>
                    </TouchableOpacity>
                </View>


                {/* Product Description */}
                <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                <Text style={styles.description}>{book.mo_ta}</Text>

                {/* Product Details */}
                <Text style={styles.sectionTitle}>Thông tin chi tiết</Text>
                <View style={styles.detailContainer}>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Số trang:</Text>
                        <Text style={styles.detailValue}>{book.so_trang}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Kích thước:</Text>
                        <Text style={styles.detailValue}>{book.kich_thuoc}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Số lượng:</Text>
                        <Text style={styles.detailValue}>{book.so_luong}</Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Trạng thái:</Text>
                        <Text style={styles.detailValue}>
                            {book.trang_thai ? book.trang_thai : 'Không xác định'}
                        </Text>
                    </View>
                    <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Thể loại:</Text>
                        <Text style={styles.detailValue}>
                            {book.the_loai.map((tl) => tl.ten_the_loai).join(', ')}
                        </Text>
                    </View>
                </View>
            </View>

            {/* Rating Summary Section */}
            <View style={styles.ratingContainer}>
                <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                <View style={styles.ratingSummary}>
                    <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
                    <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Image
                                key={star}
                                source={star <= fullStars ? starFilled : starOutline}
                                style={styles.star}
                            />
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() => navigation.navigate('ManDanhGia' as never, {
                        bookImage: book.anh,
                        bookName: book.ten_sach,
                    } as never)}
                >
                    <Text style={styles.viewDetail}>Xem chi tiết</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>

         {/* BottomSheet */}
         <BottomSheet ref={bottomSheetRef} snapPoints={snapPoints} enablePanDownToClose={true}>
  <BottomSheetView style={styles.bottomSheetContainer}>
    {/* Hàng ngang chứa ảnh và nội dung */}
    <View style={styles.sheetContent1}>
      {/* Ảnh sách */}
      <Image
        source={{ uri: book.anh }}
        style={styles.bookImage}
      />

      {/* Nội dung */}
      <View style={styles.textContainer}>
        <Text style={styles.bookTitle}>{book.ten_sach}</Text>
        <Text style={styles.price1}>{book.gia}</Text>
      </View>

      {/* Nút đóng */}
      <TouchableOpacity style={styles.closeButton1} onPress={() => bottomSheetRef.current?.close()}>
        <Image source={require("../assets/image/close.png")} style={styles.closeIcon} />
      </TouchableOpacity>
    </View>

    {/* Chọn số lượng sản phẩm */}
    <View style={styles.quantityContainer}>
      <Text style={styles.quantityLabel}>{book.so_trang}</Text>
      <View style={styles.quantityControls}>
        <TouchableOpacity onPress={decreaseQuantity}>
          <Image source={require("../assets/image/minus.png")} 
          style={styles.quantityButton} />
        </TouchableOpacity>
        <Text style={styles.quantityText}>{quantity}</Text>
        <TouchableOpacity  onPress={increaseQuantity}>
          <Image source={require("../assets/image/plus.png")} style={styles.quantityButton} />
        </TouchableOpacity>
      </View>
    </View>

    {/* Nút mua hàng */}
    <TouchableOpacity style={styles.buyButton} 
   onPress={() => addToCart}
>
      <Text style={styles.buyButtonText}>Thêm vào giỏ hàng</Text>
    </TouchableOpacity>
  </BottomSheetView>
</BottomSheet>
        </GestureHandlerRootView>
    );
};

export default ProductDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
    },
    productImageContainer: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    productImage: {
        width: '80%',
        height: 350,
        resizeMode: 'cover',
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        marginTop: 10,
    }, bottomSheetContainer: {
      padding: 20,
      backgroundColor: "#fff",
      borderRadius: 15,
    },
    sheetContent1: {
      flexDirection: "row",
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
    iconOverlay: {
        position: 'absolute',
        top: 20,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    iconButton: {
        backgroundColor: 'rgba(0, 0, 0, 0.4)',
        padding: 8,
        borderRadius: 30,
        marginHorizontal: 5,
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    rightIcons: {
        flexDirection: 'row',
    },
    infoContainer: {
        padding: 20,
        backgroundColor: '#fff',
        marginTop: -20,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: -2},
        shadowOpacity: 0.1,
        shadowRadius: 5,
        elevation: 3,
    },
    bookTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    author: {
        fontSize: 18,
        color: '#777',
        marginBottom: 10,
    },
    price: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginBottom: 20,
    },
    shopInfoContainer: {
        marginVertical: 20,
    },
    shopInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#f9f9f9',
        padding: 10,
        borderRadius: 10,
    },
    shopImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginRight: 15,
    },
    shopName: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
    },
    loadingText: {
        fontSize: 16,
        color: '#555',
        marginBottom: 20,
    },
    errorText: {
        fontSize: 16,
        color: 'red',
        marginBottom: 20,
    },
    noShopText: {
        fontSize: 16,
        color: '#777',
        marginBottom: 20,
    },
    buttonRow: {
        flexDirection: 'row',
        marginTop: 20,
        width: '100%',
        justifyContent:'center',
    },
    buyNowButton: {
        backgroundColor: '#d32f2f',
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginLeft: 10,
        width: '48%',
    },
    buyNowButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    addToCartButton: {
        backgroundColor: '#fff',
        borderColor: '#d32f2f',
        borderWidth: 1,
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: 'center',
        width: '48%',
        marginRight: 10,
    },
    addToCartButtonText: {
        color: '#d32f2f',
        fontSize: 18,
        fontWeight: 'bold',
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        color: '#333',
        marginTop: 20,
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        color: '#555',
        lineHeight: 24,
    },
    detailContainer: {
        backgroundColor: '#fafafa',
        padding: 15,
        borderRadius: 10,
        marginTop: 20,
    },
    detailRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    detailLabel: {
        fontSize: 16,
        color: '#777',
        flex: 1,
    },
    detailValue: {
        fontSize: 16,
        color: '#333',
        fontWeight: '500',
        flex: 2,
        textAlign: 'right',
    },
    ratingContainer: {
        marginVertical: 20,
        padding: 10,
        backgroundColor: '#fafafa',
        borderRadius: 10,
    },
    ratingSummary: {
        alignItems: 'center',
        flexDirection: 'row',
    },
    ratingValue: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000000',
        marginRight: 30,
    },
    ratingStars: {
        flexDirection: 'row',
        marginVertical: 5,
    },
    star: {
        width: 20,
        height: 20,
        marginHorizontal: 2,
    },
    viewDetail: {
        marginTop: 30,
        fontSize: 16,
        color: '#5908B0',
        textDecorationLine: 'underline',
        textAlign: "center",
    },
});
