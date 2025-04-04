import {
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
    Linking
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppSelector } from '../redux/hooks';
import { getAccessToken } from '../redux/storageHelper';
import RenderShopSection from '../components/ItemThanhToan'; // Import RenderShopSection đã chỉnh sửa

const ManThanhToan = () => {
    const dataPTTT = [
        { id: 2, pttt: 'VNPay', icon: require('../assets/vnp.png'), bc: 'NCB' },
        { id: 3, pttt: 'VISA', icon: require('../assets/icon_visa.png'), bc: 'VISA' },
        { id: 4, pttt: 'MasterCard', icon: require('../assets/icon_mastercard.png'), bc: 'MasterCard' },
    ];

    const navigation = useNavigation();
    const route = useRoute();
    const { selectedProducts, book, quantity } = route.params || { selectedProducts: [] };
    const [selectedPTTT, setSelectedPTTT] = useState(null);
    const [tongtienShip, setTongTienShip] = useState(0);
    const [tongThanhToan, setTongThanhToan] = useState(0);
    const [tongTienHang, setTongTienHang] = useState(0);
    const user = useAppSelector(state => state.user.user);

    const products = book
        ? [{ ...book, so_luong_mua: quantity, id_sach: book.id_sach || book._id }]
        : selectedProducts;

    // Nhóm sản phẩm theo shop
    const groupProductsByShop = (products) => {
        const grouped = products.reduce((result, product) => {
            const shopId = product.book_info?.id_shop || product.id_shop;
            if (!result[shopId]) {
                result[shopId] = [];
            }
            result[shopId].push(product);
            return result;
        }, {});
        return Object.values(grouped);
    };

    const groupedShops = groupProductsByShop(products);

    const payload = {
        items: products.map(item => ({
            id_sach: item.id_sach,
            so_luong: item.so_luong_mua
        }))
    };

    useEffect(() => {
        if (products.length > 0) {
            fetchTotalPrice();
        }
    }, [products]);

    const fetchTotalPrice = async () => {
        const accessToken = await getAccessToken();
        try {
            const response = await fetch('http://14.225.206.60:3000/api/payments/calculate-total-amount', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                body: JSON.stringify(payload),
            });

            const data = await response.json();
            if (response.ok) {
                setTongTienShip(data.data.shipping_total);
                setTongThanhToan(data.data.total_amount);
                setTongTienHang(data.data.total_amount - data.data.shipping_total);
            } else {
                console.error('Lỗi khi tính toán tổng tiền:', data.message);
            }
        } catch (error) {
            console.error('Lỗi kết nối API:', error);
        }
    };

    const handleSelectPTTT = (id) => {
        setSelectedPTTT(id);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    const handlePayment = async () => {
        const accessToken = await getAccessToken();

        // Kiểm tra địa chỉ trước khi thanh toán
        if (!user.dia_chi || user.dia_chi.trim() === '') {
            Alert.alert('Thông báo', 'Vui lòng điền địa chỉ!');
            return;
        }

        if (!selectedPTTT) {
            Alert.alert('Thông báo', 'Vui lòng chọn phương thức thanh toán!');
            return;
        }

        const selectedItemPTTT = dataPTTT.find(item => item.id === selectedPTTT);
        if ([2, 3, 4].includes(selectedItemPTTT?.id)) {
            try {
                const response = await fetch('http://14.225.206.60:3000/api/payments/create-vnpay-payment', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({
                        amount: tongThanhToan,
                        bankCode: selectedItemPTTT.bc || "",
                        items: products.map(item => ({
                            id_sach: item.id_sach,
                            so_luong: item.so_luong_mua
                        }))
                    }),
                });

                const data = await response.json();
                if (data?.link_payment) {
                    Linking.openURL(data.link_payment).catch(() => {
                        Alert.alert('Lỗi', 'Không thể mở VNPay.');
                    });
                } else {
                    Alert.alert('Lỗi', 'Số lượng sách tồn kho không đủ để thanh toán');
                }
            } catch (error) {
                Alert.alert('Lỗi', 'Không thể tạo thanh toán.');
            }
        } else {
            Alert.alert('Thanh toán', 'Bạn đã chọn thanh toán khi nhận hàng.');
        }
    };

    const renderItemPTTT = ({ item }) => {
        const isSelected = item.id === selectedPTTT;
        return (
            <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: '#D9D9D9' }} onPress={() => handleSelectPTTT(item.id)}>
                <View style={{ padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={item.icon} />
                        <Text style={{ marginLeft: 15 }}>{item.pttt}</Text>
                    </View>
                    <TouchableOpacity style={[styles.checkbox, isSelected && styles.checked]} onPress={() => handleSelectPTTT(item.id)}>
                        {isSelected && <Image source={require('../assets/icon_tichtron.png')} />}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    const formatPhoneNumber = (phone) => {
        if (!phone) return '';
        const cleanedPhone = phone.replace(/\D/g, '');
        return cleanedPhone.startsWith('0') ? `(+84) ${cleanedPhone.slice(1)}` : `(+84) ${cleanedPhone}`;
    };

    const formatAddress = (address) => {
        if (!address) return '';
        const parts = address.split(', ');
        const street = parts[0];
        const rest = parts.slice(1).join(', ');
        return `${street},\n${rest}`;
    };

    return (
        <View style={styles.container}>
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ height: 20, width: 20, position: 'absolute', right: 100, top: 5 }} source={require('../assets/icon_back.png')} />
                </TouchableOpacity>
                <Text style={styles.title}>Thanh toán</Text>
            </View>

            <View style={styles.container2}>
                <TouchableOpacity style={styles.diachi} onPress={() => navigation.navigate('UpdateDiaChiScreen')}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../assets/icon_diachi.png')} />
                            <Text style={{ marginLeft: 10, fontWeight: 'bold' }}>{user.username}</Text>
                            <Text style={{ marginLeft: 20 }}>{formatPhoneNumber(user.sdt)}</Text>
                        </View>
                        <Text>{formatAddress(user.dia_chi)}</Text>
                    </View>
                    <Image source={require('../assets/icon_muitenphai.png')} />
                </TouchableOpacity>

                <FlatList
                    styles={{ width: '98%' }}
                    data={[{}]}
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={() => (
                        <View style={{ padding: 5 }}>
                            {/* Danh sách shop */}
                            <FlatList
                                data={groupedShops}
                                renderItem={({ item }) => <RenderShopSection items={item} />}
                                keyExtractor={(_, index) => index.toString()}
                                nestedScrollEnabled={true}
                                ListEmptyComponent={<Text style={{ textAlign: 'center' }}>Không có sản phẩm nào được thanh toán</Text>}
                            />

                            {/* Phương thức thanh toán */}
                            <View style={styles.phuongthuc}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Phương thức thanh toán</Text>
                                <FlatList
                                    data={dataPTTT}
                                    renderItem={renderItemPTTT}
                                    keyExtractor={(item) => item.id.toString()}
                                    nestedScrollEnabled={true}
                                />
                            </View>

                            {/* Tóm tắt thanh toán */}
                            <View style={styles.phuongthuc}>
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.tien}>Tổng tiền hàng</Text>
                                        <Text>{formatPrice(tongTienHang)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                                        <Text style={styles.tien}>Tổng tiền phí vận chuyển</Text>
                                        <Text>+ {formatPrice(tongtienShip)}</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                                        <Text style={styles.tien2}>Tổng thanh toán</Text>
                                        <Text style={styles.tien2}>{formatPrice(tongThanhToan)}</Text>
                                    </View>
                                </View>
                            </View>

                            <View style={{ padding: 10 }}>
                                <Text>Nhấn “Đặt hàng” đồng nghĩa với việc bạn đồng ý tuân theo điều khoản của chúng tôi</Text>
                            </View>
                        </View>
                    )}
                />

                <View style={styles.dathang}>
                    <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Tổng thanh toán </Text>
                        <Text style={{ color: '#5908B0', fontSize: 15, fontWeight: 'bold' }}>{formatPrice(tongThanhToan)}</Text>
                    </View>
                    <TouchableOpacity style={styles.btndathang} onPress={handlePayment}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Đặt hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ManThanhToan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container2: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        marginTop: 20,
        alignItems: 'center',
    },
    diachi: {
        marginTop: 10,
        width: '98%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    phuongthuc: {
        marginTop: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    checked: {
        borderColor: '#5908B0',
    },
    tien: {
        fontSize: 14,
    },
    tien2: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dathang: {
        height: 60,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    btndathang: {
        height: 40,
        width: 100,
        backgroundColor: '#5908B0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

