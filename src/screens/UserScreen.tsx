import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
} from 'react-native';
import HorizontalLine from '../components/HorizontalLine';

const UserScreen = () => {
    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                {/* Khu vực bên trái (Bắt đầu bán + Avatar + Tên user) */}
                <View style={styles.headerLeftContainer}>
                    {/* Nút "Bắt đầu bán" */}
                    <View style={styles.shopButtonWrapper}>
                        <TouchableOpacity style={styles.shopButtonRow}>
                            <Image
                                style={styles.iconSmallBlack}
                                source={require('../assets/icons/shop_user.png')}
                            />
                            <Text style={styles.shopButtonText}>Bắt đầu bán</Text>
                            <Image
                                style={styles.iconSmallBlack}
                                source={require('../assets/icons/next_user.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* Avatar + Tên + Thống kê */}
                    <View style={styles.userInfoRow}>
                        <TouchableOpacity style={styles.userAvatarButton}>
                            <Image
                                source={require('../assets/icons/user.png')}
                                style={styles.iconProfileLarge}
                            />
                        </TouchableOpacity>
                        <View style={styles.column}>
                            <Text style={styles.userName}>binhphmnh</Text>
                            <View style={styles.userStats}>
                                <View style={styles.dot}/>
                                <Text style={styles.statText}>0 Người theo dõi</Text>
                                <View style={styles.dot}/>
                                <Text style={styles.statText}>2 Đang theo dõi</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Khu vực bên phải (icon cài đặt, giỏ hàng, chat) */}
                <View style={styles.headerRightContainer}>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Image
                            source={require('../assets/icons/setting_user.png')}
                            style={styles.iconWhite}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Image
                            source={require('../assets/icons/cart_user.png')}
                            style={styles.iconWhite}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerIcon}>
                        <Image
                            source={require('../assets/icons/chat_user.png')}
                            style={styles.iconWhite}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Nội dung cuộn */}
            <ScrollView style={styles.scrollContainer}>
                <HorizontalLine thickness={10} marginVertical={0}/>

                {/* Đơn mua */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Đơn mua</Text>
                        <TouchableOpacity onPress={() => console.log('Xem lịch sử mua hàng')}>
                            <Text style={styles.sectionLink}>Xem lịch sử mua hàng</Text>
                        </TouchableOpacity>
                    </View>

                    {/* Các trạng thái đơn hàng */}
                    <View style={styles.rowIcons}>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/wallet_user.png')}
                                style={styles.iconImageLarge}
                            />
                            <Text style={styles.iconBoxText}>Chờ xác nhận</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/box_user.png')}
                                style={styles.iconImageLarge}
                            />
                            <Text style={styles.iconBoxText}>Chờ xác nhận</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/truck_user.png')}
                                style={styles.iconImageLarge}
                            />
                            <Text style={styles.iconBoxText}>Đang giao</Text>
                        </TouchableOpacity>

                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/review_user.png')}
                                style={styles.iconImageLarge}
                            />
                            <Text style={styles.iconBoxText}>Chờ đánh giá</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <HorizontalLine thickness={10} marginVertical={0}/>

                {/* Tiện ích khác */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quan tâm</Text>
                    </View>
                    <View style={[styles.row,styles.rowIcons]}>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/visibility.png')}
                                style={styles.iconImageLarge}
                            />
                            <Text style={styles.iconBoxText}>Đã xem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/favorite_user.png')}
                                style={styles.iconImageLarge}
                            />
                            <Text style={styles.iconBoxText}>Yêu thích</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/cart_user.png')}
                                style={styles.iconImageLarge}
                            />
                            <Text style={styles.iconBoxText}>Mua lại</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <HorizontalLine thickness={10} marginVertical={0}/>

                {/* Hỗ trợ */}
                <View style={styles.section}>
                    <View style={[styles.sectionHeader, styles.row]}>
                        <Text style={styles.sectionTitle}>Hỗ trợ</Text>
                    </View>
                    <TouchableOpacity style={styles.listItem}>
                        <Text style={styles.listItemText}>Trung tâm trợ giúp</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listItem}>
                        <Text style={styles.listItemText}>Gửi tin nhắn cho chúng tôi</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.listItem}>
                        <Text style={styles.listItemText}>Shopee Blog</Text>
                    </TouchableOpacity>
                </View>

                {/* Khoảng trống cuối */}
                <View style={{height: 50}}/>
            </ScrollView>
        </View>
    );
};

export default UserScreen;

// =========== Styles ===========
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },

    // Header tổng
    header: {
        height: 140,
        backgroundColor: '#ff5722',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 10,
    },

    // Bên trái header
    headerLeftContainer: {
        flexDirection: 'column',
        paddingVertical: 25,
    },
    shopButtonWrapper: {
        marginTop: -20,
        alignItems: 'center',
        backgroundColor: '#fff',
        borderRadius: 30,
        marginLeft: -100,
        width: 220,
    },
    shopButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginHorizontal: -60,
        marginLeft: 30,
    },
    iconSmallBlack: {
        width: 15,
        height: 15,
        tintColor: '#000',
    },
    shopButtonText: {
        fontSize: 12,
        color: '#000',
        marginHorizontal: 5,
    },

    userInfoRow: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    userAvatarButton: {
        marginLeft: 15,
    },
    iconProfileLarge: {
        width: 70,
        height: 70,
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 10,
    },
    userStats: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 10,
        marginTop: 5,
    },
    dot: {
        width: 4,
        height: 4,
        borderRadius: 2,
        backgroundColor: '#666',
        marginHorizontal: 6,
    },
    statText: {
        fontSize: 12,
        color: '#fff',
    },

    // Bên phải header
    headerRightContainer: {
        flexDirection: 'row',
        marginBottom: 'auto',
    },
    headerIcon: {
        marginLeft: 15,
    },
    iconWhite: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },

    // ScrollView
    scrollContainer: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },

    // Section chung
    section: {
        backgroundColor: '#fff',
        marginTop: 10,
        paddingHorizontal: 16,
        paddingBottom: 10,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    sectionTitle: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    sectionLink: {
        color: '#ff5722',
        fontSize: 14,
    },

    // Dòng icon (trạng thái đơn hàng)
    rowIcons: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-around',
    },
    iconBox: {
        alignItems: 'center',
        backgroundColor: '#f5f6ff',
        padding: 10,
        borderRadius: 20,
    },
    iconImageLarge: {
        width: 40,
        height: 40,
    },
    iconBoxText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },

    // Danh sách item
    listItem: {
        paddingVertical: 10,
    },
    listItemText: {
        fontSize: 14,
        color: '#333',
    },

    // Row/Column hỗ trợ
    row: {
        flexDirection: 'row',
    },
    column: {
        flexDirection: 'column',
    },
});
