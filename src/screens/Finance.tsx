import { StyleSheet, Text, View, TouchableOpacity, Image, Alert, ActivityIndicator } from 'react-native';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { getAccessToken } from '../redux/storageHelper';

const Finance = ({ navigation }) => {
    const { user } = useSelector(state => state.user);
    const { shop } = useSelector(state => state.shop);

    const [balance, setBalance] = useState(0);
    const [loading, setLoading] = useState(true);

    const fetchBalance = async () => {
         const accessToken = await getAccessToken();
            if (!accessToken) return;
        if (!shop || !user || !accessToken) {
            Alert.alert('Lỗi', 'Không có thông tin shop hoặc token người dùng.');
            return;
        }

        try {
            const response = await fetch(`http://14.225.206.60:3000/api/shops/get-shop-info-from-user-id/${user._id}`, {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'Content-Type': 'application/json',
                },
            });
            const data = await response.json();
            console.log(data);
            if (data?.data?.tong_tien) {
                const formattedBalance = new Intl.NumberFormat().format(data.data.tong_tien);
                setBalance(formattedBalance);
            } 
        } catch (error) {
            console.error(error);
            Alert.alert('Lỗi', 'Không thể tải dữ liệu sản phẩm từ API.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBalance();
    }, [user, shop]);

    if (loading) {
        return (
            <View style={styles.loaderContainer}>
                <ActivityIndicator size="large" color="#4CAF50" />
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Tài chính</Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.cardContainer}>
                    <Text style={styles.balanceText}>Tổng số dư</Text>
                    <View style={styles.rowContainer}>
                        <Text style={styles.balanceAmount}>{balance} VND</Text>
                        <TouchableOpacity 
                            style={styles.withdrawButton} 
                            onPress={() => navigation.navigate("Ruttien1")}
                        >
                            <Text style={styles.buttonText}>Rút tiền</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.revenueContainer}>
                        <Image source={require('../assets/icons/vi.png')} style={styles.iconn} />
                        <TouchableOpacity onPress={() => navigation.navigate('Revenue')}>
                            <Text style={styles.revenueText}>Doanh thu đơn hàng</Text>
                        </TouchableOpacity>
                    </View>
                    {/* Nút Lịch sử được thêm vào đây */}
                    <TouchableOpacity 
                        style={styles.historyButton} 
                        onPress={() => navigation.replace('LichsuruttienShop')}
                    >
                        <Text style={styles.buttonText}>Lịch sử rút tiền</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default Finance;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
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
        right: 10,
    },
    iconn: {
        width: 24,
        height: 24,
    },
    body: {
        flex: 1,
        backgroundColor: '#F1EFF1',
        alignItems: 'center',
    },
    cardContainer: {
        backgroundColor: '#fff',
        borderRadius: 25,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 5,
        marginTop: 20,
        width: '95%',
    },
    balanceText: {
        fontSize: 18,
        color: '#000',
    },
    balanceAmount: {
        fontSize: 26,
        fontWeight: 'bold',
        color: '#E00000',
    },
    rowContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 10,
    },
    revenueContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        alignItems: 'center',
    },
    revenueText: {
        fontSize: 17,
        color: '#000',
        marginRight: 160,
    },
    withdrawButton: {
        backgroundColor: '#FF7A00',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    historyButton: {
        backgroundColor: '#4CAF50', // Màu xanh lá để phân biệt với nút Rút tiền
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 10,
        alignItems: 'center',
        marginTop: 20, // Khoảng cách với phần trên
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    loaderContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});