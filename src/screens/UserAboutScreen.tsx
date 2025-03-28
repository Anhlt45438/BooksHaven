import React from "react";
import {View, Text, Image, TouchableOpacity, StyleSheet} from "react-native";
import {useNavigation} from "@react-navigation/native";

const AboutScreen = () => {
    const navigation = useNavigation();

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity style={styles.back} onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/icons/back.png')}
                        style={{width: 26, height: 26}}
                    />
                </TouchableOpacity>
                    <Text style={styles.headertext}>Giới Thiệu</Text>
            </View>
            <View style={styles.container2}>
                {/* Logo App */}
                <Image source={require("../assets/images/logo.png")} style={styles.logo}/>

                {/* Tên ứng dụng */}
                <Text style={styles.appName}>BooksHaven</Text>

                {/* Mô tả ứng dụng */}
                <Text style={styles.description}>
                    📚 BooksHaven là ứng dụng giúp bạn tìm kiếm, mua và đánh giá các loại sách yêu thích.
                    Chúng tôi mang đến trải nghiệm đọc sách tốt nhất cho bạn!
                </Text>

                {/* Phiên bản */}
                <Text style={styles.version}>Phiên bản: 1.0.0</Text>

                {/* Nút quay lại trang chủ */}
                <TouchableOpacity
                    style={styles.button}
                    onPress={() => navigation.navigate("HomeTabBottom")}
                >
                    <Text style={styles.buttonText}>Về Trang Chủ</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default AboutScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
    },
    container2: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        alignItems: "center",
        marginTop: '10%',
        padding: 20,
    },
    header: {
        flexDirection: 'row',
        paddingHorizontal: 20,
        backgroundColor: 'white',
        alignItems: 'center',
        height: 60,
    },
    headertext: {
        fontSize: 21,
        marginTop: 5,
        flex: 1,
        textAlign:'center',
        marginRight: 26,
    },
    back: {
        marginEnd: 30,
        marginTop: 4,
    },
    logo: {
        width: 100,
        height: 100,
        marginBottom: 20,
    },
    appName: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#D32F2F",
        marginBottom: 10,
    },
    description: {
        fontSize: 16,
        textAlign: "center",
        color: "#333",
        marginBottom: 20,
    },
    version: {
        fontSize: 14,
        color: "#666",
        marginBottom: 30,
    },
    button: {
        backgroundColor: "#D32F2F",
        paddingVertical: 12,
        paddingHorizontal: 24,
        borderRadius: 5,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
