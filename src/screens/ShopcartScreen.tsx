import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
const ShopcartScreen =()=>{
    return(
        <View style={{alignItems:"center"}}>
            <Text style={{fontSize:30}}>Đây là màn hình giỏ hàng</Text>
        </View>
    )
}
export default ShopcartScreen