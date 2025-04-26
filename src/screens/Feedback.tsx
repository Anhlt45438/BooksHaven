import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Alert,
  ScrollView,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { RadioButton } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { getAccessToken } from "../redux/storageHelper";

const FeedbackScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [description, setDescription] = useState("");
  const navigation = useNavigation();

  const categories = [
    "Tìm kiếm sản phẩm",
    "Chi tiết sản phẩm và bình luận",
    "Đặt hàng",
    "Các chức năng khác",
    "Lỗi và lỗi ứng dụng",
    "Khác",
  ];

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
      const response = await fetch("http://14.225.206.60:3000/api/feedbacks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken.trim()}`,
        },
        body: JSON.stringify({
          content: description,
          title: selectedCategory,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert("Thành công", `Gửi feedback thành công`);
        setDescription("");
        setSelectedCategory(null);
      } else {
        Alert.alert("Lỗi", result.message || "Có lỗi xảy ra khi gửi feedback");
      }
    } catch (error) {
      console.error("Error sending feedback:", error);
      Alert.alert("Lỗi", "Không thể gửi feedback, vui lòng thử lại sau.");
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={{ flex: 1 }}
    >
      <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 30 }}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Image
              source={require("../assets/image/back1.png")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Chăm Sóc Khách Hàng</Text>
          <TouchableOpacity>
            <Image
              source={require("../assets/image/shoppingcart.jpg")}
              style={styles.headerIcon}
            />
          </TouchableOpacity>
        </View>

        {/* Câu hỏi 1 */}
        <Text style={styles.question}>1. Bạn có đề xuất cho:</Text>
        <RadioButton.Group
          onValueChange={(value) => setSelectedCategory(value)}
          value={selectedCategory}
        >
          {categories.map((category, index) => (
            <TouchableOpacity
              key={index}
              style={styles.radioItem}
              onPress={() => setSelectedCategory(category)}
            >
              <RadioButton value={category} />
              <Text style={styles.radioText}>{category}</Text>
            </TouchableOpacity>
          ))}
        </RadioButton.Group>

        {/* Câu hỏi 2 */}
        <Text style={styles.question}>2. Mô tả chi tiết đề xuất của bạn:</Text>
        <TextInput
          style={styles.textArea}
          placeholder="Nhập phản hồi của bạn..."
          multiline
          maxLength={500}
          value={description}
          onChangeText={setDescription}
        />
        <Text style={styles.charCount}>{description.length}/500</Text>

        {/* Gửi */}
        <TouchableOpacity
          style={[
            styles.submitButton,
            (!selectedCategory || !description) && styles.disabledButton,
          ]}
          disabled={!selectedCategory || !description}
          onPress={sendFeedback}
        >
          <Text style={styles.submitText}>Gửi phản hồi</Text>
        </TouchableOpacity>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    backgroundColor: "#fff",
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  headerIcon: {
    width: 28,
    height: 28,
    resizeMode: "contain",
  },
  question: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 20,
    marginBottom: 10,
    color: "#333",
  },
  radioItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 5,
  },
  radioText: {
    fontSize: 15,
    color: "#000",
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: "#ddd",
    padding: 12,
    borderRadius: 12,
    textAlignVertical: "top",
    backgroundColor: "#fafafa",
  },
  charCount: {
    textAlign: "right",
    color: "#888",
    fontSize: 12,
    marginTop: 5,
  },
  submitButton: {
    backgroundColor: "#ff5722",
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 25,
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
