import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { getAccessToken } from '../redux/storageHelper';
import { useNavigation } from '@react-navigation/native';



const NotificationScreen = () => {
    const [Feedbacks,setFeedbacks]=useState([])
    const navigation = useNavigation()
     const [totalPages, setTotalPages] = useState(1);
     const [currentPage, setCurrentPage] = useState(1);
    const getFeedback = async (page) => {
          const accessToken = await getAccessToken();
            if (!accessToken) {
              console.error("Không có accessToken");
              return;
            }
        try {
          const response = await fetch(`http://14.225.206.60:3000/api/feedbacks/user?page=${page}&limit=10`, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              // Thêm Authorization nếu API yêu cầu token
              'Authorization': `Bearer ${accessToken}`
            },
          });
      
          if (!response.ok) {
            // Xử lý lỗi nếu status không phải 200-299
            throw new Error(`HTTP error! status: ${response.status}`);
          }
      
          const data = await response.json();
          console.log('Feedback data:', data);
          setTotalPages(data.pagination.totalPages)
          // Bạn có thể set state ở đây nếu dùng React
          setFeedbacks(data.data);
      console.log(Feedbacks);
      
        } catch (error) {
          console.error('Failed to fetch feedback:', error.message);
        }
      };
      useEffect(()=>{
        getFeedback(currentPage)
      },[])

      const formatTime = (isoString) => {
        const date = new Date(isoString);
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
      
        return `${hours}:${minutes} - ${day}/${month}/${year}`;
      };

      
  const renderItem = ({ item }) => (
    <TouchableOpacity onPress={() => navigation.replace('DetailFeedback', { phan_hoi: item.phan_hoi })}>

    <View style={[styles.card, item.isNew && styles.cardNew]}>
       
    <Image source={require('../assets/images/logo.png')} style={styles.image} />
    <View style={styles.content}>
      <Text style={styles.title}>{item.tieu_de}</Text>
      <Text style={styles.description}>{item.noi_dung}</Text>
  
      {/* Thời gian nằm dưới cùng bên phải */}
      <View style={styles.bottomRow}>
        {item.isNew && <Text style={styles.newLabel}>New</Text>}
        <Text style={styles.time}>{formatTime(item.ngay_tao)}</Text>
        <Text style={styles.time}>xem chi tiết</Text>
      </View>
    </View>
  </View>
  </TouchableOpacity>
  
  );

  
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
         <TouchableOpacity onPress={() => navigation.replace('Chamsockhachhang1')}>
                                             <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                                         </TouchableOpacity>
        <Text style={styles.headerTitle}>Phản hồi</Text>
        <View style={{ width: 24 }} /> 
      </View>

      {/* Notifications List */}
      <FlatList
        data={Feedbacks}
        renderItem={renderItem}
        keyExtractor={(item) => item._id}
        contentContainerStyle={styles.listContent}
      />
        <View style={styles.pagination}>
            {[...Array(totalPages)].map((_, index) => {
              const page = index + 1;
              return (
                <TouchableOpacity
                  key={page}
                  onPress={() => setCurrentPage(page)}
                  style={[
                    styles.pageButton,
                    currentPage === page && styles.pageButtonActive,
                  ]}
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
    backgroundColor: '#fff',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  backArrow: {
    fontSize: 20,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  listContent: {
    paddingHorizontal: 16,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f4f4f4',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  cardNew: {
    backgroundColor: '#e0e0e0',
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 6,
    marginRight: 12,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    marginBottom: 4,
  },
  description: {
    fontSize: 12,
    color: '#555',
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 6,
  },
  
  time: {
    fontSize: 12,
    color: '#888',
    textAlign: 'right',
  },
  
  newLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#000',
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

export default NotificationScreen;
