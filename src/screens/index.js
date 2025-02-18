import { StyleSheet, Text, View } from 'react-native'
import * as React from 'react'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { NavigationContainer } from '@react-navigation/native';

import GioHang from './ManGioHang'
const StackDemo=createNativeStackNavigator();
const index = () => {
  return (
   
    <NavigationContainer>
        <StackDemo.Navigator >

            <StackDemo.Screen  name='GioHangScreen' component={GioHang} options={{headerShown:false}} />
        </StackDemo.Navigator>
    </NavigationContainer>
 
  )
}

export default index

const styles = StyleSheet.create({})

// import { StyleSheet, Text, View } from 'react-native'
// import * as React from 'react'
// import { createNativeStackNavigator } from '@react-navigation/native-stack'
// import { Provider } from 'react-redux';
// import { NavigationContainer } from '@react-navigation/native';
// import store from '../redux/store';
// import Chinh from './ManChinh'
// import Them from './ManThem'
// const StackDemo=createNativeStackNavigator();
// const index = () => {
//   return (
//     <Provider store={store}>
//         <NavigationContainer>
//             <StackDemo.Navigator>
//                 <StackDemo.Screen name='ChinhScreen' component={Chinh} options={{title:'Màn chính'}} />
//                 <StackDemo.Screen name='ThemScreen' component={Them} options={{title:'Màn Thêm'}} />
//             </StackDemo.Navigator>
//         </NavigationContainer>
//     </Provider>
//   )
// }

// export default index

// const styles = StyleSheet.create({})