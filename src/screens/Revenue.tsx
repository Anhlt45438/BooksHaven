import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';

const Revenue = ({ navigation }) => {

    const [orders, setOrders] = useState([]); // Lưu trữ danh sách đơn hàng
    const [loading, setLoading] = useState(false); // Quản lý trạng thái loading (đang tải dữ liệu)
    const [status, setStatus] = useState('Chua thanh toan'); // Lưu trữ trạng thái thanh toán (Chưa thanh toán/Đã thanh toán)
    const [totalAmount, setTotalAmount] = useState(0); // State để lưu tổng tiền
    const { user } = useSelector(state => state.user); // Lấy thông tin người dùng từ Redux

    // Hàm lấy đơn hàng dựa trên trạng thái thanh toán
    const fetchOrders = async (isPaid) => {
        if (!user || !user.accessToken) {
            console.log("Token không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`http://14.225.206.60:3000/api/orders/payment-status-shop?is_paid=${isPaid}&page=1&limit=20`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${user.accessToken}`, // Thêm token xác thực vào đây
                    'Content-Type': 'application/json',  // Đảm bảo loại nội dung là JSON
                }
            });
            const data = await response.json();
            console.log(data);
            setOrders(data.data || []); // Giả sử phản hồi chứa danh sách đơn hàng trong 'orders'

            // Tính tổng tiền từ các đơn hàng
            const total = data.data.reduce((acc, order) => acc + order.tong_tien, 0);
            setTotalAmount(total); // Cập nhật tổng tiền vào state

        } catch (error) {
            console.error('Lỗi khi lấy đơn hàng:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
        const isPaid = newStatus === 'Da thanh toan';
        fetchOrders(isPaid); // Lấy đơn hàng dựa trên trạng thái thanh toán đã chọn
    };

    useEffect(() => {
        fetchOrders(false);
    }, [user]);

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Doanh thu</Text>
                </View>

                <View style={styles.statusContainer}>
                    <TouchableOpacity
                        style={[styles.statusButton, status === 'Chua thanh toan' && styles.selectedStatus]}
                        onPress={() => handleStatusChange('Chua thanh toan')}
                    >
                        <Text style={[styles.statusText, status === 'Chua thanh toan' && styles.selectedText]}>Chưa thanh toán</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.statusButton, status === 'Da thanh toan' && styles.selectedStatus]}
                        onPress={() => handleStatusChange('Da thanh toan')}
                    >
                        <Text style={[styles.statusText, status === 'Da thanh toan' && styles.selectedText]}>Đã thanh toán</Text>
                    </TouchableOpacity>
                </View>

                <Text style={styles.amount}>{totalAmount ? String(totalAmount.toLocaleString()) : '0'} VND</Text>
            </View> 

            {loading ? (
                <ActivityIndicator size="large" color="#FF4D00" />
            ) : (
                <FlatList
                    data={orders}
                    keyExtractor={(item) => item._id}  // Sử dụng _id hoặc id_don_hang làm key
                    renderItem={({ item }) => {
                        // Lấy thông tin chi tiết từ chi_tiet_don_hang
                        const orderDetail = item.chi_tiet_don_hang && item.chi_tiet_don_hang[0];
                        return (
                            <View style={styles.orderItem}>
                                <Text style={styles.orderText}>Ngày mua: {new Date(item.ngay_mua).toLocaleDateString()}</Text>
                                <Text style={[styles.orderText, item.trang_thai === 'chưa thanh toán' && styles.pendingStatus, item.trang_thai === 'da thanh toan' && styles.paidStatus]}>
                                    Trạng thái: {item.trang_thai}
                                </Text>
                                <Text style={styles.orderText}>Tổng tiền: {item.tong_tien.toLocaleString()} VND</Text>

                                {orderDetail && orderDetail.don_hang ? (
                                    <Text style={styles.orderText}>Số lượng: {orderDetail.don_hang.so_luong}</Text>
                                ) : (
                                    <Text style={styles.noProduct}>Không có sản phẩm nào.</Text>
                                )}

                                {orderDetail && orderDetail.sach ? (
                                    <View style={styles.productDetails}>
                                        <Text>Tên sách: {orderDetail.sach.ten_sach}</Text>
                                        <Text>Tác giả: {orderDetail.sach.tac_gia}</Text>
                                        <Text>Giá: {orderDetail.sach.gia} VND</Text>
                                    </View>
                                ) : (
                                    <Text style={styles.noProduct}>Không có sản phẩm nào.</Text>
                                )}
                            </View>
                        );
                    }}
                />
            )}
        </View>
    );
};

export default Revenue;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#fff',
        paddingHorizontal: 20,
        paddingVertical: 10,
        alignItems: 'center',
    },
    headerContent: {
        top: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    title: {
        fontSize: 24,
        flex: 1,
        fontWeight: 'bold',
        textAlign: 'center',
        right: 10,
    },
    iconn: {
        width: 24,
        height: 24,
    },
    statusContainer: {
        flexDirection: 'row',
        marginTop: 10,
    },
    statusButton: {
        margin: 5,
        padding: 10,
    },
    statusText: {
        fontSize: 18,
    },
    selectedStatus: {
        borderBottomWidth: 2,
        borderColor: '#FF4D00',
    },
    selectedText: {
        color: '#FF4D00',
    },
    amount: {
        marginTop: 20,
        fontSize: 40,
        color: '#FF4D00',
    },
    orderItem: {
        padding: 15,
        marginVertical: 5,
        backgroundColor: '#f9f9f9',
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        marginHorizontal: 10,
    },
    orderText: {
        fontSize: 16,
        marginBottom: 5,
    },
    pendingStatus: {
        color: 'red',
    },
    paidStatus: {
        color: 'green',
    },
    productDetails: {
        marginTop: 10,
        paddingLeft: 10,
        borderLeftWidth: 2,
        borderColor: '#FF4D00',
    },
    noProduct: {
        color: 'gray',
        marginTop: 5,
    },
});
