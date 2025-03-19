import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Modal,
  FlatList,
  Alert,
  Platform
} from 'react-native';
import { useSelector } from 'react-redux';
import { launchImageLibrary, launchCamera } from 'react-native-image-picker';

const AddProduct = ({ navigation }) => {
  const { user } = useSelector((state) => state.user); // Lấy thông tin người dùng từ Redux
  const { shop } = useSelector((state) => state.shop); // Lấy thông tin shop từ Redux

  const [categories, setCategories] = useState([]);
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState({});
  const [author, setAuthor] = useState('');
  const [anh, setAnh] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pages, setPages] = useState('');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);
  const [imageModalVisible, setImageModalVisible] = useState(false); // Modal cho chọn ảnh

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch('http://10.0.2.2:3000/api/categories');
      const data = await response.json();
      setCategories(data["data"]);
    } catch (error) {
      console.error(error);
      Alert.alert('Lỗi', 'Không thể tải danh sách thể loại từ API.');
    }
  };


  // Hàm chuyển đổi ảnh sang base64
  const convertToBase64 = (uri) => {
    return new Promise((resolve, reject) => {
      if (Platform.OS === 'ios') {
        fetch(uri)
          .then(res => res.blob())
          .then(blob => {
            const reader = new FileReader();
            reader.onloadend = () => {
              const base64Data = `data:image/jpeg;base64,${reader.result}`;
              resolve(base64Data);
            };
            reader.onerror = error => reject(error);
            reader.readAsDataURL(blob);
          })
          .catch(reject);
      } else {
        const RNFS = require('react-native-fs');
        RNFS.readFile(uri, 'base64')
          .then((base64Data) => {
            resolve(`data:image/jpeg;base64,${base64Data}`);
          })
          .catch(reject);
      }
    });
  };

  // Hàm xử lý khi chọn ảnh từ Camera
  const handleCameraPick = () => {

//   // Hàm xử lý chọn ảnh từ thư viện hoặc chụp ảnh mới
//   const handleImagePick = () => {

    const options = {
      mediaType: 'photo',
      quality: 0.5,
    };

    launchCamera(options, async (response) => {
      if (response.didCancel) {
        console.log('User cancelled camera');
      } else if (response.errorCode) {
        console.log('Camera error: ', response.errorMessage);
        Alert.alert('Camera error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri);
            setAnh(base64Image);
          } catch (error) {
            console.error('Error converting to base64: ', error);
            Alert.alert('Error', 'Không thể chuyển ảnh sang định dạng base64. Vui lòng thử lại.');
          }
        }
      }
      setImageModalVisible(false);
    });
  };

  // Hàm xử lý khi chọn ảnh từ thư viện
  const handleLibraryPick = () => {
    const options = {
      mediaType: 'photo',
      quality: 0.5,
    };
    launchImageLibrary(options, async (response) => {


    // Mở thư viện ảnh
//     launchImageLibrary(options, (response) => {

      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        console.log('ImagePicker Error: ', response.errorMessage);

        Alert.alert('ImagePicker error', response.errorMessage);
      } else if (response.assets && response.assets.length > 0) {
        const media = response.assets[0];
        if (media.uri) {
          try {
            const base64Image = await convertToBase64(media.uri);
            setAnh(base64Image);
          } catch (error) {
            console.error('Error converting to base64: ', error);
            Alert.alert('Error', 'Không thể chuyển ảnh sang định dạng base64. Vui lòng thử lại.');
          }
        }
      }
      setImageModalVisible(false);
    });
  };

  // Mở Modal chọn ảnh
  const openImageModal = () => {
    setImageModalVisible(true);
  };

  const handleAddBook = async () => {
    
    if (!anh) {
      Alert.alert("Lỗi", "Bạn chưa chọn ảnh cho sản phẩm!");
      return;
    }

    if (!productName.trim()) {
      Alert.alert("Lỗi", "Tên sản phẩm không được để trống!");
      return;
    }
  
    if (!description.trim()) {
      Alert.alert("Lỗi", "Mô tả sản phẩm không được để trống!");
      return;
    }
  
    if (!price || isNaN(price) || parseFloat(price) <= 0) {
      Alert.alert("Lỗi", "Giá sản phẩm phải là một số dương hợp lệ!");
      return;
    }  

    if (!author.trim()) {
      Alert.alert("Lỗi", "Tên tác giả không được để trống!");
      return;
    }
  
    if (!quantity || isNaN(quantity) || parseInt(quantity) <= 0) {
      Alert.alert("Lỗi", "Số lượng sản phẩm phải là một số dương hợp lệ!");
      return;
    }
  

    console.log(pages)
    if (!pages || isNaN(pages) || parseInt(pages) <= 0) {
      Alert.alert("Lỗi", "Số trang phải là một số dương hợp lệ!");
      return;
    }
  
    if (!size.trim()) {
      Alert.alert("Lỗi", "Kích thước không được để trống!");
      return;
    }


    const newBook = {
      ten_sach: productName,
      mo_ta: description,
      gia: price,
      the_loai: [{ id_the_loai: (category as any).id_the_loai }],
      tac_gia: author,
      anh: anh,
      so_luong: quantity,
      so_trang: pages,
      kich_thuoc: size,
      //trang_thai: status,
    };

    if (!user || !user.accessToken || !shop) {
      Alert.alert("Lỗi", "Không có thông tin người dùng hoặc shop.");
      return;
    }

    try {

      console.log(newBook)

      const response = await fetch('http://10.0.2.2:3000/api/books', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.accessToken}`,
        },
        body: JSON.stringify(newBook),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Thành công', 'Sản phẩm đã được thêm thành công!');
        setProductName('');
        setDescription('');
        setPrice('');
        setCategory({});
        setAuthor('');
        setAnh('');
        setQuantity('');
        setPages('');
        setSize('');
        setStatus('');
        navigation.navigate('ProductScreen', {
          newProduct: result, // Truyền sản phẩm mới đến ProductScreen
        });
      } else {
        const errorData = await response.json();
        console.log(errorData)
        Alert.alert('Lỗi', `Không thể thêm sản phẩm: ${errorData || 'Unknown error'}`);
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi kết nối đến server!');
      console.log('Error:', error);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/Vector.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Thêm sản phẩm</Text>
      </View>

      <View style={styles.imageContainer}>
        <View style={styles.row}>
          <Text style={styles.label}>Hình ảnh/video sản phẩm</Text>
          <Text style={styles.imageHint}>Hình ảnh tỷ lệ 1:1</Text>
        </View>

        {/* Chọn ảnh */}
        <View style={styles.imageAndButtonContainer}>

          <TouchableOpacity style={styles.imageUpload} onPress={openImageModal}>

            <Text style={styles.imageText}>Chọn ảnh</Text>
          </TouchableOpacity>

          {anh ? (
            <Image source={{ uri: anh }} style={styles.imagePreview} />
          ) : (
            <Text style={styles.imagePreviewText}>Chưa có ảnh</Text>
          )}
        </View>


        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tên sản phẩm"
            value={productName}
            onChangeText={setProductName}
            maxLength={120}
            placeholderTextColor="#000"
          />
          <Text style={styles.charCount}>{productName.length}/120</Text>
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Nhập mô tả sản phẩm"
            value={description}
            onChangeText={setDescription}
            multiline
            maxLength={3000}
            placeholderTextColor="#000"
          />
          <Text style={styles.charCount}>{description.length}/3000</Text>
        </View>

        <TouchableOpacity style={[styles.optionButton, styles.categoryButton]} onPress={() => setModalVisible(true)}>
          <Image source={require('../assets/icons/image1502.png')} style={styles.optionIcon} />
          <Text style={styles.optionText}>Thể loại</Text>
          <Text style={styles.placeholderText}>{category.ten_the_loai || 'Chọn loại sách'}</Text>
        </TouchableOpacity>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập giá"
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập tác giả"
            value={author}
            onChangeText={setAuthor}
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập số lượng"
            value={quantity}
            onChangeText={setQuantity}
            keyboardType="numeric"
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập số trang"
            value={pages}
            onChangeText={setPages}
            keyboardType="numeric"
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Nhập kích thước"
            value={size}
            onChangeText={setSize}
            placeholderTextColor="#000"
          />
        </View>

        {/* <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Trạng thái"
            value={status}
            onChangeText={setStatus}
            placeholderTextColor="#000"
          />
        </View> */}

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton} onPress={handleAddBook}>
            <Text style={styles.buttonText}>Lưu sản phẩm</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Modal chọn loại sách */}
      {modalVisible && (
        <Modal transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>Chọn loại sách</Text>
              <FlatList
                data={categories}
                keyExtractor={(item) => item.id_the_loai.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setCategory(item);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.modalText}>{item.ten_the_loai}</Text>
                  </TouchableOpacity>
                )}
              />
              <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
                <Text style={styles.buttonText}>Đóng</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
      {/* Modal chọn ảnh (chụp hoặc chọn từ thư viện) */}
      {imageModalVisible && (
        <Modal
          transparent
          animationType="fade"
          onRequestClose={() => setImageModalVisible(false)}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <TouchableOpacity style={styles.modalOption} onPress={handleCameraPick}>
                <Text style={styles.modalOptionText}>Chụp ảnh</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalOption} onPress={handleLibraryPick}>
                <Text style={styles.modalOptionText}>Chọn ảnh từ thư viện</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.modalOption}
                onPress={() => setImageModalVisible(false)}>
                <Text style={[styles.modalOptionText, { color: 'red' }]}>Hủy</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 0,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'center',
    marginBottom: 10,
    marginBlockStart: 10,
    position: 'relative',
  },
  icon: {
    width: 24,
    height: 24,
    left: 15,
  },
  headerTitle: {
    fontSize: 27,
    fontWeight: 'bold',
    textAlign: 'center',
    flex: 1,
  },
  imageContainer: {
    alignItems: 'center',
    marginBottom: 0,
    padding: 10,
    backgroundColor: '#EEEEEE',
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    width: '100%',
    alignSelf: 'stretch',
    height: '100%',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    textAlign: 'left',
    marginLeft: 10,
  },
  imageAndButtonContainer: {
    flexDirection: 'row',  // Đặt nút và ảnh nằm ngang
    justifyContent: 'flex-start',  // Căn chỉnh các phần tử sang trái
    alignItems: 'center',  // Căn chỉnh các phần tử theo chiều dọc
    width: '90%',  // Chiếm 90% chiều rộng
    marginBottom: 20,  // Khoảng cách dưới
  },
  imageUpload: {
    width: 80,  // Kích thước nhỏ hơn cho nút chọn ảnh
    height: 80,  // Kích thước nhỏ hơn cho nút chọn ảnh
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6600',
    marginRight: 20,  // Giãn cách giữa nút và ảnh
  },
  imagePreview: {
    width: 170,  // Kích thước ảnh nhỏ hơn
    height: 170,  // Kích thước ảnh nhỏ hơn
    borderRadius: 10,
    resizeMode: 'contain',
  },
  imageText: {
    color: '#FF6600',
    fontSize: 16,  // Kích thước chữ nhỏ hơn

  },
  imagePreviewText: {
    fontSize: 14,
    color: '#000',

  },
  imageHint: {
    fontSize: 14,
    color: '#000',
    textAlign: 'right',
    marginRight: 10,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  input: {
    flex: 1,
    color: '#000',
    fontSize: 14,
  },
  textArea: {
    height: 80,
  },
  charCount: {
    fontSize: 12,
    color: '#000',
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    padding: 15,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 5,
    backgroundColor: '#fff',
    marginBottom: 10,
  },
  optionText: {
    marginRight: 165,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  optionText11: {
    marginRight: 265,
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  optionText1: {
    marginLeft: 10,
    fontSize: 14,
    color: '#000',
  },
  categoryButton: {
    justifyContent: 'flex-start',
  },
  placeholderText: {
    color: '#000',
    marginLeft: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 13,
    flex: 1,
    marginLeft: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  buttonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: 16,
  },
  modalOption: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  modalOptionText: {
    fontSize: 18,
    textAlign: 'center',
  },
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  modalText: { fontSize: 16 },
  closeButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  optionIcon: { width: 22, height: 22 },
});

export default AddProduct;