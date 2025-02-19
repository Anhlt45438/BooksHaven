import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image, TextInput} from 'react-native';
import {StackNavigationProp} from '@react-navigation/stack';
import CustomAppBar from "../components/CustomAppBar.tsx";
import CustomButton from "../components/CustomButtonProps.tsx";

type RootStackParamList = {
    PasswordRecovery: undefined;
    Auth: undefined;
    ResetPassword: undefined;
    Login: undefined;
};

type ResetPasswordScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'ResetPassword'
>;

interface ResetPasswordScreenProps {
    navigation: ResetPasswordScreenNavigationProp;
}

const ResetPasswordScreen: React.FC<ResetPasswordScreenProps> = ({navigation}) => {
    const [passwordVisible, setPasswordVisible] = useState(false);
    return (
        <View style={styles.screen}>
            <CustomAppBar
                title="Đặt lại mật khẩu"
                onBackPress={() => navigation.navigate('Auth')}
            />
            <View style={styles.container}>
                <Text style={styles.title}>Vui lòng nhập mật khẩu mới và xác nhận lại</Text>
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.input}
                        placeholder="Mật khẩu"
                        placeholderTextColor="#999"
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
                <Text style={styles.title2}>Mật khẩu phải dài từ 8-16 ký tự (..........)</Text>
                <CustomButton title={'Đồng ý'} onPress={() => navigation.replace('Login')}/>
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
        marginTop: 80,
    },
    iconImage: {
        width: 24,
        height: 24,
        tintColor: '#999',
    },
    iconButton: {
        padding: 10,
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
    title: {
        fontSize: 16,
        marginBottom: 20,
        fontWeight: 'bold',
        textAlign: 'center',
    },
    title2: {
        paddingLeft: 5,
        marginBottom: 20,
    }
});

export default ResetPasswordScreen;
