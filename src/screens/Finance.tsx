import { StyleSheet, Text, View, TouchableOpacity, Image } from 'react-native'
import React from 'react'

const Finance = () => {
    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <View style={styles.headerContent}>
                    <TouchableOpacity onPress={() => { console.log('Vector icon clicked'); }}>
                        <Image source={require('../assets/icons/Vector.png')} style={styles.iconn} />
                    </TouchableOpacity>
                    <Text style={styles.title}>Tài chính</Text>
                </View>
            </View>
            <View style={styles.body}>
                <View style={styles.cardContainer}>
                    <Text style={styles.balanceText}>Tổng số dư</Text>
                    <View style={styles.rowContainer}>
                        <Text style={styles.balanceAmount}>145.000 VND</Text>
                        <TouchableOpacity style={styles.withdrawButton}>
                            <Text style={styles.buttonText}>Rút tiền</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.revenueContainer}>
                        <Image source={require('../assets/icons/vi.png')} style={styles.iconn} />
                        <TouchableOpacity>
                            <Text style={styles.revenueText}>Doanh thu đơn hàng</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </View>
    )
}

export default Finance

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
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
})