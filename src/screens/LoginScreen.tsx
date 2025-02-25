import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomButton from "../components/CustomButtonProps";
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
import {
    signInWithEmailAndPassword,
    signInWithCredential,
    GoogleAuthProvider,
} from 'firebase/auth';
import { auth } from '../services/firebase';
import { GoogleSignin, statusCodes } from '@react-native-google-signin/google-signin';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
    ForgotPassword: undefined;
    Home: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const dispatch = useDispatch();

    // Cấu hình Google Signin khi component mount
    useEffect(() => {
        GoogleSignin.configure({
            webClientId: '107646354296-i0if66d1f5m4sbqd2ivoukbpgvvn19mo.apps.googleusercontent.com',
        });
    }, []);

    // Hàm đăng nhập bằng email/mật khẩu
    const handleLogin = async () => {
        if (!email.trim() || !password) {
            Alert.alert("Thông báo", "Vui lòng nhập đầy đủ email và mật khẩu!");
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert("Thông báo", "Email không hợp lệ!");
            return;
        }
        if (password.length < 8) {
            Alert.alert("Thông báo", "Mật khẩu phải có ít nhất 8 ký tự!");
            return;
        }

        try {
            dispatch(loginStart());
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            dispatch(loginSuccess(userCredential.user));
            navigation.replace('Home');
        } catch (error: any) {
            dispatch(loginFailure(error.message));
            Alert.alert("Lỗi đăng nhập", error.message);
        }
    };

    // Hàm đăng nhập bằng Google
    const handleGoogleSignIn = async () => {
        try {
            // Kiểm tra Play Services (dành cho Android)
            await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });

            // Đăng nhập Google và lấy thông tin người dùng
            const response = await GoogleSignin.signIn();
            const idToken = (response as any).idToken;
            if (!idToken) {
                Alert.alert("Đăng nhập", "Bạn đã hủy đăng nhập Google.");
                return;
            }

            // Tạo credential cho Firebase và đăng nhập
            const googleCredential = GoogleAuthProvider.credential(idToken);
            const userCredential = await signInWithCredential(auth, googleCredential);

            // Xử lý Redux và chuyển hướng sau khi đăng nhập thành công
            dispatch(loginSuccess(userCredential.user));
            navigation.replace('ForgotPassword');
        } catch (error: any) {
            if (error.code === statusCodes.SIGN_IN_CANCELLED) {
                Alert.alert("Đăng nhập", "Đăng nhập Google đã bị hủy!");
            } else {
                dispatch(loginFailure(error.message));
                Alert.alert("Lỗi đăng nhập Google", error.message);
            }
        }
    };

    return (
        <View style={styles.container}>
            <Image
                source={require('../assets/images/logo.png')}
                style={styles.logo}
                resizeMode="contain"
            />
            <Text style={styles.title}>Đăng nhập</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Email/Số điện thoại"
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
                    value={password}
                    onChangeText={setPassword}
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
            <CustomButton title="Đăng nhập" onPress={handleLogin} />
            <View style={styles.orContainer}>
                <View style={styles.line} />
                <Text style={styles.orText}>Hoặc</Text>
                <View style={styles.line} />
            </View>
            <TouchableOpacity style={styles.socialButton} onPress={handleGoogleSignIn}>
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
    iconButton: {
        padding: 10,
    },
    iconImage: {
        width: 24,
        height: 24,
        tintColor: '#999',
    },
    forgotText: {
        marginLeft: 5,
        fontSize: 12,
        color: '#0024cd',
        marginBottom: 10,
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
    orText: {
        marginTop: 30,
        textAlign: 'center',
        color: '#666',
        marginBottom: 30,
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
    icon: {
        marginRight: 8,
        width: 32,
        height: 32,
    },
});

export default LoginScreen;
