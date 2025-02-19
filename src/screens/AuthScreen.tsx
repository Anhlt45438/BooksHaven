import React, { useRef, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Keyboard,
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomAppBar from '../components/CustomAppBar';
import CustomButton from "../components/CustomButtonProps.tsx";

type RootStackParamList = {
    PasswordRecovery: undefined;
    Auth: undefined;
    ResetPassword: undefined;
};

type AuthScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'Auth'
>;

interface AuthScreenProps {
    navigation: AuthScreenNavigationProp;
}

const AuthScreen: React.FC<AuthScreenProps> = ({ navigation }) => {
    const [otp, setOtp] = useState(['', '', '', '', '', '']);

    const inputRefs = useRef<TextInput[]>([]);

    const handleChangeText = (text: string, index: number) => {
        const newOtp = [...otp];
        newOtp[index] = text;
        setOtp(newOtp);

        if (text && index < 5) {
            inputRefs.current[index + 1].focus();
        }
        else if (!text && index > 0) {
            inputRefs.current[index - 1].focus();
        }
    };

    const handleNext = () => {
        const code = otp.join('');
        console.log('Mã xác minh:', code);
        Keyboard.dismiss();
    };

    return (
        <View style={styles.screen}>
            <CustomAppBar
                title="Nhập mã xác minh"
                onBackPress={() => navigation.navigate('PasswordRecovery')}
            />
            <View style={styles.container}>
                <Text style={styles.description}>
                    Mã xác thực được gửi đến số điện thoại
                </Text>
                <Text style={styles.phoneNumber}>0336221983</Text>

                {/* Khối ô nhập mã xác thực */}
                <View style={styles.otpContainer}>
                    {otp.map((value, index) => (
                        <TextInput
                            key={index}
                            style={styles.otpInput}
                            keyboardType="number-pad"
                            maxLength={1}
                            ref={(ref) => {
                                if (ref) inputRefs.current[index] = ref;
                            }}
                            value={value}
                            onChangeText={(text) => handleChangeText(text, index)}
                            // Khi nhấn xoá trên bàn phím
                            onKeyPress={({ nativeEvent }) => {
                                if (nativeEvent.key === 'Backspace' && !value && index > 0) {
                                    inputRefs.current[index - 1].focus();
                                }
                            }}
                        />
                    ))}
                </View>

                <CustomButton title={'Tiếp theo'} onPress={()=> navigation.replace('ResetPassword')}/>

                <View style={styles.resendContainer}>
                    <Text style={styles.resendText}>Bạn vẫn chưa nhận được mã xác thực?</Text>
                    <TouchableOpacity onPress={() => console.log('Gửi lại mã')}>
                        <Text style={styles.resendLink}> Gửi lại bây giờ</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default AuthScreen;

// Styles
const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    container: {
        flex: 1,
        padding: 20,
        marginTop: 20,
    },
    description: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 40,
        color: '#333',
    },
    phoneNumber: {
        fontSize: 18,
        textAlign: 'center',
        marginBottom: 20,
        color: '#333',
        fontWeight: '600',
    },
    otpContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 40,
        marginTop: 10,
        paddingHorizontal: 20,
    },
    otpInput: {
        width: 45,
        height: 55,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        textAlign: 'center',
        fontSize: 22,
    },
    button: {
        backgroundColor: '#7f19b2',
        height: 50,
        borderRadius: 8,
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 30,
        marginBottom: 15,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
    resendContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 10,
    },
    resendText: {
        color: '#666',
        fontSize: 14,
    },
    resendLink: {
        color: '#0024cd',
        fontSize: 14,
    },
});
