import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const steps = [
  {
    id: 1,
    title: 'Bước 1: Chọn sản phẩm',
    description: 'Tìm kiếm sản phẩm bạn muốn mua bằng cách duyệt danh mục hoặc sử dụng thanh tìm kiếm.',
    icon: require('../assets/image/searching.png'),
  },
  {
    id: 2,
    title: 'Bước 2: Thêm vào giỏ hàng',
    description: 'Nhấn "Thêm vào giỏ" để lưu sản phẩm bạn yêu thích vào giỏ hàng.',
    icon: require('../assets/image/addtocart.png'),
  },
  {
    id: 3,
    title: 'Bước 3: Kiểm tra giỏ hàng',
    description: 'Vào giỏ hàng để kiểm tra số lượng, màu sắc, thông tin sản phẩm.',
    icon: require('../assets/image/checkout.png'),
  },
  {
    id: 4,
    title: 'Bước 4: Thanh toán',
    description: 'Chọn phương thức thanh toán phù hợp và nhấn "Đặt hàng".',
    icon: require('../assets/image/creditcard.png'),
  },
  {
    id: 5,
    title: 'Bước 5: Chờ nhận hàng',
    description: 'Theo dõi trạng thái đơn hàng và nhận hàng tại địa chỉ bạn đã cung cấp.',
    icon: require('../assets/image/fastdelivery.png'),
  },
];

const HowToOrderScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={styles.container}>
     
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/image/back1.png')} />
        </TouchableOpacity>
        <Text style={styles.headerText}>Hướng Dẫn Đặt Hàng</Text>
        <View style={{ width: 24 }} /> 
      </View>

     
      <View style={styles.content}>
        {steps.map((step) => (
          <View key={step.id} style={styles.stepContainer}>
            <Image source={step.icon} style={styles.stepIcon} />
            <View style={styles.stepTextContainer}>
              <Text style={styles.stepTitle}>{step.title}</Text>
              <Text style={styles.stepDescription}>{step.description}</Text>
            </View>
          </View>
        ))}
      </View>

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    backgroundColor: '#f85606',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#fff',
  },
  content: {
    padding: 16,
  },
  stepContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    alignItems: 'flex-start',
  },
  stepIcon: {
    width: 50,
    height: 50,
    marginRight: 12,
  },
  stepTextContainer: {
    flex: 1,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#333',
  },
  stepDescription: {
    fontSize: 14,
    color: '#555',
    marginTop: 4,
  },
});

export default HowToOrderScreen;
