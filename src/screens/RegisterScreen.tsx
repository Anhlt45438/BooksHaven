import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput} from 'react-native';

const RegisterScreen = ({navigation}) => {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Đăng Ký</Text>
            <TextInput style={styles.input} placeholder="Họ và tên"/>
            <TextInput
                style={styles.input}
                placeholder="Email"
                keyboardType="email-address"
            />
            <TextInput
                style={styles.input}
                placeholder="Mật khẩu"
                secureTextEntry
            />
            <TextInput
                style={styles.input}
                placeholder="Xác nhận mật khẩu"
                secureTextEntry
            />

            <TouchableOpacity style={styles.button}>
                <Text style={styles.buttonText}>Đăng Ký</Text>
            </TouchableOpacity>

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
    },
    title: {
        fontSize: 24,
        marginBottom: 20,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        marginBottom: 15,
        borderRadius: 8,
        paddingHorizontal: 10,
    },
    button: {
        backgroundColor: '#28a745',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 15,
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
