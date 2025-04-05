// import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
// import React, {useState} from 'react'

// const Statistical = ({ navigation }) => {

//     const [selectedTime, setSelectedTime] = useState('Hôm nay');
//     const [selectedButton, setSelectedButton] = useState('');

//     return (
//         <View style={styles.container}>
//             <View style={styles.header}>
//                 <View style={styles.headerContent}>
//                     <TouchableOpacity onPress={() => navigation.goBack()}>
//                     <Image source={require('../assets/icons/Vector.png')} style={styles.icon} />
//                 </TouchableOpacity>
//                 <Text style={styles.headerTitle}>Hiểu quả bán hàng</Text>
//                 </View>   
//                 <View style={styles.separator}></View>
//             </View>
//             <View style={styles.ratingContainer}>
//                 <Text style={styles.ratingText}>Hiệu quả bán hàng của shop</Text>
//                 <Text style={styles.ratingScore}>0.0/5.0</Text>
//                 <View style={styles.row}>
//                     <TouchableOpacity>
//                         <Text style={styles.optionText}>Đánh giá Shop</Text>
//                     </TouchableOpacity>
//                     <TouchableOpacity>
//                         <Text style={styles.optionText}>Hiệu quả hoạt động</Text>
//                     </TouchableOpacity>
//                 </View>
//             </View>

//             <View style={styles.salesContainer}>
//                 <Text style={styles.salesText}>Doanh số</Text>
//             </View>

//             <View style={styles.timeSelector}>
//                 {['Hôm nay', 'Hôm qua', '7 ngày qua', '30 ngày qua'].map((time) => (
//                     <TouchableOpacity
//                         key={time}
//                         style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
//                         onPress={() => setSelectedTime(time)}
//                     >
//                         <Text style={styles.timeText}>{time}</Text>
//                     </TouchableOpacity>
//                 ))}
//             </View>

//             <View style={styles.salesContainerr}>
//                 <Text style={styles.salesText}>Tổng quan</Text>
//             </View>

//             <View style={styles.summaryContainer}>
//                 <View style={styles.summaryBox}>
//                     <Text style={styles.summaryTitle}>Đơn hàng</Text>
//                     <Text style={styles.summaryNumber}>0</Text>
//                 </View>
//                 <View style={styles.summaryBox}>
//                     <Text style={styles.summaryTitle}>Doanh số</Text>
//                     <Text style={styles.summaryNumber}>0</Text>
//                 </View>
//                 <View style={styles.summaryBox}>
//                     <Text style={styles.summaryTitle}>Doanh số trên mỗi đơn hàng</Text>
//                     <Text style={styles.summaryNumber}>0</Text>
//                 </View>
//             </View>

//             <View style={styles.additionalInfoContainer}>
//                 <TouchableOpacity
//                     onPress={() => setSelectedButton('sold')}
//                 >
//                     <Text style={[styles.additionalInfoTitle, selectedButton === 'sold' && styles.selectedText]}>
//                         Số lượng sản phẩm đã bán
//                     </Text>
//                 </TouchableOpacity>
//                 <TouchableOpacity
//                     onPress={() => setSelectedButton('view')}
//                 >
//                     <Text style={[styles.additionalInfoTitle, selectedButton === 'view' && styles.selectedText]}>
//                         Lượt xem trang
//                     </Text>
//                 </TouchableOpacity>
//             </View>

//             <View style={styles.footer}>
//                 <Image source={require('../assets/icons/book.png')} style={styles.iconn}/>
//                 <Text style={styles.footerText}>Gần đây không có sản phẩm nào của bạn!</Text>
//             </View>
//         </View>
//     )
// }

// export default Statistical

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         backgroundColor: '#f5f5f5',
//         flexGrow: 1,
//         padding: 10,
//     },
//     header: {
//         padding: 10,
//         alignItems: 'center',
//     },
//     headerContent: {
//         flexDirection: 'row',
//         alignItems: 'center',
//         justifyContent: 'space-between',
//         width: '100%',
//     },
//     icon: {
//         width: 24,
//         height: 24,
//     },
//     iconn: {
//         width: 74,
//         height: 74,
//     },
//     headerTitle: {
//         fontSize: 27,
//         fontWeight: 'bold',
//         textAlign: 'center',
//         flex: 1,
//         right: 10,
//     },
//     separator: {
//         borderBottomWidth: 3,
//         borderBottomColor: '#ccc',
//         width: '120%',
//         marginVertical: 15,
//     },
//     ratingContainer: {
//         padding: 15,
//         backgroundColor: '#ffffff',
//         borderRadius: 20,
//         marginBottom: 12,
//     },
//     ratingText: {
//         fontSize: 15,
//         color: '#333',
//         fontWeight: 'bold',
//     },
//     ratingScore: {
//         fontSize: 14,
//         color: '#888',
//         marginVertical: 5,
//     },
//     row: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//     },
//     optionText: {
//         fontSize: 14,
//         color: '#007BFF',
//     },
//     timeSelector: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 10,
//     },
//     timeButton: {
//         paddingVertical: 10,
//         paddingHorizontal: 15,
//         borderWidth: 2,
//         borderColor: '#ddd',
//         borderRadius: 15,
//     },
//     selectedTimeButton: {
//         backgroundColor: '#FF5733',
//     },
//     timeText: {
//         fontSize: 13,
//         color: '#333',
//     },
//     summaryContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 15,
//         marginBottom: 20,
//     },
//     summaryBox: {
//         width: '30%',
//         padding: 15,
//         backgroundColor: '#ddd',
//         borderRadius: 10,
//         alignItems: 'center',
//     },
//     summaryTitle: {
//         fontSize: 12,
//         color: '#333',
//         fontWeight: 'bold',
//     },
//     summaryNumber: {
//         fontSize: 20,
//         color: '#333',
//     },
//     additionalInfoContainer: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginTop: 130,
//         marginBottom: 10,
//     },
//     additionalInfoRow: {
//         flexDirection: 'row',
//         justifyContent: 'space-between',
//         marginBottom: 5,
//     },
//     additionalInfoTitle: {
//         fontSize: 17,
//         color: '#333',
//     },
//     selectedText: {
//         color: '#FF5733',
//     },
//     footer: {
//         alignItems: 'center',
//         marginTop: 30,
//     },
//     footerText: {
//         fontSize: 16,
//         color: '#888',
//     },
//     salesContainer: {
//         marginBottom: 10,
//     },
//     salesContainerr: {
//         marginTop: 15,
//     },
//     salesText: {
//         fontSize: 17,
//         fontWeight: 'bold',
//         color: '#333',
//     },
// })
import { StyleSheet, Text, View, TouchableOpacity, ScrollView, Image, Alert, ActivityIndicator } from 'react-native'
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from '../redux/storageHelper';

const Statistical = ({ navigation }) => {
    const { shop } = useSelector(state => state.shop);

    const [bookData, setBookData] = useState({
        bestSellingThisMonth: [],
        mostSoldAllTime: [],
        bestRated: [],
        worstRated: []
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (shop) {
            fetchData(shop._id);  // Use shop_id from Redux
        }
    }, [shop]);

    const fetchData = async (shopId) => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            Alert.alert('Error', 'No access token found.');
            return;
        }

        try {
            const response = await fetch(`http://14.225.206.60:3000/api/books/statistics?shop_id=${shopId}`, {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });

            const data = await response.json();

            console.log('Dữ liệu từ API:', data);

            if (data && data.data) {
                setBookData({
                    bestSellingThisMonth: data.data.best_selling_this_month || [],
                    mostSoldAllTime: data.data.most_sold_all_time || [],
                    bestRated: data.data.best_rated || [],
                    worstRated: data.data.worst_rated || []
                });
            } else {
                Alert.alert('Lỗi', 'Dữ liệu trả về không hợp lệ');
            }
        } catch (error) {
            console.error(error);
            Alert.alert('Error', 'Failed to fetch data');
        } finally {
            setLoading(false);
        }
    };

    const renderItem = (item, index) => {
        
        const itemKey = item.book?.id || item.id || index;

        if (!item) {
            return <Text>Thông tin sách không có sẵn</Text>;
        }

        if (item.book) {
            return (
                <View style={styles.bookItem} key={itemKey}>
                    <View style={styles.bookDetails}>
                        <Text style={styles.bookName}>Tên sách : {item.book?.ten_sach}</Text>
                        <Text style={styles.bookAuthor}>Tác giả : {item.book?.tac_gia}</Text>
                        <Text style={styles.bookPrice}>Giá : {item.book?.gia}đ</Text>
                        <Text style={styles.totalSold}>Đã bán trong tháng : {item.total_sold}</Text>
                    </View>
                </View>
            );
        } else {
            return (
                <View style={styles.bookItem} key={itemKey}>
                    <View style={styles.bookDetails}>
                        <Text style={styles.bookName}>Tên sách : {item.ten_sach}</Text>
                        <Text style={styles.bookAuthor}>Tác giả : {item.tac_gia}</Text>
                        <Text style={styles.bookPrice}>Giá : {item.gia}đ</Text>
                        <Text style={styles.totalSold}>Đã bán : {item.da_ban}</Text>
                    </View>
                </View>
            );
        }
    };

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <ScrollView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/icons/Vector.png')} style={styles.icon} />
                    </TouchableOpacity>
                    <Text style={styles.headerTitle}>Hiệu quả bán hàng</Text>
                </View>
                <View style={styles.separator}></View>
            </View>

            {/* Top các sách bán chạy */}
            <Text style={styles.salesText}>Top các sách được bán nhiều nhất trong tháng</Text>
            <View style={styles.bookList}>
                {bookData.bestSellingThisMonth.length ? (
                    bookData.bestSellingThisMonth.map((item, index) => renderItem(item, index)) // Sử dụng renderItem với item
                ) : (
                    <Text>Không có sách bán chạy trong tháng này</Text>
                )}
            </View>

            {/* Sách có lượt bán cao */}
            <Text style={styles.salesText}>Sách có lượt bán cao</Text>
            <View style={styles.bookList}>
                {bookData.mostSoldAllTime.length ? (
                    bookData.mostSoldAllTime.map((item, index) => renderItem(item, index)) // Sử dụng renderItem với item
                ) : (
                    <Text>Không có sách bán chạy nhất mọi thời đại</Text>
                )}
            </View>

            {/* Sách có lượt đánh giá tích cực */}
            <Text style={styles.salesText}>Các sách có phản hồi đánh giá tích cực</Text>
            <View style={styles.bookList}>
                {bookData.bestRated.length ? (
                    bookData.bestRated.map((item, index) => renderItem(item, index)) // Sử dụng renderItem với item
                ) : (
                    <Text>Không có sách đánh giá tích cực</Text>
                )}
            </View>

            {/* Sách có lượt đánh giá tiêu cực */}
            <Text style={styles.salesText}>Các sách có phản hồi đánh giá tiêu cực</Text>
            <View style={styles.bookList}>
                {bookData.worstRated.length ? (
                    bookData.worstRated.map((item, index) => renderItem(item, index)) // Sử dụng renderItem với item
                ) : (
                    <Text>Không có sách đánh giá tiêu cực</Text>
                )}
            </View>

        </ScrollView>
    );
}

export default Statistical;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        padding: 10,
    },
    header: {
        padding: 10,
        alignItems: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    icon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        right: 10,
    },
    separator: {
        borderBottomWidth: 3,
        borderBottomColor: '#ccc',
        width: '120%',
        marginVertical: 15,
    },
    salesText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 10,
    },
    bookItem: {
        padding: 5,
        backgroundColor: '#fff',
        marginVertical: 5,
        marginRight: 10,
        borderRadius: 10,
        width: '100%',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ddd'
    },
    bookDetails: {
        alignItems: 'flex-start', // Align the content to the left
        justifyContent: 'center',
        flexDirection: 'column', // Arrange elements vertically
        paddingHorizontal: 10, // Add some padding to prevent text from sticking to the edge
        width: '100%',
    },
    bookName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 5,
    },
    bookAuthor: {
        fontSize: 14,
        color: '#666',
        marginBottom: 5,
    },
    bookPrice: {
        fontSize: 14,
        color: '#FF5733',
        fontWeight: 'bold'
    },
    totalSold: {
        fontSize: 14,
        color: '#666',
        marginTop: 5,
        fontStyle: 'italic',
    },
    bookList: {
        marginBottom: 20,
        flexDirection: 'column',  // Render theo dạng cột
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    }
});