import { StyleSheet, Text, View,TouchableOpacity,Image } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';

const ManHoSo = () => {
   const navigation=useNavigation();
    const dataUser=[
        {id_user:1,anh:'https://png.pngtree.com/png-clipart/20210608/ourlarge/pngtree-dark-gray-simple-avatar-png-image_3418404.jpg',trang_thai:'Bình thường',sdt:'0974832596',email:'thanhndph45538@fpt.edu.vn',dia_chi:'Số nhà 21, ngõ 25 Chùa Thông, Sơn Tây, Hà Nộicscccccccccccccccccccccccccccvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvvv'},
        {id_user:2,anh:'https://chiemtaimobile.vn/images/companies/1/%E1%BA%A2nh%20Blog/avatar-facebook-dep/Anh-avatar-hoat-hinh-de-thuong-xinh-xan.jpg?1704788263223',trang_thai:'Bị khóa',sdt:'0974832597',email:'2thanhndph45538@fpt.edu.vn',dia_chi:'Số nhà 22, ngõ 25 Chùa Thông, Sơn Tây, Hà Nội'},
        {id_user:3,anh:'https://www.vietnamworks.com/hrinsider/wp-content/uploads/2023/12/anh-den-ngau.jpeg',trang_thai:'Bình thường',sdt:'0974832598',email:'3thanhndph45538@fpt.edu.vn',dia_chi:'Số nhà 233, ngõ 25 Chùa Thông, Sơn Tây, Hà Nội'},
    ];
    const idUserDangNhap = 2; // Giả sử tài khoản đang đăng nhập có id = 1

    // Tìm thông tin user hiện tại
    const userDangNhap = dataUser.find(user => user.id_user === idUserDangNhap);
  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',justifyContent:'space-around',alignItems:'center',marginTop:10}}>
             <TouchableOpacity onPress={()=>{navigation.goBack()}}>
              <Image style={styles.icon2} source={require('../assets/icon_back.png')} />
             </TouchableOpacity>
             <Text style={styles.title}>Hồ sơ</Text>
            <TouchableOpacity onPress={()=>navigation.navigate('SuaHoSo')}>
            <Image style={styles.icon} source={require('../assets/icon_sua.png')} />
            </TouchableOpacity>
            </View>
       <View style={styles.container2}>
          <Image style={{height:120,width:120,borderRadius:60}} source={{uri:userDangNhap.anh}} />
       </View>
       <View >
        <View style={{borderBottomColor:'#D9D9D9',borderBottomWidth:1,}}>
        <Text style={[styles.chu,{color:'#5908B0',paddingBottom:10,padding:20}]}>Trạng thái: {userDangNhap.trang_thai}</Text>
        </View>
        <View style={{padding:20}}>
        <View  style={{marginTop:20}}>
         <Text style={styles.chu}>Số điện thoại</Text>
         <View style={styles.ochu}>
        <Text>{userDangNhap.sdt}</Text>
         </View>
        </View>

        <View  style={{marginTop:20}}>
         <Text style={styles.chu}>Email</Text>
         <View style={styles.ochu}>
        <Text>{userDangNhap.email}</Text>
         </View>
        </View>

        <View style={{marginTop:20}}>
         <Text style={styles.chu}>Địa chỉ</Text>
         <View style={styles.ochu}>
        <Text
        numberOfLines={1}  // Giới hạn 1 dòng
        ellipsizeMode='tail'  // Cắt chữ ở cuối và thêm "..."
        style={{ width: 'auto' }}>{userDangNhap.dia_chi}</Text>
         </View>
        </View>
        </View>
       </View>

    </View>
  )
}

export default ManHoSo

const styles = StyleSheet.create({
    container:{
        flex:1,
        
    },
    title:{
        fontSize:21,
        fontWeight:'bold',
 
     },
     icon:{
        height:20,
        width:20,
        marginLeft:20
     },
     icon2:{
        height:20,
        width:20,
        marginRight:20
     },
     container2:{
        width:'100%',
        height:200,
        backgroundColor:'#D9D9D9',
        marginTop:50,
        justifyContent:'center',
        alignItems:'center'
     },
     chu:{
    fontSize:16,
    fontWeight:'bold',

     },
     thongtin:{
        padding:20
     },
     ochu:{
      width:'100%',
      backgroundColor:'#D9D9D9',
      height:40,
      marginTop:10,
      justifyContent:'center',
      padding:10
     }
})