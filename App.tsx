import React from 'react';
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

import TabTabNavigation from './src/navigation/HomeTabBottom.tsx';
import {NavigationContainer} from '@react-navigation/native';

import AddProduct from './src/screens/AddProduct.tsx';
import EditProduct from './src/screens/EditProduct.tsx';
import ProductScreen from './src/screens/ProductScreen.tsx';
import Statistical from './src/screens/Statistical.tsx';
import Finance from './src/screens/Finance.tsx';
import Revenue from './src/screens/Revenue.tsx';

import SettingScreen from './src/screens/Setting.js';
import EditScreen from './src/screens/EditShop.js';
import SettingShipScreen from './src/screens/SettingShip.js';
import SettingAccountScreen from './src/screens/SettingAccount.js';
import SettingNotificationScreen from './src/screens/SettingNotification.js';
import DanhGiaScreen from './src/screens/ManDanhGia.js';
import BaiDanhGia from './src/screens/ManDanhSachDanhGia.js'
import ThanhToanScreen from './src/screens/ManThanhToan.js'
import GioHangScreen from './src/screens/ManGioHang.js'
import HoSoScreen from './src/screens/ManHoSo.js'
import SuaHoSoScreen from './src/screens/ManSuaHoSo.js'

import MessageScreen from './src/screens/Message.js';
import MessageDetailScreen from './src/screens/MessageDetail.js';
import AddAddressScreen from './src/screens/AddAddress.js';
import HomeScreen from './src/screens/HomeScreen.tsx';
import ChanceAddressScreen from './src/screens/ChanceAddressScreen.js';
import UserScreen from './src/screens/UserScreen.tsx';

// import ProductDetailScreen from './src/screens/ProductDetailScreen';

const Stack = createStackNavigator();

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="MyShop"

        // initialRouteName="Statistical"

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
        <Stack.Screen name="DanhGia" component={DanhGiaScreen} />
        <Stack.Screen name="BaiDanhGia" component={BaiDanhGia} />
        <Stack.Screen name="HoSo" component={HoSoScreen} />
        <Stack.Screen name="SuaHoSo" component={SuaHoSoScreen} />
        <Stack.Screen name="Payments" component={ThanhToanScreen} />
        <Stack.Screen name="GioHang" component={GioHangScreen} />
        <Stack.Screen name="Rating" component={RatingScreen} />
        <Stack.Screen name="RegisShop" component={RegisShopScreen} />
        <Stack.Screen name="RegisShop2" component={RegisShop2Screen} />
        <Stack.Screen name="RegisShop3" component={RegisShop3Screen} />
        <Stack.Screen name="MyShop" component={MyShopScreen} />

        <Stack.Screen name="TabNavigation" component={TabTabNavigation} />

        <Stack.Screen name="ProductScreen" component={ProductScreen} />
        <Stack.Screen name="AddProduct" component={AddProduct} />
        <Stack.Screen name="EditProduct" component={EditProduct} />
        <Stack.Screen name="Statistical" component={Statistical} />
        <Stack.Screen name="Finance" component={Finance} />
        <Stack.Screen name="Revenue" component={Revenue} />

        <Stack.Screen name="Setting" component={SettingScreen} />
        <Stack.Screen name="EditShop" component={EditScreen} />
        <Stack.Screen name="SettingShip" component={SettingShipScreen} />
        <Stack.Screen name="SettingAccount" component={SettingAccountScreen} />
        <Stack.Screen name="Message" component={MessageScreen} />
        <Stack.Screen name="MessageDetail" component={MessageDetailScreen} />
        <Stack.Screen name="AddAddress" component={AddAddressScreen} />
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ChanceAddress" component={ChanceAddressScreen} />
        <Stack.Screen name="User" component={UserScreen} />
        <Stack.Screen
          name="SettingNotification"
          component={SettingNotificationScreen}
        />

        {/* <Stack.Screen name="ProductDetail" component={ProductDetailScreen}/> */}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;
