import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, Image, StyleSheet, TouchableOpacity, Modal, Alert, ActivityIndicator } from 'react-native';

const ProductScreen = ({ navigation }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [confirmationVisible, setConfirmationVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [actionType, setActionType] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('');
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error(error);
      Alert.alert("Lỗi", "Không thể tải dữ liệu sản phẩm từ API.");
    } finally {
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.productItem}>
      <Image source={{ uri: item.image }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.name}</Text>
        <Text style={styles.productPrice}>Giá: {item.price}</Text>
        <Text style={styles.productStock}>Số lượng: {item.stock}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => {
          setSelectedProduct(item);
          setModalVisible(true);
        }}
      >
        <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  const handleAction = (action) => {
    setActionType(action);
    setConfirmationVisible(true);
  };

  const confirmAction = () => {
    if (actionType === 'delete') {
      // Thực hiện xóa sản phẩm qua API nếu có,
      // sau đó cập nhật lại state sản phẩm (ở đây chỉ cập nhật state cục bộ)
      const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
      setProducts(updatedProducts);
      Alert.alert("Thông báo", "Xóa sản phẩm thành công!", [{ text: "OK" }]);
    } else if (actionType === 'edit') {
      // Điều hướng sang màn hình sửa sản phẩm hoặc gọi API cập nhật sản phẩm
      console.log("Sửa sản phẩm:", selectedProduct.name);
    }
    setConfirmationVisible(false);
    setModalVisible(false);
  };

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#4CAF50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerContent}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
          </TouchableOpacity>
          <Text style={styles.title}>Sản Phẩm của Tôi</Text>
          <View style={styles.iconContainer}>
            <TouchableOpacity onPress={() => { console.log('Search icon clicked'); }}>
              <Image source={require('../assets/icons/search.png')} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => { console.log('Message icon clicked'); }}>
              <Image source={require('../assets/icons/mess.png')} style={styles.icon} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.separator}></View>

        <View style={styles.tabContainer}>
          <View style={styles.tabItem}>
            <TouchableOpacity>
              <Text style={styles.tab}>Còn hàng</Text>
            </TouchableOpacity>
            <Text style={styles.count}>(0)</Text>
          </View>
          <View style={styles.tabItem}>
            <TouchableOpacity>
              <Text style={styles.tab}>Hết hàng</Text>
            </TouchableOpacity>
            <Text style={styles.count}>(0)</Text>
          </View>
          <View style={styles.tabItem}>
            <TouchableOpacity>
              <Text style={styles.tab}>Chờ duyệt</Text>
            </TouchableOpacity>
            <Text style={styles.count}>(0)</Text>
          </View>
          <View style={styles.tabItem}>
            <TouchableOpacity>
              <Text style={styles.tab}>Đã ấn</Text>
            </TouchableOpacity>
            <Text style={styles.count}>(0)</Text>
          </View>
        </View>

        <View style={styles.separatorr}></View>
      </View>

      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.productList}
      />

      <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct')}>
        <Text style={styles.addButtonText}>Thêm sản phẩm mới</Text>
      </TouchableOpacity>

      {selectedProduct && (
        <Modal
          visible={modalVisible}
          animationType="slide"
          onRequestClose={() => setModalVisible(false)}
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
              <Image source={{ uri: selectedProduct.image }} style={styles.modalImage} />
              <Text style={styles.modalText}>Tên sản phẩm: {selectedProduct.name}</Text>
              <Text style={styles.modalText}>Tác giả: {selectedProduct.author}</Text>
              <Text style={styles.modalText}>Mô tả: {selectedProduct.description}</Text>
              <Text style={styles.modalText}>Loại sách: {selectedProduct.category}</Text>
              <Text style={styles.modalText}>Giá: {selectedProduct.price}</Text>
              <Text style={styles.modalText}>Số lượng: {selectedProduct.stock}</Text>
              <Text style={styles.modalText}>Trạng thái: {selectedProduct.status}</Text>
              <Text style={styles.modalText}>Số trang: {selectedProduct.pages}</Text>
              <Text style={styles.modalText}>Kích thước: {selectedProduct.size}</Text>

              <View style={styles.actionButtons}>
                <TouchableOpacity style={styles.button} onPress={() => handleAction('edit')}>
                  <Text style={styles.buttonText}>Sửa</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => handleAction('delete')}>
                  <Text style={styles.buttonText}>Xóa</Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
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
          transparent={true}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Xác nhận</Text>
              <Text style={styles.modalText}>
                Bạn có chắc chắn muốn {actionType === 'delete' ? 'xóa' : 'sửa'} sản phẩm này?
              </Text>
              <View style={styles.confirmButtons}>
                <TouchableOpacity style={styles.button} onPress={confirmAction}>
                  <Text style={styles.buttonText}>Có</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button} onPress={() => setConfirmationVisible(false)}>
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
  tab: {
    fontSize: 18,
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
    borderBottomWidth: 3,
    borderBottomColor: '#ccc',
    width: '120%',
    marginVertical: 15,
  },
  separatorr: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '120%',
    marginTop: 30,
  },
  productItem: {
    flexDirection: 'row',
    marginBottom: 10,
    padding: 10,
    borderBottomWidth: 2,
    borderBottomColor: '#ddd',
    justifyContent: 'space-between',
  },
  productImage: {
    width: 80,
    height: 80,
    marginRight: 20,
  },
  productDetails: {
    flex: 1,
  },
  productTitle: {
    fontSize: 18,
    fontWeight: 'bold',
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
  },
  viewDetailsButton: {
    marginTop: 70,
  },
  viewDetailsText: {
    color: '#000',
    fontSize: 16,
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
