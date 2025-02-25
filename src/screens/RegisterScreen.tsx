// RegisterScreen.tsx
import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert,
} from 'react-native';
import CustomButton from '../components/CustomButtonProps';
import { StackNavigationProp } from '@react-navigation/stack';
import { useDispatch } from 'react-redux';
import { loginStart, loginSuccess, loginFailure } from '../redux/authSlice';
// Import hàm của Firebase v9
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { auth } from '../services/firebase';

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Register'
>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({ navigation }) => {
    const [fullName, setFullName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const dispatch = useDispatch();

    const handleRegister = async () => {
        // Kiểm tra trường trống
        if (!fullName.trim() || !email.trim() || !password || !confirmPassword) {
            Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin!');
            return;
        }

        // Kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Thông báo', 'Email không hợp lệ!');
            return;
        }

        // Kiểm tra độ dài mật khẩu (ví dụ: ít nhất 6 ký tự)
        if (password.length < 8) {
            Alert.alert('Thông báo', 'Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        // Kiểm tra mật khẩu khớp với xác nhận mật khẩu
        if (password !== confirmPassword) {
            Alert.alert('Thông báo', 'Mật khẩu không khớp!');
            return;
        }

        try {
            dispatch(loginStart());
            // Tạo user mới bằng Firebase
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );
            // Cập nhật tên hiển thị nếu có
            if (userCredential.user) {
                await updateProfile(userCredential.user, {
                    displayName: fullName,
                });
            }
            dispatch(loginSuccess(userCredential.user));
            // Điều hướng đến màn hình Login (hoặc màn hình chính)
            navigation.replace('Login');
        } catch (error: any) {
            dispatch(loginFailure(error.message));
            Alert.alert('Lỗi đăng ký', error.message);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Ký</Text>
            <TextInput
                style={styles.input}
                placeholder="Họ và tên"
                value={fullName}
                onChangeText={setFullName}
            />
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
                value={email}
                onChangeText={setEmail}
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Mật khẩu"
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
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Xác nhận mật khẩu"
                    secureTextEntry={!confirmPasswordVisible}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                />
                <TouchableOpacity
                    onPress={() => setConfirmPasswordVisible(!confirmPasswordVisible)}
                    style={styles.iconButton}
                >
                    <Image
                        source={
                            confirmPasswordVisible
                                ? require('../assets/icons/visibility.png')
                                : require('../assets/icons/hide.png')
                        }
                        style={styles.iconImage}
                    />
                </TouchableOpacity>
            </View>
            <CustomButton title="Đăng ký" onPress={handleRegister} />
            <View style={styles.signinContainer}>
                <Text>Đã có tài khoản? </Text>
                <TouchableOpacity onPress={() => navigation.replace('Login')}>
                    <Text style={styles.signinText}>Đăng nhập ngay</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default RegisterScreen;

// Style giữ nguyên...
const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        marginBottom: 20,
        alignSelf: 'center',
    },
    input: {
        height: 60,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        borderColor: '#ccc',
        borderWidth: 1,
        borderRadius: 8,
        marginBottom: 15,
    },
    inputPassword: {
        flex: 1,
        height: 60,
        paddingHorizontal: 10,
    },
    iconButton: {
        padding: 10,
    },
    iconImage: {
        width: 24,
        height: 24,
        tintColor: '#999',
    },
    signinContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 'auto',
    },
    signinText: {
        color: '#0024cd',
        marginLeft: 5,
        fontWeight: '600',
    },
});
