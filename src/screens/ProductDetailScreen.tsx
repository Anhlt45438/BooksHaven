import React, {useState} from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    ScrollView,
    Dimensions,
} from 'react-native';

const {width} = Dimensions.get('window');

const ProductDetailScreen = () => {
    const [rating] = useState(4.5);

    const productPrice = 102000;

    return (
        <View style={styles.screen}>
            <ScrollView style={styles.scrollContainer}>
                <View>
                    <Image
                        source={require('../assets/images/image3.png')}
                        style={styles.productImage}
                        resizeMode="cover"
                    />
                </View>

                    <View style={styles.infoContainer}>
                        <Text style={styles.price}>
                            {productPrice.toLocaleString('vi-VN')} đ
                        </Text>
                        <Text style={styles.productName}>
                            Sách sự im lặng của bầy cừu
                        </Text>

                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Đánh giá sản phẩm</Text>
                        </View>

                        <View style={styles.ratingContainer}>
                            {renderStars(rating).map((star, index) => (
                                <Image
                                    key={index}
                                    source={star === 1
                                        ? require('../assets/icons/star.png')
                                        : star === 0.5
                                            ? require('../assets/icons/staryellow.png')
                                            : require('../assets/icons/star.png')
                                    }
                                    style={styles.starIcon}
                                />
                            ))}
                        </View>

                        {/* 3 ảnh đánh giá */}
                        <View style={styles.reviewImagesContainer}>
                            <Image
                                source={require('../assets/images/image3.png')}
                                style={styles.reviewImage}
                            />
                            <Image
                                source={require('../assets/images/image3.png')}
                                style={styles.reviewImage}
                            />
                            <Image
                                source={require('../assets/images/image3.png')}
                                style={styles.reviewImage}
                            />
                        </View>

                        {/* Thông tin shop & người đánh giá */}
                        <View style={styles.shopContainer}>
                            <Text style={styles.shopUserText}>công vũ</Text>
                            <Text style={styles.divider}>|</Text>
                            <TouchableOpacity onPress={() => console.log('Xem shop')}>
                                <Text style={styles.shopLink}>xem shop</Text>
                            </TouchableOpacity>
                        </View>

                        {/* Mô tả sản phẩm */}
                        <View style={styles.sectionTitleContainer}>
                            <Text style={styles.sectionTitle}>Mô tả sản phẩm</Text>
                        </View>
                        <Text style={styles.productDescription}>
                            Sự im lặng của bầy cừu là một tiểu thuyết trinh thám kinh điển
                            kể về hành trình truy tìm tên sát nhân hàng loạt của nữ đặc vụ
                            Clarice Starling. Cuốn sách mang đến không khí căng thẳng, kịch
                            tính và những chi tiết ám ảnh. Đây là lựa chọn không thể bỏ qua
                            cho những ai đam mê thể loại trinh thám – kinh dị.
                        </Text>
                    </View>
            </ScrollView>


            <View style={styles.bottomBar}>
                <TouchableOpacity
                    style={[styles.bottomBarButton, styles.chatButton]}
                >
                    <Text style={styles.bottomBarButtonText}>Chat ngay</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.bottomBarButton, styles.addButton]}
                >
                    <Text style={styles.bottomBarButtonText}>Thêm vào giỏ hàng</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.bottomBarButton, styles.buyButton]}
                >
                    <Text style={styles.bottomBarButtonText}>
                        Mua ngay {productPrice.toLocaleString('vi-VN')} đ
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

function renderStars(rating: number) {
    const starsArray: number[] = [];
    let remaining = rating;
    for (let i = 0; i < 5; i++) {
        if (remaining >= 1) {
            starsArray.push(1); // sao đầy
            remaining -= 1;
        } else if (remaining >= 0.5) {
            starsArray.push(0.5); // nửa sao
            remaining -= 0.5;
        } else {
            starsArray.push(0); // sao rỗng
        }
    }
    return starsArray;
}

export default ProductDetailScreen;

const styles = StyleSheet.create({
    screen: {
        flex: 1,
        backgroundColor: '#fff',
    },
    appBar: {
        height: 56,
        backgroundColor: '#fff',
        justifyContent: 'center',
        paddingHorizontal: 16,
        borderBottomWidth: 0.5,
        borderBottomColor: '#ccc',
    },
    appBarTitle: {
        fontSize: 18,
        fontWeight: '600',
    },
    scrollContainer: {
        flex: 1,
    },
    productImage: {
        width: width,
        height: width * 1.2,
        borderWidth: 1,
        borderColor: '#000000',
    },
    infoContainer: {
        paddingHorizontal: 16,
        paddingTop: 16,
    },
    price: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#7f19b2',
        marginBottom: 8,
    },
    productName: {
        fontSize: 16,
        fontWeight: '600',
        color: '#333',
        marginBottom: 8,
    },
    sectionTitleContainer: {
        marginTop: 16,
        marginBottom: 8,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: '#333',
    },
    ratingContainer: {
        flexDirection: 'row',
        marginBottom: 8,
    },
    starIcon: {
        width: 20,
        height: 20,
        marginRight: 4,
    },
    reviewImagesContainer: {
        flexDirection: 'row',
        marginVertical: 8,
    },
    reviewImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
        marginRight: 8,
    },
    shopContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    shopUserText: {
        color: '#333',
        fontSize: 14,
        marginRight: 8,
    },
    divider: {
        marginHorizontal: 4,
        color: '#999',
    },
    shopLink: {
        color: '#7f19b2',
        fontSize: 14,
        fontWeight: '600',
    },
    productDescription: {
        fontSize: 14,
        color: '#444',
        lineHeight: 20,
        marginBottom: 16,
    },
    bottomBar: {
        flexDirection: 'row',
        borderTopWidth: 0.5,
        borderTopColor: '#ccc',
    },
    bottomBarButton: {
        flex: 1,
        paddingVertical: 16,
        justifyContent: 'center',
        alignItems: 'center',
        height: 30,
    },
    chatButton: {
        backgroundColor: '#6C9692',
    },
    addButton: {
        backgroundColor: '#6C9692',
    },
    buyButton: {
        backgroundColor: '#08B05C',
    },
    bottomBarButtonText: {
        fontSize: 12,
        fontWeight: '600',
        color: '#fff',
    },
});
