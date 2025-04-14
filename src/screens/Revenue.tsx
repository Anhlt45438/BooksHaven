import { StyleSheet, Text, View, TouchableOpacity, Image, FlatList, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import DateTimePicker from '@react-native-community/datetimepicker';

const Revenue = ({ navigation }) => {

    const [orders, setOrders] = useState([]); // Lưu trữ danh sách đơn hàng
    const [loading, setLoading] = useState(false); // Quản lý trạng thái loading (đang tải dữ liệu)
    const [status, setStatus] = useState('Chua thanh toan'); // Lưu trữ trạng thái thanh toán (Chưa thanh toán/Đã thanh toán)
    const [totalAmount, setTotalAmount] = useState(0); // State để lưu tổng tiền
    const { user } = useSelector(state => state.user); // Lấy thông tin người dùng từ Redux

    // Thêm state cho ngày bắt đầu và kết thúc
    const [startDate, setStartDate] = useState(new Date());
    const [endDate, setEndDate] = useState(new Date());
    const [showStartPicker, setShowStartPicker] = useState(false);
    const [showEndPicker, setShowEndPicker] = useState(false);

    // Hàm lấy đơn hàng dựa trên trạng thái thanh toán
    const fetchOrders = async (isPaid, startDateFormatted = '', endDateFormatted = '') => {
        if (!user || !user.accessToken) {
            console.log("Token không hợp lệ");
            return;
        }

        setLoading(true);
        try {
            let url = `http://14.225.206.60:3000/api/orders/payment-status-shop?is_paid=${isPaid}&page=1&limit=20`;

            // Nếu có start_date và end_date, thêm vào URL
            if (startDateFormatted && endDateFormatted) {
                url += `&start_date=${startDateFormatted}&end_date=${endDateFormatted}`;
            }
            const response = await fetch(url, {
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
        fetchOrders(isPaid); // Lấy đơn hàng dựa trên trạng thái thanh toán đã chọn và khoảng thời gian
    };

    useEffect(() => {
        fetchOrders(false); // Lấy đơn hàng khi bắt đầu tải trang
    }, [user]);

    const filterOrdersByDate = () => {
        const startDateFormatted = startDate.toISOString().split('T')[0];
        const endDateFormatted = endDate.toISOString().split('T')[0];
        const isPaid = status === 'Da thanh toan';
        fetchOrders(isPaid, startDateFormatted, endDateFormatted); // Lọc đơn hàng theo ngày
    };

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

            {/* Phần chọn khoảng thời gian */}
            <View style={styles.dateContainer}>
                <TouchableOpacity
                    style={[styles.dateButton, styles.dateButtonLeft]}
                    onPress={() => setShowStartPicker(true)}
                >
                    <Text style={styles.dateText}>Từ: {startDate ? startDate.toLocaleDateString() : 'Chọn ngày'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.dateButton, styles.dateButtonRight]}
                    onPress={() => setShowEndPicker(true)}
                >
                    <Text style={styles.dateText}>Đến: {endDate ? endDate.toLocaleDateString() : 'Chọn ngày'}</Text>
                </TouchableOpacity>

                {/* Nút tìm */}
                <TouchableOpacity style={styles.findButton} onPress={filterOrdersByDate}>
                    <Text style={styles.findButtonText}>Tìm</Text>
                </TouchableOpacity>
            </View>

            {showStartPicker && (
                <DateTimePicker
                    value={startDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowStartPicker(false);
                        if (selectedDate) {
                            setStartDate(selectedDate);
                        }
                    }}
                />
            )}
            {showEndPicker && (
                <DateTimePicker
                    value={endDate || new Date()}
                    mode="date"
                    display="default"
                    onChange={(event, selectedDate) => {
                        setShowEndPicker(false);
                        if (selectedDate) {
                            setEndDate(selectedDate);
                        }
                    }}
                />
            )}

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
    dateContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 15, 
        paddingVertical: 10, 
        backgroundColor: '#fff', 
    },
    dateButton: {
        flex: 1, 
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginRight: 10, 
        justifyContent: 'center',
        alignItems: 'center',
    },
    dateButtonLeft: {
        marginRight: 5, 
    },
    dateButtonRight: {
        marginLeft: 5, 
    },
    dateText: {
        fontSize: 16,
        color: '#000',
    },
    findButton: {
        backgroundColor: '#FF4D00',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 5,
        alignSelf: 'center', 
        marginLeft: 10, 
    },
    findButtonText: {
        color: '#fff',
        fontSize: 16,
    },
});
