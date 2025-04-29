import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const UpdateReasonScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/image/back1.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Vì sao phải cập nhật thường xuyên?</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung lý do cập nhật */}
      <View style={styles.content}>
        <Text style={styles.title}>Lý do tại sao bạn cần cập nhật ứng dụng thường xuyên?</Text>
        <Text style={styles.description}>
          Việc cập nhật ứng dụng không chỉ giúp bạn trải nghiệm những tính năng mới mà còn giúp ứng dụng hoạt động ổn định hơn, cải
          thiện hiệu suất và bảo mật. Dưới đây là những lý do vì sao bạn nên cập nhật ứng dụng thường xuyên:
        </Text>

        {/* Lý do 1 */}
        <Text style={styles.subtitle}>1. Cải thiện hiệu suất và tốc độ</Text>
        <Text style={styles.text}>
          Mỗi bản cập nhật đều mang lại các cải tiến về hiệu suất và tốc độ, giúp ứng dụng hoạt động mượt mà hơn và giảm thiểu lỗi.
        </Text>

        {/* Lý do 2 */}
        <Text style={styles.subtitle}>2. Sửa lỗi và khắc phục sự cố</Text>
        <Text style={styles.text}>
          Cập nhật ứng dụng sẽ giúp sửa các lỗi đã được phát hiện trong các phiên bản trước đó, giảm thiểu các sự cố và cải thiện
          trải nghiệm người dùng.
        </Text>

        {/* Lý do 3 */}
        <Text style={styles.subtitle}>3. Cập nhật tính năng mới</Text>
        <Text style={styles.text}>
          Các tính năng mới và cải tiến sẽ được thêm vào ứng dụng, giúp bạn luôn có những trải nghiệm mới mẻ và tiện ích hơn trong
          suốt quá trình sử dụng.
        </Text>

        {/* Lý do 4 */}
        <Text style={styles.subtitle}>4. Tăng cường bảo mật</Text>
        <Text style={styles.text}>
          Các bản cập nhật thường xuyên giúp vá các lỗ hổng bảo mật, bảo vệ dữ liệu và tài khoản của bạn khỏi các mối đe dọa trực
          tuyến.
        </Text>

        {/* Lý do 5 */}
        <Text style={styles.subtitle}>5. Tương thích với các thiết bị mới</Text>
        <Text style={styles.text}>
          Cập nhật ứng dụng giúp đảm bảo rằng ứng dụng của bạn hoạt động tốt trên các thiết bị mới và các hệ điều hành mới nhất,
          giảm thiểu các vấn đề tương thích.
        </Text>

        {/* Đề xuất */}
        <Text style={styles.suggestion}>➤ Đừng quên cập nhật để có trải nghiệm tốt nhất và bảo mật cao hơn.</Text>
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
  suggestion: {
    marginTop: 16,
    fontSize: 14,
    color: '#d35400',
    fontStyle: 'italic',
  },
});

export default UpdateReasonScreen;
