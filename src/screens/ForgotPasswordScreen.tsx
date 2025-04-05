import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';
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
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Hàm validate email
    const isValidEmail = (email: string) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSendEmail = async () => {
        // Kiểm tra email trước khi gửi
        if (!email) {
            Alert.alert('Lỗi', 'Vui lòng nhập email');
            return;
        }

        if (!isValidEmail(email)) {
            Alert.alert('Lỗi', 'Email không hợp lệ');
            return;
        }

        setIsLoading(true);

        const payload = { email };

        try {
            const response = await fetch('http://14.225.206.60:3000/api/users/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();

            if (response.ok) {
                Alert.alert('Thành công', 'Email khôi phục đã được gửi!');
            } else {
                let errorMessage = 'Có lỗi xảy ra khi gửi email';
                if (data.error) {
                    errorMessage = data.error;
                    if (data.error === 'Error sending password reset email') {

                    }
                } else if (data.message) {
                    errorMessage = data.message;
                }
                Alert.alert('Lỗi', errorMessage);
            }
        } catch (error) {
            console.error('Network error:', error);
            Alert.alert('Lỗi', 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <View style={styles.screen}>
            <CustomAppBar
                title="Quên mật khẩu"
                onBackPress={() => navigation.goBack()}
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
                    value={email}
                    onChangeText={setEmail}
                    autoCapitalize="none"
                    editable={!isLoading}
                />
                <TouchableOpacity
                    onPress={handleSendEmail}
                    style={[styles.button, isLoading && styles.buttonDisabled]}
                    disabled={isLoading}
                >
                    <Text style={styles.buttonText}>
                        {isLoading ? 'Đang gửi...' : 'Tiếp theo'}
                    </Text>
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
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
    },
});

export default ForgotPasswordScreen;