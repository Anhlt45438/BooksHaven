import { Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect } from 'react';
import { Button } from 'react-native-paper';

const TestDeeplink = () => {
//   const link =
    // 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=1000000&vnp_BankCode=NCB&vnp_Command=pay&vnp_CreateDate=20250322212531&vnp_CurrCode=VND&vnp_IpAddr=%3A%3Affff%3A1.53.8.245&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+cho+ma+GD%3A22212531&vnp_OrderType=other&vnp_ReturnUrl=myapp%3A%2F%2Fhome&vnp_TmnCode=YRYBOBOC&vnp_TxnRef=22212531&vnp_Version=2.1.0&vnp_SecureHash=YOUR_NEW_SECURE_HASH';
const link='https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?vnp_Amount=10000000000&vnp_BankCode=NCB&vnp_Command=pay&vnp_CreateDate=20250322215715&vnp_CurrCode=VND&vnp_IpAddr=%3A%3Affff%3A1.53.8.245&vnp_Locale=vn&vnp_OrderInfo=Thanh+toan+cho+ma+GD%3A22215715&vnp_OrderType=other&vnp_ReturnUrl=myapp%3A%2F%2Fhome&vnp_TmnCode=YRYBOBOC&vnp_TxnRef=22215715&vnp_Version=2.1.0&vnp_SecureHash=YOUR_NEW_SECURE_HASH';
  const openVNPayPayment = async (paymentUrl) => {
    try {
      const supported = await Linking.canOpenURL(paymentUrl);
      console.log('Can open URL:', supported); // Kiểm tra giá trị của supported
      
        await Linking.openURL(paymentUrl);
        console.log('Opening URL:', paymentUrl);
     
    } catch (error) {
      console.error('Lỗi khi mở URL:', error);
    }
  };

  const handleDeepLink = ({ url }) => {
    if (url) {
      console.log('Deeplink được gọi:', url);
      const queryString = url.split('?')[1];
      if (queryString) {
        const params = new URLSearchParams(queryString);
        const result = params.get('result');
        if (result === 'success') {
          console.log('Thanh toán thành công');
        } else {
          console.log('Thanh toán thất bại');
        }
      }
    }
  };

  useEffect(() => {
    const subscription = Linking.addEventListener('url', handleDeepLink);

    Linking.getInitialURL().then((url) => {
      if (url) handleDeepLink({ url });
    });

    return () => {
      subscription.remove();
    };
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <TouchableOpacity onPress={() => openVNPayPayment(link)}>
        <Text style={{ fontSize: 16, color: 'blue' }}>Thanh toán qua VNPay</Text>
      </TouchableOpacity>
    </View>
  );
};

export default TestDeeplink;

const styles = StyleSheet.create({});