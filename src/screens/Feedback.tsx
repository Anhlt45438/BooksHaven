import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
} from "react-native";
import { RadioButton } from "react-native-paper";
import * as ImagePicker from "react-native-image-picker";
import { useNavigation } from "@react-navigation/native";

const FeedbackScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [images, setImages] = useState([]);
  const navigation = useNavigation();

  const categories = [
    "Tìm kiếm sản phẩm",
    "Chi tiết sản phẩm và bình luận",
    "Đặt hàng",
    "Các chức năng khác",
    "Lỗi và lỗi ứng dụng",
  ];

  // Chọn ảnh từ thư viện
  const pickImage = () => {
    ImagePicker.launchImageLibrary({ mediaType: "photo", selectionLimit: 5 }, (response) => {
      if (response.assets) {
        setImages([...images, ...response.assets.map(asset => asset.uri)]);
      }
    });
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
             <TouchableOpacity onPress={()=>navigation.goBack()}>
               <Image source={require('../assets/image/back1.png')}/>
             </TouchableOpacity>
             <Text style={styles.headerTitle}>Dịch vụ Chăm Sóc Khách Hàng</Text>
             <TouchableOpacity>
              <Image source={require('../assets/image/shoppingcart.jpg')}/>
             </TouchableOpacity>
           </View>

      {/* Câu hỏi 1 */}
      <Text style={styles.question}>*1. Bạn có 1 đề xuất cho:</Text>
      <RadioButton.Group
        onValueChange={(value) => setSelectedCategory(value)}
        value={selectedCategory}
      >
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.radioItem} onPress={() => setSelectedCategory(category)}>
            <RadioButton value={category} />
            <Text style={styles.radioText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </RadioButton.Group>

      {/* Câu hỏi 2 */}
      <Text style={styles.question}>*2. Bạn gặp phải vấn đề nào sau đây:</Text>
      <TextInput style={styles.disabledInput} placeholder="Please answer question 1 first" editable={false} />

      {/* Câu hỏi 3 */}
      <Text style={styles.question}>*3. Mô tả chi tiết đề xuất của bạn:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Nhập phản hồi của bạn..."
        multiline
        maxLength={500}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.charCount}>{description.length}/500</Text>

      {/* Upload ảnh */}
      <TouchableOpacity style={styles.uploadButton} onPress={pickImage}>
        <Text style={styles.uploadText}>+ Tải ảnh</Text>
      </TouchableOpacity>

      {/* Hiển thị ảnh đã chọn */}
      <FlatList
        data={images}
        horizontal
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => <Image source={{ uri: item }} style={styles.image} />}
      />

      {/* Nút Submit */}
      <TouchableOpacity style={[styles.submitButton, (!selectedCategory || !description) && styles.disabledButton]} disabled={!selectedCategory || !description}>
        <Text style={styles.submitText}>Gửi</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  backText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
  }, headerTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginVertical: 10,
    color: "#000",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioText: {
    fontSize: 16,
    color: "#000",
  },
  disabledInput: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    color: "#999",
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 10,
    borderRadius: 5,
    textAlignVertical: "top",
  },
  charCount: {
    textAlign: "right",
    color: "#888",
    fontSize: 12,
    marginBottom: 10,
  },
  uploadButton: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  uploadText: {
    color: "#333",
  },
  image: {
    width: 80,
    height: 80,
    marginRight: 10,
    marginTop: 10,
    borderRadius: 5,
  },
  submitButton: {
    backgroundColor: "#ff5722",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  submitText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  disabledButton: {
    backgroundColor: "#ccc",
  },
});

export default FeedbackScreen;