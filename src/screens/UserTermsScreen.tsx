import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const TermsScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Thanh tiêu đề */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image source={require("../assets/icons/back.png")} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
                <Text style={styles.headertext}>Điều Khoản</Text>
            </View>

            {/* Nội dung điều khoản */}
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>1. Giới thiệu</Text>
                <Text style={styles.text}>
                    Chào mừng bạn đến với BooksHaven! Khi sử dụng ứng dụng của chúng tôi, bạn đồng ý với các điều khoản sau đây.
                </Text>

                <Text style={styles.sectionTitle}>2. Quyền và Trách Nhiệm</Text>
                <Text style={styles.text}>
                    - Bạn có trách nhiệm cung cấp thông tin chính xác khi đăng ký tài khoản.{"\n"}
                    - Không được sử dụng ứng dụng để vi phạm pháp luật hoặc phát tán nội dung không phù hợp.
                </Text>

                <Text style={styles.sectionTitle}>3. Chính Sách Bảo Mật</Text>
                <Text style={styles.text}>
                    Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn. Dữ liệu của bạn sẽ không bị chia sẻ mà không có sự đồng ý.
                </Text>

                <Text style={styles.sectionTitle}>4. Thay Đổi Điều Khoản</Text>
                <Text style={styles.text}>
                    BooksHaven có thể cập nhật điều khoản này bất kỳ lúc nào. Hãy kiểm tra thường xuyên để cập nhật thông tin mới nhất.
                </Text>

                <Text style={styles.footer}>© 2024 BooksHaven. Mọi quyền được bảo lưu.</Text>
            </ScrollView>
        </View>
    );
};

export default TermsScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f3f3f3",
    },
    header: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: 20,
        backgroundColor: "white",
        height: 60,
        position: "relative",
    },
    headertext: {
        fontSize: 21,
        textAlign: "center",
        fontWeight: "bold",
    },
    back: {
        position: "absolute",
        left: 20,
    },
    content: {
        flex: 1,
        padding: 20,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#D32F2F",
        marginTop: 20,
    },
    text: {
        fontSize: 16,
        color: "#333",
        marginTop: 5,
        lineHeight: 24,
    },
    footer: {
        fontSize: 14,
        textAlign: "center",
        color: "#666",
        marginTop: 30,
        marginBottom: 20,
    },
});
