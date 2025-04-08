import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, TextInput, StyleSheet, TouchableOpacity } from 'react-native';
import { getAccessToken } from '../redux/storageHelper';
import { Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const TransactionScreen = () => {
  const [history, setHistory] = useState([]);
  const navigation = useNavigation();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  
  const formatDate = (isoString) => {
    const date = new Date(isoString);
    date.setHours(date.getHours() + 7);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={()=>navigation.replace('ChitietgiaodichShop',{chitietgiaodich:item})}>
    <View style={styles.item}>
      <View style={{ flex: 1 }}>
        <Text style={styles.name}>{item.mo_ta}</Text>
        <Text style={styles.date}>{formatDate(item.thoi_gian)}</Text>
      </View>
      <Text style={styles.amount}>- {item.so_du_thay_doi}</Text>
    </View>
    </TouchableOpacity>
  );

  const getHistory = async (page) => {
    try {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.log('Không có accessToken');
        return;
      }
      
      const response = await fetch(`http://14.225.206.60:3000/api/shops/withdrawal-history?page=${page}&limit=10`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
      });

      if (!response.ok) {
        throw new Error(`Lỗi HTTP! Status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Lịch sử rút tiền:', data);
      setHistory(data.data);
      // Tính tổng số trang dựa trên totalItems, làm tròn lên
      const totalItems =  data.data.length; // Dùng totalItems từ API nếu có, nếu không dùng độ dài data
      setTotalPages(data.pagination.totalPages)
      console.log(totalItems);
      console.log("số trang ",totalPages);
      
      setCurrentPage(page);
      
    } catch (error) {
      console.error('Lỗi khi lấy lịch sử:', error);
    }
  };

  useEffect(() => {
    getHistory(currentPage);
  }, [currentPage]);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/icons/Vector.png')} />
          </TouchableOpacity>
          <Text style={styles.headerText}>Yêu cầu tra soát</Text>
        </View>
      </View>

      <TextInput placeholder="Tìm kiếm" style={styles.searchBox} />

    

      <FlatList
        data={history}
        keyExtractor={(item) => item._id}
        renderItem={renderItem}
        contentContainerStyle={{ paddingBottom: 20 }}
      />

      <View style={styles.pagination}>
        {[...Array(totalPages)].map((_, index) => {
          const page = index + 1;
          return (
            <TouchableOpacity
              key={page}
              onPress={() => setCurrentPage(page)}
              style={[styles.pageButton, currentPage === page && styles.pageButtonActive]}
            >
              <Text style={styles.pageText}>{page}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchBox: {
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
  },
  accountRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  accountText: {
    fontWeight: '500',
  },
  item: {
    flexDirection: 'row',
    paddingVertical: 12,
    borderBottomWidth: 0.5,
    borderColor: '#ddd',
    alignItems: 'center',
  },
  name: {
    fontWeight: '500',
    fontSize: 15,
  },
  date: {
    color: '#777',
    fontSize: 13,
    marginTop: 2,
  },
  amount: {
    fontWeight: '600',
    fontSize: 15,
    color: '#000',
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerText: {
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
    flex: 1,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  pageButton: {
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  pageButtonActive: {
    backgroundColor: '#007bff',
  },
  pageText: {
    color: '#000',
  },
});

export default TransactionScreen;