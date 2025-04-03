import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAccessToken } from "../redux/storageHelper";

const FeedbackScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const [selectedRole, setSelectedRole] = useState("user"); // ✅ Thêm biến selectedRole với mặc định "user"
  const navigation = useNavigation();

  const categories = [
    "Tìm kiếm sản phẩm",
    "Chi tiết sản phẩm và bình luận",
    "Đặt hàng",
    "Các chức năng khác",
    "Lỗi và lỗi ứng dụng",
  ];

  const roles = ["admin", "user", "moderator"]; // ✅ Danh sách các vai trò có thể chọn

  const sendFeedback = async () => {
    if (!description || !selectedCategory) {
      Alert.alert("Lỗi", "Vui lòng chọn danh mục và nhập nội dung phản hồi.");
      return;
    }
  
    const accessToken = await getAccessToken();
    if (!accessToken) {
      console.error("Không có accessToken");
      return;
    }
    try {
      const response = await fetch("http://14.225.206.60:3000/api/notifications/send-feedback", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${accessToken.trim()}`
        },
        body: JSON.stringify({
          noi_dung_thong_bao: description,
          tieu_de: selectedCategory
        })
      });
  
      const result = await response.json();
  
      if (response.ok) {
        Alert.alert("Thành công", `Gửi feedback thành công`);
        setDescription("")
        setSelectedCategory(null)
      } else {
        Alert.alert("Lỗi", result.message || "Có lỗi xảy ra khi gửi feedback");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      Alert.alert("Lỗi", "Không thể gửi feedback, vui lòng thử lại sau.");
    }
  };
  
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Image source={require("../assets/image/back1.png")} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Dịch vụ Chăm Sóc Khách Hàng</Text>
        <TouchableOpacity>
          <Image source={require("../assets/image/shoppingcart.jpg")} />
        </TouchableOpacity>
      </View>

      {/* Chọn danh mục */}
      <Text style={styles.question}>*1. Bạn có 1 đề xuất cho:</Text>
      <RadioButton.Group onValueChange={(value) => setSelectedCategory(value)} value={selectedCategory}>
        {categories.map((category, index) => (
          <TouchableOpacity key={index} style={styles.radioItem} onPress={() => setSelectedCategory(category)}>
            <RadioButton value={category} />
            <Text style={styles.radioText}>{category}</Text>
          </TouchableOpacity>
        ))}
      </RadioButton.Group>

      {/* Chọn vai trò */}
      {/* <Text style={styles.question}>*2. Chọn vai trò nhận thông báo:</Text>
      <RadioButton.Group onValueChange={(value) => setSelectedRole(value)} value={selectedRole}>
        {roles.map((role, index) => (
          <TouchableOpacity key={index} style={styles.radioItem} onPress={() => setSelectedRole(role)}>
            <RadioButton value={role} />
            <Text style={styles.radioText}>{role}</Text>
          </TouchableOpacity>
        ))}
      </RadioButton.Group> */}

      {/* Nhập nội dung phản hồi */}
      <Text style={styles.question}>*2. Mô tả chi tiết đề xuất của bạn:</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Nhập phản hồi của bạn..."
        multiline
        maxLength={500}
        value={description}
        onChangeText={setDescription}
      />
      <Text style={styles.charCount}>{description.length}/500</Text>

      {/* Nút Submit */}
      <TouchableOpacity
        style={[styles.submitButton, (!selectedCategory || !description) && styles.disabledButton]}
        disabled={!selectedCategory || !description}
        onPress={()=>sendFeedback()}
      >
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
  headerTitle: {
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