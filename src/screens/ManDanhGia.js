import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import { getAccessToken } from '../redux/storageHelper';

const ManDanhGia = () => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [noidungdanhgia, setNoidungdanhgia] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { bookImage, bookName, bookId } = route.params;

    if (!bookId) {
        console.error("Missing bookId in route params");
    }

    const user = useAppSelector((state) => state.user.user);
    const currentUserId = user?._id;

    if (!currentUserId) {
        console.error("User is not logged in");
    }

    const handleStarPress = (rating) => {
        setSelectedRating(rating);
    };

    const handleSubmitReview = async () => {
        if (selectedRating <= 0) {
            alert('Vui lòng chọn số sao đánh giá!');
            return;
        }

        const reviewData = {
            id_user: currentUserId,
            id_sach: bookId,
            danh_gia: selectedRating,
            binh_luan: noidungdanhgia,
        };

        try {
            const accessToken = await getAccessToken();
            if (!accessToken) {
                throw new Error('Access token is missing');
            }

            const response = await fetch('http://14.225.206.60:3000/api/ratings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${accessToken}`,
                },
                body: JSON.stringify(reviewData),
            });
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Server error: ${response.status}. Details: ${errorText}`);
            }
            const data = await response.json();
            console.log('Review submitted successfully:', data);
            navigation.goBack(); // Quay lại ProductDetailScreen
        } catch (error) {
            alert('Mỗi tài khoản chỉ được đánh giá 1 lần');
        }
    };

    const saorong = require('../assets/icon_saorong.png');
    const saovang = require('../assets/icon_saovang.png');

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', marginTop: 10, alignItems: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/back.png')} />
                </TouchableOpacity>
                <Text style={{ fontSize: 23, fontWeight: 'bold', textAlign: 'center', flex: 1 }}>
                    Đánh giá sản phẩm
                </Text>
                <TouchableOpacity onPress={handleSubmitReview}>
                    <Image
                        style={{ height: 26, width: 26, marginTop: 5 }}
                        source={require('../assets/icons/check.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.container2}>
                <View style={{ flexDirection: 'row', alignItems: 'center', width: '100%' }}>
                    <Image
                        style={{ height: 120, width: 100, borderColor: 'black', borderWidth: 1 }}
                        source={{ uri: bookImage }}
                    />
                    <Text style={{ fontSize: 23, marginLeft: 20 }}>
                        Sách: {String(bookName)}
                    </Text>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center', marginTop: 20 }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Mời bạn đánh giá</Text>
                    <View style={{ flexDirection: 'row', marginTop: 5 }}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                                <Image
                                    source={star <= selectedRating ? saovang : saorong}
                                    style={styles.star}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{ marginTop: 20, width: '100%' }}>
                        <TextInput
                            style={styles.onhap}
                            placeholder="Nhập đánh giá của bạn về sản phẩm..."
                            multiline
                            numberOfLines={5}
                            value={noidungdanhgia}
                            onChangeText={setNoidungdanhgia}
                        />
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ManDanhGia;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 10,
        backgroundColor: '#FFFFFF',
    },
    container2: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        marginTop: 20,
        padding: 20,
    },
    star: {
        width: 25,
        height: 25,
        margin: 10,
    },
    onhap: {
        width: '100%',
        height: 300,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: 'black',
        textAlignVertical: 'top',
        padding: 10,
    },
});