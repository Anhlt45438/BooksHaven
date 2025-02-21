import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, TextInput, Image} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import CustomAppBar from "../components/CustomAppBar.tsx";

type RootStackParamList = {
    ForgotPassword: undefined;
    Login: undefined;
    PasswordRecovery: undefined;
    Auth: undefined;
};

type PasswordRecoveryScreenNavigationProp = StackNavigationProp<
    RootStackParamList,
    'PasswordRecovery'
>;

interface PasswordRecoveryScreenProps {
    navigation: PasswordRecoveryScreenNavigationProp;
}

const ForgotPasswordScreen: React.FC<PasswordRecoveryScreenProps> = ({ navigation }) => {
    return (
        <View style={styles.screen}>
            <CustomAppBar
                title="Khôi phục tài khoản"
                onBackPress={() => navigation.navigate('ForgotPassword')}
            />
            <View style={styles.container}>
                <Image source={require('../assets/icons/user.png')} style={styles.image}/>
                <Text style={styles.description}>
                    0336221983
                </Text>
                <Text style={styles.description}>
                   Vui lòng chọn phương thức khôi phục tài khoản
                </Text>
                <TouchableOpacity style={styles.socialButton}>
                    <Image
                        source={require('../assets/icons/phone.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.socialButtonText}>Xác thực với số điện thoại</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={()=> navigation.replace('Auth')} style={styles.socialButton}>
                    <Image
                        source={require('../assets/icons/gmail.png')}
                        style={styles.icon}
                    />
                    <Text style={styles.socialButtonText}>Xác thực qua Email</Text>
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
        marginTop: 80,
    },
    image: {
        width: 150,
        height: 150,
        alignSelf: 'center',
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
    icon: {
        marginRight: 8,
        width: 32,
        height: 32,
    },
    socialButton: {
        flexDirection: 'row',
        borderWidth: 1,
        borderColor: '#a1a1a1',
        borderRadius: 8,
        height: 60,
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
});

export default ForgotPasswordScreen;
