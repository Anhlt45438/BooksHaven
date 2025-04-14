import { Image, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { getAccessToken } from '../redux/storageHelper';

const RenderShopSection = ({ items }) => {
    const [shopName, setShopName] = useState('');
    const [tienShip, setTienShip] = useState(0);
    const [tongTienMoiSP, setTongTienMoiSP] = useState(0);

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
    };

    useEffect(() => {
        const fetchTotalPrice = async () => {
            const accessToken = await getAccessToken();
            const requestItems = items.map(item => ({
                id_sach: item.id_sach || item._id,
                so_luong: item.so_luong_mua || item.so_luong,
            }));

            try {
                const response = await fetch('http://14.225.206.60:3000/api/payments/calculate-total-amount', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ items: requestItems }),
                });

                const data = await response.json();
                if (response.ok) {
                    setTienShip(data?.data?.shipping_total || 0); // Phí ship chung cho shop
                    setTongTienMoiSP(data?.data?.total_amount || 0); // Tổng tiền tất cả sản phẩm trong shop
                } else {
                    console.error('Lỗi khi tính toán tổng tiền:', data.message);
                }
            } catch (error) {
                console.error('Lỗi kết nối API:', error);
            }
        };

        fetchTotalPrice();
    }, [items]);

    useEffect(() => {
        const fetchShopName = async () => {
            const accessToken = await getAccessToken();
            const shopId = items[0].book_info?.id_shop || items[0].id_shop;
            if (!shopId) return;

            try {
                const response = await fetch(`http://14.225.206.60:3000/api/shops/get-shop-info/${shopId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${accessToken}`,
                    },
                    body: JSON.stringify({ id_shop: shopId }),
                });

                const shop = await response.json();
                setShopName(shop.data?.ten_shop || 'Không xác định');
            } catch (error) {
                console.error('Lỗi khi lấy tên shop:', error);
                setShopName('Không xác định');
            }
        };

        fetchShopName();
    }, [items[0].book_info?.id_shop, items[0].id_shop]);

    return (
        <View style={styles.sp}>
            <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 10 }}>{shopName}</Text>
            {items.map((item, index) => {
                const bookInfo = item.book_info || item;
                const productName = bookInfo.ten_sach || 'Tên sách không xác định';
                const productPrice = bookInfo.gia || 0;
                const productImage = bookInfo.anh || '';
                const quantity = item.so_luong_mua || item.so_luong || 1;

                return (
                    <View
                        key={index}
                        style={{
                            flexDirection: 'row',
                            padding: 10,
                            borderColor: '#D9D9D9',
                            borderTopWidth: index === 0 ? 1 : 0,
                            borderBottomWidth: 1,
                        }}
                    >
                        <Image style={{ height: 80, width: 50 }} source={{ uri: productImage }} />
                        <View style={{ paddingLeft: 10, flex: 1 }}>
                            <Text style={{ fontSize: 16 }}>Sách: {productName}</Text>
                            <Text
                                style={{
                                    borderWidth: 1,
                                    borderColor: 'gray',
                                    width: 100,
                                    fontSize: 12,
                                    marginTop: 10,
                                    backgroundColor: '#D9D9D9',
                                }}
                            >
                                Trả hàng miễn phí
                            </Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                                    Giá: {formatPrice(productPrice)}
                                </Text>
                                <Text>Số lượng: {quantity}</Text>
                            </View>
                        </View>
                    </View>
                );
            })}
            <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 5 }}>
                <Text>Phí ship COD (mặc định):</Text>
                <Text>{formatPrice(tienShip)}</Text>
            </View>
            <View
                style={{ borderColor: 'gray', borderTopWidth: 1, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}
            >
                <Text>Tổng tiền</Text>
                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>{formatPrice(tongTienMoiSP)}</Text>
            </View>
        </View>
    );
};

export default RenderShopSection;

const styles = StyleSheet.create({
    sp: {
        marginTop: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
});