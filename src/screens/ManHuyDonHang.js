import { StyleSheet, Text, View ,TouchableOpacity,Image} from 'react-native'
import React from 'react'

const ManHuyDonHang = () => {
    const DataDiachi={id_user:1,hoten:'Vũ Văn Công',sdt:'0974832596',diachi:'ngõ 14 mễ trì hạ Phường Mễ Trì, Quận Nam Từ Liêm, Hà Nội'};
    const formattedPhone = DataDiachi.sdt.replace(/^0/, '(84) ');
  return (
    <View style={styles.container}>
     <View style={{flexDirection:'row',justifyContent:'center',padding:10}}>
            <TouchableOpacity onPress={()=>{navigation.goBack()}}>
             <Image style={{height:20,width:20,position:'absolute',right:100,top:5}} source={require('../assets/icon_back.png')} />
            </TouchableOpacity>
            <Text style={styles.title}>Đã đặt hàng</Text>
           </View>
           <View style={{justifyContent:'center',alignItems:'center',marginTop:20,borderColor:'#D9D9D9',borderBottomWidth:1,padding:20}}>
            <Image  source={require('../assets/icon_quangduong2.png')}  />
           </View>
           <View style={{padding:20}}>
            <View style={{flexDirection:'row',width:250,justifyContent:'space-around',alignItems:'center'}}>
            <Image source={require('../assets/icon_diachi.png')} />
            <Text style={{fontSize:16,fontWeight:'bold'}}>{DataDiachi.hoten}</Text>
            <Text>{formattedPhone}</Text>
            </View>
            <View style={{width:300,}}>
            <Text>{DataDiachi.diachi}</Text>
            <TouchableOpacity>
                <Text style={{fontWeight:'bold',color:'#5908B0',fontSize:16}}>Thay đổi địa chỉ...</Text>
            </TouchableOpacity>
            </View>
           
           </View>
           <View style={{borderBottomWidth:1,borderColor:'#D9D9D9'}}></View>
           
    </View>
  )
}

export default ManHuyDonHang

const styles = StyleSheet.create({
    container:{
        flex:1,
        
    },
    title:{
        fontSize:20,
        fontWeight:'bold',
 
     },
     container2:{
         flex:1,
         backgroundColor:'#D9D9D9',
        marginTop:20,
         alignItems:'center'
        
     },
})