import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Animated, useWindowDimensions} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import ScrollView = Animated.ScrollView;

type RootStackParamList = {
    Splash: undefined;
    Login: undefined;
    Register: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
    navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({navigation}) => {
    const { height } = useWindowDimensions();
    const dynamicPaddingVertical = height > 800 ? 60 : 40;

    return (
        <ScrollView contentContainerStyle={[
            styles.scrollContainer,
            {paddingVertical: dynamicPaddingVertical},
        ]}>
            <View style={styles.container}>
                <Image
                    source={require('../assets/image/logo.png')}
                    style={styles.logo}
                    resizeMode="contain"
                />
                <Text style={styles.title}>Đăng nhập</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Email/Số điện thoại"
                        placeholderTextColor="#999"
                    />
                </View>

                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#999"
                        secureTextEntry
                    />
                    <TouchableOpacity>
                        <Text style={styles.forgotText}>Quên mật khẩu?</Text>
                    </TouchableOpacity>
                </View>

                <TouchableOpacity style={styles.loginButton}>
                    <Text style={styles.loginButtonText}>Đăng nhập</Text>
                </TouchableOpacity>

                <Text style={styles.orText}>Hoặc</Text>

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

                <View style={styles.signupContainer}>
                    <Text>Bạn chưa có tài khoản?</Text>
                    <TouchableOpacity onPress={() => navigation.replace('Register')}>
                        <Text style={styles.signupText}>Đăng ký ngay</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        paddingHorizontal: 20,
        backgroundColor: '#fff',
    },
    container: {
        height: '100%',
        flex: 1,
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingTop: 40,
        paddingBottom: 20,
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
        marginBottom: 20,
        paddingHorizontal: 10,
    },
    icon: {
        marginRight: 8,
        width: 32,
        height: 32,
    },
    input: {
        flex: 1,
        height: 50,
    },
    forgotText: {
        fontSize: 12,
        color: '#7f19b2',
    },
    loginButton: {
        backgroundColor: '#7f19b2',
        paddingVertical: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginBottom: 15,
    },
    loginButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: '500',
    },
    orText: {
        textAlign: 'center',
        color: '#666',
        marginBottom: 10,
    },
    socialButton: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingVertical: 15,
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
