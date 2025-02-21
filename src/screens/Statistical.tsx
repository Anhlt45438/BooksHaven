import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React, {useState} from 'react'

const Statistical = ({ navigation }) => {

    const [selectedTime, setSelectedTime] = useState('Hôm nay');
    const [selectedButton, setSelectedButton] = useState('');

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image source={require('../assets/icons/Vector.png')} style={styles.icon} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Hiểu quả bán hàng</Text>
                </View>   
                <View style={styles.separator}></View>
            </View>
            <View style={styles.ratingContainer}>
                <Text style={styles.ratingText}>Hiệu quả bán hàng của shop</Text>
                <Text style={styles.ratingScore}>0.0/5.0</Text>
                <View style={styles.row}>
                    <TouchableOpacity>
                        <Text style={styles.optionText}>Đánh giá Shop</Text>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Text style={styles.optionText}>Hiệu quả hoạt động</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <View style={styles.salesContainer}>
                <Text style={styles.salesText}>Doanh số</Text>
            </View>

            <View style={styles.timeSelector}>
                {['Hôm nay', 'Hôm qua', '7 ngày qua', '30 ngày qua'].map((time) => (
                    <TouchableOpacity
                        key={time}
                        style={[styles.timeButton, selectedTime === time && styles.selectedTimeButton]}
                        onPress={() => setSelectedTime(time)}
                    >
                        <Text style={styles.timeText}>{time}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <View style={styles.salesContainerr}>
                <Text style={styles.salesText}>Tổng quan</Text>
            </View>

            <View style={styles.summaryContainer}>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Đơn hàng</Text>
                    <Text style={styles.summaryNumber}>0</Text>
                </View>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Doanh số</Text>
                    <Text style={styles.summaryNumber}>0</Text>
                </View>
                <View style={styles.summaryBox}>
                    <Text style={styles.summaryTitle}>Doanh số trên mỗi đơn hàng</Text>
                    <Text style={styles.summaryNumber}>0</Text>
                </View>
            </View>

            <View style={styles.additionalInfoContainer}>
                <TouchableOpacity
                    onPress={() => setSelectedButton('sold')}
                >
                    <Text style={[styles.additionalInfoTitle, selectedButton === 'sold' && styles.selectedText]}>
                        Số lượng sản phẩm đã bán
                    </Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => setSelectedButton('view')}
                >
                    <Text style={[styles.additionalInfoTitle, selectedButton === 'view' && styles.selectedText]}>
                        Lượt xem trang
                    </Text>
                </TouchableOpacity>
            </View>

            <View style={styles.footer}>
                <Image source={require('../assets/icons/book.png')} style={styles.iconn}/>
                <Text style={styles.footerText}>Gần đây không có sản phẩm nào của bạn!</Text>
            </View>
        </View>
    )
}

export default Statistical

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f5f5',
        flexGrow: 1,
        padding: 10,
    },
    header: {
        padding: 10,
        alignItems: 'center',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: '100%',
    },
    icon: {
        width: 24,
        height: 24,
    },
    iconn: {
        width: 74,
        height: 74,
    },
    headerTitle: {
        fontSize: 27,
        fontWeight: 'bold',
        textAlign: 'center',
        flex: 1,
        right: 10,
    },
    separator: {
        borderBottomWidth: 3,
        borderBottomColor: '#ccc',
        width: '120%',
        marginVertical: 15,
    },
    ratingContainer: {
        padding: 15,
        backgroundColor: '#ffffff',
        borderRadius: 20,
        marginBottom: 12,
    },
    ratingText: {
        fontSize: 15,
        color: '#333',
        fontWeight: 'bold',
    },
    ratingScore: {
        fontSize: 14,
        color: '#888',
        marginVertical: 5,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    optionText: {
        fontSize: 14,
        color: '#007BFF',
    },
    timeSelector: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    timeButton: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderWidth: 2,
        borderColor: '#ddd',
        borderRadius: 15,
    },
    selectedTimeButton: {
        backgroundColor: '#FF5733',
    },
    timeText: {
        fontSize: 13,
        color: '#333',
    },
    summaryContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 15,
        marginBottom: 20,
    },
    summaryBox: {
        width: '30%',
        padding: 15,
        backgroundColor: '#ddd',
        borderRadius: 10,
        alignItems: 'center',
    },
    summaryTitle: {
        fontSize: 12,
        color: '#333',
        fontWeight: 'bold',
    },
    summaryNumber: {
        fontSize: 20,
        color: '#333',
    },
    additionalInfoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 130,
        marginBottom: 10,
    },
    additionalInfoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    additionalInfoTitle: {
        fontSize: 17,
        color: '#333',
    },
    selectedText: {
        color: '#FF5733',
    },
    footer: {
        alignItems: 'center',
        marginTop: 30,
    },
    footerText: {
        fontSize: 16,
        color: '#888',
    },
    salesContainer: {
        marginBottom: 10,
    },
    salesContainerr: {
        marginTop: 15,
    },
    salesText: {
        fontSize: 17,
        fontWeight: 'bold',
        color: '#333',
    },
})