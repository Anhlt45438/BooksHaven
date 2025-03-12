import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView, Alert } from 'react-native';
import React, { useState } from 'react';
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';
import { useSelector } from 'react-redux';
import CustomAppBar from "../components/CustomAppBar";

const ManSuaHoSo = () => {
   const navigation = useNavigation();

   // Lấy dữ liệu từ Redux
   const userDangNhap = useSelector(state => state.auth.user);

   // Nếu user chưa có dữ liệu, không render gì cả
   if (!userDangNhap) {
      return (
          <View style={styles.container}>
             <Text>Đang tải dữ liệu...</Text>
          </View>
      );
   }

   // State để cập nhật dữ liệu nhập vào
   const [selectedImage, setSelectedImage] = useState(userDangNhap.anh || '');
   const [sodienthoai, setSodienthoai] = useState(userDangNhap.sdt || '');
   const [email, setEmail] = useState(userDangNhap.email || '');
   const [diachi, setDiachi] = useState(userDangNhap.dia_chi || '');

   const openImagePicker = () => {
      const options = { mediaType: 'photo', quality: 1 };

      launchImageLibrary(options, (response) => {
         if (response.didCancel) {
            console.log('User cancelled image picker');
         } else if (response.errorCode) {
            Alert.alert('Lỗi', 'Không thể chọn ảnh');
         } else if (response.assets && response.assets.length > 0) {
            setSelectedImage(response.assets[0].uri);
         }
      });
   };

   const handleSave = () => {
      // Gọi API cập nhật thông tin người dùng tại đây
      Alert.alert('Thông báo', 'Thông tin đã được lưu!');
   };

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

                <TouchableOpacity style={styles.container2} onPress={openImagePicker}>
                   <Image style={{ height: 120, width: 120, borderRadius: 60 }} source={{ uri: selectedImage }} />
                   <Text style={{ fontSize: 15, marginTop: 10 }}>Sửa ảnh đại diện</Text>
                </TouchableOpacity>

                <View>
                   <View style={{ borderBottomColor: '#D9D9D9', borderBottomWidth: 1 }}>
                      <Text style={[styles.chu, { color: '#5908B0', paddingBottom: 10, padding: 20 }]}>
                         Trạng thái: {userDangNhap.trang_thai}
                      </Text>
                   </View>

                   <View style={{ padding: 20 }}>
                      <View style={{ marginTop: 20 }}>
                         <Text style={styles.chu}>Số điện thoại</Text>
                         <TextInput
                             style={styles.input}
                             value={sodienthoai}
                             onChangeText={setSodienthoai}
                             keyboardType="phone-pad"
                         />
                      </View>

                      <View style={{ marginTop: 20 }}>
                         <Text style={styles.chu}>Email</Text>
                         <TextInput
                             style={styles.input}
                             value={email}
                             onChangeText={setEmail}
                             keyboardType="email-address"
                         />
                      </View>

                      <View style={{ marginTop: 20 }}>
                         <Text style={styles.chu}>Địa chỉ</Text>
                         <TextInput
                             style={styles.input}
                             value={diachi}
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
      alignItems: 'center'
   },
   chu: {
      fontWeight: 'bold',
      fontSize: 15
   },
   input: {
      width: '100%',
      borderWidth: 1,
      borderColor: '#D9D9D9',
      paddingLeft: 10,
      marginTop: 10
   }
});
