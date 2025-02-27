import React from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Image } from 'react-native';

const EditProduct = ({ navigation }) => {
  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require('../assets/icons/Vector.png')} style={styles.icon} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Sửa sản phẩm</Text>
      </View>

      {/* Trường nhập ảnh sản phẩm */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập URL ảnh sản phẩm"
        />
      </View>

      {/* Trường nhập tên sản phẩm */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tên sản phẩm"
        />
      </View>

      {/* Trường mô tả sản phẩm */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[styles.input, styles.textArea]}
          placeholder="Nhập mô tả sản phẩm"
          multiline
        />
      </View>

      {/* Trường nhập giá sản phẩm */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập giá"
          keyboardType="numeric"
        />
      </View>

      {/* Trường nhập số lượng sản phẩm */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập số lượng"
          keyboardType="numeric"
        />
      </View>

      {/* Trường nhập tác giả sản phẩm */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập tác giả"
        />
      </View>

      {/* Trường nhập số trang */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập số trang"
          keyboardType="numeric"
        />
      </View>

      {/* Trường nhập kích thước */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Nhập kích thước"
        />
      </View>

      {/* Trường trạng thái */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Trạng thái"
        />
      </View>

      {/* Trường chọn loại sản phẩm */}
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          placeholder="Chọn loại sản phẩm"
        />
      </View>

      {/* Nút Cập nhật sản phẩm */}
      <TouchableOpacity style={styles.saveButton}>
        <Text style={styles.buttonText}>Cập nhật sản phẩm</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    justifyContent: 'center',
    marginBottom: 10,
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
  saveButton: {
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 13,
    flex: 1,
    marginTop: 10,
    alignItems: 'center',
    paddingVertical: 13,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
});

export default EditProduct;
