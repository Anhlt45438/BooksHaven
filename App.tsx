import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import SplashScreen from "./src/screens/SplashScreen.tsx";
import LoginScreen from "./src/screens/LoginScreen.tsx";
import RegisterScreen from "./src/screens/RegisterScreen.tsx";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen.tsx";
import PasswordRecoveryScreen from "./src/screens/PasswordRecoveryScreen.tsx";
import AuthScreen from "./src/screens/AuthScreen.tsx";
import ResetPasswordScreen from "./src/screens/ResetPasswordScreen.tsx";
import RatingScreen from "./src/screens/RatingScreen.tsx";
import ProductDetailScreen from "./src/screens/ProductDetailScreen.tsx";
import {Provider} from "react-redux";
import store from "./src/redux/store";


const Stack = createStackNavigator();

const App = () => {
    return (
        <Provider store={store}>
            <NavigationContainer>
                <Stack.Navigator
                    initialRouteName="Splash"
                    screenOptions={{headerShown: false}}  // Ẩn header kiểu xưa
                >
                    <Stack.Screen name="Splash" component={SplashScreen}/>
                    <Stack.Screen name="Login" component={LoginScreen}/>
                    <Stack.Screen name="Register" component={RegisterScreen}/>
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen}/>
                    <Stack.Screen name="PasswordRecovery" component={PasswordRecoveryScreen}/>
                    <Stack.Screen name="Auth" component={AuthScreen}/>
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen}/>
                    <Stack.Screen name="Rating" component={RatingScreen}/>
                    <Stack.Screen name="ProductDetail" component={ProductDetailScreen}/>
                </Stack.Navigator>
            </NavigationContainer>
        </Provider>
    );
};

export default App;
