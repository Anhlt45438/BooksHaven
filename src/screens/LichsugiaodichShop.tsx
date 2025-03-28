import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';

const transactions = [
  {
    id: '1',
    type: 'Rút Tiền Tự Động',
    date: '15 Th09 2024',
    status: 'Hoàn thành',
    amount: '-đ168.965',
    icon: require('../assets/image/ruttien.png'),
    color: 'red',
  },
  {
    id: '2',
    type: 'Hoàn Tiền cho Đơn Hàng 240717SNAQG4B4',
    date: '20 Th07 2024',
    status: 'Hoàn thành',
    amount: '+đ78.159',
    icon: require('../assets/image/trutien.png'),
    color: 'red',
  },
  {
    id: '3',
    type: 'Giao dịch thành công đơn hàng 240701EJU958YG',
    date: '6 Th07 2024',
    status: 'Hoàn thành',
    amount: '+đ90.806',
    icon: require('../assets/image/themtien.png'),
    color: 'green',
  },
];

const TransactionScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity>
          <Image source={require('../assets/image/back1.png')}/>
        </TouchableOpacity>
        <Text style={styles.title}>Lịch sử giao dịch</Text>
      </View>
      <View style={styles.filterContainer}>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Từ ngày ▼</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterText}>Đến ngày ▼</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={transactions}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.transactionItem}>
            <Image source={item.icon} style={styles.icon} />
            <View style={styles.transactionDetails}>
              <Text style={styles.transactionType}>{item.type}</Text>
              <Text style={styles.transactionDate}>{item.date}</Text>
              <Text style={styles.transactionStatus}>{item.status}</Text>
            </View>
            <Text style={[styles.transactionAmount, { color: item.color }]}>{item.amount}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 16,
  },
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  filterButton: {
    backgroundColor: 'white',
    padding: 10,
    borderRadius: 5,
  },
  filterText: {
    fontSize: 14,
    color: 'black',
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 16,
    borderRadius: 10,
    marginBottom: 10,
  },
  icon: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  transactionDetails: {
    flex: 1,
    marginLeft: 10,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  transactionDate: {
    fontSize: 14,
    color: 'gray',
  },
  transactionStatus: {
    fontSize: 14,
    color: 'gray',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default TransactionScreen;
