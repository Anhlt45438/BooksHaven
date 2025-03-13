import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import NotificationScreen from '../screens/NotificationScreen';
import { Image } from 'react-native';
import UserScreen from '../screens/UserScreen';
import SearchComponent from '../screens/HomeScreen'
import ManGioHang from "../screens/ManGioHang";

export type HomeTabParamList = {
    HomeScreen: undefined;
    ShopcartScreen: undefined;
    NotificationScreen: undefined;
    UserScreen: undefined;
};

const Tab = createBottomTabNavigator<HomeTabParamList>();

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
                    component={ManGioHang}
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
                    name='UserScreen'
                    component={UserScreen}
                    options={{
                        title: 'Người dùng',
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