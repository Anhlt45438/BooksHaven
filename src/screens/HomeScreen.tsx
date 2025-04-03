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
import { fetchBooks, fetchHotBooks } from '../redux/bookSlice'; // Thêm fetchHotBooks
import { useAppDispatch, useAppSelector } from '../redux/hooks.tsx';
import { fetchCart } from '../redux/cartSlice.tsx';
import { getAccessToken } from '../redux/storageHelper';

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
    da_ban: number;
}

interface Rating {
    average_rating: number;
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
    const { books, hotBooks, loading, error, hasMore } = useAppSelector(state => state.books); // Thêm hotBooks
    const categoryState = useAppSelector(state => state.categories);

    useFocusEffect(
        React.useCallback(() => {
            dispatch(fetchCart());
        }, [dispatch]),
    );

    const categoriesList =
        categoryState.categories?.data !== undefined
            ? categoryState.categories.data
            : categoryState.categories;

    const [page, setPage] = React.useState<number>(1);
    const [searchQuery, setSearchQuery] = React.useState<string>('');
    const [filteredBooks, setFilteredBooks] = React.useState<Book[]>([]);
    const [ratings, setRatings] = useState<{ [key: string]: number }>({}); // Lưu trữ average_rating cho từng sách

    const activeBookList = books.filter((book: Book) => book.trang_thai === true) || [];

    useEffect(() => {
        dispatch(fetchCategories());
        dispatch(fetchBooks({ page: 1, limit: 20 }));
        dispatch(fetchHotBooks(100));
    }, [dispatch]);

    // Hàm lấy average_rating từ API
    const fetchAverageRating = async (bookId: string) => {
        const accessToken = await getAccessToken();
        if (!accessToken) return null;

        try {
            const response = await fetch(
                `http://14.225.206.60:3000/api/ratings/book/${bookId}?page=1&limit=10`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );
            const data = await response.json();
            return data.average_rating || 0;
        } catch (error) {
            console.error(`Lỗi khi lấy đánh giá cho sách ${bookId}:`, error.message);
            return 0;
        }
    };

    // Lấy average_rating cho tất cả sách khi books thay đổi
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

    const handleLoadMore = () => {
        if (!loading && hasMore) {
            const nextPage = page + 1;
            setPage(nextPage);
            dispatch(fetchBooks({ page: nextPage, limit: 20 }));
        }
    };

    const formatPrice = (price: any): string => {
        const numericPrice = Number(price);
        if (isNaN(numericPrice) || numericPrice <= 0) return 'Liên hệ';
        return numericPrice.toLocaleString('vi-VN');
    };

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

    const renderBookItemVertical = ({ item }: { item: Book }) => (
        <TouchableOpacity
            style={styles.productCard2}
            onPress={() => navigation.navigate('ProductDetailScreen' as never, { book: item } as never)}
        >
            <Image source={{ uri: item.anh }} style={styles.productImage} />
            <Text style={styles.bookTitle} numberOfLines={2}>{item.ten_sach}</Text>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 13, marginRight: 'auto', marginTop: 'auto', backgroundColor: 'rgba(255,196,0,0.21)', borderRadius: 3, borderColor: '#ffdc00', borderWidth: 1, paddingHorizontal: 3, height: 20, margin: 10 }}>
                <Text style={styles.ratingText}>
                    {ratings[item._id] !== undefined ? ratings[item._id].toFixed(1) : 'Đang tải...'}
                </Text>
                <Image style={{ height: 10, width: 10, marginLeft: 5 }} source={require('../assets/icon_saovang.png')} />
            </View>
            <View style={styles.viewPrice}>
                <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
                <Text style={{ fontSize: 10, marginLeft: 'auto' }}>Đã bán: {item.da_ban}</Text>
            </View>
        </TouchableOpacity>
    );

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

    const handleSearch = (text: string) => {
        setSearchQuery(text);
        if (text.trim() === '') {
            setFilteredBooks([]);
        } else {
            const filtered = books.filter(book =>
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
                            columnWrapperStyle={{ justifyContent: 'space-around' }}
                        />
                        <Text style={styles.sectionTitle}>Sách Hot</Text>
                        <FlatList
                            horizontal
                            data={hotBooks} // Sử dụng hotBooks thay vì books.slice(0, 10)
                            keyExtractor={(item, index) => `${item._id}-${index}`}
                            renderItem={renderBookItemVertical}
                            showsHorizontalScrollIndicator={false}
                            contentContainerStyle={{ paddingHorizontal: 10 }}
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
                        <Text style={styles.bookTitle} numberOfLines={2}>{item.ten_sach}</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 13, marginRight: 'auto', marginTop: 'auto', backgroundColor: 'rgba(255,196,0,0.21)', borderRadius: 3, borderColor: '#ffdc00', borderWidth: 1, paddingHorizontal: 3, height: 20, margin: 10 }}>
                            <Text style={styles.ratingText}>
                                {ratings[item._id] !== undefined ? ratings[item._id].toFixed(1) : 'Đang tải...'}
                            </Text>
                            <Image style={{ height: 10, width: 10, marginLeft: 5 }} source={require('../assets/icon_saovang.png')} />
                        </View>
                        <View style={styles.viewPrice}>
                            <Text style={styles.price}>{formatPrice(item.gia)}đ</Text>
                            <View style={{ flex: 1 }}></View>
                            <Text style={styles.soldText}>Đã bán: {item.da_ban}</Text>
                        </View>
                    </TouchableOpacity>
                )}
                contentContainerStyle={styles.productList}
                onEndReached={handleLoadMore}
                onEndReachedThreshold={0.5}
                ListFooterComponent={
                    loading && page > 1 ? (
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
        justifyContent: 'center'
    },
    productImage: {
        width: 130,
        height: 180,
        borderRadius: 10,
        margin: 10
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
        marginHorizontal: 10
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginRight: 'auto',
        marginTop: 'auto'
    },
    soldText: {
        fontSize: 10,
        color: '#666',
        textAlign: 'center'
    },
    viewPrice: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: 12,
        marginBottom: 10,
        marginTop: 'auto',
    },
    productList: {
        paddingBottom: 20,
    },
    ratingText: {
        fontSize: 9,
        color: '#666',
        textAlign: 'center',
    },
});