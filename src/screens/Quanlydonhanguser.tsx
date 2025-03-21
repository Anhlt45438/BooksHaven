import React from "react";
import { View, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { NavigationContainer } from "@react-navigation/native";

import Choxacnhan from "../screens/ChoxacnhanUser";
import Cholayhang from "../screens/CholayhangUser";
import Chogiaohang from "../screens/ChogianhangUser"; // Đảm bảo tên file đúng
import Dagiao from "../screens/Dagiao";
import Trahang from "../screens/Trahang";
import Dahuy from "../screens/Dahuy"; // Đổi import đúng

const Tab = createMaterialTopTabNavigator();

const OrderTabScreen = () => {
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require("../assets/image/shoppingcart.jpg")} style={styles.icon} />
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
     
        <Tab.Navigator
          screenOptions={{
            tabBarLabelStyle: { fontSize: 14, fontWeight: "bold" },
            tabBarIndicatorStyle: { backgroundColor: "#ff4500" },
            tabBarScrollEnabled: true, // Cho phép cuộn ngang khi tab quá nhiều
          }}
        >
          <Tab.Screen name="Chờ xác nhận" component={Choxacnhan} />
          <Tab.Screen name="Chờ lấy hàng" component={Cholayhang} />
          <Tab.Screen name="Chờ giao hàng" component={Chogiaohang} />
          <Tab.Screen name="Đã giao" component={Dagiao} />
          <Tab.Screen name="Trả hàng" component={Trahang} />
          <Tab.Screen name="Đã hủy" component={Dahuy} />
        </Tab.Navigator>
     
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