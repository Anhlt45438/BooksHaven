import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import HomeScreen from '../screens/HomeScreen';
import ShopcartScreen from '../screens/ShopcartScreen';
import NotificationScreen from '../screens/NotificationScreen';
import SettingScreen from '../screens/Setting';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';

const Tab = createBottomTabNavigator();

const TabTabNavigation = () => {
    return (
        <NavigationContainer>
            <Tab.Navigator 
                initialRouteName='HomeScreen' 
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#3498db', // Màu xanh dương khi được chọn
                    tabBarInactiveTintColor: '#95a5a6', // Màu xám nhạt khi không được chọn
                }}
            >
                <Tab.Screen 
                    name='HomeScreen' 
                    component={HomeScreen} 
                    options={{
                        title: 'Trang chủ',
                        tabBarIcon: ({ focused }) => (
                            <Image 
                                source={require('../assets/image/home.jpg')} 
                                style={{ tintColor: focused ? '#3498db' : '#95a5a6' }}
                            />
                        ),
                    }} 
                />
                <Tab.Screen 
                    name='ShopcartScreen' 
                    component={ShopcartScreen} 
                    options={{
                        title: 'Giỏ hàng',
                        tabBarIcon: ({ focused }) => (
                            <Image 
                                source={require('../assets/image/shoppingcart.jpg')} 
                                style={{ tintColor: focused ? '#3498db' : '#95a5a6' }}
                            />
                        ),
                    }} 
                />
                <Tab.Screen 
                    name='NotificationScreen' 
                    component={NotificationScreen} 
                    options={{
                        title: 'Thông báo',
                        tabBarIcon: ({ focused }) => (
                            <Image 
                                source={require('../assets/image/ringing.jpg')} 
                                style={{ tintColor: focused ? '#3498db' : '#95a5a6' }}
                            />
                        ),
                    }} 
                />
                <Tab.Screen 
                    name='SettingScreen' 
                    component={SettingScreen} 
                    options={{
                        title: 'Cài đặt',
                        tabBarIcon: ({ focused }) => (
                            <Image 
                                source={require('../assets/image/profile.jpg')} 
                                style={{ tintColor: focused ? '#3498db' : '#95a5a6' }}
                            />
                        ),
                    }} 
                />
            </Tab.Navigator>
        </NavigationContainer>
    );
}

export default TabTabNavigation;
