import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const CommitmentScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/image/back1.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Cam kết của chúng tôi</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung cam kết */}
      <View style={styles.content}>
        <Text style={styles.title}>Cam kết tối ưu ứng dụng và nâng cao trải nghiệm khách hàng</Text>
        <Text style={styles.description}>
          Chúng tôi cam kết liên tục cải tiến và tối ưu ứng dụng để mang lại trải nghiệm người dùng tốt nhất. Mọi phản hồi từ khách hàng
          sẽ được chúng tôi xem xét và thực hiện các cải tiến kịp thời.
        </Text>

        {/* Cam kết tối ưu hóa */}
        <Text style={styles.subtitle}>1. Tối ưu hiệu suất và độ ổn định của ứng dụng</Text>
        <Text style={styles.text}>
          Chúng tôi cam kết nâng cấp các tính năng và cải thiện hiệu suất của ứng dụng, giúp nó chạy mượt mà và ổn định trên mọi thiết
          bị.
        </Text>

        <Text style={styles.subtitle}>2. Nâng cao trải nghiệm người dùng</Text>
        <Text style={styles.text}>
          Chúng tôi luôn lắng nghe phản hồi từ người dùng để cải thiện giao diện, tính năng và khả năng tương tác của ứng dụng.
        </Text>

        <Text style={styles.subtitle}>3. Hỗ trợ nhanh chóng và kịp thời</Text>
        <Text style={styles.text}>
          Chúng tôi cam kết cung cấp hỗ trợ nhanh chóng khi người dùng gặp phải vấn đề. Đội ngũ hỗ trợ sẽ luôn sẵn sàng giải đáp mọi
          thắc mắc của bạn.
        </Text>

        {/* Các câu hỏi thường gặp */}
        <Text style={styles.title}>Các câu hỏi thường gặp</Text>
        <View style={styles.faqItem}>
          <TouchableOpacity
            onPress={() => navigation.navigate('CSKHUngdung', { question: 'Tại sao ứng dụng cần phải cập nhật thường xuyên?' })}
          >
            <Text style={styles.faqText}>Tại sao ứng dụng cần phải cập nhật thường xuyên?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.faqItem}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FAQDetail', { question: 'Làm thế nào để gửi phản hồi về ứng dụng?' })}
          >
            <Text style={styles.faqText}>Làm thế nào để gửi phản hồi về ứng dụng?</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.faqItem}>
          <TouchableOpacity
            onPress={() => navigation.navigate('FAQDetail', { question: 'Tại sao tôi không thể sử dụng tất cả tính năng của ứng dụng?' })}
          >
            <Text style={styles.faqText}>Tại sao tôi không thể sử dụng tất cả tính năng của ứng dụng?</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.suggestion}>➤ Nếu bạn có câu hỏi khác, vui lòng liên hệ với bộ phận hỗ trợ của chúng tôi.</Text>
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
  description: {
    fontSize: 14,
    color: '#555',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginTop: 12,
  },
  text: {
    fontSize: 14,
    color: '#333',
    marginBottom: 8,
  },
  faqItem: {
    marginTop: 8,
  },
  faqText: {
    fontSize: 14,
    color: '#f85606',
  },
  suggestion: {
    marginTop: 16,
    fontSize: 14,
    color: '#d35400',
    fontStyle: 'italic',
  },
});

export default CommitmentScreen;
