import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PhoneRegisterIssueScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/image/back1.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vấn đề đăng ký bằng số điện thoại</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung giải thích */}
      <View style={styles.content}>
        <Text style={styles.title}>Tại sao tôi không thể đăng ký tài khoản bằng số điện thoại?</Text>

        <Text style={styles.reasonTitle}>Một số lý do phổ biến có thể bao gồm:</Text>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Số điện thoại của bạn đã được sử dụng để đăng ký tài khoản khác.</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Bạn nhập sai định dạng số điện thoại (ví dụ: thiếu số 0 ở đầu).</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Số điện thoại đang bị khóa hoặc tạm thời bị hạn chế đăng ký.</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Lỗi mạng hoặc ứng dụng chưa cập nhật phiên bản mới nhất.</Text>
        </View>

        <Text style={styles.suggestion}>
          ➤ Hãy thử kiểm tra lại số điện thoại, đảm bảo bạn nhập đúng định dạng và chưa từng đăng ký. Nếu vẫn gặp lỗi, vui lòng liên hệ với Bộ phận Hỗ trợ để được trợ giúp thêm.
        </Text>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#f85606',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  headerTitle: {
    fontSize: 16,
    color: '#fff',
    fontWeight: 'bold',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  listItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  bullet: {
    fontSize: 18,
    marginRight: 6,
    color: '#f85606',
  },
  text: {
    flex: 1,
    fontSize: 14,
    color: '#333',
  },
  suggestion: {
    marginTop: 16,
    fontSize: 14,
    color: '#d35400',
    fontStyle: 'italic',
  },
});

export default PhoneRegisterIssueScreen;
