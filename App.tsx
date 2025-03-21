import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {NavigationContainer} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store.tsx';
import SplashScreen from './src/screens/SplashScreen.tsx';
import LoginScreen from './src/screens/LoginScreen.tsx';
import RegisterScreen from './src/screens/RegisterScreen.tsx';
import ForgotPasswordScreen from './src/screens/ForgotPasswordScreen.tsx';
import PasswordRecoveryScreen from './src/screens/PasswordRecoveryScreen.tsx';
import AuthScreen from './src/screens/AuthScreen.tsx';
import ResetPasswordScreen from './src/screens/ResetPasswordScreen.tsx';
import RatingScreen from './src/screens/RatingScreen.tsx';
import RegisShopScreen from './src/screens/RegisShop.tsx';
import RegisShop2Screen from './src/screens/RegisShop2.tsx';
import RegisShop3Screen from './src/screens/RegisShop3.js';
import MyShopScreen from './src/screens/MyShop.tsx';
import AddProduct from './src/screens/AddProduct.tsx';
import EditProduct from './src/screens/EditProduct.tsx';
import ProductScreen from './src/screens/ProductScreen.tsx';
import Statistical from './src/screens/Statistical.tsx';
import Finance from './src/screens/Finance.tsx';
import SearchBooks from './src/screens/SearchBooks.tsx';
import RatingSPshop from './src/screens/RatingSPshop.tsx';
import SettingScreen from './src/screens/Setting.js';
import EditScreen from './src/screens/EditShop.tsx';
import SettingShipScreen from './src/screens/SettingShip.js';
import SettingAccountScreen from './src/screens/SettingAccount.js';
import SettingNotificationScreen from './src/screens/SettingNotification.js';
import MessageScreen from './src/screens/Message.js';
import MessageDetailScreen from './src/screens/MessageDetail.js';
import AddAddressScreen from './src/screens/AddAddress.js';
import HomeScreen from './src/screens/HomeScreen.tsx';
import HomeTabBottom from './src/navigation/HomeTabBottom.tsx';
import ManGioHang from './src/screens/ManGioHang';
import ManThanhToan from './src/screens/ManThanhToan';
import ManSuaHoSo from './src/screens/ManSuaHoSo.tsx';
import UpdateAccountScreen from './src/screens/UpdateAccountScreen.tsx';
import UserScreen from './src/screens/UserScreen.tsx';

import CategoryDetailScreen from './src/screens/CategoryDetailScreen.tsx';
import ProductDetailScreen from './src/screens/ProductDetailScreen.tsx';
import ManDanhGia from './src/screens/ManDanhGia';
import ShopHomeScreen from './src/screens/ShopHome.tsx';
import UpdateDiaChiScreen from "./src/screens/UpdateDiaChiScreen.tsx";
import UserSetting from "./src/screens/UserSetting";


type RootStackParamList = {
  Splash: undefined;
  Login: undefined;
  Register: undefined;
  ForgotPassword: undefined;
  PasswordRecovery: undefined;
  Auth: undefined;
  ResetPassword: undefined;
  Rating: undefined;
  RegisShop: {user: any};
  RegisShop2: {user: any};
  RegisShop3: undefined;
  MyShop: {user: any; shopData: any};
  HomeTabBottom: undefined;
  ProductScreen: undefined;
  AddProduct: undefined;
  EditProduct: undefined;
  Statistical: undefined;
  Finance: undefined;

  SearchBooks : undefined;
  RatingSPshop : undefined;

  Settings: undefined;
  EditShop: {shop: any; user: any};
  SettingShip: undefined;
  SettingAccount: undefined;
  SettingNotification: undefined;
  Message: undefined;
  MessageDetail: undefined;
  AddAddress: undefined;
  Home: undefined;
  ManGioHang: undefined;
  ManThanhToan: undefined;
  ManHoSo: undefined;
  ManSuaHoSo: undefined;
  UpdateAccountScreen: undefined;
  User: undefined;
  ShopHome: {id_shop: any};
};
const Stack = createStackNavigator<RootStackParamList>();

const App = () => {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{headerShown: false}} // Ẩn header
        >
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="ForgotPassword"
            component={ForgotPasswordScreen}
          />
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
          <Stack.Screen name="HomeTabBottom" component={HomeTabBottom} />
          <Stack.Screen name="ProductScreen" component={ProductScreen} />
          <Stack.Screen name="AddProduct" component={AddProduct} />
          <Stack.Screen name="EditProduct" component={EditProduct} />
          <Stack.Screen name="Statistical" component={Statistical} />
          <Stack.Screen name="Finance" component={Finance} />
          <Stack.Screen name="SearchBooks" component={SearchBooks} />
          <Stack.Screen name="RatingSPshop" component={RatingSPshop} />
          <Stack.Screen name="Settings" component={SettingScreen} />
          <Stack.Screen name="EditShop" component={EditScreen} />
          <Stack.Screen name="SettingShip" component={SettingShipScreen} />
          <Stack.Screen
            name="SettingAccount"
            component={SettingAccountScreen}
          />
          <Stack.Screen
            name="SettingNotification"
            component={SettingNotificationScreen}
          />
          <Stack.Screen name="Message" component={MessageScreen} />
          <Stack.Screen name="MessageDetail" component={MessageDetailScreen} />
          <Stack.Screen name="AddAddress" component={AddAddressScreen} />
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="ManGioHang" component={ManGioHang} />
          <Stack.Screen name="ManThanhToan" component={ManThanhToan} />
          <Stack.Screen name="ManSuaHoSo" component={ManSuaHoSo} />
          <Stack.Screen name="ManDanhGia" component={ManDanhGia} />
          <Stack.Screen name="User" component={UserScreen} />

          <Stack.Screen name="CategoryDetail" component={CategoryDetailScreen} />
          <Stack.Screen name="ProductDetailScreen" component={ProductDetailScreen} />
          <Stack.Screen name="UpdateDiaChiScreen" component={UpdateDiaChiScreen} />
          <Stack.Screen name="UserSetting" component={UserSetting} />
          <Stack.Screen name="ShopHome" component={ShopHomeScreen} />

          <Stack.Screen
            name="UpdateAccountScreen"
            component={UpdateAccountScreen}
          />

        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
