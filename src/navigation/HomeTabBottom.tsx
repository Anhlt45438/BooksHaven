import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen'
import NotificationScreen from '../screens/NotificationScreen';
import { Image } from 'react-native';
import ShopcartScreen from "../screens/ShopcartScreen.tsx";
import UserScreen from "../screens/UserScreen.tsx";
const Tab = createBottomTabNavigator()

const TabTabNavigation = () =>{
    return(
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
         <Tab.Screen name='UserScreen'
            component={UserScreen}
            options={{
                title: 'User',
                tabBarIcon: ({focused}) =>(
                    <Image source={require('../assets/image/profile.jpg')}/>
                
            )}}/>

        </Tab.Navigator>
    )
}

export default TabTabNavigation