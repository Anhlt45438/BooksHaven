import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, StatusBar, SafeAreaView, Image } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import Chophanhoi from './Chophanhoifeedback';
import Daphanhoi from './Daphanhoifeedback';
import Dahoanthanh from './Dahoanthanhfeedback';
import { useNavigation } from '@react-navigation/native';
const Tab = createMaterialTopTabNavigator();
export default function SupportRequestsScreen({ route }) {
  const navigation = useNavigation();
  const initialTab = route?.params?.screen || 'Chờ phản hồi'; // Default tab nếu không truyền gì

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar backgroundColor="#fff" barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/image/back1.png")} />
        </TouchableOpacity>
        <Text style={styles.title}>Yêu cầu hỗ trợ của tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Tabs */}
      <Tab.Navigator
        initialRouteName={initialTab}
        screenOptions={{
          tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
          tabBarIndicatorStyle: { backgroundColor: "#ff4500" },
        }}
      >
        <Tab.Screen name="Chờ phản hồi" component={Chophanhoi} />
        <Tab.Screen name="Đã phản hồi" component={Daphanhoi} />
        <Tab.Screen name="Đã hoàn thành" component={Dahoanthanh} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 0.5,
    borderBottomColor: '#ccc',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
  },
  tabs: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTab: {
    color: '#E74C3C',
    fontWeight: 'bold',
    borderBottomWidth: 2,
    borderBottomColor: '#E74C3C',
    paddingBottom: 4,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noRequestText: {
    fontSize: 16,
    color: '#888',
  },
});
