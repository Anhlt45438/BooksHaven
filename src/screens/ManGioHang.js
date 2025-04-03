import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View, Modal, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import ItemTatCaGioHang from '../components/ItemTatCaGioHang';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { getAccessToken } from '../redux/storageHelper.ts';
import { ActivityIndicator } from 'react-native';

const ManGioHang = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]); // Danh sách giỏ hàng, mỗi item có thêm isChecked
  const [tongtientatca, setTongtientatca] = useState(0);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedBook, setSelectedBook] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Hàm xử lý khi bấm vào item để hiển thị modal
  const handleShowBookDetail = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };

  // Hàm lấy dữ liệu giỏ hàng
  const fetchCartData = async () => {
    setIsLoading(true);
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.log('Không có accessToken');
      return;
    }

    try {
      const response = await fetch('http://14.225.206.60:3000/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu giỏ hàng');
      }

      const cartData = await response.json();
      console.log('Dữ liệu giỏ hàng:', cartData);

      if (!cartData.data.items || !Array.isArray(cartData.data.items)) {
        console.error('Lỗi: cartData.items không phải là một mảng!', cartData);
        setData([]);
        return;
      }

      // Thêm isChecked vào mỗi item, mặc định là false nếu không có dữ liệu trước đó
      const updatedData = cartData.data.items.map(item => ({
        ...item,
        isChecked: data.find(prevItem => prevItem.id_sach === item.id_sach)?.isChecked || false,
      }));
      setData(updatedData);

      // Cập nhật tổng tiền dựa trên các sản phẩm đã chọn
      handleUpdateValue(updatedData);
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error.message);
      setData([]);
    } finally {
      setIsLoading(false);
    }
  };

  // Gọi fetchCartData khi màn hình được focus
  useFocusEffect(
    React.useCallback(() => {
      fetchCartData();
    }, [])
  );

  // Hàm xử lý khi kéo xuống để refresh
  const onRefresh = async () => {
    setRefreshing(true);
    await fetchCartData();
    setRefreshing(false);
  };

  // Xóa sản phẩm khỏi giỏ hàng
  const handleRemoveItem = (id_ctgh) => {
    setData(prevData => prevData.filter(item => item.id_ctgh !== id_ctgh));
  };

  // Cập nhật tổng tiền
  const handleUpdateValue = (currentData = data) => {
    const selectedItems = currentData.filter(item => item.isChecked);
    setTongtientatca(
      selectedItems.reduce((total, item) => {
        return total + Number(item.book_info.gia) * item.so_luong;
      }, 0)
    );
  };

  // Xử lý khi checkbox thay đổi
  const handleCheckChange = (checked, gia, soLuong, id_sach) => {
    setData(prevData =>
      prevData.map(item =>
        item.id_sach === id_sach ? { ...item, isChecked: checked } : item
      )
    );

    // Cập nhật tổng tiền ngay lập tức
    setTongtientatca(prev => {
      if (checked) {
        return prev + Number(gia) * soLuong;
      } else {
        return prev - Number(gia) * soLuong;
      }
    });
  };

  // Xử lý khi số lượng thay đổi
  const handleUpdateQuantity = (id_sach, newQuantity, gia, isChecked) => {
    setData(prevData =>
      prevData.map(item =>
        item.id_sach === id_sach ? { ...item, so_luong: newQuantity } : item
      )
    );

    if (isChecked) {
      const oldItem = data.find(item => item.id_sach === id_sach);
      const oldQuantity = oldItem ? oldItem.so_luong : 0;
      setTongtientatca(prev => prev + (newQuantity - oldQuantity) * Number(gia));
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>

      <View style={styles.tabtatca}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#5908B0" />
            <Text style={styles.loadingText}>Đang tải giỏ hàng...</Text>
          </View>
        ) : (
          <FlatList
            data={data}
            keyExtractor={item => item.id_ctgh}
            renderItem={({ item }) => (
              <TouchableOpacity onPress={() => handleShowBookDetail(item)}>
                <ItemTatCaGioHang
                  item={item}
                  isChecked={item.isChecked} // Truyền trạng thái isChecked
                  onCheckChange={handleCheckChange}
                  onUpdateQuantity={handleUpdateQuantity}
                  onDeleteItem={handleRemoveItem}
                />
              </TouchableOpacity>
            )}
            ListEmptyComponent={
              <Text style={{ marginTop: 100, fontSize: 16, textAlign: 'center' }}>
                Không có sản phẩm nào trong giỏ hàng, kéo xuống để tải lại
              </Text>
            }
            refreshing={refreshing}
            onRefresh={onRefresh}
          />
        )}

        <View style={styles.bottomContainer}>
          <Text style={styles.totalText}>Tổng tiền: {tongtientatca.toLocaleString('vi-VN')}đ</Text>
          <TouchableOpacity
            style={styles.btnThanhtoan}
            onPress={() => {
              const selectedProducts = data
                .filter(item => item.isChecked)
                .map(item => ({
                  ...item,
                  so_luong_mua: item.so_luong,
                }));

              if (selectedProducts.length > 0) {
                navigation.navigate('ManThanhToan', { selectedProducts, tongtientatca });
              } else {
                Alert.alert('Vui lòng chọn ít nhất một sản phẩm để thanh toán!');
              }
            }}
          >
            <Text style={styles.btnText}>Thanh toán ({data.filter(item => item.isChecked).length})</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal hiển thị chi tiết sách */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {selectedBook && (
              <>
                {selectedBook.book_info?.anh ? (
                  <Image
                    source={{ uri: selectedBook.book_info.anh }}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.noImageText}>Không có hình ảnh</Text>
                )}
                <Text style={styles.modalTitle}>{selectedBook.book_info?.ten_sach || 'Không có tên'}</Text>
                <Text style={styles.modalText}>
                  Giá: <Text style={{ fontWeight: 'bold' }}>{Number(selectedBook.book_info?.gia).toLocaleString('vi-VN')}đ</Text>
                </Text>
                <Text style={styles.modalText}>Mô tả: <Text style={{ fontWeight: 'bold' }}>{selectedBook.book_info?.mo_ta || 'Không có thông tin'}</Text></Text>
                <Text style={styles.modalText}>Số trang: <Text style={{ fontWeight: 'bold' }}>{selectedBook.book_info?.so_trang || 'Không có thông tin'}</Text></Text>
                <Text style={styles.modalText}>Tác giả: <Text style={{ fontWeight: 'bold' }}>{selectedBook.book_info?.tac_gia || 'Không có thông tin'}</Text></Text>
                {selectedBook.book_info?.kich_thuoc && (
                  <Text style={styles.modalText}>Kích thước: <Text style={{ fontWeight: 'bold' }}>{selectedBook.book_info.kich_thuoc}</Text></Text>
                )}
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setModalVisible(false)}
                >
                  <Text style={styles.closeButtonText}>Đóng</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default ManGioHang;

// Styles giữ nguyên như cũ
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    padding: 10,
  },
  tabtatca: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#D9D9D9',
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    backgroundColor: '#F0F6D0',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnThanhtoan: {
    height: 40,
    width: 140,
    backgroundColor: '#5908B0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
    elevation: 5,
  },
  bookImage: {
    width: 150,
    height: 200,
    marginBottom: 10,
  },
  noImageText: {
    fontSize: 16,
    color: '#888',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    backgroundColor: '#5908B0',
    borderRadius: 5,
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#5908B0',
  },
});