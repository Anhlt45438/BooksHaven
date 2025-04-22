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
} from 'react-native';
import { StackNavigationProp } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import CustomButton from '../components/CustomButtonProps';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { login } from '../redux/userSlice';
import { resetBooks } from '../redux/bookSlice.tsx';
import { CommonActions } from '@react-navigation/native'; // For navigation reset

type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  HomeTabBottom: undefined;
};

type LoginScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  'Login'
>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [passwordVisible, setPasswordVisible] = useState(false);
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector(state => state.user); // Get loading state from Redux

  const validateEmail = (email: string) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleLogin = async () => {
    if (loading) return; // Prevent multiple login attempts

    // Input validation
    if (!email.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập Email!');
      return;
    }
    if (!validateEmail(email)) {
      Alert.alert('Lỗi', 'Vui lòng nhập đúng định dạng Email!');
      return;
    }
    if (!loginPassword.trim()) {
      Alert.alert('Lỗi', 'Vui lòng nhập mật khẩu!');
      return;
    }

    try {
      const resultAction = await dispatch(
        login({ email, password: loginPassword }),
      );
      if (login.fulfilled.match(resultAction)) {
        const userData = resultAction.payload; // userInfo from API
        const accessToken = await AsyncStorage.getItem('accessToken'); // Get accessToken from AsyncStorage
        if (accessToken) {
          await AsyncStorage.setItem(
            'userData',
            JSON.stringify({ ...userData, accessToken }),
          ); // Store accessToken with userData
          dispatch(resetBooks());
          // Reset navigation stack to HomeTabBottom
          navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: 'HomeTabBottom' }],
            })
          );
        } else {
          throw new Error('Không tìm thấy accessToken sau khi đăng nhập');
        }
      } else {
        console.error('Login failed:', resultAction.payload); // Log error for debugging
        Alert.alert('Thất bại', resultAction.payload as string);
      }
    } catch (error) {
      console.error('Lỗi trong handleLogin:', error); // Improved error logging
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi đăng nhập. Vui lòng thử lại!');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView style={{ flex: 1 }}>
        <Image
          source={require('../assets/images/logo.png')}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Đăng nhập</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Email"
            placeholderTextColor="grey"
            value={email}
            onChangeText={setEmail}
          />
        </View>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Mật khẩu"
            placeholderTextColor="grey"
            secureTextEntry={!passwordVisible}
            value={loginPassword}
            onChangeText={setLoginPassword}
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
        <TouchableOpacity onPress={() => navigation.navigate('ForgotPassword')}>
          <Text style={styles.forgotText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
        <CustomButton
          title={loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          onPress={handleLogin}
          disabled={loading}
          style={loading ? { opacity: 0.5 } : {}} // Visual feedback when loading
        />
        <View style={styles.orContainer}>
          <View style={styles.line} />
          <Text style={styles.orText}>Hoặc</Text>
          <View style={styles.line} />
        </View>
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
      </ScrollView>
      <View style={styles.signupContainer}>
        <Text>Bạn chưa có tài khoản?</Text>
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupText}>Đăng ký ngay</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 30,
    paddingBottom: 20,
    justifyContent: 'center',
  },
  logo: {
    marginTop: 30,
    width: 120,
    height: 120,
    alignSelf: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
    marginBottom: 20,
    alignSelf: 'center',
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
    height: 50,
    color: 'black',
  },
  forgotText: {
    marginLeft: 5,
    fontSize: 12,
    color: '#0024cd',
    marginBottom: 10,
  },
  orText: {
    marginTop: 30,
    textAlign: 'center',
    color: '#666',
    marginBottom: 30,
  },
  orContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  line: {
    margin: 15,
    flex: 1,
    height: 1,
    backgroundColor: '#ccc',
  },
  icon: {
    marginRight: 8,
    width: 32,
    height: 32,
  },
  socialButton: {
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    height: 50,
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