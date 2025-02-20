import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image, Modal, FlatList } from 'react-native';

const categories = ['Sách giáo khoa', 'Tiểu thuyết', 'Truyện tranh', 'Khoa học', 'Kinh tế', 'Lịch sử', 'Tâm lý học'];

const AddProduct = ({navigation}) => {
  const [productName, setProductName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('0');
  const [category, setCategory] = useState('');
  const [author, setAuthor] = useState('');
  const [quantity, setQuantity] = useState('');
  const [pages, setPages] = useState('');
  const [size, setSize] = useState('');
  const [status, setStatus] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

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
        <TouchableOpacity style={styles.imageUpload}>
          <Text style={styles.imageText}>Thêm ảnh</Text>
        </TouchableOpacity>

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
          <Text style={styles.optionText}>Loại sách</Text>
          <Text style={styles.placeholderText}>{category || 'Chọn loại sách'}</Text>
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

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Trạng thái"
            value={status}
            onChangeText={setStatus}
            placeholderTextColor="#000"
          />
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.saveButton}>
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
                keyExtractor={(item) => item}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.modalItem}
                    onPress={() => {
                      setCategory(item);
                      setModalVisible(false);
                    }}>
                    <Text style={styles.modalText}>{item}</Text>
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
  imageUpload: {
    width: 120,
    height: 120,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#FF6600',
    marginBottom: 10,
    marginRight: 220,
  },
  imageText: {
    color: '#FF6600',
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
  modalContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', padding: 20, borderRadius: 10, width: '80%' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 10, textAlign: 'center' },
  modalItem: { padding: 10, borderBottomWidth: 1, borderColor: '#ddd' },
  modalText: { fontSize: 16 },
  closeButton: { backgroundColor: '#28a745', padding: 10, borderRadius: 10, alignItems: 'center', marginTop: 10 },
  optionIcon: { width: 22, height: 22 },
});

export default AddProduct;