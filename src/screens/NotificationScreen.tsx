import React from 'react';
import {View, Text, FlatList, Image, StyleSheet, TouchableOpacity} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';

const notifications = [
    {id: '1', title: 'Khuyến mãi', message: '👉 Vô vàn sản phẩm cực trendy TẠI ĐÂY! 👉', icon: 'tag', count: 10},
    {
        id: '2',
        title: 'Thông tin Tài chính',
        message: 'SPAYLATER MUA TRƯỚC TRẢ SAU 💥 Tận h...',
        icon: 'credit-card',
        count: 5
    },
    {
        id: '3',
        title: 'Cập nhật Shopee',
        message: '🔥 Mừng tháng của nàng, tặng bạn tới 5.000...',
        icon: 'gift',
        count: 6
    },
];

const orders = [
    {
        id: '4',
        status: 'Đang vận chuyển',
        orderId: '2503070JQQWW27',
        seller: 'ZUZG OFFICIAL',
        courier: 'SPX Express',
        image: 'https://via.placeholder.com/50'
    },
    {
        id: '5',
        status: 'Đơn hàng đã hoàn tất',
        orderId: '250228QCNTE6C3',
        message: 'Đánh giá sản phẩm trước ngày 06-04-2025 để nhận 200 xu.',
        image: 'https://via.placeholder.com/50'
    },
    {
        id: '6',
        status: 'Đang vận chuyển',
        orderId: '250305SHAQGR2Q',
        seller: 'HocoMall',
        courier: 'SPX Express',
        image: 'https://via.placeholder.com/50'
    },
];

const NotificationScreen = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Thông báo</Text>
                <View style={styles.headerIcons}>
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/image/shoppingcart.jpg')}
                            style={styles.icon}
                        />
                        <View style={styles.badge}><Text style={styles.badgeText}>16</Text></View>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Image
                            source={require('../assets/image/conversation.png')}
                            style={styles.icon}
                        />
                        <View style={styles.badge}><Text style={styles.badgeText}>9</Text></View>
                    </TouchableOpacity>
                </View>
            </View>
            <FlatList
                data={[...notifications, ...orders]}
                keyExtractor={(item) => item.id}
                renderItem={({item}) => (
                    <View style={styles.card}>
                        {item.icon ? (
                            <View style={styles.notificationItem}>
                                <Icon name={item.icon} size={24} color="#FF5722" style={styles.icon}/>
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.title}</Text>
                                    <Text style={styles.message}>{item.message}</Text>
                                </View>
                                {item.count &&
                                    <View style={styles.countBubble}><Text style={styles.countText}>{item.count}</Text></View>}
                            </View>
                        ) : (
                            <View style={styles.orderItem}>
                                <Image source={{uri: item.image}} style={styles.image}/>
                                <View style={styles.textContainer}>
                                    <Text style={styles.title}>{item.status}</Text>
                                    <Text
                                        style={styles.message}>{item.message || `Đơn hàng ${item.orderId} đã được xử lý.`}</Text>
                                </View>
                            </View>
                        )}
                    </View>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {flex: 1, backgroundColor: '#f5f5f5'},
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 15,
        backgroundColor: '#fff',
        elevation: 3
    },
    headerTitle: {fontSize: 20, fontWeight: 'bold', color: '#333'},
    headerIcons: {flexDirection: 'row', gap: 15},
    badge: {position: 'absolute', top: -5, right: -5, backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 6},
    badgeText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
    card: {backgroundColor: '#fff', padding: 10, marginVertical: 5, borderRadius: 10},
    notificationItem: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
    orderItem: {flexDirection: 'row', alignItems: 'center'},
    icon: {marginRight: 10},
    image: {width: 50, height: 50, borderRadius: 10, marginRight: 10},
    textContainer: {flex: 1},
    title: {fontSize: 16, fontWeight: 'bold'},
    message: {fontSize: 14, color: '#757575'},
    countBubble: {backgroundColor: 'red', borderRadius: 10, paddingHorizontal: 6, alignSelf: 'center'},
    countText: {color: '#fff', fontSize: 12, fontWeight: 'bold'},
});

export default NotificationScreen;