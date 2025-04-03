import React, { useState } from 'react';
import {
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
    ScrollView,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import { getAccessToken } from '../redux/storageHelper';

const ManDanhGia = () => {
    const [selectedRating, setSelectedRating] = useState(0);
    const [noidungdanhgia, setNoidungdanhgia] = useState('');
    const navigation = useNavigation();
    const route = useRoute();
    const { bookImage, bookName, bookId, onReviewSuccess } = route.params || {};

    if (!bookId) {
        console.error('Missing bookId in route params');
        return (
            <View style={styles.container}>
                <Text>Không tìm thấy thông tin sách!</Text>
            </View>
        );
    }

    const user = useAppSelector((state) => state.user.user);
    const currentUserId = user?._id;

    if (!currentUserId) {
        console.error('User is not logged in');
        return (
            <View style={styles.container}>
                <Text>Vui lòng đăng nhập để đánh giá!</Text>
            </View>
        );
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
            alert('Đánh giá thành công!');

            // Gọi callback để cập nhật danh sách trong ToReviewScreen
            if (onReviewSuccess) {
                onReviewSuccess();
            }

            navigation.goBack();
        } catch (error) {
            alert('Mỗi tài khoản chỉ được đánh giá 1 lần');
        }
    };

    const saorong = require('../assets/icon_saorong.png');
    const saovang = require('../assets/icon_saovang.png');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/back.png')} style={styles.backIcon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Đánh giá sản phẩm</Text>
                <View style={styles.headerPlaceholder} />
            </View>

            <ScrollView style={styles.scrollContainer}>
                <View style={styles.transportSection}>
                    <View style={styles.transportHeader}>
                        <Text style={styles.transportHeaderText}>Đơn Hàng Đã Hoàn Thành</Text>
                    </View>
                    <View style={styles.transportContent}>
                        <Text style={styles.sectionTitle}>Thông tin vận chuyển</Text>
                        <Text style={styles.transportText}>SPX Express: SPX{bookId}</Text>
                        <View style={styles.transportStatus}>
                            <Image
                                source={require('../assets/icons/truck_user.png')}
                                style={styles.truckIcon}
                            />
                            <Text style={styles.transportStatusText}>Giao hàng thành công</Text>
                        </View>
                    </View>
                    <View style={styles.divider} />
                    <View style={styles.addressContent}>
                        <Text style={styles.sectionTitle}>Địa chỉ hiện tại:</Text>
                        <Text style={styles.addressText}>{user.dia_chi || 'Chưa thiết lập'}</Text>
                    </View>
                </View>

                <View style={styles.productSection}>
                    <Text style={styles.sectionTitle}>Thông tin sản phẩm</Text>
                    <View style={styles.productInfo}>
                        <Image
                            style={styles.productImage}
                            source={{ uri: bookImage }}
                            onError={() => console.log('Error loading book image')}
                        />
                        <View style={styles.productDetails}>
                            <Text style={styles.productName}>{bookName}</Text>
                            <Text style={styles.quantity}>Số lượng: 1</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.ratingSection}>
                    <Text style={styles.sectionTitle}>Mời bạn đánh giá</Text>
                    <View style={styles.ratingContainer}>
                        <View style={styles.stars}>
                            {[1, 2, 3, 4, 5].map((star) => (
                                <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                                    <Image
                                        source={star <= selectedRating ? saovang : saorong}
                                        style={styles.star}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                    </View>
                    <TextInput
                        style={styles.reviewInput}
                        placeholder="Nhập đánh giá của bạn về sản phẩm..."
                        multiline
                        numberOfLines={5}
                        value={noidungdanhgia}
                        onChangeText={setNoidungdanhgia}
                        placeholderTextColor="gray"
                    />
                </View>

                <TouchableOpacity style={styles.submitButton} onPress={handleSubmitReview}>
                    <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
                </TouchableOpacity>
            </ScrollView>
        </View>
    );
};

export default ManDanhGia;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 20,
        backgroundColor: '#FFF',
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backIcon: {
        width: 24,
        height: 24,
    },
    headerTitle: {
        flex: 1,
        fontSize: 20,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#333',
    },
    headerPlaceholder: {
        width: 24,
    },
    scrollContainer: {
        flex: 1,
    },
    transportSection: {
        marginHorizontal: 20,
        marginTop: 10,
        marginBottom: 10,
        borderRadius: 10,
        backgroundColor: '#FFF',
        overflow: 'hidden',
    },
    transportHeader: {
        height: 40,
        backgroundColor: '#537c59',
        padding: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    transportHeaderText: {
        color: '#FFF',
        fontWeight: 'bold',
        fontSize: 16,
    },
    transportContent: {
        padding: 15,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#333',
        marginBottom: 8,
    },
    transportText: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    transportStatus: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    truckIcon: {
        width: 20,
        height: 20,
        tintColor: '#00af67',
        marginRight: 10,
    },
    transportStatusText: {
        fontSize: 14,
        color: '#00af67',
    },
    divider: {
        backgroundColor: '#E8E8E8',
        height: 0.5,
        marginHorizontal: 15,
        marginVertical: 10,
    },
    addressContent: {
        padding: 15,
        paddingTop: 0,
    },
    addressText: {
        fontSize: 14,
        color: '#666',
        lineHeight: 20,
    },
    productSection: {
        backgroundColor: '#FFF',
        padding: 15,
        marginHorizontal: 20,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
    },
    productInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    productImage: {
        width: 80,
        height: 100,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        marginRight: 15,
    },
    productDetails: {
        flex: 1,
    },
    productName: {
        fontSize: 16,
        color: '#333',
        marginBottom: 5,
        lineHeight: 22,
    },
    quantity: {
        fontSize: 14,
        color: '#666',
    },
    ratingSection: {
        backgroundColor: '#FFF',
        padding: 15,
        marginHorizontal: 20,
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        marginBottom: 20,
    },
    ratingContainer: {
        alignItems: 'center',
        marginBottom: 15,
    },
    stars: {
        flexDirection: 'row',
        justifyContent: 'center',
    },
    star: {
        width: 30,
        height: 30,
        marginHorizontal: 5,
    },
    reviewInput: {
        width: '100%',
        height: 120,
        backgroundColor: '#F5F5F5',
        borderWidth: 1,
        borderColor: '#E0E0E0',
        borderRadius: 5,
        padding: 10,
        textAlignVertical: 'top',
        fontSize: 14,
        color: '#000000',
    },
    submitButton: {
        backgroundColor: '#ff6d40',
        paddingVertical: 15,
        marginHorizontal: '5%',
        marginBottom: 20,
        borderRadius: 5,
        alignItems: 'center',
    },
    submitButtonText: {
        color: '#FFF',
        fontSize: 16,
        fontWeight: 'bold',
    },
});