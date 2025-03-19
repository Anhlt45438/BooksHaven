import React, { useState, useCallback } from 'react';
import { View, Text, Image, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRoute, RouteProp, useNavigation } from '@react-navigation/native';
import { useFocusEffect } from '@react-navigation/native'; // Thêm import này
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getShopInfo } from '../redux/shopSlice';

interface TheLoai {
    _id: string;
    id_the_loai: string;
    ten_the_loai: string;
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

interface Rating {
    _id: string;
    id_danh_gia: string;
    id_user: string;
    id_sach: string;
    danh_gia: number;
    binh_luan: string;
    ngay_tao: string;
    user_name?: string;
    user_avatar?: string;
}

type RootStackParamList = {
    ProductDetailScreen: { book: Book };
};

const ProductDetailScreen: React.FC = () => {
    const route = useRoute<RouteProp<RootStackParamList, 'ProductDetailScreen'>>();
    const { book } = route.params;
    const navigation = useNavigation();
    const dispatch = useAppDispatch();
    const shopState = useAppSelector((state) => state.shop);

    // State cho đánh giá
    const [averageRating, setAverageRating] = useState(0);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(false);
    const [ratings, setRatings] = useState<Rating[]>([]);

    // Gọi API để lấy thông tin shop
    React.useEffect(() => {
        if (book.id_shop) {
            dispatch(getShopInfo(book.id_shop));
        }
    }, [dispatch, book.id_shop]);

    // Hàm fetchRatings
    const fetchRatings = async (book: Book, page: number, limit: number) => {
        try {
            const url = `http://10.0.2.2:3000/api/ratings/book/${book.id_sach}?page=${page}&limit=${limit}`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data = await response.json();

            const ratingsWithUserInfo = await Promise.all(
                data.data.map(async (rating) => {
                    try {
                        const userResponse = await fetch(
                            `http://10.0.2.2:3000/api/users/user-info-account?user_id=${rating.id_user}`
                        );
                        if (!userResponse.ok) {
                            throw new Error(`Failed to fetch user: ${userResponse.status}`);
                        }
                        const userData = await userResponse.json();

                        return {
                            ...rating,
                            user_name: userData.username || 'Anonymous',
                            user_avatar: userData.avatar || null,
                        };
                    } catch (error) {
                        console.error(`Error fetching user ${rating.id_user}:`, error);
                        return {
                            ...rating,
                            user_name: 'Anonymous',
                            user_avatar: null,
                        };
                    }
                })
            );
            return {
                ...data,
                data: ratingsWithUserInfo,
            };
        } catch (error) {
            console.error('Error fetching ratings:', error);
            throw error;
        }
    };

    // Sử dụng useFocusEffect để tải lại dữ liệu khi màn hình được focus
    useFocusEffect(
        useCallback(() => {
            setLoading(true);
            // Reset page về 1 và clear ratings để tải lại từ đầu
            setPage(1);
            setRatings([]);
            fetchRatings(book, 1, 10)
                .then((result) => {
                    setRatings(result.data);
                    setAverageRating(result.average_rating || 0);
                    setTotalPages(result.pagination.totalPages || 1);
                    setLoading(false);
                })
                .catch((err) => {
                    console.error('Error in useFocusEffect:', err);
                    setLoading(false);
                });
        }, [book.id_sach]) // Dependency là book.id_sach
    );

    const formatPrice = (price: number) => price.toLocaleString('vi-VN');

    // Rating section
    const starFilled = require('../assets/icon_saovang.png');
    const starOutline = require('../assets/icon_saorong.png');
    const defaultAvatar = require('../assets/icons/user.png');

    const handleAddToCart = () => {
        console.log('Book added to cart:', book);
    };

    return (
        <ScrollView style={styles.container}>
            {/* Product Image */}
            <View style={styles.productImageContainer}>
                <Image source={{ uri: book.anh }} style={styles.productImage} />
            </View>

            {/* Overlay Icons */}
            <View style={styles.iconOverlay}>
                <TouchableOpacity style={styles.iconButton} onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/back.png')} style={styles.icon} />
                </TouchableOpacity>
                <View style={styles.rightIcons}>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={require('../assets/icons/support.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={require('../assets/icons/cart_user.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image source={require('../assets/icons/menu-dots.png')} style={styles.icon} />
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
                            <Image source={{ uri: shopState.shop.anh_shop }} style={styles.shopImage} />
                            <Text style={styles.shopName}>{shopState.shop.ten_shop}</Text>
                        </View>
                    ) : (
                        <Text style={styles.noShopText}>Không có thông tin shop</Text>
                    )}
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCart}>
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

            {/* Rating Section */}
            <View style={styles.ratingContainer}>
                <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                <View style={styles.ratingSummary}>
                    <Text style={styles.ratingValue}>{averageRating.toFixed(1)}</Text>
                    <View style={styles.ratingStars}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <Image
                                key={star}
                                source={star <= Math.floor(averageRating) ? starFilled : starOutline}
                                style={styles.star}
                            />
                        ))}
                    </View>
                </View>
                <TouchableOpacity
                    onPress={() =>
                        navigation.navigate('ManDanhGia' as never, {
                            bookImage: book.anh,
                            bookName: book.ten_sach,
                            bookId: book.id_sach,
                        } as never)
                    }
                >
                    <Text style={styles.viewDetail}>Viết đánh giá</Text>
                </TouchableOpacity>

                {/* Danh sách đánh giá */}
                {ratings.length > 0 ? (
                    ratings.map((rating, index) => (
                        <View key={`${rating._id}-${index}`} style={styles.ratingItem}>
                            <Image
                                source={rating.user_avatar ? { uri: rating.user_avatar } : defaultAvatar}
                                style={styles.userAvatar}
                            />
                            <View style={styles.ratingContent}>
                                <Text style={styles.userName}>{rating.user_name || 'Anonymous'}</Text>
                                <View style={styles.ratingStars}>
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Image
                                            key={star}
                                            source={star <= rating.danh_gia ? starFilled : starOutline}
                                            style={styles.star}
                                        />
                                    ))}
                                </View>
                                <Text style={styles.comment}>{rating.binh_luan}</Text>
                                <Text style={styles.date}>
                                    {new Date(rating.ngay_tao).toLocaleDateString()}
                                </Text>
                            </View>
                        </View>
                    ))
                ) : (
                    <Text style={styles.noRatingsText}>Chưa có đánh giá nào</Text>
                )}

                {/* Nút "Xem thêm" */}
                {page < totalPages && (
                    <TouchableOpacity onPress={() => setPage(page + 1)} style={styles.loadMoreButton}>
                        <Text style={styles.loadMoreText}>Xem thêm</Text>
                    </TouchableOpacity>
                )}

                {/* Trạng thái loading */}
                {loading && <Text style={styles.loadingText}>Đang tải...</Text>}
            </View>
        </ScrollView>
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
    ratingItem: {
        flexDirection: 'row',
        marginBottom: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 10,
    },
    userAvatar: {
        width: 50,
        height: 50,
        borderRadius: 25,
        marginRight: 10,
    },
    ratingContent: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
    },
    comment: {
        fontSize: 14,
        color: '#555',
        marginTop: 5,
    },
    date: {
        fontSize: 12,
        color: '#999',
        marginTop: 5,
    },
    loadMoreButton: {
        alignItems: 'center',
        padding: 10,
        backgroundColor: '#5908B0',
        borderRadius: 5,
        marginTop: 10,
    },
    loadMoreText: {
        color: '#fff',
        fontSize: 16,
    },
    noRatingsText: {
        fontSize: 16,
        color: '#777',
        textAlign: 'center',
        marginTop: 10,
    },
});