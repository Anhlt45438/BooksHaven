import { StyleSheet, Text, View,TouchableOpacity,Image, FlatList } from 'react-native'
import React, { useState } from 'react'

const ManSauDatHang = () => {
const [data, setData] = useState([]);

const Data=
    [
        {id:1,ten:'Sach1',gia:100000,anh:{uri:'https://nxbhcm.com.vn/Image/Biasach/dacnhantam86.jpg'}},
        {id:2,ten:'Sach2',gia:200000,anh:{uri:'https://cafebiz.cafebizcdn.vn/162123310254002176/2020/6/1/89352514119046-1590980660192526057720.jpg'}},
        {id:3,ten:'Sach3',gia:300000,anh:{uri:'https://cafebiz.cafebizcdn.vn/162123310254002176/2020/6/1/89352514119046-1590980660192526057720.jpg'}},

    ]

const ItemSachBanChay=({item})=>{

return(
    <View style={{height:200,width:150,backgroundColor:'#D9D9D9',justifyContent:'center',alignItems:'center',margin:5,borderRadius:20}}>
      <Image style={{height:100,width:100}} source={item.anh} />
      <Text style={[styles.chu,{marginTop:10}]}>Tên sách: {item.ten}</Text>
      <Text style={styles.chu}>Giá: {item.gia.toLocaleString("vi-VN")}đ</Text>
    </View>
)
}
  
  return (
    <View style={{flex:1}}>
       <View style={{flexDirection:'row',padding:20}}>
             <TouchableOpacity onPress={()=>{navigation.goBack()}}>
              <Image style={{height:20,width:20,}} source={require('../assets/icon_back.png')} />
             </TouchableOpacity>
             
            </View>
            <View style={{justifyContent:'center',height:360,alignItems:'center',borderColor:'#D9D9D9',borderBottomWidth:1}}>
                <Image style={{height:60,width:60}} source={require('../assets/icon_tichto.png')} />
                <Text style={{fontSize:18,fontWeight:'bold',marginTop:15}}>Cảm ơn bạn đã đặt hàng</Text>
                <TouchableOpacity style={styles.nut}>
                    <Text style={{fontSize:16}}>Xem thông tin đơn hàng</Text>
                </TouchableOpacity>
                <Image style={{height:140,width:'95%',marginTop:10}} source={require('../assets/anh_banner.png')} />

               

            </View>
            <View style={{padding:10}}>
             <Text style={{fontSize:18}}>Sách bán chạy nhất</Text>
             <FlatList
             data={Data}
             renderItem={({item})=>
                <ItemSachBanChay item={item}/>
             }
             keyExtractor={item =>item.id}
            horizontal
             />
            </View>
    </View>
  )
}

export default ManSauDatHang

const styles = StyleSheet.create({
    nut:{
        height:50,
        width:250,
        backgroundColor:'#D9D9D9',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:20
    },
    chu:{
        fontSize:16
    }
})