import {

    StyleSheet,
    Text,
    View,
    TouchableOpacity,
    Image,
    ScrollView,
    KeyboardAvoidingView,
    Alert,
    Platform,
} from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import CustomAppBar from '../components/CustomAppBar';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppSelector, useAppDispatch } from '../redux/hooks';
import { PermissionsAndroid } from 'react-native';
import { fetchUserData } from '../redux/userSlice';

const ManSuaHoSo = () => {
    const navigation = useNavigation();
    const userDangNhap = useAppSelector((state) => state.user.user);
    const [selectedImage, setSelectedImage] = useState(userDangNhap?.anh || '');
    const [imageError, setImageError] = useState(false);
    const dispatch = useAppDispatch();
    const defaultImage = require('../assets/icons/user.png');
    const user = useAppSelector((state) => state.user.user) || { avatar: null };


  useEffect(() => {
    if (userDangNhap) {
      setSelectedImage(userDangNhap.anh || '');
      setImageError(false);
    }
  }, [userDangNhap]);


    // Mở hộp thoại chọn ảnh từ máy ảnh hoặc thư viện
    const openImageOptions = () => {
        Alert.alert('Chọn ảnh', 'Vui lòng chọn nguồn ảnh', [
            { text: 'Máy ảnh', onPress: () => launchCameraOptions() },
            { text: 'Thư viện', onPress: () => launchLibraryOptions() },
            { text: 'Hủy', style: 'cancel' },
        ]);
    };

    // Xử lý mở máy ảnh
    const launchCameraOptions = async () => {
        try {
            const granted = await PermissionsAndroid.request(
                PermissionsAndroid.PERMISSIONS.CAMERA,
                {
                    title: 'Quyền truy cập máy ảnh',
                    message: 'Ứng dụng cần quyền truy cập máy ảnh để chụp ảnh.',
                    buttonPositive: 'Đồng ý',
                    buttonNegative: 'Hủy',
                }
            );

            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                const options = { mediaType: 'photo', quality: 1 };
                launchCamera(options, (response) => {
                    if (response.didCancel) {
                        console.log('User cancelled camera');
                    } else if (response.errorCode) {
                        Alert.alert('Lỗi', 'Không thể truy cập máy ảnh');
                    } else if (response.assets && response.assets.length > 0) {
                        const uri = response.assets[0].uri;
                        console.log('Ảnh từ máy ảnh:', uri);
                        setSelectedImage(uri);
                        setImageError(false);
                    }
                });
            } else {
                Alert.alert('Lỗi', 'Quyền truy cập máy ảnh bị từ chối');
            }
        } catch (error) {
            console.error('Lỗi khi yêu cầu quyền:', error);
            Alert.alert('Lỗi', 'Không thể yêu cầu quyền truy cập máy ảnh');
        }
    };

    // Xử lý mở thư viện ảnh
    const launchLibraryOptions = () => {
        const options = { mediaType: 'photo', quality: 1 };
        launchImageLibrary(options, (response) => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện');
            } else if (response.assets && response.assets.length > 0) {
                const uri = response.assets[0].uri;
                console.log('Ảnh từ thư viện:', uri);
                setSelectedImage(uri);
                setImageError(false);
            }

        });
      } else {
        Alert.alert('Lỗi', 'Quyền truy cập máy ảnh bị từ chối');
      }
    } catch (error) {
      console.error('Lỗi khi yêu cầu quyền:', error);
      Alert.alert('Lỗi', 'Không thể yêu cầu quyền truy cập máy ảnh');
    }
  };

  // Mở thư viện ảnh
  const launchLibraryOptions = () => {
    const options = {
      mediaType: 'photo',
      quality: 1,
    };
    launchImageLibrary(options, response => {
      if (response.didCancel) {
        console.log('User cancelled image picker');
      } else if (response.errorCode) {
        Alert.alert('Lỗi', 'Không thể chọn ảnh từ thư viện ');
      } else if (response.assets && response.assets.length > 0) {
        const uri = response.assets[0].uri;
        console.log('Ảnh từ thư viện:', uri);
        setSelectedImage(uri);
        setImageError(false);
      }
    });
  };


    // Hàm lưu thông tin cập nhật (ví dụ: chỉ cập nhật avatar)
    const handleSave = async () => {
        if (!selectedImage) {
            Alert.alert('Lỗi', 'Vui lòng chọn ảnh trước khi lưu!');
            return;
        }

        const accessToken = await AsyncStorage.getItem('accessToken');
        if (!accessToken) {
            Alert.alert('Lỗi', 'Không tìm thấy token để xác thực');
            return;
        }
        if (!userDangNhap?._id) {
            Alert.alert('Lỗi', 'Không tìm thấy ID người dùng');
            return;
        }

        const updatedUser = { avatar: selectedImage };

        try {
            const response = await fetch(
                `http://10.0.2.2:3000/api/users/update/${userDangNhap._id}`,
                {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${accessToken}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(updatedUser),
                }
            );


    try {
      const response = await fetch(
        `http://14.225.206.60:3000/api/users/update/${userDangNhap._id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedUser),
        },
      );
      
      
      const responseData = await response.json();

            if (response.ok) {
                dispatch(fetchUserData(userDangNhap._id));
                Alert.alert('Thành công', 'Cập nhật thông tin thành công!');
                navigation.goBack();
            } else {
                Alert.alert(
                    'Lỗi',
                    `Không thể cập nhật thông tin: ${responseData.message || 'Unknown error'}`
                );
            }
        } catch (error) {
            Alert.alert('Lỗi', 'Có lỗi xảy ra khi kết nối đến server!');
        }
    };

    if (!userDangNhap) {
        return (
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Text>Đang tải dữ liệu user...</Text>
            </View>

        );
      }
    } catch (error) {
      Alert.alert('Lỗi', 'Có lỗi xảy ra khi kết nối đến server!');
    }
  };

  if (!userDangNhap) {
    return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
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
                                source={
                                    selectedImage && !imageError
                                        ? { uri: selectedImage }
                                        : user.avatar && !imageError
                                            ? { uri: user.avatar }
                                            : defaultImage
                                }
                                onError={() => setImageError(true)}
                            />
                        </TouchableOpacity>
                        <Text style={{ fontSize: 15, marginTop: 10 }}>Sửa ảnh đại diện</Text>
                    </View>

                    <View style={styles.infoContainer}>
                        {/* Cập nhật tên đăng nhập */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                navigation.navigate(
                                    'UpdateAccountScreen' as never,
                                    { field: 'username', currentValue: userDangNhap.username || '' } as never
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

                        {/* Cập nhật số điện thoại */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                navigation.navigate(
                                    'UpdateAccountScreen' as never,
                                    { field: 'sdt', currentValue: userDangNhap.sdt || '' } as never
                                )
                            }
                        >
                            <Text style={styles.infoLabel}>Số điện thoại</Text>
                            <View style={styles.infoRight}>
                                <Text style={[styles.infoText, !userDangNhap.sdt && { color: 'red' }]}>
                                    {userDangNhap.sdt || 'Chưa thiết lập'}
                                </Text>
                                <Image source={require('../assets/icons/next.png')} style={styles.nextIcon} />
                            </View>
                        </TouchableOpacity>

                        {/* Không cho phép thay đổi email */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                Alert.alert('Thông báo', 'Bạn không thể thay đổi địa chỉ email')
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

                        {/* Cập nhật địa chỉ qua màn hình UpdateDiaChiScreen */}
                        <TouchableOpacity
                            style={styles.infoRow}
                            onPress={() =>
                                navigation.navigate(
                                    'UpdateDiaChiScreen' as never,
                                    { field: 'dia_chi', currentValue: userDangNhap.dia_chi || '' } as never
                                )
                            }
                        >
                            <Text style={styles.infoLabel}>Địa chỉ</Text>
                            <View style={styles.infoRight}>
                                <Text style={[styles.infoText, !userDangNhap.dia_chi && { color: 'red' }]}>
                                    {userDangNhap.dia_chi
                                        ? (userDangNhap.dia_chi.length > 20
                                            ? userDangNhap.dia_chi.substring(0, 25) + '...'
                                            : userDangNhap.dia_chi)
                                        : 'Chưa thiết lập'}
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
