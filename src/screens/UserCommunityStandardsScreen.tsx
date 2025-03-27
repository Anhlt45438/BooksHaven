import React from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";

const CommunityStandardsScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            {/* Thanh tiêu đề */}
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image source={require("../assets/icons/back.png")} style={{ width: 26, height: 26 }} />
                </TouchableOpacity>
                <Text style={styles.headertext}>Tiêu Chuẩn Cộng Đồng</Text>
            </View>

            {/* Nội dung tiêu chuẩn cộng đồng */}
            <ScrollView style={styles.content}>
                <Text style={styles.sectionTitle}>1. Hành Vi Tôn Trọng</Text>
                <Text style={styles.text}>
                    BooksHaven khuyến khích sự tôn trọng giữa các thành viên. Mọi hành vi xúc phạm, phân biệt đối xử hoặc bạo lực đều bị nghiêm cấm.
                </Text>

                <Text style={styles.sectionTitle}>2. Nội Dung Hợp Pháp</Text>
                <Text style={styles.text}>
                    - Không chia sẻ nội dung vi phạm pháp luật, bản quyền hoặc gây hại cho người khác.{"\n"}
                    - Nội dung phản cảm, kích động hoặc mang tính lừa đảo sẽ bị xóa ngay lập tức.
                </Text>

                <Text style={styles.sectionTitle}>3. Giao Tiếp Lành Mạnh</Text>
                <Text style={styles.text}>
                    Mọi cuộc thảo luận nên dựa trên tinh thần xây dựng. Hãy sử dụng ngôn từ lịch sự và tránh spam hoặc quảng cáo không liên quan.
                </Text>

                <Text style={styles.sectionTitle}>4. Báo Cáo Vi Phạm</Text>
                <Text style={styles.text}>
                    Nếu bạn phát hiện nội dung hoặc hành vi vi phạm, vui lòng báo cáo để chúng tôi có thể xử lý nhanh chóng.
                </Text>

                <Text style={styles.footer}>© 2024 BooksHaven. Chung tay xây dựng cộng đồng đọc sách văn minh!</Text>
            </ScrollView>
        </View>
    );
};

export default CommunityStandardsScreen;

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
        fontSize: 20,
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
