import { StyleSheet, Text, View,TouchableOpacity,Image, FlatList } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import ItemSauDatHang from '../components/ItemSauDatHang';

const ManSauDatHang = () => {

const navigation = useNavigation();
  const route = useRoute();
const { selectedProducts, tongThanhToan, tongTienHang, tongtienShip } = route.params || {};

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };
console.log(selectedProducts);

  
  return (
    <View style={{flex:1}}>
       <View style={{flexDirection:'row',padding:20}}>
            </View>
            <View style={{justifyContent:'center',height:360,alignItems:'center',borderColor:'#D9D9D9',borderBottomWidth:1}}>
                <Image style={{height:60,width:60}} source={require('../assets/icon_tichto.png')} />
                <Text style={{fontSize:18,fontWeight:'bold',marginTop:15}}>Cảm ơn bạn đã đặt hàng</Text>
                <TouchableOpacity style={styles.nut}  onPress={()=>{
                     navigation.navigate('HomeTabBottom', { screen: 'HomeScreen' });
                }}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>Trở về trang chủ</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nut2}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>Hủy đơn hàng</Text>
                </TouchableOpacity>
                <Image style={{height:140,width:'95%',marginTop:10}} source={require('../assets/anh_banner.png')} />

               

            </View>
            <View style={{padding:10,flex:1}}>
             <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-around'}}>
             <Text style={{fontSize:16}}>Đơn hàng của bạn</Text>
             <Text style={{fontSize:14,fontWeight:'bold'}}>Tổng tiền đơn hàng: {formatPrice(tongThanhToan)}</Text>
             </View>
             <FlatList
             style={{marginTop:5}}
             data={selectedProducts}
             renderItem={({item})=>
                <ItemSauDatHang  item={item}/>
             }
             keyExtractor={item =>item.id_ctgh}
            
             />
            </View>
    </View>
  )
}

export default ManSauDatHang

const styles = StyleSheet.create({
    nut:{
        height:40,
        width:200,
        backgroundColor:'#D9D9D9',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10
    },
    nut2:{
        height:40,
        width:200,
        backgroundColor:'#D9D9D9',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        borderColor:'#EA5656',
        borderWidth:2
    },
    chu:{
        fontSize:16
    }
})