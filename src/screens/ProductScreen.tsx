import React, { useState } from 'react';
import { View, Text, FlatList, Image, StyleSheet, ScrollView, TouchableOpacity, Modal, Alert } from 'react-native';

const initialProductsData = [
    {
        id: '1',
        ten_sach: 'Sách Lập Trình React Native',
        tac_gia: 'Nguyễn Văn A',
        mo_ta: 'Một cuốn sách học React Native từ cơ bản đến nâng cao.',
        gia: '200,000 VND',
        so_luong: '50',
        anh: require('../assets/image/logo.png'), // Thay bằng hình ảnh thực tế của bạn
        trang_thai: 'Còn hàng',
        so_trang: '300',
        kich_thuoc: '15 x 22 cm',
        loai_sach: 'Khoa học',
    },
    {
        id: '2',
        ten_sach: 'Sách Lịch Sử Việt Nam',
        tac_gia: 'Trần Văn B',
        mo_ta: 'Cuốn sách nói về lịch sử Việt Nam qua các thời kỳ.',
        gia: '150,000 VND',
        so_luong: '30',
        anh: require('../assets/image/logo.png'), // Thay bằng hình ảnh thực tế của bạn
        trang_thai: 'Hết hàng',
        so_trang: '250',
        kich_thuoc: '16 x 23 cm',
        loai_sach: 'Lịch sử',
    },
    {
        id: '3',
        ten_sach: 'Tiểu Thuyết Kinh Dị',
        tac_gia: 'Phạm Minh C',
        mo_ta: 'Tiểu thuyết kinh dị đầy kịch tính và bất ngờ.',
        gia: '100,000 VND',
        so_luong: '100',
        anh: require('../assets/image/logo.png'), // Thay bằng hình ảnh thực tế của bạn
        trang_thai: 'Còn hàng',
        so_trang: '350',
        kich_thuoc: '14 x 21 cm',
        loai_sach: 'Tiểu thuyết',
    },
    {
        id: '4',
        ten_sach: 'Sách Giáo Khoa Toán 10',
        tac_gia: 'Lê Thị D',
        mo_ta: 'Cuốn sách giáo khoa môn toán lớp 10.',
        gia: '120,000 VND',
        so_luong: '200',
        anh: require('../assets/image/logo.png'),
        trang_thai: 'Còn hàng',
        so_trang: '250',
        kich_thuoc: '15 x 21 cm',
        loai_sach: 'Sách giáo khoa',
    },
    {
        id: '5',
        ten_sach: 'Truyện Tranh Marvel',
        tac_gia: 'John Doe',
        mo_ta: 'Truyện tranh Marvel cực kỳ hấp dẫn và độc đáo.',
        gia: '80,000 VND',
        so_luong: '150',
        anh: require('../assets/image/logo.png'),
        trang_thai: 'Còn hàng',
        so_trang: '120',
        kich_thuoc: '18 x 26 cm',
        loai_sach: 'Truyện tranh',
    },
    {
        id: '7',
        ten_sach: 'Kinh Tế Vĩ Mô',
        tac_gia: 'Nguyễn Thanh F',
        mo_ta: 'Cuốn sách về nền kinh tế vĩ mô và các lý thuyết.',
        gia: '250,000 VND',
        so_luong: '90',
        anh: require('../assets/image/logo.png'),
        trang_thai: 'Còn hàng',
        so_trang: '450',
        kich_thuoc: '18 x 25 cm',
        loai_sach: 'Kinh tế',
    },
    {
        id: '8',
        ten_sach: 'Tâm Lý Học Cơ Bản',
        tac_gia: 'Trương Minh G',
        mo_ta: 'Sách giới thiệu về các khái niệm cơ bản trong tâm lý học.',
        gia: '110,000 VND',
        so_luong: '60',
        anh: require('../assets/image/logo.png'),
        trang_thai: 'Còn hàng',
        so_trang: '220',
        kich_thuoc: '15 x 22 cm',
        loai_sach: 'Tâm lý học',
    },
];

const ProductScreen = ({ navigation }) => {
    const [products, setProducts] = useState(initialProductsData);
    const [modalVisible, setModalVisible] = useState(false);
    const [confirmationVisible, setConfirmationVisible] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [actionType, setActionType] = useState(null);

    const renderItem = ({ item }) => (
        <View style={styles.productItem}>
            <Image source={item.anh} style={styles.productImage} />
            <View style={styles.productDetails}>
                <Text style={styles.productTitle}>{item.ten_sach}</Text>
                <Text style={styles.productPrice}>Giá: {item.gia}</Text>
                <Text style={styles.productStock}>Số lượng: {item.so_luong}</Text>
            </View>

            <TouchableOpacity
                style={styles.viewDetailsButton}
                onPress={() => {
                    setSelectedProduct(item);
                    setModalVisible(true);
                }}
            >
                <Text style={styles.viewDetailsText}>Xem chi tiết</Text>
            </TouchableOpacity>
        </View>
    );

    const handleAction = (action) => {
        setActionType(action);
        setConfirmationVisible(true);
    };

    const confirmAction = () => {
        if (actionType === 'delete') {
            const updatedProducts = products.filter(product => product.id !== selectedProduct.id);
            setProducts(updatedProducts); // Cập nhật lại state với danh sách sản phẩm đã xóa
            Alert.alert("Thông báo", "Xóa sản phẩm thành công!", [{ text: "OK" }]);
        } else if (actionType === 'edit') {
            console.log("Sửa sản phẩm:", selectedProduct.ten_sach);
        }
        setConfirmationVisible(false);
        setModalVisible(false);
    };

    return (
        <View style={styles.container}>

            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => { console.log('Vector icon clicked'); }}>
                        <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Sản Phẩm của Tôi</Text>
                    <View style={styles.iconContainer}>
                        <TouchableOpacity onPress={() => { console.log('Search icon clicked'); }}>
                            <Image source={require('../assets/icons/search.png')} style={styles.icon} />
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => { console.log('Message icon clicked'); }}>
                            <Image source={require('../assets/icons/mess.png')} style={styles.icon} />
                        </TouchableOpacity>
                    </View>
                </View>

                <View style={styles.separator}></View>

                <View style={styles.tabContainer}>
                    <View style={styles.tabItem}>
                        <TouchableOpacity>
                            <Text style={styles.tab}>Còn hàng</Text>
                        </TouchableOpacity>
                        <Text style={styles.count}>(0)</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <TouchableOpacity>
                            <Text style={styles.tab}>Hết hàng</Text>
                        </TouchableOpacity>
                        <Text style={styles.count}>(0)</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <TouchableOpacity>
                            <Text style={styles.tab}>Chờ duyệt</Text>
                        </TouchableOpacity>
                        <Text style={styles.count}>(0)</Text>
                    </View>
                    <View style={styles.tabItem}>
                        <TouchableOpacity>
                            <Text style={styles.tab}>Đã ấn</Text>
                        </TouchableOpacity>
                        <Text style={styles.count}>(0)</Text>
                    </View>
                </View>

                <View style={styles.separatorr}></View>

            </View>

            <FlatList
                data={products}
                renderItem={renderItem}
                keyExtractor={(item) => item.id}
                contentContainerStyle={styles.productList}
            />

            <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('AddProduct')}>
                <Text style={styles.addButtonText}>Thêm sản phẩm mới</Text>
            </TouchableOpacity>

            {selectedProduct && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    onRequestClose={() => setModalVisible(false)}
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Chi tiết sản phẩm</Text>
                            <Image source={selectedProduct.anh} style={styles.modalImage} />
                            <Text style={styles.modalText}>Tên sản phẩm: {selectedProduct.ten_sach}</Text>
                            <Text style={styles.modalText}>Tác giả: {selectedProduct.tac_gia}</Text>
                            <Text style={styles.modalText}>Mô tả: {selectedProduct.mo_ta}</Text>
                            <Text style={styles.modalText}>Loại sách: {selectedProduct.loai_sach}</Text>
                            <Text style={styles.modalText}>Giá: {selectedProduct.gia}</Text>
                            <Text style={styles.modalText}>Số lượng: {selectedProduct.so_luong}</Text>
                            <Text style={styles.modalText}>Trạng thái: {selectedProduct.trang_thai}</Text>
                            <Text style={styles.modalText}>Số trang: {selectedProduct.so_trang}</Text>
                            <Text style={styles.modalText}>Kích thước: {selectedProduct.kich_thuoc}</Text>

                            <View style={styles.actionButtons}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleAction('edit')}
                                >
                                    <Text style={styles.buttonText}>Sửa</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => handleAction('delete')}
                                >
                                    <Text style={styles.buttonText}>Xóa</Text>
                                </TouchableOpacity>
                            </View>

                            <TouchableOpacity
                                style={styles.closeButton}
                                onPress={() => setModalVisible(false)}
                            >
                                <Text style={styles.buttonText}>Đóng</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}
            {/* Modal xác nhận xóa hoặc sửa */}
            {confirmationVisible && (
                <Modal
                    visible={confirmationVisible}
                    animationType="slide"
                    onRequestClose={() => setConfirmationVisible(false)}
                    transparent={true}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>Xác nhận</Text>
                            <Text style={styles.modalText}>
                                Bạn có chắc chắn muốn {actionType === 'delete' ? 'xóa' : 'sửa'} sản phẩm này?
                            </Text>
                            <View style={styles.confirmButtons}>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={confirmAction}
                                >
                                    <Text style={styles.buttonText}>Có</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={styles.button}
                                    onPress={() => setConfirmationVisible(false)}
                                >
                                    <Text style={styles.buttonText}>Không</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        padding: 20,
        flexGrow: 1,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        textAlign: 'center',
        left: 14,
    },
    iconContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    icon: {
        width: 24,
        height: 24,
        marginLeft: 10,
    },
    iconn: {
        width: 24,
        height: 24,
    },
    tabContainer: {
        flexDirection: 'row',
        marginTop: 5,
        width: '100%',
        justifyContent: 'space-between'
    },
    tabItem: {
        alignItems: 'center',
    },
    tab: {
        fontSize: 18,
    },
    count: {
        fontSize: 18,
        color: '#000',
    },
    buttonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    addButton: {
        backgroundColor: '#4CAF50',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20,
        position: 'absolute',
        bottom: 15,
        left: 20,
        right: 20,
    },
    addButtonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
    separator: {
        borderBottomWidth: 3,
        borderBottomColor: '#ccc',
        width: '120%',
        marginVertical: 15,
    },
    separatorr: {
        borderBottomWidth: 1,
        borderBottomColor: '#ccc',
        width: '120%',
        marginTop: 30,
    },
    productItem: {
        flexDirection: 'row',
        marginBottom: 10,
        padding: 10,
        borderBottomWidth: 2,
        borderBottomColor: '#ddd',
        justifyContent: 'space-between',
    },
    productImage: {
        width: 80,
        height: 80,
        marginRight: 20,
    },
    productDetails: {
        flex: 1,
    },
    productTitle: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    productPrice: {
        fontSize: 16,
        marginTop: 5,
    },
    productStock: {
        fontSize: 16,
        marginTop: 5,
    },
    productList: {
        marginTop: 0,
    },
    viewDetailsButton: {
        marginTop: 70,
    },
    viewDetailsText: {
        color: '#000',
        fontSize: 16,
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContent: {
        backgroundColor: '#fff',
        padding: 20,
        borderRadius: 10,
        width: '80%',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
        textAlign: 'center',
    },
    modalText: {
        fontSize: 16,
        marginBottom: 10,
    },
    modalImage: {
        width: 150,
        height: 150,
        marginBottom: 10,
        resizeMode: 'contain',
    },
    closeButton: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
    },
    button: {
        backgroundColor: '#4CAF50',
        padding: 10,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 10,
        width: '45%',
    },
    actionButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginVertical: 15,
    },
    confirmButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
});

export default ProductScreen;