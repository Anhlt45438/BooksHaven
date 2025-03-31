import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import { getAccessToken } from "../redux/storageHelper";

const ReviewedScreen = () => {
    const [reviews, setReviews] = useState([]);

    const getReviewedProducts = async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) {
            return;
        }

        try {
            // Giả định có API để lấy danh sách đánh giá của người dùng
            const response = await fetch(
                "http://14.225.206.60:3000/api/reviews/user",
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${accessToken}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Không thể lấy dữ liệu đánh giá");
            }

            const reviewData = await response.json();
            setReviews(reviewData.data || []);
        } catch (error) {
            // console.error("Lỗi khi lấy đánh giá:", error.message);
        }
    };

    useEffect(() => {
        getReviewedProducts();
    }, []);

    const ReviewCard = ({ item }) => {
        return (
            <View style={styles.container}>
                <Text style={styles.productName}>{item.productName || "Sản phẩm"}</Text>
                <Text style={styles.reviewText}>Đánh giá: {item.rating}/5</Text>
                <Text style={styles.comment}>{item.comment || "Không có bình luận"}</Text>
            </View>
        );
    };

    return (
        <FlatList
            data={reviews}
            keyExtractor={(item) => item._id.toString()}
            renderItem={({ item }) => <ReviewCard item={item} />}
            ListEmptyComponent={
                <Text style={styles.emptyText}>Không có đánh giá nào</Text>
            }
        />
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        padding: 10,
        borderRadius: 10,
        margin: 10,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    productName: {
        fontSize: 16,
        fontWeight: "bold",
    },
    reviewText: {
        fontSize: 14,
        color: "gray",
        marginVertical: 5,
    },
    comment: {
        fontSize: 14,
    },
    emptyText: {
        textAlign: "center",
        marginVertical: 20,
        fontSize: 16,
        color: "gray",
    },
});

export default ReviewedScreen;