import { StyleSheet, Text, View, TouchableOpacity, Image, TextInput, ScrollView, KeyboardAvoidingView } from 'react-native'
import React, { useState } from 'react'
import { launchImageLibrary } from 'react-native-image-picker';
import { useNavigation } from '@react-navigation/native';

const ManSuaHoSo = () => {
   const navigation=useNavigation();
   const dataUser = [
      { id_user: 1, anh: 'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg', trang_thai: 'Bình thường', sdt: '0974832596', email: 'thanhndph45538@fpt.edu.vn', dia_chi: 'Số nhà 21, ngõ 25 Chùa Thông, Sơn Tây, Hà Nộicscccccccccccccccccccccccccccvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv' },
      { id_user: 2, anh: 'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223', trang_thai: 'Bị khóa', sdt: '0974832597', email: '2thanhndph45538@fpt.edu.vn', dia_chi: 'Số nhà 22, ngõ 25 Chùa Thông, Sơn Tây, Hà Nội' },
      { id_user: 3, anh: 'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau.jpeg', trang_thai: 'Bình thường', sdt: '0974832598', email: '3thanhndph45538@fpt.edu.vn', dia_chi: 'Số nhà 233, ngõ 25 Chùa Thông, Sơn Tây, Hà Nội' },
   ];
   const idUserDangNhap = 2; // Giả sử tài khoản đang đăng nhập có id = 1

   // Tìm thông tin user hiện tại
   const userDangNhap = dataUser.find(user => user.id_user === idUserDangNhap);

   const [selectedImage, setSelectedImage] = useState(userDangNhap.anh);
   const [sodienthoai, setSodienthoai] = useState(userDangNhap.sdt || '');
   const [email, setEmail] = useState(userDangNhap.email || '');
   const [diachi, setDiachi] = useState(userDangNhap.dia_chi || '');
   

   const getShortText = (text) => {
      if (text.length > 50) {
         return text.substring(0, 50) + '...';
      }
      return text;
   };



   // Hàm mở thư viện chọn ảnh
   const openImagePicker = () => {
      const options = {
         mediaType: 'photo',
         quality: 1,
      };

      launchImageLibrary(options, (response) => {
         if (response.didCancel) {
            console.log('User cancelled image picker');
         } else if (response.errorCode) {
            Alert.alert('Lỗi', 'Không thể chọn ảnh');
         } else if (response.assets && response.assets.length > 0) {
            const uri = response.assets[0].uri;
            setSelectedImage(uri);  // Cập nhật ảnh mới
         }
      });
   };

   const handleSave = () => {
      // Sau này có thể thêm logic gọi API cập nhật thông tin user ở đây
      Alert.alert('Thông báo', 'Thông tin đã được lưu!');
   };

   return (
    <KeyboardAvoidingView 
    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    style={{ flex: 1 }}
    keyboardVerticalOffset={100}>
       <ScrollView contentContainerStyle={{flexGrow:1}}
          keyboardShouldPersistTaps="handled">
       <View style={styles.container}>
         <View style={{ flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', marginTop: 10 }}>
            <TouchableOpacity onPress={() => navigation.goBack()}>
               <Image style={styles.icon2} source={require('../assets/icon_back.png')} />
            </TouchableOpacity>
            <Text style={styles.title}>Sửa hồ sơ</Text>
            <TouchableOpacity>
               <Text style={[styles.title, { color: '#5908B0' }]}>Lưu</Text>
            </TouchableOpacity>
         </View>
         <TouchableOpacity style={styles.container2} onPress={openImagePicker}>
            <Image style={{ height: 120, width: 120, borderRadius: 60 }} source={{ uri: selectedImage }} />
            <Text style={{ fontSize: 15, marginTop: 10 }}>Sửa ảnh đại diện</Text>
         </TouchableOpacity>
         <View>
            <View style={{ borderBottomColor: '#D9D9D9', borderBottomWidth: 1, }}>
               <Text style={[styles.chu, { color: '#5908B0', paddingBottom: 10, padding: 20 }]}>Trạng thái: {userDangNhap.trang_thai}</Text>
            </View>

            <View style={{ padding: 20 }}>
               <View style={{ marginTop: 20 }}>
                  <Text style={styles.chu}>Số điện thoại</Text>
                  <TextInput
                   style={{ width: '100%', borderWidth: 1,borderColor:'#D9D9D9',paddingLeft:10,marginTop:10 }}
                     value={sodienthoai}
                     onChangeText={setSodienthoai}
                     keyboardType="phone-pad"
                  />
               </View>

               <View style={{ marginTop: 20 }}>
                  <Text style={styles.chu}>Email</Text>
                  <TextInput
                   style={{ width: '100%', borderWidth: 1,borderColor:'#D9D9D9',paddingLeft:10,marginTop:10 }}
                     value={email}
                     onChangeText={setEmail}
                     keyboardType="email-address"

                  />
               </View>

               <View style={{ marginTop: 20 }}>
                  <Text style={styles.chu}>Địa chỉ</Text>
                  <TextInput
                     style={{ width: '100%', borderWidth: 1,borderColor:'#D9D9D9',paddingLeft:10,marginTop:10 }}
                     value={getShortText(diachi)}
                     onChangeText={setDiachi}
                  />
               </View>
            </View>
         </View>
      </View>
     </ScrollView>
    </KeyboardAvoidingView>
   )
}

export default ManSuaHoSo

const styles = StyleSheet.create({
   container: {
      flex: 1,

   },
   title: {
      fontSize: 21,
      fontWeight: 'bold',

   },
   icon: {
      height: 20,
      width: 20,
      marginLeft: 20
   },
   icon2: {
      height: 20,
      width: 20,
      marginRight: 20
   },
   container2: {
      width: '100%',
      height: 200,
      backgroundColor: '#D9D9D9',
      marginTop: 50,
      justifyContent: 'center',
      alignItems: 'center'
   },
   chu:{
      fontWeight:'bold',
      fontSize:15
   }

})