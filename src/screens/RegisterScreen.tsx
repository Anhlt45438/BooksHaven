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
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import CustomButton from '../components/CustomButtonProps';
import { StackNavigationProp } from '@react-navigation/stack';
import { useAppDispatch } from '../redux/hooks';
import { register } from '../redux/userSlice';
import { CommonActions } from '@react-navigation/native'; // For navigation reset

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
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sdt, setsdt] = useState('');
    const [dia_chi] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
    const [isRegistering, setIsRegistering] = useState(false); // Track registration state

    const dispatch = useAppDispatch();

    const handleRegister = async () => {
        if (isRegistering) return; // Prevent multiple registrations

        // Input validation
        if (!name.trim()) {
            Alert.alert('Thất Bại', 'Vui lòng nhập họ và tên!');
            return;
        }
        if (!email.trim()) {
            Alert.alert('Thất Bại', 'Vui lòng nhập email!');
            return;
        }
        if (!sdt.trim()) {
            Alert.alert('Thất Bại', 'Vui lòng nhập số điện thoại!');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Thất Bại', 'Vui lòng nhập mật khẩu!');
            return;
        }
        if (!confirmPassword.trim()) {
            Alert.alert('Thất Bại', 'Vui lòng nhập xác nhận mật khẩu!');
            return;
        }

        // Validate email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            Alert.alert('Thất Bại', 'Email không hợp lệ!');
            return;
        }

        // Validate phone number: must start with 0 or +84 and have 10-11 digits
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
        if (!phoneRegex.test(sdt)) {
            Alert.alert('Thất Bại', 'Số điện thoại không hợp lệ!');
            return;
        }

        if (password.length < 8) {
            Alert.alert('Thất Bại', 'Mật khẩu phải có ít nhất 8 ký tự!');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Thất Bại', 'Mật khẩu không trùng khớp!');
            return;
        }

        setIsRegistering(true); // Disable button while processing
        try {
            const resultAction = await dispatch(
                register({ name, email, sdt, dia_chi, password })
            );

            if (register.fulfilled.match(resultAction)) {
                Alert.alert('Thành công', 'Đăng ký thành công!');
                // Reset navigation stack to Login screen
                navigation.dispatch(
                    CommonActions.reset({
                        index: 0,
                        routes: [{ name: 'Login' }],
                    })
                );
            } else {
                // Log error for debugging
                console.error('Registration failed:', resultAction.payload || resultAction.error);
                Alert.alert('Thất bại', 'Email đã tồn tại. Vui lòng thử lại!');
            }
        } catch (error) {
            console.error('Registration error:', error); // Log unexpected errors
            Alert.alert('Thất bại', 'Đã xảy ra lỗi khi đăng ký. Vui lòng thử lại!');
        } finally {
            setIsRegistering(false); // Re-enable button
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === "ios" ? "padding" : "height"}
            style={{ flex: 1 }}
        >
            <View style={styles.container}>
                <ScrollView>
                    <Text style={styles.title}>Đăng Ký</Text>
                    <TextInput
                        style={styles.input}
                        placeholder="Họ và tên"
                        placeholderTextColor="grey"
                        value={name}
                        onChangeText={setName}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="grey"
                        keyboardType="email-address"
                        value={email}
                        onChangeText={setEmail}
                    />
                    <TextInput
                        style={styles.input}
                        placeholder="Số điện thoại"
                        placeholderTextColor="grey"
                        keyboardType="phone-pad"
                        value={sdt}
                        onChangeText={setsdt}
                    />

                    <View style={styles.inputContainer}>
                        <TextInput
                            style={styles.inputPassword}
                            placeholder="Mật khẩu"
                            placeholderTextColor="grey"
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
                            placeholderTextColor="grey"
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

                    <CustomButton
                        title={isRegistering ? 'Đang đăng ký...' : 'Đăng ký'} // Update button text
                        onPress={handleRegister}
                        disabled={isRegistering} // Disable button while registering
                        style={isRegistering ? { opacity: 0.5 } : {}} // Visual feedback
                    />
                </ScrollView>
                <View style={styles.signinContainer}>
                    <Text>Đã có tài khoản? </Text>
                    <TouchableOpacity onPress={() => navigation.replace('Login')}>
                        <Text style={styles.signinText}>Đăng nhập ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
};

export default RegisterScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#fff',
        paddingTop: 50,
    },
    title: {
        fontSize: 28,
        fontWeight: '600',
        marginBottom: 20,
        alignSelf: 'center',
    },
    input: {
        height: 50,
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
        height: 50,
        paddingHorizontal: 10,
        color: 'black',
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