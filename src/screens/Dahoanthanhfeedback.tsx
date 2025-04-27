import { useNavigation } from "@react-navigation/native";
import { useEffect, useState } from "react";
import { Image, StyleSheet } from "react-native";
import { FlatList, TouchableOpacity } from "react-native";
import { Text, View } from "react-native";
import { getAccessToken } from "../redux/storageHelper";

const Dahoanthanh =()=>{
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
              const filtered = data.data.filter((order) => {
                const lastReply = order.phan_hoi[order.phan_hoi.length - 1];
                return order.trang_thai === "da_giai_quyet";
              });
              console.log('Feedback data:', data);
              setTotalPages(data.pagination.totalPages)
              // Bạn có thể set state ở đây nếu dùng React
              setFeedbacks(filtered);
          console.log(Feedbacks);
          
            } catch (error) {
              console.error('Failed to fetch feedback:', error.message);
            }
          };
          useEffect(()=>{
            getFeedback(currentPage)
          },[currentPage])
    
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
        <TouchableOpacity onPress={() => navigation.replace('DetailFeedback', { phan_hoi: item.phan_hoi , id_feedback:item._id , trang_thai: item.trang_thai })}>
    
        <View style={[styles.card, item.isNew && styles.cardNew]}>
           
        <Image source={require('../assets/images/logo.png')} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{item.tieu_de}</Text>
          <Text style={styles.description}>{item.noi_dung}</Text>
      
         
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
          {Feedbacks.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Image
                source={require('../assets/image/empty.png')} // bạn có thể thay bằng ảnh phù hợp
                style={styles.emptyImage}
              />
              <Text style={styles.noRequestText}>chưa có phản hồi nào</Text>
            </View>
          ) : (
            <>
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
                      onPress={() => {
                        setCurrentPage(page);
                        getFeedback(page); // cần gọi lại API khi đổi trang
                      }}
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
            </>
          )}
        </View>
      );
      
    
}
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
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  emptyImage: {
    width: 120,
    height: 120,
    marginBottom: 16,
    opacity: 0.5,
  },
  noRequestText: {
    fontSize: 16,
    color: '#888',
    textAlign: 'center',
  },
  
});
export default Dahoanthanh;