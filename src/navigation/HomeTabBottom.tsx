import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import ShopcartScreen from '../screens/ShopcartScreen';
import NotificationScreen from '../screens/NotificationScreen';
import { Image } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import UserScreen from '../screens/UserScreen';
import SearchComponent from '../screens/HomeScreen'

const Tab = createBottomTabNavigator();

const HomeTabBottom = () => {
    return (
            <Tab.Navigator
                initialRouteName='HomeScreen'
                screenOptions={{
                    headerShown: false,
                    tabBarActiveTintColor: '#3498db',
                    tabBarInactiveTintColor: '#95a5a6',
                }}
            >
                <Tab.Screen
                    name='HomeScreen'
                    component={SearchComponent}
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
                    component={UserScreen}
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
    );
}

export default HomeTabBottom;