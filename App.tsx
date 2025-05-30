import React, {useEffect} from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import {
  createNavigationContainerRef,
  NavigationContainer,
} from '@react-navigation/native';
import {Provider} from 'react-redux';
import {store} from './src/redux/store.tsx';
import {Linking, Text} from 'react-native';
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
import Revenue from './src/screens/Revenue.tsx';
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
import QuanlydonhangUserScreen from './src/screens/Quanlydonhanguser.tsx';
import CategoryDetailScreen from './src/screens/CategoryDetailScreen.tsx';
import ProductDetailScreen from './src/screens/ProductDetailScreen.tsx';
import ManDanhGia from './src/screens/ManDanhGia';
import UserSetting from './src/screens/UserSetting.tsx';
import UpdateDiaChiScreen from './src/screens/UpdateDiaChiScreen.tsx';
import QuanlydonhangShop from './src/screens/QuanlydonhangShop.tsx';
import Feedback from './src/screens/Feedback.tsx';
import ChitietdonhangUser from './src/screens/ChitietdonhangUser.tsx';
import ChitietdonhangShop from './src/screens/ChitietdonhangShop.tsx';
import UserAboutScreen from './src/screens/UserAboutScreen.tsx';
import TermsScreen from './src/screens/UserTermsScreen.tsx';
import CommunityStandardsScreen from './src/screens/UserCommunityStandardsScreen.tsx';
import ChamsockhachhangScreen from './src/screens/Chamsockhachhangf.tsx';
import ShopHomeScreen from './src/screens/ShopHome.tsx';

import Ruttien1 from './src/screens/Ruttien1.tsx';
import Ruttien2 from './src/screens/Ruttien2.tsx';
import Ruttien3 from './src/screens/Ruttien3.tsx';

import ChoiceBank from './src/screens/ChoiceBank.tsx';
import InforBank from './src/screens/InforBank.tsx';
import ManSauDatHang from './src/screens/ManSauDatHang.js';

import LichsuruttienShop from './src/screens/LichsuruttienShop.tsx';
import ChitietgiaodichShop from './src/screens/ChitietgiaodichShop.tsx';
import Chamsockhachhang from './src/screens/Chamsockhachhang.tsx';
import FeedbacktoUser from './src/screens/FeedbacktoUser.tsx';
import DetailFeedback from './src/screens/DetailFeedback.tsx';
import SafeShopping from './src/screens/SafeShopping.tsx'
import Quanlyfeedback from './src/screens/Quanlyfeedback.tsx'
import Goiy1 from './src/screens/Gọiy1.tsx'
import Goiy2 from './src/screens/Goiy2.tsx'
import Goiy3 from './src/screens/CSKHUngdung1.tsx'
import CSKHUngdung from './src/screens/CSKHUngdung.tsx'
import CSKHUngdung2 from './src/screens/CSKHUngdung2.tsx'
import CSKHMuasam from './src/screens/CSKHMuasam.tsx'
import CSKHMuasam1 from './src/screens/CSKHMuasam1.tsx'
import CSKHMuasam2 from './src/screens/CSKHMuasam2.tsx'
const navigationRef = createNavigationContainerRef();

import ReviewScreen from './src/screens/ReviewScreen.tsx';
import ReviewTabScreen from './src/screens/ReviewScreen.tsx';
import AccountSecurityScreen from './src/screens/AccountSecurityScreen.tsx';
import OrderTabScreen from './src/screens/Quanlydonhanguser.tsx';
import ManChitietSach from './src/screens/ManChiTietSach.js';

import { LogBox } from 'react-native';


LogBox.ignoreAllLogs();

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
  Revenue: undefined;
  SearchBooks: undefined;
  RatingSPshop: undefined;
  Settings: undefined;
  EditShop: {shop: any; user: any};
  SettingShip: undefined;
  SettingAccount: undefined;
  SettingNotification: undefined;
  Message: undefined;
  MessageDetail: undefined;
  AddAddress: undefined;
  ManThanhToan: undefined;
  ManSuaHoSo: undefined;
  ManDanhGia: undefined;
  User: undefined;
  CategoryDetail: undefined;
  ProductDetailScreen: undefined;
  UpdateAccountScreen: undefined;
  UserAboutScreen: undefined;
  UpdateDiaChiScreen: undefined;
  UserSetting: undefined;
  TermsScreen: undefined;
  OrderTabScreen: undefined;
  CommunityStandardsScreen: undefined;
  ReviewScreen: undefined;
  ShopHome: {id_shop: any};
  ReviewTabScreen: undefined;
  Chamsockhachhang: undefined;
  Home: undefined;
  QuanlydonhangShop: undefined;
  ChitietdonhangUser: undefined;
  QuanlydonhangUserScreen: undefined;
  ManGioHang: undefined;
  Feedback: undefined;
  ChitietdonhangShop: undefined;
  AccountSecurityScreen: undefined;
  Ruttien1: undefined;
  Ruttien2: undefined;
  Ruttien3: undefined;
  ChoiceBank: undefined;
  InforBank: undefined;
};
const Stack = createStackNavigator<RootStackParamList>();

const linking = {
  prefixes: ['myapp://'],
  config: {
    screens: {
      HomeTabBottom: {
        path: '', // Root của HomeTabBottom
        screens: {
          HomeScreen: 'home',
          
        },
      },
      ManSauDatHang: 'giohang',
    },
  },
};

const App = () => {
  const handleDeepLink = ({url}: {url: string}) => {
    if (navigationRef.isReady()) {
      if (url === 'myapp://home') {
        navigationRef.navigate('HomeTabBottom', {screen: 'HomeScreen'});
      } else if (url === 'myapp://giohang') {

        navigationRef.navigate('ManSauDatHang');

      }
    }
  };

  useEffect(() => {
    Linking.addEventListener('url', handleDeepLink);
    Linking.getInitialURL().then(url => {
      if (url) {
        handleDeepLink({url});
      }
    });

    return () => {
      Linking.removeAllListeners('url');
    };
  }, []);
  return (
    <Provider store={store}>
      <NavigationContainer
        ref={navigationRef}
        linking={linking}
        fallback={<Text>Loading...</Text>}>
        <Stack.Navigator
          initialRouteName="Splash"
          screenOptions={{headerShown: false}}>
          <Stack.Screen name="Splash" component={SplashScreen} />
          <Stack.Screen
            name="ChitietdonhangUser"
            component={ChitietdonhangUser}
          />
          <Stack.Screen
            name="ChitietdonhangShop"
            component={ChitietdonhangShop}
          />
          <Stack.Screen
            name="QuanlydonhangUserScreen"
            component={QuanlydonhangUserScreen}
          />
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Register" component={RegisterScreen} />
          <Stack.Screen
            name="QuanlydonhangShop"
            component={QuanlydonhangShop}
          />
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
          <Stack.Screen name="Revenue" component={Revenue} />
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
          <Stack.Screen name="ManChiTietSach" component={ManChitietSach} />
          <Stack.Screen name="ManSauDatHang" component={ManSauDatHang} />
          <Stack.Screen name="User" component={UserScreen} />
          <Stack.Screen name="Ruttien1" component={Ruttien1} />
          <Stack.Screen name="Ruttien2" component={Ruttien2} />
          <Stack.Screen name="Ruttien3" component={Ruttien3} />
          <Stack.Screen name="ChoiceBank" component={ChoiceBank} />
          <Stack.Screen name="InforBank" component={InforBank} />
          <Stack.Screen name="LichsuruttienShop" component={LichsuruttienShop} />
          <Stack.Screen name="ChitietgiaodichShop" component={ChitietgiaodichShop} />
          <Stack.Screen name="Chamsockhachhang1" component={Chamsockhachhang} />
          <Stack.Screen name="FeedbacktoUser" component={FeedbacktoUser} />
          <Stack.Screen name="DetailFeedback" component={DetailFeedback} />
          <Stack.Screen name="SafeShopping" component={SafeShopping} />
          <Stack.Screen name="Quanlyfeedback" component={Quanlyfeedback} />
          <Stack.Screen name="Goiy1" component={Goiy1} />
          <Stack.Screen name="Goiy2" component={Goiy2} />
          <Stack.Screen name="CSKHUngdung1" component={Goiy3} />
          <Stack.Screen name="CSKHUngdung" component={CSKHUngdung} />
          <Stack.Screen name="CSKHUngdung2" component={CSKHUngdung2} />
          <Stack.Screen name="CSKHMuasam" component={CSKHMuasam} />
          <Stack.Screen name="CSKHMuasam1" component={CSKHMuasam1} />
          <Stack.Screen name="CSKHMuasam2" component={CSKHMuasam2} />
          
          <Stack.Screen
            name="CategoryDetail"
            component={CategoryDetailScreen}
          />
          <Stack.Screen
            name="ProductDetailScreen"
            component={ProductDetailScreen}
          />
          <Stack.Screen
            name="UpdateDiaChiScreen"
            component={UpdateDiaChiScreen}
          />
          <Stack.Screen name="UserSetting" component={UserSetting} />
          <Stack.Screen name="ShopHome" component={ShopHomeScreen} />
          <Stack.Screen
            name="UpdateAccountScreen"
            component={UpdateAccountScreen}
          />
          <Stack.Screen
            name="Chamsockhachhang"
            component={ChamsockhachhangScreen}
          />
          <Stack.Screen name="Feedback" component={Feedback} />
          <Stack.Screen name="UserAboutScreen" component={UserAboutScreen} />
          <Stack.Screen name="TermsScreen" component={TermsScreen} />
          <Stack.Screen
            name="CommunityStandardsScreen"
            component={CommunityStandardsScreen}
          />
          <Stack.Screen name="OrderTabScreen" component={OrderTabScreen} />
          <Stack.Screen name="ReviewScreen" component={ReviewScreen} />
          <Stack.Screen name="ReviewTabScreen" component={ReviewTabScreen} />
          <Stack.Screen
            name="AccountSecurityScreen"
            component={AccountSecurityScreen}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </Provider>
  );
};

export default App;
