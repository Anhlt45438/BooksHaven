import { Alert, FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View,Modal, Image } from 'react-native';
import React, { useEffect, useState } from 'react';
import ItemTatCaGioHang from '../components/ItemTatCaGioHang';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import ManThanhToan from './ManThanhToan';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { getAccessToken } from '../redux/storageHelper.ts';

const ManGioHang = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const [itemsSelected, setItemsSelected] = useState([]);
  const [tongtientatca, setTongtientatca] = useState(0);
  const [refreshing, setRefreshing] = useState(false);

  const [modalVisible, setModalVisible] = useState(false); // Trạng thái hiển thị modal
  const [selectedBook, setSelectedBook] = useState(null);

  // Hàm xử lý khi bấm vào item để hiển thị modal
  const handleShowBookDetail = (book) => {
    setSelectedBook(book);
    setModalVisible(true);
  };
  // Hàm lấy dữ liệu giỏ hàng
  const fetchCartData = async () => {
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
        setData([]); // Đặt data về rỗng nếu có lỗi
        return;
      }

      setData(cartData.data.items); // Cập nhật dữ liệu giỏ hàng
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error.message);
      setData([]); // Đặt data về rỗng nếu có lỗi
    }
  };

  // Gọi fetchCartData khi component mount
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

  const handleRemoveItem = (id) => {
    setData((prevData) => prevData.filter((item) => item.id_ctgh !== id));
    setItemsSelected((prevSelected) => prevSelected.filter((item) => item !== id));
  };

  useEffect(() => {
    handleUpdateValue();
  }, [itemsSelected, data]); // Thêm data vào dependency để cập nhật tổng tiền khi data thay đổi

  function handleUpdateValue() {
    console.log(data);
    const dataChoosen = data.filter((product) => itemsSelected.includes(product.id_sach));
    console.log(dataChoosen);
    setTongtientatca(
      dataChoosen.reduce((total, item) => {
        return total + Number(item.book_info.gia) * item.so_luong;
      }, 0)
    );
  }

  const handleCheckChange = (checked, gia, soLuong, id) => {
  if (checked) {
    setItemsSelected((prev) => [...prev, id]);
  } else {
    setItemsSelected((prev) => prev.filter((item) => item !== id));
  }
};

  const handleUpdateQuantity = (id, newQuantity, gia, isChecked) => {
    setData((prevData) =>
      prevData.map((item) =>
        item.id_sach === id ? { ...item, so_luong: newQuantity } : item
      )
    );
    handleUpdateValue();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>

      <View style={styles.tabtatca}>
        <FlatList
          data={data}
          keyExtractor={(item) => item.id_ctgh}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => handleShowBookDetail(item)}>
              <ItemTatCaGioHang
              item={item}
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
          refreshing={refreshing} // Trạng thái refreshing
          onRefresh={onRefresh} // Hàm gọi khi kéo xuống
        />

        <View style={styles.bottomContainer}>
          <Text style={styles.totalText}>Tổng tiền: {tongtientatca.toLocaleString('vi-VN')}đ</Text>
          <TouchableOpacity
            style={styles.btnThanhtoan}
            onPress={() => {
              const selectedProducts = data
                .filter((item) => itemsSelected.includes(item.id_sach))
                .map((item) => ({
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
            <Text style={styles.btnText}>Thanh toán ({itemsSelected.length})</Text>
          </TouchableOpacity>
        </View>
      </View>
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
                {/* Hình ảnh sách (nếu có) */}
                {selectedBook.book_info?.anh ? (
                  <Image
                    source={{ uri: selectedBook.book_info.anh }}
                    style={styles.bookImage}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={styles.noImageText}>Không có hình ảnh</Text>
                )}

                {/* Tên sách */}
                <Text style={styles.modalTitle}>{selectedBook.book_info?.ten_sach || 'Không có tên'}</Text>

                {/* Giá */}
                <Text style={styles.modalText}>
                  Giá: <Text style={{fontWeight:'bold'}}>{Number(selectedBook.book_info?.gia).toLocaleString('vi-VN')}đ</Text>
                </Text>

        

                {/* Shop */}
                <Text style={styles.modalText}>Mô tả: <Text style={{fontWeight:'bold'}}>{selectedBook.book_info?.mo_ta || 'Không có thông tin'}</Text></Text>
                <Text style={styles.modalText}>Số trang: <Text style={{fontWeight:'bold'}}>{selectedBook.book_info?.so_trang || 'Không có thông tin'}</Text></Text>
                <Text style={styles.modalText}>Tác giả: <Text style={{fontWeight:'bold'}}>{selectedBook.book_info?.tac_gia || 'Không có thông tin'}</Text></Text>

                {/* Kích thước (nếu có) */}
                {selectedBook.book_info?.kich_thuoc && (
                  <Text style={styles.modalText}>Kích thước: <Text style={{fontWeight:'bold'}}>{selectedBook.book_info.kich_thuoc}</Text></Text>
                )}

                {/* Nút đóng modal */}
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#E1DEDE',
  },
  activeTab: {
    backgroundColor: '#EF6363',
  },
  tabText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
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
  tabdamua: {
    padding: 16,
  },
  ip: {
    height: 40,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)', // Nền mờ
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
});