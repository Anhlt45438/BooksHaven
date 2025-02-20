import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import SplashScreen from './src/screens/SplashScreen.tsx';
import LoginScreen from './src/screens/LoginScreen.tsx';
import RegisterScreen from './src/screens/RegisterScreen.tsx';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen.tsx';
import PasswordRecoveryScreen from './src/screens/PasswordRecoveryScreen.tsx';
import AuthScreen from './src/screens/AuthScreen.tsx';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen.tsx';
import RatingScreen from './src/screens/RatingScreen.tsx';
import RegisShopScreen from './src/screens/RegisShop.js';
import RegisShop2Screen from './src/screens/RegisShop2.js';
import RegisShop3Screen from './src/screens/RegisShop3.js';
import MyShopScreen from './src/screens/MyShop.js';
// import ProductDetailScreen from './src/screens/ProductDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="RegisShop"
        screenOptions={{headerShown: false}} // Ẩn header kiểu xưa
      >
        <Stack.Screen name="Splash" component={SplashScreen} />
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Register" component={RegisterScreen} />
        <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
        <Stack.Screen
          name="PasswordRecovery"
          component={PasswordRecoveryScreen}
        />
        <Stack.Screen name="Auth" component={AuthScreen} />
        <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="RegisShop" component={RegisShopScreen} />
        <Stack.Screen name="RegisShop2" component={RegisShop2Screen} />
        <Stack.Screen name="RegisShop3" component={RegisShop3Screen} />
        <Stack.Screen name="MyShop" component={MyShopScreen} />
        {/* <Stack.Screen name="ProductDetail" component={ProductDetailScreen}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;