import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const AccountPolicyScreen = () => {
  const navigation = useNavigation();

  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#fff' }}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/image/back1.png')} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Tiêu chuẩn hoạt động của người dùng</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Nội dung tiêu chuẩn hoạt động */}
      <View style={styles.content}>
        <Text style={styles.title}>Tiêu chuẩn hoạt động của người dùng</Text>
        <Text style={styles.description}>
          Để duy trì một cộng đồng lành mạnh và thân thiện, chúng tôi yêu cầu người dùng tuân thủ những tiêu chuẩn dưới đây khi sử dụng dịch vụ của chúng tôi.
        </Text>

        <Text style={styles.subtitle}>1. Tôn trọng người khác</Text>
        <Text style={styles.text}>
          Người dùng cần tôn trọng người khác, tránh các hành vi lạm dụng, quấy rối hoặc phát ngôn thô tục.
        </Text>

        <Text style={styles.subtitle}>2. Cung cấp thông tin chính xác</Text>
        <Text style={styles.text}>
          Hãy đảm bảo rằng mọi thông tin bạn cung cấp trong quá trình đăng ký hoặc sử dụng dịch vụ đều là chính xác và đầy đủ.
        </Text>

        <Text style={styles.subtitle}>3. Hành vi gian lận</Text>
        <Text style={styles.text}>
          Người dùng không được thực hiện các hành vi gian lận, giả mạo tài khoản, hoặc sử dụng dịch vụ với mục đích xấu.
        </Text>

        <Text style={styles.subtitle}>4. Hành vi vi phạm pháp luật</Text>
        <Text style={styles.text}>
          Người dùng không được sử dụng dịch vụ cho các hoạt động vi phạm pháp luật, bao gồm nhưng không giới hạn ở hành vi xâm phạm bản quyền hoặc buôn bán hàng giả.
        </Text>

        <Text style={styles.subtitle}>5. Không sử dụng tài khoản của người khác</Text>
        <Text style={styles.text}>
          Không được chia sẻ mật khẩu hoặc sử dụng tài khoản của người khác mà không có sự đồng ý.
        </Text>

        <Text style={styles.subtitle}>6. Hành vi ảnh hưởng đến hệ thống</Text>
        <Text style={styles.text}>
          Người dùng không được thực hiện các hành động làm ảnh hưởng đến tính ổn định của hệ thống, bao gồm tấn công mạng, spam hoặc tạo ra lỗi.
        </Text>

        {/* Những hành động dẫn đến khóa tài khoản */}
        <Text style={styles.title}>Những hành động sẽ dẫn đến việc khóa tài khoản</Text>
        <Text style={styles.text}>
          Nếu người dùng vi phạm các tiêu chuẩn trên hoặc thực hiện các hành động sau, tài khoản có thể bị khóa ngay lập tức:
        </Text>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Gian lận trong việc thanh toán hoặc tạo đơn hàng giả.</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Lợi dụng lỗ hổng hệ thống hoặc thực hiện các cuộc tấn công mạng.</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Phát tán thông tin sai lệch hoặc các lời mời lừa đảo người dùng khác.</Text>
        </View>

        <View style={styles.listItem}>
          <Text style={styles.bullet}>•</Text>
          <Text style={styles.text}>Quấy rối, lăng mạ hoặc gây phiền toái cho người dùng khác.</Text>
        </View>

        <Text style={styles.suggestion}>
          ➤ Để tránh việc bị khóa tài khoản, vui lòng tuân thủ các quy định và tiêu chuẩn này.
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
  suggestion: {
    marginTop: 16,
    fontSize: 14,
    color: '#d35400',
    fontStyle: 'italic',
  },
});

export default AccountPolicyScreen;
