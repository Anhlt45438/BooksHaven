import React, { useState } from 'react';
import {
    StyleSheet,
    Text,
    View,
    TextInput,
    TouchableOpacity,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useAppDispatch, useAppSelector } from '../redux/hooks';
import { updateUserThunk } from '../redux/userSlice';
import CustomAppBar from '../components/CustomAppBar';

const UpdateAccountScreen = () => {
    const navigation = useNavigation();
    const route = useRoute();
    const dispatch = useAppDispatch();
    const user = useAppSelector((state) => state.user.user);

    // Nhận tham số từ route
    // field: tên trường cần cập nhật (ví dụ: "username", "sđt", "email", "dia_chi")
    // currentValue: giá trị hiện tại của trường đó
    const { field, currentValue } = route.params;
    const [value, setValue] = useState(currentValue);

    // Map field sang nhãn hiển thị (nếu cần)
    const fieldLabels = {
        username: 'Tên đăng nhập',
        'sđt': 'Số điện thoại',
        email: 'Email',
        dia_chi: 'Địa chỉ',
    };

    const handleSave = async () => {
        if (value.trim() === '') {
            Alert.alert('Lỗi', 'Giá trị không được để trống!');
            return;
        }
        if (value === currentValue) {
            Alert.alert('Thông báo', 'Không có thay đổi nào!');
            return;
        }
        try {
            const updateData = { [field]: value };
            await dispatch(updateUserThunk({ userId: user._id, updateData })).unwrap();
            Alert.alert('Thông báo', 'Cập nhật thành công!');
            navigation.goBack();
        } catch (error) {
            Alert.alert('Lỗi', 'Cập nhật không thành công!');
            console.error(error);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.container}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ScrollView contentContainerStyle={styles.contentContainer}>
                <CustomAppBar title="Cập nhật thông tin" onBackPress={() => navigation.goBack()} />
                <View style={styles.formContainer}>
                    <Text style={styles.label}>{fieldLabels[field] || field}</Text>
                    <TextInput
                        style={styles.input}
                        placeholder={`Nhập ${fieldLabels[field] || field}`}
                        value={value}
                        onChangeText={setValue}
                    />
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Lưu thông tin</Text>
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default UpdateAccountScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        marginTop: "auto",
    },
    contentContainer: {
        flexGrow: 1,
        marginTop: "auto",
    },
    formContainer: {
        marginTop: 20,
        padding: 20
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 20
    },
    saveButton: {
        backgroundColor: '#006711',
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: 'center'
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    },
});
