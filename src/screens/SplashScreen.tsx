import React, {useEffect} from 'react';
import {View, Image, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppDispatch} from "../redux/hooks.tsx";

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    HomeTabBottom: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashScreenProps {
    navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({navigation}) => {
    const dispatch = useAppDispatch();

    useEffect(() => {
        const checkLoginStatus = async () => {
            try {
                const token = await AsyncStorage.getItem('accessToken');
                const userDataString = await AsyncStorage.getItem('userData');
                if (token && userDataString) {
                    const userData = JSON.parse(userDataString); // Chuyển chuỗi JSON thành object
                    // Cập nhật Redux state với thông tin người dùng
                    dispatch({type: 'user/setUser', payload: userData});
                    navigation.replace('HomeTabBottom');
                } else {
                    navigation.replace('Login');
                }
            } catch (error) {
                console.error('Lỗi khi kiểm tra trạng thái đăng nhập:', error);
                navigation.replace('Login');
            }
        };

        checkLoginStatus();
    }, [navigation, dispatch]);

    // Hàm kiểm tra token hợp lệ (nếu cần)
    const checkTokenValidity = async (token: string) => {
        try {
            const payload = JSON.parse(atob(token.split('.')[1]));
            return payload.exp > Date.now() / 1000; // Kiểm tra token còn hạn
        } catch (error) {
            return false;
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#F5FCFF',
    },
    logo: {
        width: 200,
        height: 200,
    },
});

export default SplashScreen;