import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import { getAccessToken } from '../redux/storageHelper';

const WithdrawConfirmation = ({ route }) => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false); // Thêm state cho loading

  const { ruttien, selectedBank, stk } = route.params;

  const payment = async () => {
    setIsLoading(true); // Bật loading khi bắt đầu request
    const accessToken = await getAccessToken();
    if (!accessToken) {
      Alert.alert('ko có accecctoken');
      setIsLoading(false); // Tắt loading nếu có lỗi
      return;
    }
    try {
      const response = await fetch('http://14.225.206.60:3000/api/shops/withdrawal', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          tai_khoan: stk,
          ngan_hang: selectedBank.name,
          so_tien: ruttien
        }),
      });
      const data = await response.json();
      if (response.ok) {
        navigation.replace('Ruttien3', {
          selectedBank: selectedBank,
          ruttien: ruttien,
          stk: stk
        });
      } else {
        Alert.alert(`Lỗi: ${data.message}`);
      }
    } catch (error) {
      console.error('Error adding to cart:', error);
      Alert.alert('Lỗi kết nối đến server!');
    } finally {
      setIsLoading(false); // Tắt loading khi hoàn thành (dù thành công hay thất bại)
    }
  };

  return (
    <View style={styles.container}>
      {/* Tiêu đề */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.replace('Ruttien1', { selectedBank: selectedBank, stk: stk })}>
          <Image source={require('../assets/image/back1.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Xác nhận Rút tiền</Text>
      </View>

      {/* Nội dung */}
      <View style={styles.content}>
        <Text style={styles.label}>Rút tiền từ số dư tài khoản</Text>
        <View style={styles.bankInfo}>
          <Image source={selectedBank?.icon} style={{ width: 50, height: 50, resizeMode: 'contain' }} />
          <Text style={styles.bankText}>{"Ngân hàng " + selectedBank?.name}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.text}>Số tiền đã rút</Text>
          <Text style={styles.amount}>{ruttien}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.text}>Phí rút tiền</Text>
          <Text style={styles.amount}> {ruttien ? (parseInt(ruttien) * 0.1).toLocaleString('vi-VN') : "0"} đ</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.text}>Số tiền chuyển vào tài khoản ngân hàng</Text>
          <Text style={[styles.amount, styles.highlight]}>
            {ruttien ? (parseInt(ruttien) * 0.9).toLocaleString('vi-VN') : "0"} đ
          </Text>
        </View>
      </View>

      {/* Nút xác nhận */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={[styles.button, isLoading && styles.buttonDisabled]} 
          onPress={payment}
          disabled={isLoading} // Vô hiệu hóa nút khi đang loading
        >
          {isLoading ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <Text style={styles.buttonText}>Xác nhận</Text>
          )}
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
  buttonDisabled: {
    backgroundColor: '#ffa366', // Màu nhạt hơn khi đang loading
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawConfirmation;