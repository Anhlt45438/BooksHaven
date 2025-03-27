import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Alert,
  ActivityIndicator,
} from 'react-native';

import { useSelector } from 'react-redux';
import { useFocusEffect } from '@react-navigation/native';


const ProductScreen = ({ route, navigation }) => {
  const { user } = useSelector(state => state.user); // Lấy thông tin người dùng từ Redux
  const { shop } = useSelector(state => state.shop); // Lấy thông tin shop từ Redux


  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detailLoading, setDetailLoading] = useState(false); // trạng thái loading cho chi tiết sách
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(null);
  const [statusList, setStatusList] = useState('con_hang');

  useEffect(() => {
    if (shop && user) {
      fetchProducts(statusList);
    }
    if (route.params?.newProduct) {
      setProducts(prevProducts => [route.params.newProduct, ...prevProducts]);
    }
  }, [route.params?.newProduct, shop, user]);

  // Sử dụng useFocusEffect để reload lại dữ liệu khi quay lại ProductScreen
  useFocusEffect(
    React.useCallback(() => {
      if (shop && user) {
        fetchProducts(statusList);
      }
    }, [shop, user, statusList]),
  );

  const fetchProducts = async (status = '') => {
    if (!shop || !user || !user.accessToken) {
      Alert.alert('Lỗi', 'Không có thông tin shop hoặc token người dùng.');
      return;
    }


    // Kiểm tra xem giá trị status có hợp lệ không
    if (!['con_hang', 'het_hang', 'chua_duyet'].includes(status)) {
      Alert.alert('Lỗi', 'Trạng thái không hợp lệ.');
      return;
    }

    try {
      console.log(response)
      const response = await fetch(`http://14.225.206.60:3000/api/shops/products/status?page=1&limit=10`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',

        },
        body: JSON.stringify({
          type: status,
        }),
      });
      console.log(status)
      const data = await response.json();
      console.log(data);
      if (data && Array.isArray(data['data'])) {
        setProducts(data['data']);  // Cập nhật sản phẩm
      } else {
        Alert.alert('Lỗi', 'Dữ liệu trả về không hợp lệ.');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm từ API.');
    } finally {
      setLoading(false);
    }
  };

  // Hàm gọi API lấy chi tiết sách theo bookId
  const fetchBookDetails = async bookId => {
    if (!user || !user.accessToken) {
      Alert.alert('Lỗi', 'Không tìm thấy token người dùng.');
      return;
    }
    try {
      setDetailLoading(true);

      const response = await fetch(`http://14.225.206.60:3000/api/books/${bookId}`, {
        headers: {
          'Authorization': `Bearer ${user.accessToken}`,
          'Content-Type': 'application/json',

        },
      });
      const data = await response.json();
      console.log(data);
      setSelectedProduct(data['data']);
      setModalVisible(true);

      console.log('selectedProduct.the_loai:', selectedProduct.the_loai);

    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải chi tiết sản phẩm từ API.');
    } finally {
      setDetailLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.anh }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.ten_sach}</Text>
        <Text style={styles.productPrice}>Giá: {item.gia}</Text>
        <Text style={styles.productStock}>Số lượng: {item.so_luong}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => fetchBookDetails(item._id)}>
        <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.ratingButton}
        
        onPress={() => navigation.navigate('RatingSPshop', { bookId: item._id })}>
        <Image source={require('../assets/icons/rating.png')} style={styles.ratingIcon} />
        
      </TouchableOpacity>
    </View>
  );

  const handleAction = action => {
    setActionType(action);
    setConfirmationVisible(true);
  };

  const deleteProduct = async () => {
    if (!selectedProduct) return;
    if (!user || !user.accessToken) {
      Alert.alert('Lỗi', 'Không tìm thấy token người dùng.');
      return;
    }

    try {


      const response = await fetch(`http://14.225.206.60:3000/api/books/${selectedProduct._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${user.accessToken}`, // Sử dụng token từ Redux
          'Content-Type': 'application/json',

        },
      );

      if (response.ok) {
        const updatedProducts = products.filter(
          product => product._id !== selectedProduct._id,
        );
        setProducts(updatedProducts);
        Alert.alert('Thông báo', 'Xóa sản phẩm thành công!', [{ text: 'OK' }]);
      } else {
        const errorData = await response.json();
        Alert.alert(
          'Lỗi',
          `Xóa sản phẩm thất bại: ${errorData || 'Unknown error'}`,
        );
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể xóa sản phẩm.');
    } finally {
      setConfirmationVisible(false);
      setModalVisible(false);
    }
  };

  const confirmAction = () => {
    if (actionType === 'delete') {
      deleteProduct();
    } else if (actionType === 'edit') {
      console.log('Sửa sản phẩm:', selectedProduct.ten_sach);
    }
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  // Hàm gọi API khi người dùng chọn trạng thái
  const handleTabPress = (status) => {
    setStatusList(status);
    setLoading(true);  // Hiển thị loading khi gọi API
    fetchProducts(status);  // Gọi API với tham số status
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.navigate('MyShop')}>
            <Image
              source={require('../assets/icons/Vector.png')}
              style={styles.iconn}
            />
          </TouchableOpacity>
          <Text style={styles.title}>Sản Phẩm của Tôi</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity
              onPress={() => navigation.navigate('SearchBooks')}>
              <Image
                source={require('../assets/icons/search.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                console.log('Message icon clicked');
              }}>
              <Image
                source={require('../assets/icons/mess.png')}
                style={styles.icon}
              />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator}></View>

        <View style={styles.tabContainer}>
          <View style={styles.tabItem}>
            <TouchableOpacity onPress={() => handleTabPress('con_hang')}>
              <Text style={[styles.tab, statusList === 'con_hang' ? styles.selectedTabText : null]}>Còn hàng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabItem}>
            <TouchableOpacity onPress={() => handleTabPress('het_hang')}>
              <Text style={[styles.tab, statusList === 'het_hang' ? styles.selectedTabText : null]}>Hết hàng</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.tabItem}>
            <TouchableOpacity onPress={() => handleTabPress('chua_duyet')}>
              <Text style={[styles.tab, statusList === 'chua_duyet' ? styles.selectedTabText : null]}>Chờ duyệt</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separatorr}></View>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.productList}
        ListFooterComponent={<View style={styles.footerSpacing} />}
      />

      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('AddProduct')}>
        <Text style={styles.addButtonText}>Thêm sản phẩm mới</Text>
      </TouchableOpacity>

      {selectedProduct && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
              <Image
                source={{ uri: selectedProduct.anh }}
                style={styles.modalImage}
              />
              <Text style={styles.modalText}>
                Tên sản phẩm: {selectedProduct.ten_sach}
              </Text>
              <Text style={styles.modalText}>
                Tác giả: {selectedProduct.tac_gia}
              </Text>
              <Text style={styles.modalText}>
                Mô tả: {selectedProduct.mo_ta}
              </Text>
              <Text style={styles.modalText}>
                Loại sách:{' '}
                {Array.isArray(selectedProduct.the_loai)
                  ? selectedProduct.the_loai
                    .map(item => item.ten_the_loai)
                    .join(', ')
                  : selectedProduct.the_loai
                    ? selectedProduct.the_loai.ten_the_loai
                    : 'Chưa cập nhật'}
              </Text>
              <Text style={styles.modalText}>Giá: {selectedProduct.gia}</Text>
              <Text style={styles.modalText}>
                Số lượng: {selectedProduct.so_luong}
              </Text>
              <Text style={styles.modalText}>
                Trạng thái: {selectedProduct.trang_thai}
              </Text>
              <Text style={styles.modalText}>
                Số trang: {selectedProduct.so_trang}
              </Text>
              <Text style={styles.modalText}>
                Kích thước: {selectedProduct.kich_thuoc}
              </Text>

              <View style={styles.actionButtons}>


                <TouchableOpacity style={styles.button} onPress={() => {
                  setModalVisible(false);
                  navigation.navigate('EditProduct', { products: selectedProduct });
                }}>

                  <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => handleAction('delete')}>
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {confirmationVisible && (
        <Modal
          visible={confirmationVisible}
          animationType="slide"
          onRequestClose={() => setConfirmationVisible(false)}
          transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác nhận</Text>
              <Text style={styles.modalText}>
                Bạn có chắc chắn muốn {actionType === 'delete' ? 'xóa' : 'sửa'}{' '}
                sản phẩm này?
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity style={styles.button} onPress={confirmAction}>
                  <Text style={styles.buttonText}>Có</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.button}
                  onPress={() => setConfirmationVisible(false)}>
                  <Text style={styles.buttonText}>Không</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>

  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
    flexGrow: 1,
  },
  header: {
    alignItems: 'center',
    marginBottom: 20,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    left: 14,
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  icon: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  iconn: {
    width: 24,
    height: 24,
  },
  tabContainer: {
    flexDirection: 'row',
    marginTop: 5,
    width: '100%',
    justifyContent: 'space-between',
  },
  tabItem: {
    alignItems: 'center',
  },
  selectedTabText: {
    color: '#FF7F24', // Màu cam khi nút được chọn (chỉ thay đổi màu chữ, không màu nền)
  },
  tab: {
    fontSize: 19,
  },
  count: {
    fontSize: 18,
    color: '#000',
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  addButton: {
    backgroundColor: '#4CAF50',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
    position: 'absolute',
    bottom: 15,
    left: 20,
    right: 20,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  separator: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    width: '120%',
    marginVertical: 15,
  },
  separatorr: {
    borderBottomWidth: 2,
    borderBottomColor: '#ccc',
    width: '120%',
    marginTop: 20,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 15,
    padding: 12,
    borderRadius: 8,
    backgroundColor: '#f9f9f9', // Màu nền nhẹ cho item
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    marginHorizontal: 0, // Thêm khoảng cách ngang cho item
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 90,
    height: 120,
    resizeMode: 'contain',
    marginRight: 15,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  productPrice: {
    fontSize: 16,
    marginTop: 5,
  },
  productStock: {
    fontSize: 16,
    marginTop: 5,
  },
  productList: {
    marginTop: 0,
    marginBottom: 50,
  },
  viewDetailsButton: {
    marginTop: 75,
    marginRight: -30,
  },
  viewDetailsText: {
    color: '#000',
    fontSize: 17,
  },
  ratingButton: {
    marginBottom: 80,
    padding: 0,
  },
  ratingIcon: {
    width: 34,
    height: 40,
  },
  footerSpacing: {
    height: 20, // Khoảng cách giữa các phần tử và nút "Thêm sản phẩm mới"
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  modalImage: {
    width: 150,
    height: 150,
    marginBottom: 10,
    resizeMode: 'contain',
  },
  closeButton: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  button: {
    backgroundColor: '#4CAF50',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginVertical: 10,
    width: '45%',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginVertical: 15,
  },
  confirmButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default ProductScreen;

