import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Alert,
} from 'react-native';
import { logoutUserThunk } from '../redux/userSlice';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import TermsScreen from "./UserTermsScreen.tsx";

const SettingAccount = ({ navigation }) => {
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);

    const handleLogout = async () => {
        try {
            const resultAction = await dispatch(logoutUserThunk());
            if (logoutUserThunk.fulfilled.match(resultAction)) {
                Alert.alert('Thành công', 'Đăng xuất thành công!');
                navigation.navigate('Login');
            } else {
                Alert.alert('Lỗi', 'Đăng xuất không thành công. Vui lòng thử lại!');
                console.error('Lỗi khi gọi logoutUserThunk:', resultAction.payload);
            }
        } catch (error) {
            console.error('Lỗi khi xử lý đăng xuất:', error);
            Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng xuất.');
        }
    };

    const renderList = (data) => {
        return data.map((item, index, arr) => (
            <View key={index}>
                <TouchableOpacity style={styles.box} onPress={item.onPress}>
                    <Text style={styles.txt}>{item.title}</Text>
                    <Image
                        source={require('../assets/icons/Vector2.png')}
                        style={styles.icon}
                    />
                </TouchableOpacity>
                {index !== arr.length - 1 && <View style={styles.separator} />}
            </View>
        ));
    };

    const accountItems = [
        {
            title: 'Tài khoản và Bảo mật',
            onPress: () => navigation.navigate('ManSuaHoSo'),
        },
        {
            title: 'Địa chỉ',
            onPress: () => navigation.navigate('UpdateDiaChiScreen'),
        },
        {
            title: 'Tài khoản / Thẻ Ngân hàng',
            onPress: () => navigation.navigate('PaymentMethodScreen'),
        },
    ];

    const settingItems = [
        { title: 'Cài đặt chat', onPress: () => {} },
        { title: 'Cài đặt thông báo', onPress: () => {} },
        { title: 'Cài đặt riêng tư', onPress: () => {} },
        { title: 'Người dùng bị chặn', onPress: () => {} },
        { title: 'Ngôn ngữ', onPress: () => {} },
    ];

    const supportItems = [
        { title: 'Trung tâm hỗ trợ', onPress: () => {} },
        { title: 'Tiêu chuẩn cộng đồng', onPress: () => navigation.navigate("CommunityStandardsScreen") },
        { title: "Điều khoản Book's haven", onPress: () => navigation.navigate('TermsScreen') },
        { title: 'Giới thiệu', onPress: () => navigation.navigate('UserAboutScreen') },
        { title: 'Yêu cầu xóa tài khoản', onPress: () => {}},
    ];

    return (
        <View style={{ flex: 1 }}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/icons/back.png')}
                        style={{ width: 26, height: 26 }}
                    />
                </TouchableOpacity>
                <Text style={styles.headertext}>Thiết lập tài khoản</Text>
            </View>
            <ScrollView style={styles.container}>
                <View style={{ alignItems: 'center', marginTop: 10 }}>
                    <Text style={styles.sectionTitle}>Tài khoản</Text>
                    <View style={styles.conbox}>{renderList(accountItems)}</View>

                    <Text style={[styles.sectionTitle, { color: '#8D8D8D' }]}>Cài đặt</Text>
                    <View style={styles.conbox}>{renderList(settingItems)}</View>

                    <Text style={[styles.sectionTitle, { color: '#8D8D8D' }]}>Hỗ trợ</Text>
                    <View style={styles.conbox}>{renderList(supportItems)}</View>

                    <TouchableOpacity
                        style={styles.logoutButton}
                        onPress={handleLogout}
                    >
                        <Text style={styles.logoutText}>Đăng xuất</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
            <View style={styles.footerSeparator} />
        </View>
    );
};

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        height: 60,
    },
    back: {
        marginEnd: 30,
        marginTop: 4,
    },
    headertext: {
        marginLeft: 26,
        fontSize: 21,
        marginTop: 5,
    },
    container: {
        flex: 1,
        backgroundColor: '#f4f4f4',
    },
    conbox: {
        width: '100%',
        backgroundColor: 'rgb(255,255,255)',
        marginVertical: 10,
        overflow: 'hidden',
    },
    box: {
        width: '100%',
        padding: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    txt: {
        fontSize: 15,
    },
    icon: {
        marginTop: 3,
    },
    separator: {
        height: 1,
        backgroundColor: 'rgba(200, 200, 200, 0.8)',
        marginHorizontal: 10,
    },
    sectionTitle: {
        width: '95%',
        marginTop: 5,
        color: '#6c6c6c',
        fontSize: 16,
    },
    logoutButton: {
        width: '95%',
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#393939',
        borderRadius: 5,
        alignItems: 'center',
        justifyContent: 'center',
        height: 40,
        marginTop: 20,
        marginBottom: 20,
    },
    logoutText: {
        color: '#333',
        fontSize: 20,
        fontWeight: '600',
    },
    footerSeparator: {
        height: 2,
        backgroundColor: 'rgba(200, 200, 200, 1)',
    },
});

export default SettingAccount;
