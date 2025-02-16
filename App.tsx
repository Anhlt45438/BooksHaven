import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createStackNavigator} from '@react-navigation/stack';
import 'react-native-gesture-handler';
import SplashScreen from "./src/screens/SplashScreen.tsx";
import LoginScreen from "./src/screens/LoginScreen.tsx";
import RegisterScreen from "./src/screens/RegisterScreen.tsx";
import ForgotPasswordScreen from "./src/screens/ForgotPasswordScreen.tsx";
import PasswordRecoveryScreen from "./src/screens/PasswordRecoveryScreen.tsx";


const Stack = createStackNavigator();

const App = () => {
    return (
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
            </Stack.Navigator>
        </NavigationContainer>
    );
};

export default App;
