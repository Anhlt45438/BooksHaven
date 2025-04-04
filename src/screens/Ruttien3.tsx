import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image, ScrollView } from "react-native";
import { Card, Divider } from "react-native-paper";
import { AntDesign } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

const WithdrawScreen = () => {
    const navigation = useNavigation();
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Image source={require('../assets/image/back1.png')} style={styles.backIcon} />
        </TouchableOpacity>
        <Text style={styles.title}>Thông tin Rút tiền</Text>
      </View>
      
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.amount}>-đ1.265.267</Text>
        <Text style={styles.notice}>
          Bạn sẽ nhận được tiền vào tài khoản ngân hàng trong khoảng thời gian từ ngày 21 Th02 2022 đến ngày 23 Th02 2022
        </Text>

        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.label}>Chuyển tiền đến</Text>
            <Text style={styles.value}>BIDV - NH Đầu tư & Phát triển Việt Nam *5478</Text>
            <Divider style={styles.divider} />
            <Text style={styles.label}>Phí rút tiền</Text>
            <Text style={styles.value}>đ11.000</Text>
            <Divider style={styles.divider} />
            <Text style={styles.label}>Số tiền chuyển vào tài khoản ngân hàng</Text>
            <Text style={styles.value}>đ1.254.267</Text>
            <Divider style={styles.divider} />
            <Text style={styles.label}>Mã rút tiền</Text>
            <Text style={styles.value}>283778317</Text>
            <Divider style={styles.divider} />
            <Text style={styles.label}>Thời gian thực hiện</Text>
            <Text style={styles.value}>15:59 18 Th02 2022</Text>
          </Card.Content>
        </Card>

        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>Yêu cầu Rút Tiền đang được xử lý</Text>
          <Text style={styles.statusText}>
            Yêu cầu Rút tiền đã được chuyển đến ngân hàng BIDV để xử lý.
          </Text>
          <Text style={styles.statusText}>18/02/2022 15:59</Text>
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.button} onPress={()=>navigation.navigate('Finance')}>
        <Text style={styles.buttonText}>Trở lại Số dư TK Shopee</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: "contain",
  },
  title: {
    fontSize: 18,
    fontWeight: "bold",
    textAlign: "center",
    flex: 1,
    marginRight: 30,
  },
  amount: {
    fontSize: 26,
    fontWeight: "bold",
    color: "red",
    textAlign: "center",
    marginVertical: 10,
  },
  notice: {
    textAlign: "center",
    color: "gray",
    marginBottom: 20,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: "#fff",
  },
  label: {
    fontSize: 14,
    color: "gray",
  },
  value: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  divider: {
    marginVertical: 5,
  },
  statusBox: {
    backgroundColor: "#E3F2FD",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1976D2",
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: "gray",
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: "#FF5722",
    padding: 14,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default WithdrawScreen;
