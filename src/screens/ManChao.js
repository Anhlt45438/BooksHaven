import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect } from 'react'
import { useNavigation } from '@react-navigation/native';

const ManChao = () => {
    const navigation=useNavigation();
    useEffect(() => {
      const timer=setTimeout(()=>{
        navigation.navigate('DangNhapScreen')
      },3000)
    
      return () => {
        clearTimeout(timer)
      }
    }, [])
    

  return (
    <View style={styles.container}>
      <Image style={styles.img} source={require('../assets/anh1.png')} />
    </View>
  )
}

export default ManChao

const styles = StyleSheet.create({
  container:{

    flex:1,
    justifyContent:'center',
    alignItems:'center'
  },
    img:{
        width:200,
        height:200,
        resizeMode: 'contain', // Đảm bảo ảnh không bị méo

    }
})