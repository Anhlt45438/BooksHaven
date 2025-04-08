import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, StyleSheet, ScrollView, SafeAreaView, TouchableOpacity,Image } from "react-native";


const TransactionDetailScreen = ({route}) => {
    const {chitietgiaodich}=route.params
    const navigation = useNavigation()

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        date.setHours(date.getHours() + 7);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        return `${day}/${month}/${year} ${hours}:${minutes}`;
      };
      const soDuThayDoiStr = (chitietgiaodich.so_du_thay_doi || "").toString(); // ép về string
     

      const soTienMatch = soDuThayDoiStr.match(/\d+/);
      const soTien = soTienMatch ? soTienMatch[0] : "";
      
      
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.header}>
                <View style={styles.headerContent}>
                  <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/Vector.png')} />
                  </TouchableOpacity>
                  <Text style={styles.title}>Chi tiết giao dịch</Text>

                </View>
              </View>
        
      
        <View style={styles.section}>
          <Text style={styles.label}>Ngày thực hiện</Text>
          <Text style={styles.value}>{formatDate(chitietgiaodich.thoi_gian)}</Text>

          <Text style={styles.label}>Số giao dịch</Text>
          <Text style={styles.value}>{chitietgiaodich._id}</Text>

          <Text style={styles.label}>Số tiền</Text>
          <Text style={styles.value}>{soTien}</Text>

          <Text style={styles.label}>Phí (bao gồm VAT)</Text>
          <Text style={styles.value}>{soTien/10} ₫</Text>

          {/* <Text style={styles.label}>Từ</Text>
          <Text style={styles.value}>Tài khoản •••• 0044</Text> */}

          <Text style={styles.label}>Nội dung</Text>
          <Text style={styles.value}>
           {chitietgiaodich.mo_ta}
          </Text>
        </View>

        {/* <View style={styles.section}>
          <Text style={styles.subTitle}>Người nhận</Text>

          <Text style={styles.label}>Tên người nhận</Text>
          <Text style={styles.value}>VU THI THU HA</Text>

          <Text style={styles.label}>Số tài khoản</Text>
          <Text style={styles.value}>3881019846666</Text>

          <Text style={styles.label}>Ngân hàng</Text>
          <Text style={styles.value}>Quân đội</Text>
        </View> */}

        {/* <View style={styles.buttonContainer}>
          <Text style={styles.button}>Tra soát</Text>
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  scrollContainer: {
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
    width:'100%'
  },
  section: {
    marginBottom: 20,
  },
  subTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
  },
  label: {
    color: "#888",
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    fontWeight: "500",
    marginTop: 2,
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 30,
  },
  button: {
    backgroundColor: "#f1f1f1",
    paddingVertical: 12,
    paddingHorizontal: 30,
    borderRadius: 25,
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  }, headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
});

export default TransactionDetailScreen;
