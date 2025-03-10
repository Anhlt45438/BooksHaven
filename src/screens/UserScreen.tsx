import React, {useEffect, useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Image,
    TouchableOpacity,
    Alert,
} from 'react-native';
import HorizontalLine from '../components/HorizontalLine';
import {StackNavigationProp} from "@react-navigation/stack";
import {RouteProp} from "@react-navigation/native";

type RootStackParamList = {
    UserScreen: undefined;
    MyShop: undefined;
    RegisShop: { user: any };
    SettingAccount: undefined;
    Message: undefined;
};

type UserScreenNavigationProp = StackNavigationProp<RootStackParamList, 'UserScreen'>;
type UserScreenRouteProp = RouteProp<RootStackParamList, 'UserScreen'>;

interface UserScreenProps {
    navigation: UserScreenNavigationProp;
    route: UserScreenRouteProp;
}

const UserScreen: React.FC<UserScreenProps> = ({ navigation, route }) => {
    const [user, setUser] = useState({
        _id: '67cea155080d1998b5d4d3dd',
        username: 'Congvu',
        password: '123456',
        sđt: '0396622583',
        email: 'congv@gmail.com',
        dia_chi: 'Hà Nội, Việt Nam',
        avatar:
            'https://i.pinimg.com/originals/f8/45/68/f8456800ac55a50acda33ea6b9267e54.jpg',
        trang_thai: 'active',
        accessToken:
            'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX2lkIjoiNjdjZWExNTUwODBkMTk5OGI1ZDRkM2RkIiwidG9rZW5fdHlwZSI6MCwiaWF0IjoxNzQxNTk0OTc2LCJleHAiOjE3NDE1OTg1NzZ9.ki4kuWh8fVLkQc0Jo-7HPK5MnG5-TLeP1lY6Jwh0QgY',
    });

    const [hasShopRole, setHasShopRole] = useState(false);

    useEffect(() => {
        const fetchUserRole = async () => {
            try {
                const response = await fetch(
                    `http://192.123.99.100:3000/api/users/user-info-account?user_id=${user._id}`,
                    {
                        method: 'GET',
                        headers: {
                            'Content-Type': 'application/json',
                            Accept: 'application/json', // Yêu cầu trả về JSON
                            Authorization: `Bearer ${user.accessToken}`,
                        },
                    },
                );
                const text = await response.text();
                console.log('Response text:', text);

                // Nếu response bắt đầu bằng '<', có khả năng server trả về HTML (lỗi)
                if (text.trim().startsWith('<')) {
                    throw new Error(
                        'Server returned HTML instead of JSON. Check the endpoint and server configuration.',
                    );
                }

                const result = JSON.parse(text);
                if (response.ok) {
                    // Xác định id của vai trò "shop"
                    const SHOP_ROLE_ID = '67c344fc50b53f3cbd9c20ba';
                    // Nếu có ít nhất 1 record có id_role khớp với SHOP_ROLE_ID thì user có vai trò shop
                    const isShop =
                        Array.isArray(result) &&
                        result.some(role => role.id_role === SHOP_ROLE_ID);
                    setHasShopRole(isShop);
                } else {
                    Alert.alert(
                        'Lỗi',
                        result.message || 'Không thể lấy dữ liệu vai trò.',
                    );
                }
            } catch (error) {
                console.error(error);
                if (error instanceof Error) {
                    Alert.alert('Lỗi', error.message);
                } else {
                    Alert.alert('Lỗi', 'An unknown error occurred.');
                }
            }
        };

        fetchUserRole();
    }, [user]);
    return (
        <View style={styles.screen}>
            {/* Header */}
            <View style={styles.header}>
                {/* Khu vực bên trái (Bắt đầu bán + Avatar + Tên user) */}
                <View style={styles.headerLeftContainer}>
                    {/* Nút "Bắt đầu bán" */}
                    <View style={styles.shopButtonWrapper}>
                        <TouchableOpacity
                            style={styles.shopButtonRow}
                            onPress={() => {
                                // Nếu có vai trò shop, điều hướng đến MyShop, nếu không điều hướng sang trang đăng ký shop
                                if (hasShopRole) {
                                    navigation.navigate('MyShop');
                                } else {
                                    navigation.navigate('RegisShop', {user});
                                }
                            }}>
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
                                source={{uri: user.avatar}}
                                style={styles.iconProfileLarge}
                            />
                        </TouchableOpacity>
                        <View style={styles.column}>
                            <Text style={styles.userName}>{user.username}</Text>
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
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => navigation.navigate('SettingAccount')}>
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
                    <TouchableOpacity
                        style={styles.headerIcon}
                        onPress={() => navigation.navigate('Message')}>
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
                        <TouchableOpacity
                            onPress={() => console.log('Xem lịch sử mua hàng')}>
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
                    <View style={[styles.row, styles.rowIcons]}>
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
        paddingTop: 20,
    },

    // Bên trái header
    headerLeftContainer: {
        flexDirection: 'column',
        paddingVertical: 25,
    },
    shopButtonWrapper: {
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
    shopButtonRow: {
        flexDirection: 'row',
        alignItems: 'center',
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
        borderRadius: 35,
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
    iconRow: {
        flexDirection: 'row',
        marginTop: 8,
        justifyContent: 'space-around',
    }, iconLarge: {
        width: 40,
        height: 40,
    },
});
