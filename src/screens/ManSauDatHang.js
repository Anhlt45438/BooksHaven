import { StyleSheet, Text, View,TouchableOpacity,Image, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import ItemSauDatHang from '../components/ItemSauDatHang';
import { getAccessToken } from '../redux/storageHelper';

const ManSauDatHang = () => {

const navigation = useNavigation();
  const route = useRoute();
  const [order, setOrder] = useState([]);
  const [tongtiendonhang, setTongTienDonHang] = useState();
   
  

 useEffect(() => {
                const fetchOrder = async () => {
                    const accessToken = await getAccessToken();
                  try {
                    const response = await fetch(`http://14.225.206.60:3000/api/orders/recent`, {
                      method: "GET",
                      headers: {
                        "Content-Type": "application/json",
                        'Authorization': `Bearer ${accessToken}`,
                      },
                      
                    });

                    const donhang = await response.json();
                    console.log("don hang:", donhang);
              
                    setOrder(donhang.data.orders);
                    setTongTienDonHang(donhang.data.payment_info.so_tien);
                   
                    
                  } catch (error) {
                    console.error("Lỗi khi lấy đơn hàng", error);
                  
                  }
                };
              
                fetchOrder();
              }, []);

const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
  };

  
  const idCtdhList = order.map(item => item.chi_tiet_don_hang[0].id_ctdh);
  console.log('tong tien: ',tongtiendonhang);
  console.log('order: ',order);
 

  
  return (
    <View style={{flex:1}}>
       <View style={{flexDirection:'row',padding:10}}>
            </View>
            <View style={{justifyContent:'center',height:360,alignItems:'center',borderColor:'#D9D9D9',borderBottomWidth:1}}>
                <Image style={{height:60,width:60}} source={require('../assets/icon_tichto.png')} />
                <Text style={{fontSize:18,fontWeight:'bold',marginTop:15}}>Cảm ơn bạn đã đặt hàng</Text>
                <TouchableOpacity style={styles.nut}  onPress={()=>{
                     navigation.navigate('HomeTabBottom', { screen: 'HomeScreen' });
                }}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>Trở về trang chủ</Text>
                </TouchableOpacity>
               
                <Image style={{height:140,width:'95%',marginTop:10}} source={require('../assets/anh_banner.png')} />

               

            </View>
            <View style={{padding:10,flex:1}}>
             <View style={{flexDirection:'row',alignItems:'center'}}>
             <Text style={{fontSize:18,marginLeft:10}}>Đơn hàng của bạn</Text>
             </View>
             <FlatList
             style={{marginTop:5}}
             data={order}
             renderItem={({item})=>
                <ItemSauDatHang  item={item}/>
             }
             keyExtractor={(item) =>item._id}
            
             />
              
            </View>
            <View style={{justifyContent:'center',alignItems:'center',padding:15}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',width:'100%',marginBottom:10}}>
              <Text style={{fontWeight:'bold',fontSize:16}}>Tổng tiền thanh toán</Text>
              <Text style={{fontWeight:'bold',fontSize:16}}>{formatPrice(tongtiendonhang)}</Text>
              </View>
            <TouchableOpacity style={styles.nut2}>
                    <Text style={{fontSize:16,fontWeight:'bold'}}>Hủy đơn hàng</Text>
                </TouchableOpacity>
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
        marginTop:10,
        borderColor:'black',
        borderWidth:1
    },
    nut2:{
        height:40,
        width:200,
        backgroundColor:'#D9D9D9',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center',
        marginTop:10,
        borderColor:'black',
        borderWidth:1
    },
    chu:{
        fontSize:16
    }
})