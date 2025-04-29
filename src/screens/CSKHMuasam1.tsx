import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

const PaymentVnPayScreen = () => {
    const navigation = useNavigation()
  return (
    <ScrollView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Phương Thức Thanh Toán VNPay</Text>
      </View>

      {/* VNPay Logo */}
      <View style={styles.logoContainer}>
        <Image
          source={require('../assets/banks/vnpay.jpg')} // Bạn cần thay đúng đường dẫn hình VNPay
          style={styles.logo}
          resizeMode="contain"
        />
      </View>

      {/* Nội dung giới thiệu */}
      <View style={styles.contentContainer}>
        <Text style={styles.title}>Thanh toán dễ dàng với VNPay</Text>
        <Text style={styles.description}>
          VNPay hỗ trợ thanh toán nhanh chóng, an toàn và tiện lợi. Bạn có thể sử dụng thẻ ngân hàng nội địa, thẻ quốc tế hoặc ví VNPay để hoàn tất đơn hàng chỉ trong vài bước đơn giản.
        </Text>

        {/* Hướng dẫn các bước */}
        <Text style={styles.stepTitle}>Cách thanh toán qua VNPay:</Text>
        <View style={styles.stepContainer}>
          <Text style={styles.stepText}>1. Chọn phương thức thanh toán "VNPay" khi đặt hàng.</Text>
          <Text style={styles.stepText}>2. Hệ thống sẽ chuyển bạn đến cổng thanh toán VNPay.</Text>
          <Text style={styles.stepText}>3. Chọn ngân hàng / ví điện tử và điền thông tin yêu cầu.</Text>
          <Text style={styles.stepText}>4. Xác nhận giao dịch và hoàn tất đơn hàng.</Text>
        </View>

        {/* Lưu ý */}
        <View style={styles.noticeContainer}>
          <Text style={styles.noticeTitle}>Lưu ý:</Text>
          <Text style={styles.noticeText}>- Đảm bảo kết nối mạng ổn định trong quá trình thanh toán.</Text>
          <Text style={styles.noticeText}>- Nếu thanh toán thất bại, vui lòng thử lại hoặc chọn phương thức khác.</Text>
        </View>
      </View>

      {/* Button quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={()=>navigation.goBack()}>
        <Text style={styles.backButtonText}>Quay lại trang mua hàng</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#0072bc',
    paddingVertical: 20,
    paddingHorizontal: 16,
  },
  headerTitle: {
    fontSize: 18,
    color: '#fff',
    fontWeight: 'bold',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: 20,
  },
  logo: {
    width: 200,
    height: 80,
  },
  contentContainer: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#0072bc',
  },
  stepContainer: {
    marginBottom: 20,
  },
  stepText: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  noticeContainer: {
    backgroundColor: '#fff3cd',
    padding: 12,
    borderRadius: 8,
  },
  noticeTitle: {
    fontWeight: 'bold',
    fontSize: 14,
    color: '#856404',
    marginBottom: 4,
  },
  noticeText: {
    fontSize: 13,
    color: '#856404',
    marginBottom: 4,
  },
  backButton: {
    backgroundColor: '#0072bc',
    margin: 16,
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  backButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default PaymentVnPayScreen;
