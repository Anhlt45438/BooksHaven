import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    Image,
    TextInput,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions
} from 'react-native';

const { width, height } = Dimensions.get('window');

interface Category {
    _id: string;
    id_the_loai: string;
    ten_the_loai: string;
}

interface Book {
    _id: string;
    ten_sach: string;
    gia: string;
    anh: string;
    // ... các field khác nếu cần
}

// Map tên thể loại lấy ảnh cục bộ
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
    const [categories, setCategories] = useState<Category[]>([]);
    const [books, setBooks] = useState<Book[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetchData();
    }, []);

    const fetchData = async () => {
        try {
            setLoading(true);

            // Fetch categories
            console.log('--- Fetching categories...');
            const catRes = await fetch('http://10.0.2.2:3000/api/categories');
            const catJson = await catRes.json();
            console.log('Categories response:', catJson);
            // Nếu API trả về { data: [...] }, ta gán categories = catJson.data
            setCategories(catJson.data || []);

            // Fetch books
            console.log('--- Fetching books...');
            const bookRes = await fetch('http://10.0.2.2:3000/api/books?page=1&limit=20');
            const bookJson = await bookRes.json();
            console.log('Books response:', bookJson);
            // Nếu API trả về { data: [...] }, ta gán books = bookJson.data
            setBooks(bookJson.data || []);

        } catch (err: any) {
            console.error('Lỗi fetchData:', err);
            setError(`Có lỗi xảy ra: ${err.message || err}`);
        } finally {
            setLoading(false);
        }
    };


    // Render thể loại theo dạng grid
    const renderCategoryItem = ({ item }: { item: Category }) => {
        const localImage = categoryImages[item.ten_the_loai]
            ? categoryImages[item.ten_the_loai]
            : require('../assets/image/image.jpg'); // fallback ảnh mặc định nếu không có map

        return (
            <TouchableOpacity style={styles.categoryItem}>
                <Image source={localImage} style={styles.categoryImage} />
                <Text style={styles.categoryText}>{item.ten_the_loai}</Text>
            </TouchableOpacity>
        );
    };

    // Render sách (dạng card)
    const renderBookItem = ({ item }: { item: Book }) => {
        return (
            <View style={styles.productCard}>
                <Image source={{ uri: item.anh }} style={styles.productImage} />
                <Text style={styles.bookTitle} numberOfLines={1}>
                    {item.ten_sach}
                </Text>
                <Text style={styles.price}>{item.gia}đ</Text>
            </View>
        );
    };

    if (loading) {
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
                />
                <View style={styles.iconsContainer}>
                    <TouchableOpacity style={styles.iconWrapper}>
                        <Image source={require('../assets/image/shoppingcart.jpg')} style={styles.icon} />
                        <View style={styles.badge}><Text style={styles.badgeText}>1</Text></View>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.iconWrapper}>
                        <Image source={require('../assets/image/conversation.png')} style={styles.icon} />
                        <View style={styles.badge}><Text style={styles.badgeText}>9</Text></View>
                    </TouchableOpacity>
                </View>
            </View>

            <FlatList
            ListHeaderComponent={
                <>
                    {/* BANNER */}
                    <Image
                        source={require('../assets/image/image.png')}
                        style={styles.bannerImage}
                        resizeMode="stretch"
                    />

                    {/* CATEGORIES */}
                    <Text style={styles.sectionTitle}>Thể loại nổi bật</Text>
                    <FlatList
                        data={categories}
                        keyExtractor={(item) => item._id}
                        renderItem={renderCategoryItem}
                        numColumns={4}
                        scrollEnabled={false}
                        columnWrapperStyle={{ justifyContent: 'space-around' }}
                    />

                    {/* BOOKS - danh sách ngang */}
                    <Text style={styles.sectionTitle}>Sách mới</Text>
                    <FlatList
                        horizontal
                        data={books}
                        keyExtractor={(item) => item._id}
                        renderItem={renderBookItem}
                        showsHorizontalScrollIndicator={false}
                        contentContainerStyle={{ paddingHorizontal: 10 }}
                    />

                    <Text style={styles.sectionTitle}>Tất cả sách</Text>
                </>
            }
            data={books}
            keyExtractor={(item) => item._id}
            numColumns={2}
            renderItem={({ item }) => (
                <View style={styles.productCard1}>
                    <Image source={{ uri: item.anh }} style={styles.productImage} />
                    <Text style={styles.bookTitle} numberOfLines={2}>
                        {item.ten_sach}
                    </Text>
                    <Text style={styles.price}>{item.gia}đ</Text>
                </View>
            )}
            contentContainerStyle={styles.productList}
        />
        </View>

    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        margin: -10,
        padding: 0,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#d32f2f',
        paddingHorizontal: 20,
        paddingVertical: 8,
        justifyContent: 'space-between',
    },
    searchBar: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 8,
        borderRadius: 8,
        marginRight: 10,
        color: '#000',
        marginTop: 10,
        height: 40
    },
    iconsContainer: {
        height: 50,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    iconWrapper: {
        position: 'relative',
        marginLeft: 10,
    },
    icon: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    badge: {
        position: 'absolute',
        top: -5,
        right: -8,
        backgroundColor: 'red',
        borderRadius: 10,
        paddingHorizontal: 6
    },
    badgeText: {
        color: '#fff',
        fontSize: 10,
        fontWeight: 'bold'
    },
    bannerImage: {
        width: '100%',
        height: height * 0.25
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginVertical: 10,
        color: '#ff5722',
        paddingLeft: 10
    },
    // Categories
    categoryItem: {
        alignItems: 'center',
        width: '25%',
        paddingVertical: 10
    },
    categoryImage: {
        width: 60,
        height: 60,
        borderRadius: 30,
        marginBottom: 5
    },
    categoryText: {
        fontSize: 12,
        textAlign: 'center'
    },
    // Books - card ngang
    productCard: {
        backgroundColor: 'white',
        marginRight: 10,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center',
        width: 120
    },
    // Books - danh sách 2 cột
    productCard1: {
        flex: 1,
        backgroundColor: 'white',
        margin: 5,
        padding: 10,
        borderRadius: 8,
        alignItems: 'center'
    },
    productImage: {
        width: 100,
        height: 100,
        borderRadius: 8
    },
    bookTitle: {
        fontSize: 14,
        marginTop: 5,
        textAlign: 'center',
        color: '#333'
    },
    price: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#d32f2f',
        marginTop: 5
    },
    productList: {
        paddingHorizontal: 10,
        paddingBottom: 20
    }
});

export default HomeScreen;
