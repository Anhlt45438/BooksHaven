import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Alert, Platform } from 'react-native';
import React, { useState, useEffect } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import CustomAppBar from "../components/CustomAppBar";
import { useAppSelector } from "../redux/hooks.tsx";

const ManSuaHoSo = () => {
   const navigation = useNavigation();

   // Lấy user từ Redux
   const userDangNhap = useAppSelector((state) => state.user.user);

   // Tạo state cục bộ, khởi tạo từ Redux
   const [selectedImage, setSelectedImage] = useState(userDangNhap?.anh || '');
   // Sửa key: dùng "sdt" thay vì "sđt"
   const [sodienthoai, setSodienthoai] = useState(userDangNhap?.sdt || '');
   const [email, setEmail] = useState(userDangNhap?.email || '');
   const [diachi, setDiachi] = useState(userDangNhap?.dia_chi || '');
   const [imageError, setImageError] = useState(false);

   // Cập nhật state cục bộ khi user từ Redux thay đổi
   useEffect(() => {
      if (userDangNhap) {
         setSelectedImage(userDangNhap.anh || '');
         setSodienthoai(userDangNhap.sđt || '');
         setEmail(userDangNhap.email || '');
         setDiachi(userDangNhap.dia_chi || '');
         setImageError(false);
      }
   }, [userDangNhap]);

   // Hàm rút gọn text
   const getShortText = (text: string) => {
      if (text.length > 50) {
         return text.substring(0, 50) + '...';
      }
      return text;
   };

   // Hàm mở thư viện chọn ảnh (chỉ mở kho lưu trữ, không đẩy ảnh lên server)
   const openImagePicker = () => {
      const options = {
         mediaType: 'photo' as const,
         quality: 'high', // sử dụng giá trị chuỗi phù hợp
      };

      launchImageLibrary(options, (response) => {
         if (response.didCancel) {
            console.log('User cancelled image picker');
         } else if (response.errorCode) {
            Alert.alert('Lỗi', 'Không thể chọn ảnh');
         } else if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            setSelectedImage(uri);
            setImageError(false);
         }
      });
   };

   const handleSave = () => {
      // Bạn có thể dispatch action cập nhật thông tin người dùng tại đây
      Alert.alert('Thông báo', 'Thông tin đã được lưu!');
   };

   // Nếu userDangNhap null (chưa load xong hoặc chưa đăng nhập), trả về màn loading
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
          <ScrollView contentContainerStyle={{ flexGrow: 1 }}
                      keyboardShouldPersistTaps="handled"
          >
             <View style={styles.container}>
                <CustomAppBar
                    title="Hồ sơ"
                    onBackPress={() => navigation.goBack()}
                    rightIcon={require('../assets/icons/check.png')}
                    onRightPress={handleSave}
                />

                <View style={styles.container2}>
                   <TouchableOpacity onPress={openImagePicker}>
                      <Image
                          style={{ height: 120, width: 120, borderRadius: 60 }}
                          source={
                             imageError || !selectedImage
                                 ? require('../assets/icons/user.png')
                                 : { uri: selectedImage }
                          }
                          onError={() => setImageError(true)}
                      />
                   </TouchableOpacity>
                   <Text style={{ fontSize: 15, marginTop: 10 }}>Sửa ảnh đại diện</Text>
                </View>

                <View>
                   <View style={{ borderBottomColor: '#D9D9D9', borderBottomWidth: 1 }}>
                      <Text style={[styles.chu, { color: '#006711', paddingBottom: 10, padding: 20 }]}>
                         Trạng thái: {userDangNhap.trang_thai === 1 ? 'Hoạt động' : userDangNhap.trang_thai === 2 ? 'Không hoạt động' : 'Không xác định'}
                      </Text>
                   </View>

                   <View style={{ padding: 20 }}>
                      <View style={{ marginTop: 20 }}>
                         <Text style={styles.chu}>Số điện thoại</Text>
                         <TextInput
                             style={{ width: '100%', borderWidth: 1, borderColor: '#D9D9D9', paddingLeft: 10, marginTop: 10 }}
                             value={sodienthoai}
                             onChangeText={setSodienthoai}
                             keyboardType="phone-pad"
                         />
                      </View>

                      <View style={{ marginTop: 20 }}>
                         <Text style={styles.chu}>Email</Text>
                         <TextInput
                             style={{ width: '100%', borderWidth: 1, borderColor: '#D9D9D9', paddingLeft: 10, marginTop: 10 }}
                             value={email}
                             onChangeText={setEmail}
                             keyboardType="email-address"
                         />
                      </View>

                      <View style={{ marginTop: 20 }}>
                         <Text style={styles.chu}>Địa chỉ</Text>
                         <TextInput
                             style={{ width: '100%', borderWidth: 1, borderColor: '#D9D9D9', paddingLeft: 10, marginTop: 10 }}
                             value={getShortText(diachi)}
                             onChangeText={setDiachi}
                         />
                      </View>
                   </View>
                </View>
             </View>
          </ScrollView>
       </KeyboardAvoidingView>
   );
};

export default ManSuaHoSo;

const styles = StyleSheet.create({
   container: {
      flex: 1,
   },
   container2: {
      width: '100%',
      height: 200,
      backgroundColor: '#D9D9D9',
      marginTop: 50,
      justifyContent: 'center',
      alignItems: 'center',
   },
   chu: {
      fontWeight: 'bold',
      fontSize: 15,
   },
});
