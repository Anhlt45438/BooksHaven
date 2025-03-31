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
    ActivityIndicator,
} from 'react-native';

import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { fetchCategories } from '../redux/categorySlice';
import { fetchBooks } from '../redux/bookSlice';

import { useAppDispatch, useAppSelector } from '../redux/hooks.tsx';
import { fetchCart } from '../redux/cartSlice.tsx';

const { width, height } = Dimensions.get('window');

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

const categoryImages: { [key: string]: any } = {
    'Tâm lý': require('../assets/image/cate_stl.jpg'),
    'Truyện tranh': require('../assets/image/image.jpg'),
    'Sách giáo khoa': require('../assets/image/cate_sgk.jpg'),
    'Tiêu thuyết': require('../assets/image/cate_tt.jpg'),
    'Khoa học': require('../assets/image/cate_kh.jpg'),
    'Kinh tế': require('../assets/image/cate_kt.jpg'),
    'Lịch sử': require('../assets/image/cate_ls.jpg'),
};

const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const cartItemCount = useAppSelector(state => state.cart.totalItems);
    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchCart());
        }, []),
    );

    // Lấy state từ Redux
    const categoryState = useAppSelector(state => state.categories);
    const bookState = useAppSelector(state => state.books);

    // Unwrap data nếu API trả về dạng object có key "data"
    const categoriesList =
        categoryState.categories?.data !== undefined
            ? categoryState.categories.data
            : categoryState.categories;

    // State cho phân trang
    const [page, setPage] = useState<number>(1);
    const [allBooks, setAllBooks] = useState<Book[]>([]);
    const [isLoadingMore, setIsLoadingMore] = useState<boolean>(false);
    const [hasMore, setHasMore] = useState<boolean>(true);

    // Tính loading và error tổng hợp
    const loading = categoryState.loading || bookState.loading;
    const error = categoryState.error || bookState.error;
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);

    // Lọc sách đã được duyệt
    const activeBookList = allBooks.filter((book: Book) => book.trang_thai === true) || [];

    useEffect(() => {
        dispatch(fetchCategories());
        loadBooks(1); // Load trang đầu tiên khi component mount
    }, [dispatch]);

    // Hàm load sách theo trang
    const loadBooks = async (pageNum: number) => {
        if (isLoadingMore || !hasMore) return;

        try {
            setIsLoadingMore(true);
            const response = await dispatch(fetchBooks({ page: pageNum, limit: 20 })).unwrap();
            const newBooks = response.data || response; // Xử lý cấu trúc response

            if (newBooks.length === 0) {
                setHasMore(false); // Không còn sách để load
            } else {
                setAllBooks(prevBooks => [...prevBooks, ...newBooks]); // Nối danh sách sách mới
                setPage(pageNum); // Cập nhật trang hiện tại
            }
        } catch (err: any) {
            console.error('Lỗi loadBooks:', err);
        } finally {
            setIsLoadingMore(false);
        }
    };

    // Xử lý khi kéo đến cuối danh sách
    const handleLoadMore = () => {
        if (!isLoadingMore && hasMore) {
            const nextPage = page + 1;
            loadBooks(nextPage);
        }
    };

    // Hàm format giá tiền
    const formatPrice = (price: any): string => {
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) return 'Liên hệ';
        return numericPrice.toLocaleString('vi-VN');
    };

    // Render thể loại
    const renderCategoryItem = ({ item }: { item: Category }) => {
        const localImage = categoryImages[item.ten_the_loai]
            ? categoryImages[item.ten_the_loai]
            : require('../assets/image/image.jpg');
        return (
            <TouchableOpacity
                style={styles.categoryItem}
                onPress={() => {
                    navigation.navigate(
                        'CategoryDetail' as never,
                        { categoryId: item._id, categoryName: item.ten_the_loai } as never,
                    );
                }}>
                <Image source={localImage} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.ten_the_loai}</Text>
            </TouchableOpacity>
        );
    };

    // Render sách (danh sách ngang)
    const renderBookItemVertical = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.productCard2}
            onPress={() => navigation.navigate('ProductDetailScreen' as never, { book: item } as never)}
        >
            <Image source={{ uri: item.anh }} style={styles.productImage} />
            <Text style={styles.bookTitle} numberOfLines={2}>{item.ten_sach}</Text>
            <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
        </TouchableOpacity>
    );

    // Render sách trong overlay tìm kiếm
    const renderBookItem11 = ({ item }: { item: Book }) => (
        <View style={styles.overlayContainer}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate("ProductDetailScreen" as never, { book: item } as never);
                    setSearchQuery('');
                }}>
                <View style={styles.productCard11}>
                    <Image source={{ uri: item.anh }} style={styles.productImage1} />
                    <View style={{ flex: 1, paddingStart: 20 }}>
                        <Text style={styles.bookTitle} numberOfLines={1}>{item.ten_sach}</Text>
                        <Text style={styles.price}>{item.gia}đ</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    // Xử lý tìm kiếm
    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredBooks([]);
        } else {
            const filtered = allBooks.filter(book =>
                book.ten_sach.toLowerCase().includes(text.toLowerCase())
            );
            setFilteredBooks(filtered);
        }
    };

    if (loading && page === 1) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, { justifyContent: 'center', alignItems: 'center' }]}>
                <Text style={{ color: 'red' }}>{error}</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            {/* HEADER */}
            <View style={styles.header}>
                <TextInput
                    style={styles.searchBar}
                    placeholder="Tìm kiếm sách..."
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={handleSearch}
                />
                <View style={styles.iconsContainer}>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('ManGioHang')}>
                        <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon} />
                        {cartItemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartItemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('Message')}>
                        <Image source={require('../assets/image/conversation.png')} style={styles.icon} />
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>9</Text>
                        </View>
                    </TouchableOpacity>
                </View>
            </View>

            {searchQuery.length > 0 && (
                <View style={styles.searchOverlay}>
                    <FlatList
                        data={filteredBooks}
                        keyExtractor={(item) => item._id}
                        renderItem={renderBookItem11}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            )}

            <FlatList
                ListHeaderComponent={
                    <>
                        {/* BANNER */}
                        <Image
                            source={require('../assets/image/image.png')}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                        {/* CATEGORIES */}
                        <Text style={styles.sectionTitle}>Thể loại nổi bật</Text>
                        <FlatList
                            data={categoriesList}
                            keyExtractor={(item: Category) => item._id}
                            renderItem={renderCategoryItem}
                            numColumns={4}
                            scrollEnabled={false}
                            columnWrapperStyle={{ justifyContent: 'space-around' }}
                        />
                        {/* BOOKS - danh sách ngang */}
                        <Text style={styles.sectionTitle}>Sách Hot</Text>
                        <FlatList
                            horizontal
                            data={allBooks.slice(0, 10)} // Giới hạn 10 sách hot
                            keyExtractor={(item: Book) => item._id}
                            renderItem={renderBookItemVertical}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 10 }}
                        />
                        <Text style={styles.sectionTitle}>Tất cả sách</Text>
                    </>
                }
                data={activeBookList}
                keyExtractor={(item: Book) => item._id}
                numColumns={2}
                renderItem={({ item }: { item: Book }) => (
                    <TouchableOpacity
                        style={styles.productCard1}
                        onPress={() =>
                            navigation.navigate(
                                'ProductDetailScreen' as never,
                                { book: item } as never,
                            )
                        }>
                        <Image source={{ uri: item.anh }} style={styles.productImage} />
                        <Text style={styles.bookTitle} numberOfLines={2}>{item.ten_sach}</Text>
                        <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.productList}
                onEndReached={handleLoadMore} // Gọi khi kéo đến cuối
                onEndReachedThreshold={0.5} // Kích hoạt khi còn 50% chiều cao danh sách
                ListFooterComponent={
                    isLoadingMore ? (
                        <ActivityIndicator size="large" color="#d32f2f" style={{ marginVertical: 20 }} />
                    ) : null
                }
            />
        </View>
    );
};

export default HomeScreen;

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
    overlayContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingStart: 10,
        paddingEnd: 10,
        width: '100%'
    },
    searchOverlay: {
        position: 'absolute',
        top: 60,
        left: 0,
        right: 0,
        backgroundColor: '#fff',
        zIndex: 10,
        maxHeight: 300,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
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
    productCard11: {
        backgroundColor: 'white',
        marginRight: 10,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row'
    },
    productCard: {
        backgroundColor: '#fff',
        marginRight: 15,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        width: 140,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        marginVertical: 10,
    },
    productCard1: {
        backgroundColor: '#fff',
        margin: 8,
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '45%',
    },
    productCard2: {
        backgroundColor: '#fff',
        margin: 8,
        padding: 10,
        borderRadius: 10,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: 150,
    },
    productImage: {
        width: 130,
        height: 180,
        borderRadius: 10,
        marginBottom: 8,
    },
    productImage1: {
        width: 50,
        height: 50,
        borderRadius: 8,
        resizeMode: 'contain'
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
        marginTop: 5,
    },
    productList: {
        paddingBottom: 20,
    },
});