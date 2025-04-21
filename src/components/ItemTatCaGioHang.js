import { Alert, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { useAppSelector } from '../redux/hooks';
import { getAccessToken } from '../redux/storageHelper';

const ItemTatCaGioHang = ({ item, isChecked, onCheckChange, onUpdateQuantity, onDeleteItem }) => {
    const [checked, setChecked] = useState(isChecked);
    const [localQuantity, setLocalQuantity] = useState(item.so_luong);
    const [bookData, setBookData] = useState(null);
    const [shopName, setShopName] = useState("");

    useEffect(() => {
        const fetchBookDetails = async () => {
            const accessToken = await getAccessToken();
            console.log('User Access Token:', accessToken);
            try {
                const response = await fetch(`http://14.225.206.60:3000/api/books/${item.id_sach}`);
                const data = await response.json();
                const updatedData = { ...data, data: { ...data.data, gia: parseInt(data.data?.gia, 10) || 0 } };
                setBookData(updatedData);

                // Kiểm tra nếu số lượng còn lại = 0 thì disable checkbox ngay lập tức
                if (updatedData.data.so_luong === 0) {
                    setChecked(false); // Bỏ chọn checkbox
                    setLocalQuantity(0); // Đặt số lượng về 0
                    onCheckChange(false, updatedData.data.gia, 0, item.id_sach); // Cập nhật lên component cha
                    onUpdateQuantity(item.id_sach, 0, updatedData.data.gia, false);
                }
            } catch (error) {
                console.error("Lỗi khi lấy thông tin sách:", error);
            }
        };

        if (item.id_sach) {
            fetchBookDetails();
        }
    }, [item.id_sach]);

    const xoaSanPham = async () => {
        console.log("ID CTGH để xóa:", item.id_ctgh);
        const accessToken = await getAccessToken();
        console.log("User token:", accessToken);

        try {
            const response = await fetch(`http://14.225.206.60:3000/api/cart/remove/${item.id_ctgh}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
            });
            const responseData = await response.json();
            console.log("Response từ API:", responseData);

            if (response.ok) {
                console.log('Xóa sản phẩm thành công');
                onDeleteItem(item.id_ctgh);
                
                if (checked) {
                    onUpdateQuantity(item.id_sach, 0, bookData?.data?.gia, checked);
                    onCheckChange(false, bookData?.data?.gia, 0, item.id_sach);
                }
            } else {
                console.error('Xóa sản phẩm thất bại');
            }
        } catch (error) {
            console.error('Lỗi khi xóa sản phẩm:', error);
        }
    };

    useEffect(() => {
        const fetchShopName = async () => {
            try {
                const response = await fetch(`http://14.225.206.60:3000/api/shops/get-shop-info/${item.book_info.id_shop}`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({ id_shop: item.book_info.id_shop }),
                });

                const shop = await response.json();
                setShopName(shop.data.ten_shop);
            } catch (error) {
                console.error("Lỗi khi lấy tên shop:", error);
                setShopName("Không xác định");
            }
        };

        fetchShopName();
    }, [item.book_info.id_shop]);

    useEffect(() => {
        setChecked(isChecked);
    }, [isChecked]);

    const toggleCheckbox = () => {
        // Chỉ cho phép toggle nếu số lượng > 0 và số lượng còn lại > 0
        if (localQuantity > 0 && bookData?.data?.so_luong > 0) {
            const newChecked = !checked;
            setChecked(newChecked);
            onCheckChange(newChecked, bookData?.data?.gia, localQuantity, item.id_sach);
        }
    };

    const tangSoLuong = () => {
        const newQuantity = localQuantity + 1;
        if (bookData?.data?.so_luong !== undefined && newQuantity > bookData.data.so_luong) {
            Alert.alert(`Số lượng sách trong kho chỉ còn ${bookData.data.so_luong} cuốn!`);
        } else {
            setLocalQuantity(newQuantity);
            onUpdateQuantity(item.id_sach, newQuantity, bookData?.data?.gia, checked);
        }
    };

    const giamSoLuong = () => {
        if (localQuantity > 1) {
            const newQuantity = localQuantity - 1;
            setLocalQuantity(newQuantity);
            onUpdateQuantity(item.id_sach, newQuantity, bookData?.data?.gia, checked);
        } else if (localQuantity === 1) {
            // Khi giảm từ 1 về 0, tự động bỏ chọn checkbox
            setLocalQuantity(0);
            setChecked(false);
            onUpdateQuantity(item.id_sach, 0, bookData?.data?.gia, checked);
            onCheckChange(false, bookData?.data?.gia, 0, item.id_sach);
        }
    };

    return (
        <View style={styles.container}>
            <View style={styles.it}>
                <View style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', marginLeft: 10 }}>
                    <Image style={{ height: 120, width: 75, padding: 10 }} source={{ uri: bookData?.data?.anh }} />

                    <View style={{ flexDirection: 'row', paddingTop: 10, alignItems: 'center', justifyContent: 'space-between' }}>
                        <View style={{ flexDirection: 'column', width: '63%', marginLeft: 10 }}>
                            <Text style={{ fontWeight: 'bold' }}>{bookData?.data?.ten_sach} ({bookData?.data?.kich_thuoc})</Text>
                            <Text>Shop: {shopName}</Text>
                            <Text style={{ paddingTop: 3, marginTop: 5, fontWeight: 'bold' }}>
                                Giá: {bookData?.data?.gia?.toLocaleString('vi-VN')}đ
                            </Text>
                            <Text style={{ marginTop: 5 }}>Còn: {bookData?.data?.so_luong} sách có sẵn</Text>

                            <View style={{ flexDirection: 'row', marginTop: 5, alignItems: 'center' }}>
                                <TouchableOpacity onPress={giamSoLuong}>
                                    <Image style={{ height: 20, width: 20 }} source={require('../assets/icon_tru.png')} />
                                </TouchableOpacity>

                                <Text style={{ marginLeft: 15, fontSize: 18, color: 'black', fontWeight: 'bold', padding: 5, borderRadius: 10 }}>
                                    {localQuantity}
                                </Text>

                                <TouchableOpacity style={{ paddingLeft: 15 }} onPress={tangSoLuong}>
                                    <Image style={{ height: 20, width: 20 }} source={require('../assets/icon_cong.png')} />
                                </TouchableOpacity>
                                <TouchableOpacity style={{ paddingLeft: 15 }} onPress={xoaSanPham}>
                                    <Image style={{ height: 20, width: 20 }} source={require('../assets/thungrac.png')} />
                                </TouchableOpacity>
                            </View>
                        </View>

                        <TouchableOpacity
                            onPress={toggleCheckbox}
                            style={[styles.checkboxContainer, (localQuantity === 0 || bookData?.data?.so_luong === 0) && styles.disabledCheckboxContainer]}
                            disabled={localQuantity === 0 || bookData?.data?.so_luong === 0} // Disable nếu số lượng = 0 hoặc tồn kho = 0
                        >
                            <View style={[styles.checkbox, checked && styles.checked, (localQuantity === 0 || bookData?.data?.so_luong === 0) && styles.disabledCheckbox]}>
                                {checked && <Image style={{ height: 24, width: 24 }} source={require('../assets/dautich2.png')} />}
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    );
};

export default ItemTatCaGioHang;

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 10,
    },
    it: {
        height: 'auto',
        width: '98%',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#EBEBF1',
        paddingBottom: 5,
        borderTopRightRadius: 20,
        borderBottomRightRadius: 20,
    },
    checkboxContainer: {
        marginRight: 20,
        alignItems: 'center',
    },
    disabledCheckboxContainer: {
        opacity: 0.5, // Làm mờ khi bị disable
    },
    checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#333',
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 10,
        borderRadius: 5,
    },
    checked: {
        backgroundColor: '#4CAF50',
        borderColor: '#4CAF50',
    },
    disabledCheckbox: {
        borderColor: '#999', // Đổi màu viền khi bị disable
        backgroundColor: '#ccc', // Màu nền xám khi bị disable
    },
});