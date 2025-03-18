import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
    ScrollView,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage'; // Thêm import AsyncStorage
import CustomButton from "../components/CustomButtonProps";
import { useAppDispatch } from '../redux/hooks';
import { login } from '../redux/userSlice';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    HomeTabBottom: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const dispatch = useAppDispatch();

    // Validate email bằng regex đơn giản
    const validateEmail = (email: string) => {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    };

    const handleLogin = async () => {
        if (!email.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập Email!');
            return;
        }
        if (!validateEmail(email)) {
            Alert.alert('Lỗi', 'Vui lòng nhập đúng định dạng Email!');
            return;
        }
        if (!loginPassword.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu!');
            return;
        }

        const resultAction = await dispatch(login({ email, password: loginPassword }));
        if (login.fulfilled.match(resultAction)) {
            const { accessToken } = resultAction.payload; // Lấy accessToken từ payload của API
            await AsyncStorage.setItem('accessToken', accessToken); // Lưu accessToken vào AsyncStorage
            Alert.alert('Thành công', 'Đăng nhập thành công!');
            navigation.replace('HomeTabBottom'); // Chuyển đến HomeTabBottom
        } else {
            Alert.alert('Thất bại', resultAction.payload as string);
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>
                <Image
                    source={require('../assets/images/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Đăng nhập</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#999"
                        value={email}
                        onChangeText={setEmail}
                    />
                </View>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#999"
                        secureTextEntry={!passwordVisible}
                        value={loginPassword}
                        onChangeText={setLoginPassword}
                    />
                    <TouchableOpacity
                        onPress={() => setPasswordVisible(!passwordVisible)}
                        style={styles.iconButton}
                    >
                        <Image
                            source={
                                passwordVisible
                                    ? require('../assets/icons/visibility.png')
                                    : require('../assets/icons/hide.png')
                            }
                            style={styles.iconImage}
                        />
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.replace('ForgotPassword')}>
                    <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                </TouchableOpacity>
                <CustomButton
                    title={'Đăng nhập'}
                    onPress={handleLogin}
                />
                <View style={styles.orContainer}>
                    <View style={styles.line} />
                    <Text style={styles.orText}>Hoặc</Text>
                    <View style={styles.line} />
                </View>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={require('../assets/icons/google.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.socialButtonText}>Tiếp tục với Google</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={require('../assets/icons/facebook.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.socialButtonText}>Tiếp tục với Facebook</Text>
                </TouchableOpacity>
            </ScrollView>
            <View style={styles.signupContainer}>
                <Text>Bạn chưa có tài khoản?</Text>
                <TouchableOpacity onPress={() => navigation.replace('Register')}>
                    <Text style={styles.signupText}>Đăng ký ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        height: '100%',
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 30,
        paddingTop: 50,
        paddingBottom: 20,
        justifyContent: 'center',
    },
    logo: {
        width: 120,
        height: 120,
        alignSelf: 'center',
        marginBottom: 30,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 20,
        alignSelf: 'center',
    },
    iconImage: {
        width: 24,
        height: 24,
        tintColor: '#999',
    },
    iconButton: {
        padding: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        paddingHorizontal: 10,
    },
    input: {
        flex: 1,
        height: 60,
    },
    forgotText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#0024cd',
        marginBottom: 10,
    },
    orText: {
        marginTop: 30,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
    },
    orContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
    line: {
        margin: 15,
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    icon: {
        marginRight: 8,
        width: 32,
        height: 32,
    },
    socialButton: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#a1a1a1',
        borderRadius: 8,
        height: 60,
        paddingHorizontal: 10,
        alignItems: 'center',
        marginBottom: 15,
    },
    socialButtonText: {
        flex: 1,
        textAlign: 'center',
        fontWeight: '500',
        fontSize: 18,
    },
    signupContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
    },
    signupText: {
        color: '#0024cd',
        marginLeft: 5,
        fontWeight: '500',
    },
});

export default LoginScreen;