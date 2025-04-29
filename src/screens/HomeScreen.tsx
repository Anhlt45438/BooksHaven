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
import { fetchBooks, fetchHotBooks } from '../redux/bookSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks.tsx';
import { fetchCart } from '../redux/cartSlice.tsx';
import { getAccessToken } from '../redux/storageHelper';

// Constants

const { width, height } = Dimensions.get('window');


// Interfaces
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
    da_ban: number;
}

// Category Images Mapping
const categoryImages: { [key: string]: any } = {
    'Tâm lý': require('../assets/image/cate_stl.jpg'),
    'Truyện tranh': require('../assets/image/image.jpg'),
    'Sách giáo khoa': require('../assets/image/cate_sgk.jpg'),
    'Tiêu thuyết': require('../assets/image/cate_tt.jpg'),
    'Khoa học': require('../assets/image/cate_kh.jpg'),
    'Kinh tế': require('../assets/image/cate_kt.jpg'),
    'Lịch sử': require('../assets/image/cate_ls.jpg'),
};

// Main Component
const HomeScreen = () => {
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    // Redux State
    const cartItemCount = useAppSelector(state => state.cart.totalItems);
    const { books, hotBooks, loading, error, hasMore } = useAppSelector(
        state => state.books,
    );
    const categoryState = useAppSelector(state => state.categories);

    // Local State
    const [page, setPage] = useState<number>(1);
    const [searchQuery, setSearchQuery] = useState<string>('');
    const [filteredBooks, setFilteredBooks] = useState<Book[]>([]);
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});

    // Derived Data
    const categoriesList =
        categoryState.categories?.data ?? categoryState.categories;
    const activeBookList = books.filter((book: Book) => book.trang_thai) || [];

    const bookState = useAppSelector(state => state.books);
    const booksList =
        bookState.books?.data !== undefined
            ? bookState.books.data
            : bookState.books;

    // Tính loading và error tổng hợp
    const [messages, setMessages] = useState([]);
    const [messagesCount, setMessagesCount] = useState();
    // const [books, setBooks] = useState<Book[]>([]);
    const [loadingg, setLoading] = useState<boolean>(false);
    const [errorr, setError] = useState<string | null>(null);
    const user = useAppSelector(state => state.user.user);

    // Effects
    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchCart());
        }, [dispatch]),
    );

    useFocusEffect(
        React.useCallback(() => {
            const intervalId = setInterval(async () => {
                const accessToken = await getAccessToken();

                try {
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
                    const sortedMessages = data.data.sort((a, b) => {
                        return (
                            new Date(b.ngay_cap_nhat).getTime() -
                            new Date(a.ngay_cap_nhat).getTime()
                        );
                    });

                    // Đếm số lượng tin nhắn chưa đọc (nguoi_nhan_da_doc = false và không phải người gửi)
                    const readMessagesCount = sortedMessages.filter(
                        message =>
                            message.nguoi_nhan_da_doc === false &&
                            message.id_nguoi_gui_cuoi !== user._id,
                    ).length;

                    setMessagesCount(readMessagesCount); // Cập nhật số tin nhắn chưa đọc
                } catch (err) {
                    setError(err.message);
                }
            }, 2000); // Đặt thời gian lặp lại là 5 giây

            // Dọn dẹp khi component unmount
            return () => clearInterval(intervalId);
        }, []),
    );

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchBooks({ page: 1, limit: 20 }));
        dispatch(fetchHotBooks(100));
    }, [dispatch]);

    useEffect(() => {
        const fetchRatings = async () => {
            const newRatings: { [key: string]: number } = {};
            for (const book of books) {
                const rating = await fetchAverageRating(book._id);
                newRatings[book._id] = rating;
            }
            setRatings(newRatings);
        };

        if (books.length > 0) {
            fetchRatings();
        }
    }, [books]);

    // Helper Functions
    const fetchAverageRating = async (bookId: string): Promise<number> => {
        const accessToken = await getAccessToken();
        if (!accessToken) return 0;

        try {
            const response = await fetch(
                `http://14.225.206.60:3000/api/ratings/book/${bookId}?page=1&limit=10`,
                {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${accessToken}`,
                    },
                },
            );
            const data = await response.json();
            return data.average_rating || 0;
        } catch (error) {
            console.error(`Lỗi khi lấy đánh giá cho sách ${bookId}:`, error.message);
            return 0;
        }
    };

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(fetchBooks({ page: nextPage, limit: 20 }));
        }
    };

    const formatPrice = (price: any): string => {
        const numericPrice = Number(price);
        return isNaN(numericPrice) || numericPrice <= 0
            ? 'Liên hệ'
            : numericPrice.toLocaleString('vi-VN');
    };

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredBooks([]);
        } else {
            const filtered = books.filter(book =>
                book.ten_sach.toLowerCase().includes(text.toLowerCase()),
            );
            setFilteredBooks(filtered);
        }
    };
    console.log(books);
    

    // Render Functions
    const renderCategoryItem = ({ item }: { item: Category }) => {
        const localImage =
            categoryImages[item.ten_the_loai] ?? require('../assets/image/image.jpg');
        // Giả sử id_shop lấy từ dữ liệu sách đầu tiên hoặc một nguồn cố định
        const idShop = books.length > 0 ? books[0].id_shop : '67cf16c9fc9a46719d686287'; // Thay bằng logic thực tế
        return (
            <TouchableOpacity
                style={styles.categoryItem}
                onPress={() =>
                    navigation.navigate(
                        'CategoryDetail' as never,
                        {
                            categoryId: item._id,
                            categoryName: item.ten_the_loai,
                            idShop: idShop, // Truyền id_shop
                        } as never
                    )
                }>
                <Image source={localImage} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.ten_the_loai}</Text>
            </TouchableOpacity>
        );
    };

    const renderBookItemVertical = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.productCard2}
            onPress={() =>
                navigation.navigate(
                    'ProductDetailScreen' as never,
                    { book: item } as never,
                )
            }>
            <Image source={{ uri: item.anh }} style={styles.productImage} />
            <Text style={styles.bookTitle} numberOfLines={2}>
                {item.ten_sach}
            </Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                    {ratings[item._id] !== undefined
                        ? ratings[item._id].toFixed(1)
                        : 'Đang tải...'}
                </Text>
                <Image
                    style={styles.ratingStar}
                    source={require('../assets/icon_saovang.png')}
                />
            </View>
            <View style={styles.viewPrice}>
                <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
                <Text style={styles.soldText}>Đã bán: {item.da_ban}</Text>
            </View>
        </TouchableOpacity>
    );

    const renderBookItem11 = ({ item }: { item: Book }) => (
        <View style={styles.overlayContainer}>
            <TouchableOpacity
                onPress={() => {
                    navigation.navigate(
                        'ProductDetailScreen' as never,
                        { book: item } as never,
                    );
                    setSearchQuery('');
                }}>
                <View style={styles.productCard11}>
                    <Image source={{ uri: item.anh }} style={styles.productImage1} />
                    <View style={styles.bookInfo}>
                        <Text style={styles.bookTitle} numberOfLines={1}>
                            {item.ten_sach}
                        </Text>
                        <Text style={styles.price}>{item.gia}đ</Text>
                    </View>
                </View>
            </TouchableOpacity>
        </View>
    );

    // Loading and Error States
    if (loading && page === 1) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text>Đang tải dữ liệu...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={[styles.container, styles.center]}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }

    // Main Render
    return (
        <View style={styles.container}>
            {/* Header */}
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
                        onPress={() =>
                            navigation.navigate('HomeTabBottom', { screen: 'ShopcartScreen' })
                        }>
                        <Image
                            source={require('../assets/image/shoppingcart.jpg')}
                            style={styles.icon}
                        />
                        {cartItemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartItemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('Message')}>
                        <Image
                            source={require('../assets/image/conversation.png')}
                            style={styles.icon}
                        />
                        {messagesCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{messagesCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                </View>
            </View>

            {/* Search Overlay */}
            {searchQuery.length > 0 && (
                <View style={styles.searchOverlay}>
                    <FlatList
                        data={filteredBooks}
                        keyExtractor={item => item._id}
                        renderItem={renderBookItem11}
                        keyboardShouldPersistTaps="handled"
                    />
                </View>
            )}

            {/* Main Content */}
            <FlatList
                ListHeaderComponent={
                    <>
                        <Image
                            source={require('../assets/image/image.png')}
                            style={styles.bannerImage}
                            resizeMode="cover"
                        />
                        <Text style={styles.sectionTitle}>Thể loại nổi bật</Text>
                        <FlatList
                            data={categoriesList}
                            keyExtractor={(item: Category) => item._id}
                            renderItem={renderCategoryItem}
                            numColumns={4}
                            scrollEnabled={false}
                            columnWrapperStyle={styles.categoryWrapper}
                        />
                        <Text style={styles.sectionTitle}>Sách Hot</Text>
                        <FlatList
                            horizontal
                            data={hotBooks}
                            keyExtractor={(item, index) => `${item._id}-${index}`}
                            renderItem={renderBookItemVertical}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={styles.hotBooksContainer}
                        />
                        <Text style={styles.sectionTitle}>Tất cả sách</Text>
                    </>
                }
                data={activeBookList}
                keyExtractor={(item, index) => `${item._id}-${index}`}
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
                        <Text style={styles.bookTitle} numberOfLines={2}>
                            {item.ten_sach}
                        </Text>
                        <View style={styles.ratingContainer}>
                            <Text style={styles.ratingText}>
                                {ratings[item._id] !== undefined
                                    ? ratings[item._id].toFixed(1)
                                    : 'Đang tải...'}
                            </Text>
                            <Image
                                style={styles.ratingStar}
                                source={require('../assets/icon_saovang.png')}
                            />
                        </View>
                        <View style={styles.viewPrice}>
                            <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
                            <View style={styles.flexSpacer} />
                            <Text style={styles.soldText}>Đã bán: {item.da_ban}</Text>
                        </View>
                    </TouchableOpacity >
                )}

                contentContainerStyle={styles.productList}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading && page > 1 ? (
                        <ActivityIndicator
                            size="large"
                            color="#d32f2f"
                            style={styles.loadingFooter}

                        />
                    ) : null
                }
            />
        </View >
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f2f2f2',
    },
    center: {
        justifyContent: 'center',
        alignItems: 'center',
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
    overlayContainer: {
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        paddingStart: 10,
        paddingEnd: 10,
        width: '100%',
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
    categoryWrapper: {
        justifyContent: 'space-around',
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
    hotBooksContainer: {
        paddingHorizontal: 10,
    },
    productList: {
        paddingBottom: 20,
    },
    productCard11: {
        backgroundColor: 'white',
        marginRight: 10,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: '100%',
        flexDirection: 'row',
    },
    productCard1: {
        backgroundColor: '#fff',
        margin: 8,
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
        margin: 10,
    },
    productImage1: {
        width: 50,
        height: 50,
        borderRadius: 8,
        resizeMode: 'contain',
    },
    bookInfo: {
        flex: 1,
        paddingStart: 20,
    },
    bookTitle: {
        fontSize: 14,
        marginTop: 5,
        color: '#333',
        marginHorizontal: 10,
        marginBottom: 5,
        marginRight: 'auto',
        minHeight: 34,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 13,
        marginRight: 'auto',
        backgroundColor: 'rgba(255, 196, 0, 0.21)',
        borderRadius: 3,
        borderColor: '#ffdc00',
        borderWidth: 1,
        paddingHorizontal: 3,
        height: 20,
        margin: 10,
        marginTop: 'auto',
    },
    ratingText: {
        fontSize: 9,
        color: '#666',
        textAlign: 'center',
    },
    ratingStar: {
        height: 10,
        width: 10,
        marginLeft: 5,
    },
    viewPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        marginBottom: 10,
        marginTop: 'auto',
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginRight: 'auto',
    },
    soldText: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center',
    },
    flexSpacer: {
        flex: 1,
    },
    loadingFooter: {
        marginVertical: 20,
    },
    errorText: {
        color: 'red',
    },
});

export default HomeScreen;
