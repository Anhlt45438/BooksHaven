import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Image,
    Alert, ScrollView,
} from 'react-native';
import CustomButton from '../components/CustomButtonProps';
import {StackNavigationProp} from '@react-navigation/stack';
import {useAppDispatch} from '../redux/hooks';
import {register} from '../redux/userSlice';

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

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [sđt, setsđt] = useState('');
    const [dia_chi] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);

    const dispatch = useAppDispatch();

    const handleRegister = async () => {
        // Validate số điện thoại: phải bắt đầu bằng 0 hoặc +84 và có 10-11 chữ số
        const phoneRegex = /^(0|\+84)[0-9]{9,10}$/;
        if (!phoneRegex.test(sđt)) {
            Alert.alert('Lỗi', 'Số điện thoại không hợp lệ!');
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert('Oops', 'Mật khẩu không trùng khớp!');
            return;
        }

        const resultAction = await dispatch(
            register({name, email, sđt, dia_chi, password})
        );

        if (register.fulfilled.match(resultAction)) {
            Alert.alert('Thành công', 'Đăng ký thành công!');
            navigation.replace('Login');
        } else {
            console.error('Đăng ký lỗi:', resultAction.payload);
            Alert.alert('Thất bại', 'Đăng ký không thành công. Vui lòng thử lại!');
        }
    };

    return (
        <View style={styles.container}>
            <ScrollView>

                <Text style={styles.title}>Đăng Ký</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Họ và tên"
                    value={name}
                    onChangeText={setName}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    keyboardType="email-address"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Số điện thoại"
                    keyboardType="phone-pad"
                    value={sđt}
                    onChangeText={setsđt}
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

                <CustomButton
                    title={'Đăng ký'}
                    onPress={handleRegister}
                />
            </ScrollView>
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
