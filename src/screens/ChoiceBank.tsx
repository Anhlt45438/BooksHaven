import { useNavigation } from "@react-navigation/native";
import React, { useEffect } from "react";
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useSelector } from "react-redux";
import { Fetch } from "socket.io-client";
import { getAccessToken } from "../redux/storageHelper";

const banks = [
  { name: "Agribank", icon: require("../assets/banks/agribank.png") },
  { name: "BIDV", icon: require("../assets/banks/bidv.png") },
  { name: "VCB", icon: require("../assets/banks/vcb.png") },
  { name: "VietinBank", icon: require("../assets/banks/vietinbank.png") },
  { name: "ACB", icon: require("../assets/banks/acb.png") },
  { name: "MB", icon: require("../assets/banks/mb.png") },
  { name: "Sacombank", icon: require("../assets/banks/sacombank.png") },
  { name: "SCB", icon: require("../assets/banks/scb.png") },
  { name: "Techcombank", icon: require("../assets/banks/techcombank.png") },
  { name: "TPBank", icon: require("../assets/banks/tpbank.png") },
  { name: "VIB", icon: require("../assets/banks/vib.png") },
  { name: "VPBank", icon: require("../assets/banks/vpbank.png") },
  { name: "ABBank", icon: require("../assets/banks/abbank.png") },
  { name: "BacABank", icon: require("../assets/banks/bacabank.png") },

];


const BankListScreen = () => {
    const navigation = useNavigation();
  
  return (
    <View style={styles.container}>
          <View style={styles.header}>
                         <View style={styles.headerContent}>
                             <TouchableOpacity onPress={() => navigation.replace('InforBank')}>
                                 <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                             </TouchableOpacity>
                             <Text style={styles.title}>Tài chính</Text>
                         </View>
                     </View>
                          
      
      <FlatList
        data={banks}
        numColumns={4}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View style={styles.bankItem}>
            <TouchableOpacity onPress={() => navigation.replace('InforBank', { selectedBank: item })}>
            <Image source={item.icon} style={styles.icon} />
            <Text style={styles.bankName}>{item.name}</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    right: 10,
},
  bankItem: {
    alignItems: "center",
    justifyContent: "center",
    width: "25%",
    paddingVertical: 15,
  },
  icon: {
    width: 50,
    height: 50,
    resizeMode: "contain",
  },
  bankName: {
    marginTop: 5,
    fontSize: 12,
    textAlign: "center",
  },  header: {
    backgroundColor: '#fff',
    alignItems: 'center',
    padding: 20,
},
headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
},iconn: {
    width: 24,
    height: 24,
},
});

export default BankListScreen;
