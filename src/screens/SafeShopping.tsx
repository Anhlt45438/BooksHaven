import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert } from 'react-native';

const SafeShoppingNotice = ({ navigation }) => {
  const handleAcknowledge = () => {
    Alert.alert('Cảm ơn', 'Cảm ơn bạn đã đọc thông tin mua sắm an toàn.');
    navigation.goBack(); // hoặc navigation.navigate('TrangChu');
  };

  return (
    <View style={styles.container}>
      <Image
        source={require('../assets/image/shoppingcart.jpg')} // Đặt ảnh vào thư mục assets/images
        style={styles.image}
        resizeMode="contain"
      />
      <Text style={styles.title}>Cảnh Báo Mua Sắm An Toàn</Text>
      <Text style={styles.message}>
        • Không chia sẻ thông tin cá nhân hoặc tài khoản ngân hàng qua ứng dụng.{'\n'}
        • Luôn kiểm tra nguồn gốc sản phẩm và người bán.{'\n'}
        • Sử dụng phương thức thanh toán an toàn và đáng tin cậy.{'\n'}
        • Cảnh giác với những ưu đãi quá tốt để là thật.
      </Text>

      <TouchableOpacity style={styles.button} onPress={handleAcknowledge}>
        <Text style={styles.buttonText}>Tôi đã hiểu</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 180,
    height: 180,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#d9534f',
    marginBottom: 16,
    textAlign: 'center',
  },
  message: {
    fontSize: 16,
    color: '#333',
    textAlign: 'left',
    marginBottom: 32,
    lineHeight: 24,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default SafeShoppingNotice;
