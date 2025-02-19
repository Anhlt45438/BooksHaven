import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import HomeScreen from '../screens/HomeScreen'
import ShopcartScreen from '../screens/ShopcartScreen'
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/Setting';
import { Image } from 'react-native';
const stack=createStackNavigator();
import { NavigationContainer } from '@react-navigation/native';
const Tab = createBottomTabNavigator()

const TabTabNavigation = () =>{
    return(
        <NavigationContainer>
        <Tab.Navigator initialRouteName='HomeScreen' screenOptions={{ headerShown: false }}>
            <Tab.Screen name='HomeScreen' 
            component={HomeScreen} 
            options={{
                title: 'Trang chủ',
                tabBarIcon: ({focused}) =>(
                    <Image source={require('../assets/image/home.jpg')}/>
                
            )}}/>
         <Tab.Screen name='ShopcartScreen' 
            component={ShopcartScreen} 
            options={{
                title: 'Giỏ hàng',
                tabBarIcon: ({focused}) =>(
                    <Image source={require('../assets/image/shoppingcart.jpg')}/>
                
            )}}/>
         <Tab.Screen name='NotificationScreen' 
            component={NotificationScreen} 
            options={{
                title: 'Thông báo',
                tabBarIcon: ({focused}) =>(
                    <Image source={require('../assets/image/ringing.jpg')}/>
                
            )}}/>
         <Tab.Screen name='SettingScreen' 
            component={SettingScreen} 
            options={{
                title: 'Cài đật',
                tabBarIcon: ({focused}) =>(
                    <Image source={require('../assets/image/profile.jpg')}/>
                
            )}}/>

        </Tab.Navigator>
        </NavigationContainer>
    )
}

export default TabTabNavigation