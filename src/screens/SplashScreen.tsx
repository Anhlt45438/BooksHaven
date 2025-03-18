import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StackNavigationProp } from '@react-navigation/stack';

type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  HomeTabBottom: undefined;
};

type SplashScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Splash'>;

interface SplashScreenProps {
  navigation: SplashScreenNavigationProp;
}

const SplashScreen: React.FC<SplashScreenProps> = ({ navigation }) => {
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const token = await AsyncStorage.getItem('accessToken');
        const timeout = setTimeout(() => {
          if (token) {
            navigation.replace('HomeTabBottom'); // Có token -> HomeTabBottom
          } else {
            navigation.replace('Login'); // Không có token -> Login
          }
        }, 2000); // Đợi 2 giây để hiển thị Splash
        return () => clearTimeout(timeout);
      } catch (error) {
        console.error('Lỗi khi kiểm tra token:', error);
        navigation.replace('Login'); // Lỗi -> Login
      }
    };

    checkLoginStatus();
  }, [navigation]);

  return (
      <View style={styles.container}>
        <Image
            source={require('../assets/images/logo.png')}
            style={styles.logo}
            resizeMode="contain"
        />
      </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  logo: {
    width: 200,
    height: 200,
  },
});

export default SplashScreen;