import { useNavigation } from '@react-navigation/native';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, Switch, StyleSheet, ScrollView, Image } from 'react-native';


const TransferToBankScreen = ({ route }) => {
    const [bankName, setBankName] = useState('');
    const [accountNumber, setAccountNumber] = useState('');
    const [accountHolder, setAccountHolder] = useState('');
    const [saveAccount, setSaveAccount] = useState(true);
    const selectedBank = route?.params?.selectedBank;
    const [accountNumberError, setAccountNumberError] = useState('');

    const isNextEnabled = selectedBank && accountNumber && accountHolder && accountNumber.length >= 10;

    const navigation = useNavigation();

    const handleAccountNumberChange = (text) => {
        setAccountNumber(text);
        // Kiểm tra độ dài số tài khoản
        if (text.length < 10) {
            setAccountNumberError('Số tài khoản ít nhất phải có 10 chữ số');
        } else {
            setAccountNumberError('');
        }
    };

    return (
        <ScrollView style={styles.container}>

<View style={styles.headerRow}>
    <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backWrapper}>
        <Image source={require('../assets/icons/Vector.png')} style={styles.backButton} />
    </TouchableOpacity>
    <Text style={styles.title}>Chuyển đến Ngân hàng bất kỳ</Text>
    {/* Thêm View trống bên phải để căn giữa thật sự */}
    <View style={styles.backWrapper} />
</View>


            <View style={styles.warningBox}>
                <Text style={styles.warningText}>
                    ⚠️ Vui lòng kiểm tra kỹ Tên Ngân hàng, Số tài khoản và Tên chủ tài khoản trước khi tiếp tục.
                    Lưu ý: chỉ hỗ trợ chuyển tiền đến số tài khoản.
                </Text>
            </View>

            <View style={styles.form}>
                {selectedBank ? (
                    <TouchableOpacity style={styles.inputRow} onPress={() => navigation.replace('ChoiceBank')}>
                        <Text style={styles.label}>Ngân hàng</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <Image source={selectedBank?.icon} style={styles.icon} />
                            <Text style={styles.placeholder}>{"Ngân hàng " + selectedBank?.name || 'Chọn ngân hàng >'}</Text>

                        </View>

                    </TouchableOpacity>
                ) : (
                    <TouchableOpacity style={styles.inputRow} onPress={() => navigation.navigate('ChoiceBank')}>
                        <Text style={styles.label}>Tên ngân hàng</Text>
                        <Text style={styles.placeholder}>Chọn ngân hàng  </Text>
                    </TouchableOpacity>
                )}


                <View style={styles.inputRow}>
                    <Text style={styles.label}>Số tài khoản</Text>
                    <TextInput
                        style={styles.input}
                        value={accountNumber}
                        onChangeText={handleAccountNumberChange}
                        placeholder="Nhập Số tài khoản"
                        keyboardType="numeric"
                    />
                    {accountNumberError ? (
                        <Text style={styles.errorText}>{accountNumberError}</Text>
                    ) : null}
                </View>

                <View style={styles.inputRow}>
                    <Text style={styles.label}>Tên chủ tài khoản</Text>
                    <TextInput
                        style={styles.input}
                        value={accountHolder}
                        onChangeText={setAccountHolder}
                        placeholder="Điền tên đầy đủ"
                    />
                </View>

                {/* <View style={styles.switchRow}>
                    <Text style={styles.label}>Lưu tài khoản</Text>
                    <Switch
                        value={saveAccount}
                        onValueChange={setSaveAccount}
                    />
                </View> */}
            </View>

            <TouchableOpacity
                style={[styles.button, !isNextEnabled && styles.buttonDisabled]}
                disabled={!isNextEnabled}
                onPress={() => {
                    navigation.replace('Ruttien1', { selectedBank: selectedBank, stk: accountNumber })
                }}
            >
                <Text style={styles.buttonText}>TIẾP THEO</Text>
            </TouchableOpacity>

        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
    },
    warningBox: {
        backgroundColor: '#FFF3CD',
        padding: 12,
        borderRadius: 8,
        marginBottom: 16,
    },
    warningText: {
        color: '#856404',
        fontSize: 14,
    },
    form: {
        backgroundColor: '#fff',
        borderRadius: 10,
        paddingVertical: 4,
    },
    inputRow: {
        paddingVertical: 12,
        paddingHorizontal: 8,
        borderBottomWidth: 1,
        borderBottomColor: '#eee',
    },
    label: {
        fontSize: 14,
        color: '#000',
        marginBottom: 4,
    },
    placeholder: {

        paddingStart: 10
    },
    input: {
        fontSize: 16,
        color: '#000',
    },
    switchRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: 12,
    },
    button: {
        backgroundColor: '#FF5722',
        paddingVertical: 14,
        alignItems: 'center',
        borderRadius: 8,
        marginTop: 20,
    },
    buttonDisabled: {
        backgroundColor: '#ddd',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    }, backButton: {
        padding: 10,
    }, icon: {
        width: 50,
        height: 50,
        resizeMode: "contain",
    }, errorText: {
        color: 'red',
        fontSize: 12,
        marginTop: 4,
    },headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 12,
    },backWrapper: {
        width: 40, // giữ chiều rộng cố định để cân layout
        alignItems: 'center',
    },
});

export default TransferToBankScreen;
