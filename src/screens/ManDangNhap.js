import { Image, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'

const ManDangNhap = () => {
  return (
    <View style={styles.container}>

      <Image style={styles.img} source={require('../assets/anh1.png')}/>
     
      <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
            <Image style={{height:25,width:25,marginEnd:5}} source={require('../assets/icon_nguoi2.jpg')} />
            <TextInput style={styles.ip}
            placeholder='Email/Số điện thoại/Tên đăng nhập'
            placeholderTextColor={'gray'}
            />
      </View>
      <View style={{flexDirection:'row',alignItems:'center',marginTop:20}}>
            <Image style={{height:20,width:20,marginEnd:10}} source={require('../assets/khoa.png')} />
            <TextInput style={styles.ip}
            placeholder='Mật khẩu'
            placeholderTextColor={'gray'}
            />
      </View>
     <TouchableOpacity style={{    marginRight: '15%',     alignSelf: 'flex-end',marginTop:10}}>
     <Text style={{    alignSelf: 'flex-end'}}>Quên mật khẩu?</Text>
     </TouchableOpacity>
      </View>
    
  )
}

export default ManDangNhap

const styles = StyleSheet.create({
  container:{
    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
  img:{
    height:100,
    width:100,
    resizeMode: 'contain', // Đảm bảo ảnh không bị méo

  },
  ip:{
    height:50,
    width:'70%',
    borderWidth:1,
    borderColor:'#ccc'
  }
   

})