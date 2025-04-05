import React, {useState} from 'react';
import {View, ScrollView, Switch, TouchableOpacity, Image, StyleSheet} from 'react-native';
import {Text, List, Divider} from 'react-native-paper';
import {useAppSelector} from "../redux/hooks.tsx";

const AccountSecurityScreen = ({navigation}) => {
    const [isFingerprintEnabled, setFingerprintEnabled] = useState(true);

    const handleToggleFingerprint = () => {
        setFingerprintEnabled(!isFingerprintEnabled);
    };

    const user = useAppSelector((state) => state.user.user);

    const maskPhone = (phone: string | undefined) => {
        if (!phone) return 'Chưa cập nhật';
        return phone.replace(/^(\d{2})\d{5}(\d{2})$/, '$1*****$2');
    };

    const maskEmail = (email: string | undefined) => {
        if (!email) return 'Chưa cập nhật';
        const [name, domain] = email.split('@');
        return `${name[0]}**********${name[name.length - 1]}@${domain}`;
    };

    return (
        <ScrollView style={{backgroundColor: '#fff', flex: 1, paddingHorizontal: 16}}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/icons/back.png')}
                        style={{width: 26, height: 26}}
                    />
                </TouchableOpacity>
                <View style={{flex: 1, alignItems: 'center', marginRight: 26}}>
                    <Text style={styles.headertext}> Tài khoản & Bảo mật</Text>
                </View>
            </View>
            <List.Section>
                <Divider/>
                <Text style={{fontSize: 16, marginTop: 10, marginBottom: 4, color: '#888'}}>Tài Khoản</Text>
                <TouchableOpacity onPress={() => navigation.navigate('ManSuaHoSo')}>
                    <List.Item
                        title="Hồ Sơ Của Tôi"
                    />
                </TouchableOpacity>
                <List.Item
                    title="Tên người dùng"
                    description={user?.username || 'Chưa cập nhật'}
                />

                <List.Item
                    title="Điện thoại"
                    description={maskPhone(user?.sdt)}
                />

                <List.Item
                    title="Email nhận hóa đơn"
                    description={maskEmail(user?.email)}
                />

                <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
                    <List.Item
                        title="Đổi mật khẩu"
                    />
                </TouchableOpacity>
            </List.Section>
        </ScrollView>
    );
};

export default AccountSecurityScreen;
const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        backgroundColor: 'white',
        alignItems: 'center',
        height: 60,
    },
    back: {
        marginTop: 4,
    },
    headertext: {
        marginLeft: 16,
        fontSize: 21,
        marginTop: 5,
    },
});