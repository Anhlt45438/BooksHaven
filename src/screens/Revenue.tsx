import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native';
import React, { useState } from 'react';

const Revenue = ({navigation}) => {

    const [status, setStatus] = useState('Chua thanh toan');

    const handleStatusChange = (newStatus) => {
        setStatus(newStatus);
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

                <Text style={styles.amount}>1 jack</Text>
            </View>

            <View style={styles.container22}>
                <Image source={require('../assets/icons/y.png')} style={styles.icon} />
                <Text style={styles.amountt}>Lịch sử giao dịch</Text>
            </View>
        </View>
    );
};

export default Revenue;

const styles = StyleSheet.create({
    container: {
        flex: 0,
    },
    header: {
        backgroundColor: '#fff',
        alignItems: 'center',
        padding: 20,
    },
    headerContent: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        height: '20%',
        marginTop: 5,
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
    statusContainer: {
        flexDirection: 'row',
    },
    statusButton: {
        margin: 10,
        padding: 10,
    },
    statusText: {
        fontSize: 22,
    },
    selectedStatus: {
        borderBottomWidth: 2,
        borderColor: '#FF4D00',
    },
    selectedText: {
        color: '#FF4D00',
    },
    amount: {
        marginTop: 15,
        fontSize: 40,
        color: '#FF4D00',
    },
    container22: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    icon: {
        marginTop: 200,
        width: 120,
        height: 120,
    },
    amountt: {
        fontSize: 19,
        color: '#989898',
    },
});
