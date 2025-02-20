import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomAppBar from "../components/CustomAppBar.tsx";

type RootStackParamList = {
    Login: undefined;
    ForgotPassword: undefined;
    PasswordRecovery: undefined;
};

type ForgotPasswordScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ForgotPassword'
>;

interface ForgotPasswordScreenProps {
    navigation: ForgotPasswordScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<ForgotPasswordScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <CustomAppBar
                title="Quên mật khẩu"
                onBackPress={() => navigation.replace('Login')}
            />
            <View style={styles.container}>
                <Text style={styles.description}>
                   Vui lòng nhập email của bạn để khôi phục mật khẩu
                </Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email của bạn"
                    keyboardType="email-address"
                    placeholderTextColor="#999"
                />
                <TouchableOpacity onPress={() => navigation.replace('PasswordRecovery')} style={styles.button} >
                    <Text style={styles.buttonText}>Tiếp theo</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
        marginTop: 100,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
    },
    input: {
        height: 60,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
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
});

export default ForgotPasswordScreen;
