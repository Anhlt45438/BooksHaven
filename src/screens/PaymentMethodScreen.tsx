import React from 'react';
import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    SafeAreaView,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';

const PaymentMethodScreen = () => {
    const navigation = useNavigation();

    // Hàm xử lý khi nhấn "Thêm thẻ mới"
    const handleAddCard = () => {
        console.log('Thêm thẻ mới');
    };

    // Hàm xử lý khi nhấn "Thêm tài khoản ngân hàng"
    const handleAddBankAccount = () => {
        console.log('Thêm tài khoản ngân hàng');
    };

    return (
        <SafeAreaView style={styles.container}>
            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image
                        source={require('../assets/image/back.png')} // Đảm bảo bạn có icon này trong thư mục assets
                        style={styles.backIcon}
                    />
                </TouchableOpacity>
                <Text style={styles.headerText}>Phương thức thanh toán</Text>
            </View>

            {/* Nội dung */}
            <View style={styles.content}>
                {/* Phần Thẻ Tín dụng/Ghi nợ */}
                <Text style={styles.sectionTitle}>Thẻ Tín dụng/Ghi nợ</Text>
                <TouchableOpacity style={styles.optionContainer} onPress={handleAddCard}>
                    <Image
                        source={require('../assets/icons/credit-card.png')} // Đảm bảo bạn có icon thẻ tín dụng
                        style={styles.optionIcon}
                    />
                    <Text style={styles.optionText}>Thêm thẻ mới</Text>
                </TouchableOpacity>

                {/* Phần Tài khoản ngân hàng */}
                <Text style={styles.sectionTitle}>Tài khoản ngân hàng</Text>
                <TouchableOpacity style={styles.optionContainer} onPress={handleAddBankAccount}>
                    <Image
                        source={require('../assets/icons/bank.png')} // Đảm bảo bạn có icon ngân hàng
                        style={styles.optionIcon}
                    />
                    <Text style={styles.optionText}>Thêm tài khoản ngân hàng</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PaymentMethodScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        paddingVertical: 15,
        paddingHorizontal: 20,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
    },
    backIcon: {
        width: 24,
        height: 24,
        tintColor: '#000000',
    },
    headerText: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#000000',
        marginLeft: 20,
    },
    content: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000000',
        marginBottom: 10,
    },
    optionContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFFFFF',
        padding: 15,
        borderRadius: 10,
        marginBottom: 15,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3,
        elevation: 3,
    },
    optionIcon: {
        width: 24,
        height: 24,
        marginRight: 15,
        tintColor: '#1E90FF',
    },
    optionText: {
        fontSize: 16,
        color: '#000000',
    },
});