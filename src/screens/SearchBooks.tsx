import React, {useState, useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  StyleSheet,
  Image,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useSelector} from 'react-redux';

const SearchBooks = ({navigation}) => {
  const {user} = useSelector(state => state.user); // Lấy thông tin người dùng từ Redux
  const [searchKeyword, setSearchKeyword] = useState('');
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false); // trạng thái modal
  const [selectedProduct, setSelectedProduct] = useState(null); // sản phẩm được chọn

  useEffect(() => {
    if (!searchKeyword) {
      setProducts([]); // Nếu không có từ khóa, ẩn danh sách sản phẩm
    }
  }, [searchKeyword]);


    // Hàm tìm kiếm sản phẩm theo từ khóa
    const searchProducts = async (keyword) => {
        if (!keyword.trim()) {
            setProducts([]); // Nếu từ khóa rỗng, không hiển thị danh sách sản phẩm
            return;
        }
        setLoading(true);
        const shopId = user.shop_id;
        try {
            const response = await fetch(`http://14.225.206.60:3000/api/books/search?keyword=${keyword}&shop_id=${shopId}`, {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            setProducts(data.data || []); // Hiển thị kết quả tìm kiếm
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể tìm kiếm sản phẩm.");
        } finally {
            setLoading(false);
        }
    };


  // Hàm xử lý thay đổi trong trường tìm kiếm
  const handleSearchInputChange = input => {
    setSearchKeyword(input);
    searchProducts(input); // Gọi tìm kiếm mỗi khi người dùng nhập
  };

  // Hàm xử lý mở Modal chi tiết sản phẩm
  const openProductDetail = product => {
    setSelectedProduct(product);
    setModalVisible(true);
  };


    // Hàm gọi API lấy chi tiết sách theo bookId
    const fetchBookDetails = async (bookId) => {
        if (!user || !user.accessToken) {
            Alert.alert("Lỗi", "Không tìm thấy token người dùng.");
            return;
        }
        try {
            const response = await fetch(`http://14.225.206.60:3000/api/books/${bookId}`, {
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);
            setSelectedProduct(data["data"]);
            setModalVisible(true); // Mở Modal hiển thị chi tiết sản phẩm
        } catch (error) {
            console.error(error);
            Alert.alert("Lỗi", "Không thể tải chi tiết sản phẩm từ API.");
        }
    };


  // Render item trong FlatList (chỉ xem chi tiết)
  const renderItem = ({item}) => (
    <View style={styles.productItem}>
      <Image source={{uri: item.anh}} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productTitle}>{item.ten_sach}</Text>
        <Text style={styles.productPrice}>Giá: {item.gia}</Text>
        <Text style={styles.productStock}>Số lượng: {item.so_luong}</Text>
      </View>
      <TouchableOpacity
        style={styles.viewDetailsButton}
        onPress={() => fetchBookDetails(item._id)} // Mở Modal xem chi tiết
      >
        <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image
            source={require('../assets/icons/Vector.png')}
            style={styles.icon}
          />
        </TouchableOpacity>
        <Text style={styles.title}>Tìm kiếm sản phẩm</Text>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Nhập tên sản phẩm"
        value={searchKeyword}
        onChangeText={handleSearchInputChange} // Gọi hàm khi người dùng nhập
      />

      {/* Hiển thị ActivityIndicator nếu đang tải dữ liệu tìm kiếm */}
      {loading && (
        <View style={styles.loaderContainer}>
          <ActivityIndicator size="large" color="#4CAF50" />
        </View>
      )}

      {/* Chỉ hiển thị FlatList khi có từ khóa tìm kiếm */}
      {searchKeyword && products.length > 0 && (
        <FlatList
          data={products}
          renderItem={renderItem}
          keyExtractor={item => item._id}
        />
      )}

      {/* Nếu không có sản phẩm tìm thấy và từ khóa không rỗng, hiển thị thông báo */}
      {searchKeyword && products.length === 0 && !loading && (
        <Text style={styles.noResultsText}>Không tìm thấy sản phẩm nào.</Text>
      )}

      {/* Modal xem chi tiết sản phẩm */}
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
                source={{uri: selectedProduct.anh}}
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

              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
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
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    width: 24,
    height: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    padding: 10,
    borderRadius: 5,
    marginBottom: 10,
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
  viewDetailsButton: {
    marginTop: 70,
  },
  viewDetailsText: {
    color: '#000',
    fontSize: 16,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noResultsText: {
    textAlign: 'center',
    color: 'gray',
    fontSize: 16,
    marginTop: 20,
  },

  // Modal styles
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
    marginTop: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default SearchBooks;
