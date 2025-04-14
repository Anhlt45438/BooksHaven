import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  ScrollView,
} from 'react-native';
import {Card, Divider} from 'react-native-paper';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

const WithdrawScreen = ({route}) => {
  const navigation = useNavigation();
  const {ruttien, selectedBank, stk} = route.params;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Thông tin Rút tiền</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.amount}>- {ruttien} đ</Text>
        <Text style={styles.notice}>
          Bạn sẽ nhận được tiền vào tài khoản ngân hàng trong khoảng thời gian
          từ ngày 1 -2 ngày kể từ thời điểm giao dịch
        </Text>

        <Card style={styles.card}>
          <Card style={styles.card}>
            <Card.Content>
              <Text style={styles.label}>Chuyển tiền đến</Text>
              <Text style={styles.value}>Ngân hàng {selectedBank.name}</Text>
              <Divider style={styles.divider} />
              <Text style={styles.label}>Phí rút tiền</Text>
              <Text style={styles.value}>
                {ruttien
                  ? (parseInt(ruttien) * 0.1).toLocaleString('vi-VN')
                  : '0'}{' '}
                đ
              </Text>
              <Divider style={styles.divider} />
              <Text style={styles.label}>
                Số tiền chuyển vào tài khoản ngân hàng
              </Text>
              <Text style={styles.value}>
                {ruttien
                  ? (parseInt(ruttien) * 0.9).toLocaleString('vi-VN')
                  : '0'}{' '}
                đ
              </Text>
              <Divider style={styles.divider} />
            </Card.Content>
          </Card>
        </Card>

        <View style={styles.statusBox}>
          <Text style={styles.statusTitle}>
            Yêu cầu Rút Tiền đang được xử lý
          </Text>
          <Text style={styles.statusText}>
            Yêu cầu Rút tiền đã được chuyển đến ngân hàng {selectedBank.name} để
            xử lý.
          </Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.replace('Finance')}>
        <Text style={styles.buttonText}>Trở lại</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  backButton: {
    padding: 10,
  },
  backIcon: {
    width: 24,
    height: 24,
    resizeMode: 'contain',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
    marginRight: 30,
  },
  amount: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'red',
    textAlign: 'center',
    marginVertical: 10,
  },
  notice: {
    textAlign: 'center',
    color: 'gray',
    marginBottom: 20,
  },
  card: {
    padding: 10,
    borderRadius: 10,
    elevation: 2,
    backgroundColor: '#fff',
  },
  label: {
    fontSize: 14,
    color: 'gray',
  },
  value: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  divider: {
    marginVertical: 5,
  },
  statusBox: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
  },
  statusTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1976D2',
    marginBottom: 5,
  },
  statusText: {
    fontSize: 14,
    color: 'gray',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  button: {
    backgroundColor: '#FF5722',
    padding: 14,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default WithdrawScreen;
