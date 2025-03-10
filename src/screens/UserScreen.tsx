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
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
    UserScreen: undefined;
    MyShop: undefined;
    Settings: undefined;
};

type UserScreenProps = {
    navigation: StackNavigationProp<RootStackParamList, 'UserScreen'>;
};

const UserScreen: React.FC<UserScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <View style={styles.header}>
                {/* Left Section */}
                <View style={styles.headerLeft}>
                    {/* "Bắt đầu bán" button */}
                    <View style={styles.shopButtonContainer}>
                        <TouchableOpacity
                            style={styles.shopButton}
                            onPress={() => navigation.navigate('MyShop')}
                        >
                            <Image
                                style={styles.iconSmall}
                                source={require('../assets/icons/shop_user.png')}
                            />
                            <Text style={styles.shopButtonText}>Bắt đầu bán</Text>
                            <Image
                                style={styles.iconSmall}
                                source={require('../assets/icons/next_user.png')}
                            />
                        </TouchableOpacity>
                    </View>

                    {/* User info: Avatar, Name, Stats */}
                    <View style={styles.userInfo}>
                        <TouchableOpacity style={styles.avatarButton}>
                            <Image
                                source={require('../assets/icons/user.png')}
                                style={styles.avatar}
                            />
                        </TouchableOpacity>
                        <View style={styles.userDetails}>
                            <Text style={styles.userName}>binhphmnh</Text>
                            <View style={styles.userStats}>
                                <View style={styles.dot} />
                                <Text style={styles.statText}>0 Người theo dõi</Text>
                                <View style={styles.dot} />
                                <Text style={styles.statText}>2 Đang theo dõi</Text>
                            </View>
                        </View>
                    </View>
                </View>

                {/* Right Section: Icons */}
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.iconButton} onPress={() => navigation.navigate('Settings')}>
                        <Image
                            source={require('../assets/icons/setting_user.png')}
                            style={styles.iconWhite}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image
                            source={require('../assets/icons/cart_user.png')}
                            style={styles.iconWhite}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.iconButton}>
                        <Image
                            source={require('../assets/icons/chat_user.png')}
                            style={styles.iconWhite}
                        />
                    </TouchableOpacity>
                </View>
            </View>

            {/* Scrollable Content */}
            <ScrollView style={styles.content}>
                <HorizontalLine thickness={10} marginVertical={0} />

                {/* Đơn mua Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Đơn mua</Text>
                        <TouchableOpacity onPress={() => console.log('Xem lịch sử mua hàng')}>
                            <Text style={styles.sectionLink}>Xem lịch sử mua hàng</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/wallet_user.png')}
                                style={styles.iconLarge}
                            />
                            <Text style={styles.iconBoxText}>Chờ xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/box_user.png')}
                                style={styles.iconLarge}
                            />
                            <Text style={styles.iconBoxText}>Chờ xác nhận</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/truck_user.png')}
                                style={styles.iconLarge}
                            />
                            <Text style={styles.iconBoxText}>Đang giao</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/review_user.png')}
                                style={styles.iconLarge}
                            />
                            <Text style={styles.iconBoxText}>Chờ đánh giá</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <HorizontalLine thickness={10} marginVertical={0} />

                {/* Quan tâm Section */}
                <View style={styles.section}>
                    <View style={styles.sectionHeader}>
                        <Text style={styles.sectionTitle}>Quan tâm</Text>
                    </View>
                    <View style={styles.iconRow}>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/visibility.png')}
                                style={styles.iconLarge}
                            />
                            <Text style={styles.iconBoxText}>Đã xem</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/favorite_user.png')}
                                style={styles.iconLarge}
                            />
                            <Text style={styles.iconBoxText}>Yêu thích</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.iconBox}>
                            <Image
                                source={require('../assets/icons/cart_user.png')}
                                style={styles.iconLarge}
                            />
                            <Text style={styles.iconBoxText}>Mua lại</Text>
                        </TouchableOpacity>
                    </View>
                </View>

                <HorizontalLine thickness={10} marginVertical={0} />

                {/* Hỗ trợ Section */}
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
                        <Text style={styles.listItemText}>Shop Blog</Text>
                    </TouchableOpacity>
                </View>

                {/* Footer Spacer */}
                <View style={{ height: 50 }} />
            </ScrollView>
        </View>
    );
};

export default UserScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    /* Header */
    header: {
        height: 140,
        backgroundColor: '#ff5722',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 10,
        paddingTop: 20,
    },
    headerLeft: {
        flexDirection: 'column',
        paddingVertical: 25,
    },
    shopButtonContainer: {
        marginTop: -20,
        backgroundColor: '#fff',
        borderRadius: 30,
        marginLeft: -100,
        width: 210,
        height: 28,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: 10
    },
    shopButton: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: 30,
    },
    iconSmall: {
        width: 15,
        height: 15,
        tintColor: '#000',
    },
    shopButtonText: {
        fontSize: 12,
        color: '#000',
        marginHorizontal: 5,
    },
    userInfo: {
        marginTop: 20,
        flexDirection: 'row',
        alignItems: 'center',
    },
    avatarButton: {
        marginLeft: 15,
    },
    avatar: {
        width: 70,
        height: 70,
    },
    userDetails: {
        flexDirection: 'column',
        marginLeft: 10,
    },
    userName: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '600',
    },
    userStats: {
        flexDirection: 'row',
        alignItems: 'center',
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
    headerRight: {
        flexDirection: 'row',
        marginBottom: 'auto',
    },
    iconButton: {
        marginLeft: 15,
    },
    iconWhite: {
        width: 24,
        height: 24,
        tintColor: '#fff',
    },
    /* Content */
    content: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    /* Section */
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
        marginBottom: 8,
    },
    sectionTitle: {
        color: '#333',
        fontSize: 16,
        fontWeight: '600',
    },
    sectionLink: {
        color: '#ff5722',
        fontSize: 14,
    },
    /* Icon Row */
    iconRow: {
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
    iconLarge: {
        width: 40,
        height: 40,
    },
    iconBoxText: {
        fontSize: 12,
        color: '#333',
        textAlign: 'center',
        marginTop: 5,
    },
    /* List Items */
    listItem: {
        paddingVertical: 10,
    },
    listItemText: {
        fontSize: 14,
        color: '#333',
    },
    row: {
        flexDirection: 'row',
    },
});
