import {Image, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions} from 'react-native';
import React, {useState} from 'react';
import {useNavigation, useRoute} from '@react-navigation/native';

const {height} = Dimensions.get('window');

const ManDanhGia = () => {
    const [selectedRating, setSelectedRating] = useState(0); // Lưu số sao được chọn
    const [noidungdanhgia, setNoidungdanhgia] = useState(''); // Lưu nội dung đánh giá
    const [isAnonymous, setIsAnonymous] = useState(false); // State cho checkbox ẩn danh

    const navigation = useNavigation();
    const route = useRoute();
    const {bookImage, bookName} = route.params; // Lấy params từ ProductDetailScreen

    const handleStarPress = (rating) => {
        setSelectedRating(rating);
    };

    const saorong = require('../assets/icon_saorong.png');
    const saovang = require('../assets/icon_saovang.png');

    return (
        <View style={styles.container}>
            <View style={{flexDirection: 'row', marginTop: 10}}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/back.png')}/>
                </TouchableOpacity>
                <Text style={{fontSize: 23, fontWeight: 'bold', textAlign: 'center', flex: 1}}>
                    Đánh giá sản phẩm
                </Text>
                <TouchableOpacity>
                    <Image
                        style={{height: 26, width: 26, marginTop: 5, justifyContent: 'center', alignItems: 'center'}}
                        source={require('../assets/icons/check.png')}
                    />
                </TouchableOpacity>
            </View>

            <View style={styles.container2}>
                <View style={{flexDirection: 'row', alignItems: 'center', width: '100%'}}>
                    <Image
                        style={{height: 120, width: 100, borderColor: 'black', borderWidth: 1}}
                        source={{uri: bookImage}} // Sử dụng bookImage từ params
                    />
                    <Text style={{ fontSize: 23, marginLeft: 20 }}>
                        Sách: {String(bookName)}
                    </Text>
                </View>

                <View style={{alignItems: 'center', justifyContent: 'center', marginTop: 20}}>
                    <Text style={{fontSize: 18, fontWeight: 'bold'}}>Mời bạn đánh giá</Text>
                    <View style={{flexDirection: 'row', marginTop: 5}}>
                        {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity key={star} onPress={() => handleStarPress(star)}>
                                <Image
                                    source={star <= selectedRating ? saovang : saorong}
                                    style={styles.star}
                                />
                            </TouchableOpacity>
                        ))}
                    </View>

                    <View style={{marginTop: 20, width: '100%'}}>
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

            {/*<View style={{ marginTop: 10, padding: 10 }}>*/}
            {/*    <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Đánh giá ẩn danh</Text>*/}
            {/*    <View style={{ flexDirection: 'row', marginTop: 5, justifyContent: 'space-between', alignItems: 'center' }}>*/}
            {/*        <Text style={{ fontSize: 15 }}>Tên tài khoản của bạn sẽ hiển thị như 0******1</Text>*/}
            {/*        <TouchableOpacity*/}
            {/*            style={styles.checkbox}*/}
            {/*            onPress={() => setIsAnonymous(!isAnonymous)}*/}
            {/*        >*/}
            {/*            {isAnonymous && <Image source={require('../assets/icon_tichtron.png')} />}*/}
            {/*        </TouchableOpacity>*/}
            {/*    </View>*/}
            {/*</View>*/}
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
        flex: 'auto',
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
    checkbox: {
        width: 27,
        height: 27,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
});