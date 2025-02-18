import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image} from 'react-native';
import CustomButton from "../components/CustomButtonProps.tsx";
import {StackNavigationProp} from "@react-navigation/stack";

type RootStackParamList = {
    Login: undefined;
    Register: undefined;
};

type RegisterScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Register'>;

interface RegisterScreenProps {
    navigation: RegisterScreenNavigationProp;
}

const RegisterScreen: React.FC<RegisterScreenProps> = ({navigation}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    const [confirmPasswordVisible, setConfirmPasswordVisible] = useState(false);
        const handleRegister = () => {
        };

        return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Ký</Text>
            <TextInput style={styles.input} placeholder="Họ và tên"/>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
            />
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.inputPassword}
                    placeholder="Mật khẩu"
                    secureTextEntry={!passwordVisible}
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
    inputPassword: {
        flex: 1,
        height: 60,
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
    button: {
        marginTop: 30,
        backgroundColor: '#28a745',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
    },
    iconButton: {
        padding: 10,
    },
    iconImage: {
        width: 24,
        height: 24,
        tintColor: '#999',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
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

export default RegisterScreen;