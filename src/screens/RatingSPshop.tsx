import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, Image, TouchableOpacity } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';

const RatingSPshop = () => {
  const { params } = useRoute();
  const { bookId } = params; // Nhận bookId từ tham số truyền vào
  const [ratings, setRatings] = useState([]);
  const navigation = useNavigation(); // Lấy navigation

  // Hàm để lấy thông tin người dùng (avatar và tên) từ API
  const fetchUserInfo = async (userId) => {
    try {
      const response = await fetch(`http://14.225.206.60:3000/api/users/user-info-account?user_id=${userId}`);
      if (!response.ok) {
        throw new Error('Không thể lấy thông tin người dùng');
      }
      const userData = await response.json();
      return userData; // Trả về thông tin người dùng
    } catch (error) {
      console.error('Error fetching user info:', error);
      return { username: 'Anonymous', avatar: null }; // Giá trị mặc định nếu có lỗi
    }
  };

  // Fetch dữ liệu đánh giá của sản phẩm từ bookId
  useEffect(() => {
    // Fetch dữ liệu đánh giá cho sản phẩm dựa trên bookId
    fetch(`http://14.225.206.60:3000/api/ratings/book/${bookId}`)
      .then((response) => response.json())
      .then(async (data) => {
        // Lấy thông tin người dùng cho từng đánh giá
        const ratingsWithUserInfo = await Promise.all(
          data.data.map(async (rating) => {
            // Lấy thông tin người dùng
            const userInfo = await fetchUserInfo(rating.id_user);
            return {
              ...rating,
              user_name: userInfo.username,  // Thêm tên người dùng
              user_avatar: userInfo.avatar,  // Thêm avatar người dùng
            };
          })
        );
        setRatings(ratingsWithUserInfo);  // Cập nhật với danh sách đánh giá đã có thông tin người dùng
      })
      .catch((error) => console.error('Error fetching ratings:', error));
  }, [bookId]);

  return (
    <View style={styles.container}>
      {/* Header với nút quay lại */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/Vector.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
      </View>

      {/* Hiển thị danh sách đánh giá */}
      <FlatList
        data={ratings}
        keyExtractor={(item) => item._id}
        renderItem={({ item }) => (
          <View style={styles.ratingItem}>
            <Image
              source={item.user_avatar ? { uri: item.user_avatar } : require('../assets/icons/user.png')}
              style={styles.userAvatar}
            />
            <View style={styles.ratingContent}>
              <Text style={styles.userName}>{item.user_name || 'Anonymous'}</Text>
              <View style={styles.ratingStars}>
                {[1, 2, 3, 4, 5].map(star => (
                  <Image
                    key={star}
                    source={
                      star <= item.danh_gia ? require('../assets/icon_saovang.png') : require('../assets/icon_saorong.png')
                    }
                    style={styles.star}
                  />
                ))}
              </View>
              <Text style={styles.comment}>{item.binh_luan}</Text>
              <Text style={styles.date}>
                {new Date(item.ngay_tao).toLocaleDateString()}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  icon: {
    width: 24,
    height: 24,
  },
  ratingItem: {
    flexDirection: 'row',
    marginBottom: 20,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    marginRight: 10,
  },
  ratingContent: {
    flex: 1,
  },
  userName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  ratingStars: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  star: {
    width: 20,
    height: 20,
    marginHorizontal: 2,
  },
  comment: {
    fontSize: 16,
    color: '#555',
    marginTop: 5,
  },
  date: {
    fontSize: 12,
    color: '#999',
    marginTop: 5,
  },
});

export default RatingSPshop;
