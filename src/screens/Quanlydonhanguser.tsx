import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";

import { NavigationContainer, useNavigation, useRoute } from "@react-navigation/native";


import Choxacnhan from "./ChoxacnhanUser";
import Dangchuanbihang from "./Dangchuanbihang";
import Danggiaohang from "./Danggiaohang";
import Dagiao from "./Dagiao";



const Tab = createMaterialTopTabNavigator();

const OrderTabScreen = () => {
 
 const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
       <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require("../assets/image/back1.png")} />
                      </TouchableOpacity>
        <Text style={styles.headerTitle}>Đơn đã mua</Text>
        <View style={styles.headerIcons}>
          <TouchableOpacity>
            <Image source={require("../assets/image/search.png")} style={styles.icon} />
          </TouchableOpacity>
          <TouchableOpacity>
            <Image source={require("../assets/image/conversation.png")} style={styles.icon} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={{ flex: 1 }}>  
  <Tab.Navigator
    screenOptions={{
      tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
      tabBarIndicatorStyle: { backgroundColor: "#ff4500" },
      tabBarScrollEnabled: true,
    }}
  >
    <Tab.Screen name="Chờ xác nhận" component={Choxacnhan} />
    <Tab.Screen name="Đang chuẩn bị hàng" component={Dangchuanbihang} />
    <Tab.Screen name="Đang giao hàng" component={Danggiaohang} />
    <Tab.Screen name="Đã nhận hàng" component={Dagiao} />
  </Tab.Navigator>
</View>

    </View>
  );
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#e0e0e0",
    position: "relative",
    zIndex: 1, // Đảm bảo header nằm trên
  },
  
  headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  headerIcons: {
    flexDirection: "row",
  },
  icon: {
    width: 24,
    height: 24,
    marginHorizontal: 10,
  },
});

export default OrderTabScreen;