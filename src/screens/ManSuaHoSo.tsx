import {
    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    Platform
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import CustomAppBar from "../components/CustomAppBar";
import { useAppSelector } from "../redux/hooks.tsx";

const ManSuaHoSo = () => {
    const navigation = useNavigation();
    const userDangNhap = useAppSelector((state) => state.user.user);

    // Lấy ảnh đại diện từ Redux
    const [selectedImage, setSelectedImage] = useState(userDangNhap?.anh || '');
    const [imageError, setImageError] = useState(false);

    useEffect(() => {
        if (userDangNhap) {
            setSelectedImage(userDangNhap.anh || '');
            setImageError(false);
        }
    }, [userDangNhap]);

    // Hàm mở hộp thoại chọn nguồn ảnh
    const openImageOptions = () => {
        Alert.alert("Chọn ảnh", "Vui lòng chọn nguồn ảnh", [
            { text: "Máy ảnh", onPress: () => launchCameraOptions() },
            { text: "Thư viện", onPress: () => launchLibraryOptions() },
            { text: "Hủy", style: "cancel" }
        ]);
    };

    // Mở máy ảnh
    const launchCameraOptions = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };
        launchCamera(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled camera');
            } else if (response.errorCode) {
                Alert.alert('Lỗi', 'Không thể truy cập máy ảnh');
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setSelectedImage(uri);
                setImageError(false);
            }
        });
    };

    // Mở thư viện ảnh
    const launchLibraryOptions = () => {
        const options = {
            mediaType: 'photo',
            quality: 1,
        };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện');
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                setSelectedImage(uri);
                setImageError(false);
            }
        });
    };

    const handleSave = () => {
        // Giả sử lưu thông tin cập nhật (bạn có thể tích hợp API PUT tại đây)
        Alert.alert('Thông báo', 'Thông tin đã được lưu!');
    };

    if (!userDangNhap) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Đang tải dữ liệu user...</Text>
            </View>
        );
    }

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={{ flex: 1 }}
            keyboardVerticalOffset={100}
        >
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} keyboardShouldPersistTaps="handled">
                <View style={styles.container}>
                    <CustomAppBar
                        title="Hồ sơ"
                        onBackPress={() => navigation.goBack()}
                        rightIcon={require('../assets/icons/check.png')}
                        onRightPress={handleSave}
                    />

                    <View style={styles.container2}>
                        <TouchableOpacity onPress={openImageOptions}>
                            <Image
                                style={{ height: 120, width: 120, borderRadius: 60 }}
                                source={ imageError || !selectedImage ? require('../assets/icons/user.png') : { uri: selectedImage } }
                                onError={() => setImageError(true)}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 15, marginTop: 10 }}>Sửa ảnh đại diện</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        {/* Tên đăng nhập */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                navigation.navigate(
                                    "UpdateAccountScreen" as never,
                                    { field: "username", currentValue: userDangNhap.username || "" } as never
                                )
                            }
                        >
                            <Text style={styles.infoLabel}>Tên đăng nhập</Text>
                            <View style={styles.infoRight}>
                                <Text style={[styles.infoText, !userDangNhap.username && { color: 'red' }]}>
                                    {userDangNhap.username || 'Chưa thiết lập'}
                                </Text>
                                <Image source={require('../assets/icons/next.png')} style={styles.nextIcon} />
                            </View>
                        </TouchableOpacity>

                        {/* Số điện thoại */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                navigation.navigate(
                                    "UpdateAccountScreen" as never,
                                    { field: "sđt", currentValue: userDangNhap.sđt || "" } as never
                                )
                            }
                        >
                            <Text style={styles.infoLabel}>Số điện thoại</Text>
                            <View style={styles.infoRight}>
                                <Text style={[styles.infoText, !userDangNhap.sđt && { color: 'red' }]}>
                                    {userDangNhap.sđt || 'Chưa thiết lập'}
                                </Text>
                                <Image source={require('../assets/icons/next.png')} style={styles.nextIcon} />
                            </View>
                        </TouchableOpacity>

                        {/* Email */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                navigation.navigate(
                                    "UpdateAccountScreen" as never,
                                    { field: "email", currentValue: userDangNhap.email || "" } as never
                                )
                            }
                        >
                            <Text style={styles.infoLabel}>Email</Text>
                            <View style={styles.infoRight}>
                                <Text style={[styles.infoText, !userDangNhap.email && { color: 'red' }]}>
                                    {userDangNhap.email || 'Chưa thiết lập'}
                                </Text>
                                <Image source={require('../assets/icons/next.png')} style={styles.nextIcon} />
                            </View>
                        </TouchableOpacity>

                        {/* Địa chỉ */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                navigation.navigate(
                                    "UpdateAccountScreen" as never,
                                    { field: "dia_chi", currentValue: userDangNhap.dia_chi || "" } as never
                                )
                            }
                        >
                            <Text style={styles.infoLabel}>Địa chỉ</Text>
                            <View style={styles.infoRight}>
                                <Text style={[styles.infoText, !userDangNhap.dia_chi && { color: 'red' }]}>
                                    {userDangNhap.dia_chi || 'Chưa thiết lập'}
                                </Text>
                                <Image source={require('../assets/icons/next.png')} style={styles.nextIcon} />
                            </View>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default ManSuaHoSo;

const styles = StyleSheet.create({
    container: { flex: 1 },
    container2: {
        width: '100%',
        height: 200,
        backgroundColor: '#D9D9D9',
        marginTop: 50,
        justifyContent: 'center',
        alignItems: 'center',
    },
    infoContainer: { paddingHorizontal: 20, paddingTop: 30 },
    infoRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        borderBottomColor: '#D9D9D9',
        borderBottomWidth: 1,
        paddingVertical: 15,
    },
    infoLabel: { fontWeight: 'bold', fontSize: 15 },
    infoRight: { flexDirection: 'row', alignItems: 'center' },
    infoText: { fontSize: 15, color: '#555', marginRight: 10 },
    nextIcon: { width: 20, height: 20 },
});
