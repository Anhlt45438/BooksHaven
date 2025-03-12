import {StyleSheet, Text, View, Image} from 'react-native';
import React from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux'; // Import Redux
import CustomAppBar from '../components/CustomAppBar';

const ManHoSo = () => {
    const navigation = useNavigation();

    // Lấy dữ liệu người dùng từ Redux
    const user = useSelector((state) => state.user.user);

    // Nếu không có user (chưa đăng nhập), hiển thị loading hoặc thông báo
    if (!user) {
        return (
            <View style={styles.container}>
                <CustomAppBar title="Hồ sơ" onBackPress={() => navigation.goBack()} rightIcon={(require('../assets/icons/edit.png'))} onRightPress={navigation.navigate('')}/>
                <Text style={styles.loadingText}>Đang tải...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <CustomAppBar title="Hồ sơ" onBackPress={() => navigation.goBack()} rightIcon={(require('../assets/icons/edit.png'))} onRightPress={navigation.navigate('ManSuaHoSo')}/>
            <View style={styles.container2}>
                <Image style={styles.avatar}
                       source={{uri: user.anh || 'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg'}}/>
            </View>
            <View>
                <View style={styles.section}>
                    <Text style={[styles.textBold, {color: '#5908B0'}]}>Trạng thái: {user.trang_thai}</Text>
                </View>

                <View style={styles.content}>
                    <View style={styles.infoBox}>
                        <Text style={styles.textBold}>Số điện thoại</Text>
                        <View style={styles.ochu}>
                            <Text>{user.sđt}</Text>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.textBold}>Email</Text>
                        <View style={styles.ochu}>
                            <Text>{user.email}</Text>
                        </View>
                    </View>

                    <View style={styles.infoBox}>
                        <Text style={styles.textBold}>Địa chỉ</Text>
                        <View style={styles.ochu}>
                            <Text numberOfLines={1} ellipsizeMode="tail">{user.dia_chi}</Text>
                        </View>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ManHoSo;

const styles = StyleSheet.create({
    container: {flex: 1},
    loadingText: {textAlign: 'center', marginTop: 50, fontSize: 16},
    container2: {
        width: '100%',
        height: 200,
        backgroundColor: '#D9D9D9',
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center'
    },
    avatar: {height: 120, width: 120, borderRadius: 60},
    section: {borderBottomColor: '#D9D9D9', borderBottomWidth: 1, padding: 20},
    textBold: {fontSize: 16, fontWeight: 'bold'},
    content: {padding: 20},
    infoBox: {marginTop: 20},
    ochu: {width: '100%', backgroundColor: '#D9D9D9', height: 40, marginTop: 10, justifyContent: 'center', padding: 10},
});
