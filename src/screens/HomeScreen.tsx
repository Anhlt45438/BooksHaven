import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks.tsx';
import { fetchCategories } from '../redux/categorySlice';
import { fetchBooks } from '../redux/bookSlice';
import { fetchCart } from '../redux/cartSlice.tsx';

const { width, height } = Dimensions.get('window');

// Định nghĩa interface
interface Category {
    _id: string;
    id_the_loai: string;
    ten_the_loai: string;
}

interface Book {
    _id: string;
    ten_sach: string;
    gia: number;
    anh: string;
    trang_thai: boolean;
}

// Danh sách ảnh thể loại
const categoryImages: { [key: string]: any } = {
    'Tâm lý': require('../assets/image/cate_stl.jpg'),
    'Sách giáo khoa': require('../assets/image/cate_sgk.jpg'),
    'Tiểu thuyết': require('../assets/image/cate_tt.jpg'),
    'Truyện tranh': require('../assets/image/image.jpg'),
    'Khoa học': require('../assets/image/cate_kh.jpg'),
    'Kinh tế': require('../assets/image/cate_kt.jpg'),
    'Lịch sử': require('../assets/image/cate_ls.jpg'),
};

// Component chính
const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    // Lấy dữ liệu từ Redux
    const cartItemCount = useAppSelector((state) => state.cart.totalItems);
    const categoryState = useAppSelector((state) => state.categories);
    const bookState = useAppSelector((state) => state.books);

    // State cho phân trang
    const [page, setPage] = useState(1);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [hasMore, setHasMore] = useState(true);

    // Unwrap dữ liệu từ API
    const categoriesList =
        categoryState.categories?.data !== undefined
            ? categoryState.categories.data
            : categoryState.categories;
    const booksList =
        bookState.books?.data !== undefined ? bookState.books.data : bookState.books;

    // Lọc sách đã được duyệt
    const activeBookList = booksList?.filter((book: Book) => book.trang_thai === true) || [];

    // Tính trạng thái loading và error
    const loading = categoryState.loading || bookState.loading;
    const error = categoryState.error || bookState.error;

    // Fetch dữ liệu khi component mount
    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchBooks({ page: 1, limit: 20 }));
    }, [dispatch]);

    // Cập nhật danh sách sách khi dữ liệu từ Redux thay đổi
    useEffect(() => {
        const booksList = bookState.books?.data !== undefined ? bookState.books.data : bookState.books;
        const activeBookList = booksList?.filter((book: Book) => book.trang_thai === true) || [];

        if (activeBookList.length >= 0) { // Luôn chạy để cập nhật ngay cả khi mảng rỗng
            if (page === 1) {
                setAllBooks(activeBookList);
            } else if (activeBookList.length > 0) {
                setAllBooks((prevBooks) => {
                    const newBooks = activeBookList.filter(
                        (newBook) => !prevBooks.some((book) => book._id === newBook._id)
                    );
                    return [...prevBooks, ...newBooks];
                });
            }
            // Kiểm tra xem còn dữ liệu để tải không
            setHasMore(activeBookList.length === 20); // Chỉ có thêm dữ liệu nếu trả về đúng 20 sách
        }
    }, [bookState.books, page]); // Dependency là bookState.books, không phải activeBookList

    // Fetch giỏ hàng khi màn hình được focus
    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchCart());
        }, [dispatch])
    );

    // Hàm tải thêm sách khi cuộn đến cuối
    const loadMoreBooks = () => {
        if (!bookState.loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(fetchBooks({ page: nextPage, limit: 20 }));
        }
    };

    // Hàm định dạng giá tiền
    const formatPrice = (price: any): string => {
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) return 'Liên hệ';
        return numericPrice.toLocaleString('vi-VN');
    };

    // Render một thể loại
    const renderCategoryItem = ({ item }: { item: Category }) => {
        const localImage = categoryImages[item.ten_the_loai] || require('../assets/image/cate_tt.jpg');
        return (
            <TouchableOpacity
                style={styles.categoryItem}
                onPress={() =>
                    navigation.navigate('CategoryDetail' as never, {
                        categoryId: item._id,
                        categoryName: item.ten_the_loai,
                    } as never)
                }
            >
                <Image source={localImage} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.ten_the_loai}</Text>
            </TouchableOpacity>
        );
    };

    // Render một cuốn sách (danh sách ngang)
    const renderBookItem = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.productCard1}
            onPress={() =>
                navigation.navigate('ProductDetailScreen' as never, { book: item } as never)
            }
        >
            <Image source={{ uri: item.anh }} style={styles.productImage} />
            <Text style={styles.bookTitle} numberOfLines={1}>{item.ten_sach}</Text>
            <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
        </TouchableOpacity>
    );

    // Render một cuốn sách (danh sách dọc)
    const renderBookItemVertical = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.productCard2}
            onPress={() =>
                navigation.navigate('ProductDetailScreen' as never, { book: item } as never)
            }
        >
            <Image source={{ uri: item.anh }} style={styles.productImage} />
            <Text style={styles.bookTitle} numberOfLines={2}>{item.ten_sach}</Text>
            <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
        </TouchableOpacity>
    );

    // Hiển thị loading
    if (loading && page === 1) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    // Hiển thị lỗi
    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    // Giao diện chính
    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Tìm kiếm sách..."
                    placeholderTextColor="#aaa"
                />
                <View style={styles.iconsContainer}>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('ManGioHang')}
                    >
                        <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon} />
                        {cartItemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartItemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <Image source={require('../assets/image/conversation.png')} style={styles.icon} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>9</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {/* Danh sách chính */}
            <FlatList
                ListHeaderComponent={
                    <>
                        <Image source={require('../assets/image/image.png')} style={styles.bannerImage} />
                        <Text style={styles.sectionTitle}>Thể loại nổi bật</Text>
                        <FlatList
                            data={categoriesList}
                            keyExtractor={(item: Category) => item._id}
                            renderItem={renderCategoryItem}
                            numColumns={4}
                            scrollEnabled={false}
                            columnWrapperStyle={{ justifyContent: 'space-around' }}
                        />
                        <Text style={styles.sectionTitle}>Sách Hot</Text>
                        <FlatList
                            horizontal
                            data={booksList}
                            keyExtractor={(item: Book) => item._id}
                            renderItem={renderBookItem}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                        />
                        <Text style={styles.sectionTitle}>Tất cả sách</Text>
                    </>
                }
                data={allBooks}
                keyExtractor={(item: Book) => item._id}
                numColumns={2}
                renderItem={renderBookItemVertical}
                contentContainerStyle={styles.productList}
                onEndReached={loadMoreBooks}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    bookState.loading && page > 1 ? (
                        <View style={{ padding: 10 }}>
                            <Text style={{ textAlign: 'center' }}>Đang tải thêm...</Text>
                        </View>
                    ) : !hasMore ? (
                        <View style={{ padding: 10 }}>
                            <Text style={{ textAlign: 'center' }}>Đã tải hết sách</Text>
                        </View>
                    ) : null
                }
            />
        </View>
    );
};

export default HomeScreen;

// Styles
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingHorizontal: 16,
        paddingVertical: 12,
    },
    searchBar: {
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 12,
        borderRadius: 5,
        color: '#333',
        marginRight: 10,
    },
    iconsContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconWrapper: {
        position: 'relative',
        marginLeft: 10,
    },
    icon: {
        width: 26,
        height: 26,
        tintColor: '#fff',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -5,
        backgroundColor: '#ff4242',
        borderRadius: 10,
        width: 13,
        height: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: 'white',
        fontSize: 10,
        fontWeight: 'bold',
    },
    bannerImage: {
        width: '100%',
        height: height * 0.25,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginVertical: 10,
        color: '#333',
        paddingLeft: 10,
    },
    categoryItem: {
        alignItems: 'center',
        width: '25%',
        paddingVertical: 10,
        marginVertical: 5,
    },
    categoryImage: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginBottom: 5,
        borderWidth: 2,
        borderColor: '#fff',
    },
    categoryText: {
        fontSize: 13,
        fontWeight: '600',
        textAlign: 'center',
    },
    productCard: {
        backgroundColor: '#fff',
        marginRight: 15,
        padding: 10,
        borderRadius: 10,
        width: 140,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    productCard1: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
        margin: 8,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: 150,
    },
    productCard2: {
        backgroundColor: '#fff',
        margin: 8,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '48%',
    },
    productImage: {
        width: 140,
        height: 160,
        borderRadius: 10,
        marginBottom: 8,
    },
    bookTitle: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        color: '#333',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginTop: 'auto',
        textAlign: "center",
    },
    productList: {
        paddingBottom: 20,
    },
});