import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Icon } from 'react-native-paper';

const WithdrawConfirmation = () => {
  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <Image source={require('../assets/image/back1.png')}/>
        <Text style={styles.headerText}>Xác nhận Rút tiền</Text>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.label}>Rút tiền từ số dư TK Shopee</Text>
        <View style={styles.bankInfo}>
          <Image source={require('../assets/image/banking.png')} />
          <Text style={styles.bankText}>BIDV - NH Đầu tư & Phát triển Việt Nam *5478</Text>
        </View>
        
        <View style={styles.infoRow}>
          <Text style={styles.text}>Số tiền đã rút</Text>
          <Text style={styles.amount}>₫1.265.267</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.text}>Phí rút tiền</Text>
          <Text style={styles.amount}>₫11.000</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.text}>Số tiền chuyển vào tài khoản ngân hàng</Text>
          <Text style={[styles.amount, styles.highlight]}>₫1.254.267</Text>
        </View>

        <Text style={styles.notice}>Vui lòng chờ từ 1 - 3 ngày làm việc để xử lý quá trình rút tiền.</Text>
      </View>

      {/* Nút xác nhận */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>Xác nhận</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 10,
  },
  content: {
    backgroundColor: '#f9f9f9',
    padding: 16,
    borderRadius: 10,
    flex: 1,
  },
  label: {
    fontSize: 14,
    color: '#888',
  },
  bankInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
  },
  bankText: {
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 'bold',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 8,
  },
  text: {
    fontSize: 14,
    color: '#555',
  },
  amount: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  highlight: {
    color: 'red',
  },
  notice: {
    fontSize: 12,
    color: '#888',
    marginTop: 10,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 20,
    left: 16,
    right: 16,
  },
  button: {
    backgroundColor: '#ff6600',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawConfirmation;
