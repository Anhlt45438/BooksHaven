import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity,
} from 'react-native';
import {useRoute, useNavigation} from '@react-navigation/native';
import {useAppDispatch, useAppSelector} from '../redux/hooks';
import {fetchBooks} from '../redux/bookSlice';

interface TheLoai {
    _id: string;
    id_the_loai: string;
    ten_the_loai: string;
}

interface Book {
    _id: string;
    ten_sach: string;
    gia: number;
    anh: string;
    da_ban?: number; // Thêm thuộc tính da_ban (có thể không có trong API, cần kiểm tra)
    the_loai: TheLoai[];
}

const CategoryDetailScreen = () => {
    const {categoryId, categoryName} = useRoute().params as {
        categoryId: string;
        categoryName: string;
    };

    const formatPrice = (price: number): string => {
        return price.toLocaleString('vi-VN');
    };

    const cartItemCount = useAppSelector((state) => state.cart.totalItems);
    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    const {books, loading, error} = useAppSelector((state) => state.books);
    const [searchQuery, setSearchQuery] = useState<string>('');

    // State để lưu trữ đánh giá (giả lập nếu API không trả về)
    const [ratings, setRatings] = useState<{ [key: string]: number }>({});

    useEffect(() => {
        dispatch(fetchBooks({page: 1, limit: 100}));
    }, [dispatch, categoryId]);

    // Giả lập lấy đánh giá nếu API không trả về
    useEffect(() => {
        const fetchRatings = async () => {
            const newRatings: { [key: string]: number } = {};
            for (const book of booksArray) {
                newRatings[book._id] = Math.random() * 5; // Giả lập điểm từ 0-5
            }
            setRatings(newRatings);
        };
        if (booksArray.length > 0) {
            fetchRatings();
        }
    }, [books]);

    const booksArray: Book[] =
        books && books.data && Array.isArray(books.data)
            ? books.data
            : Array.isArray(books)
                ? books
                : [];

    const filteredBooks = booksArray
        .filter(book =>
            book.the_loai &&
            book.the_loai.some((tl: TheLoai) => tl._id === categoryId || tl.id_the_loai === categoryId)
        )
        .filter(book =>
            book.ten_sach.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const renderBookItem = ({item}: { item: Book }) => (
        <TouchableOpacity
            style={styles.bookCard}
            onPress={() =>
                navigation.navigate(
                    'ProductDetailScreen' as never,
                    {book: item} as never
                )
            }
        >
            <Image source={{uri: item.anh}} style={styles.bookImage}/>
            <Text style={styles.bookTitle} numberOfLines={2}>
                {item.ten_sach}
            </Text>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>
                    {ratings[item._id] !== undefined ? ratings[item._id].toFixed(1) : 'N/A'}
                </Text>
                <Image style={styles.ratingStar} source={require('../assets/icon_saovang.png')}/>
            </View>
            <View style={styles.viewPrice}>
                <Text style={styles.bookPrice}>{formatPrice(item.gia)}đ</Text>
                <View style={{flex: 1}}></View>
                <Text style={styles.soldText}>
                    Đã bán: {item.da_ban !== undefined ? item.da_ban : 0}
                </Text>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require('../assets/icons/back.png')} style={styles.backIcon}/>
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sách..."
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={styles.iconsContainer}>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('HomeTabBottom', { screen: 'ShopcartScreen' })}
                    >
                        <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon}/>
                        {cartItemCount > 0 && (
                            <View style={styles.badge}>
                                <Text style={styles.badgeText}>{cartItemCount}</Text>
                            </View>
                        )}
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={styles.iconWrapper}
                        onPress={() => navigation.navigate('Message')}
                    >
                        <Image source={require('../assets/image/conversation.png')} style={styles.icon}/>

                    </TouchableOpacity>
                </View>
            </View>

            <Text style={styles.title}>{categoryName}</Text>

            {loading ? (
                <Text style={styles.loadingText}>
                    Đang tải sách của thể loại {categoryName}...
                </Text>
            ) : error ? (
                <Text style={styles.errorText}>{error}</Text>
            ) : (
                <FlatList
                    data={filteredBooks}
                    keyExtractor={(item) => item._id}
                    renderItem={renderBookItem}
                    numColumns={2}
                    contentContainerStyle={styles.listContainer}
                    columnWrapperStyle={styles.columnWrapper}
                />
            )}
        </View>
    );
};

export default CategoryDetailScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#e8e8e8',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingHorizontal: 10,
        paddingVertical: 8,
    },
    backButton: {
        marginRight: 10,
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    searchInput: {
        flex: 1,
        backgroundColor: '#e0e0e0',
        borderRadius: 8,
        paddingHorizontal: 10,
        height: 40,
        color: '#333',
    },
    title: {
        fontSize: 20,
        margin: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
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
        right: -8,
        backgroundColor: '#ff5252',
        borderRadius: 10,
        width: 13,
        height: 13,
        justifyContent: 'center',
        alignItems: 'center',
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold',
    },
    loadingText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
    },
    errorText: {
        textAlign: 'center',
        marginTop: 20,
        fontSize: 16,
        color: 'red',
    },
    listContainer: {
        paddingHorizontal: 10,
        paddingBottom: 20,
    },
    columnWrapper: {
        justifyContent: 'space-between',
    },
    bookCard: {
        backgroundColor: '#fff',
        margin: 8,
        borderRadius: 10,
        alignItems: 'center',
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 3,
        width: '48%',
    },
    bookImage: {
        width: 130,
        height: 180,
        borderRadius: 10,
        margin: 10,
    },
    bookTitle: {
        fontSize: 14,
        marginTop: 5,
        color: '#333',
        marginHorizontal: 10,
        marginBottom: 5,
        textAlign: 'center',
        minHeight: 34,
    },
    ratingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 20,
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
        marginHorizontal: 20,
        marginBottom: 10,
        marginTop: 'auto',
    },
    bookPrice: {
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
});