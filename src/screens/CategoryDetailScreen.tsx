import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    Image,
    TextInput,
    TouchableOpacity
} from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { fetchBooks } from '../redux/bookSlice';

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
    the_loai: TheLoai[];
}

const CategoryDetailScreen = () => {
    const { categoryId, categoryName } = useRoute().params as {
        categoryId: string;
        categoryName: string;
    };

    // Hàm format giá tiền (mỗi 3 số có 1 dấu chấm)
    const formatPrice = (price: number): string => {
        return price.toLocaleString('vi-VN');
    };

    const navigation = useNavigation();
    const dispatch = useAppDispatch();

    // Lấy state từ Redux (books, loading, error)
    const { books, loading, error } = useAppSelector((state) => state.books);

    // Local state cho thanh tìm kiếm
    const [searchQuery, setSearchQuery] = useState<string>('');

    // Fetch toàn bộ sách khi vào screen hoặc khi categoryId thay đổi
    useEffect(() => {
        dispatch(fetchBooks({ page: 1, limit: 100 }));
    }, [dispatch, categoryId]);

    // Nếu books có key "data" thì unwrap, nếu không, dùng trực tiếp
    const booksArray: Book[] =
        books && books.data && Array.isArray(books.data)
            ? books.data
            : Array.isArray(books)
                ? books
                : [];

    // Lọc sách theo categoryId và search query
    const filteredBooks = booksArray
        .filter(book =>
            book.the_loai &&
            book.the_loai.some((tl: TheLoai) => tl._id === categoryId || tl.id_the_loai === categoryId)
        )
        .filter(book =>
            book.ten_sach.toLowerCase().includes(searchQuery.toLowerCase())
        );

    const renderBookItem = ({ item }: { item: Book }) => (
        <TouchableOpacity style={styles.bookCard} onPress={() => navigation.navigate(
            "ProductDetailScreen" as never,
            {
                book: item, // Truyền dữ liệu sách
            } as never
        )}>
            <Image source={{ uri: item.anh }} style={styles.bookImage} />
            <Text style={styles.bookTitle} numberOfLines={1}>{item.ten_sach}</Text>
            <Text style={styles.bookPrice}>{formatPrice(item.gia)}đ</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Image source={require('../assets/icons/back.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Tìm kiếm sách..."
                    placeholderTextColor="#aaa"
                    value={searchQuery}
                    onChangeText={setSearchQuery}
                />
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon}/>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>1</Text>
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <Image source={require('../assets/image/conversation.png')} style={styles.icon}/>
                        <View style={styles.badge}>
                            <Text style={styles.badgeText}>9</Text>
                        </View>
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
        // Bỏ flex: 1, set width để item chỉ chiếm 1 nửa màn hình
        width: '46%',
        backgroundColor: '#fff',
        marginBottom: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    bookImage: {
        width: 120,
        height: 160,
        borderRadius: 10,
        marginTop: 10,
    },
    bookTitle: {
        fontSize: 14,
        marginTop: 8,
        textAlign: 'center',
        color: '#333',
    },
    bookPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginVertical: 10,
    },
});