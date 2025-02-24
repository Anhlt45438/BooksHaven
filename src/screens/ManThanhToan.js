import { FlatList, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import { useNavigation, useRoute } from '@react-navigation/native'



const ManThanhToan = () => {
  const dataPTTT=[
   { id:1,pttt:'Thanh toán khi nhận hàng',icon:require('../assets/ttknh.png')},
   { id:2,pttt:'VNPay',icon:require('../assets/vnp.png')},
  ]
    const navigation=useNavigation();
    const route=useRoute();
    const {selectedProducts,tongtientatca}=route.params || {selectedProducts:[]};
  
    const [selectedPTTT, setSelectedPTTT] = useState(null); // Lưu trạng thái phương thức thanh toán

  const handleSelectPTTT = (id) => {
    setSelectedPTTT(id);
  };

  const groupByShop = (products) => {
    return products.reduce((acc, item) => {
      if (!acc[item.shop]) {
        acc[item.shop] = {
          shop: item.shop,
          items: [],
          shippingFee: 30000, // Chỉ tính phí ship một lần cho mỗi shop
        };
      }
      acc[item.shop].items.push(item);
      return acc;
    }, {});
  };
  
  const renderGroupedItems = (shopData) => {
    const { shop, items, shippingFee } = shopData;
  
    const totalShopPrice = items.reduce((sum, item) => sum + item.gia * item.soluong, 0);
    const totalPriceWithShipping = totalShopPrice + shippingFee;
  }

    const renderItem=({item})=>{
      const thanhtien=(item.gia*item.soluong+30000).toLocaleString('vi-VN');
      return(
        <View style={styles.sp} >
         <Text style={{fontWeight:'bold',fontSize:16,padding:10}}>{item.shop}</Text>
         <View style={{flexDirection:'row',padding:10}}>
          <Image style={{height:80,width:50}} source={item.anh} />
          <View style={{flexDirection:'column'}}>
          <View style={{paddingLeft:10,width:250}}>
          <Text style={{fontSize:16}}>{item.ten}</Text>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:40}}>
          <Text style={{fontWeight:'bold',fontSize:15}}>{item.gia} đ</Text>
         
        <Text style={{fontSize:15}} >
       Số lượng: {item.soluong}
        </Text>
      
          </View>
          
          </View>
          </View>
          
         </View>
         
         <View style={{justifyContent:'space-between',flexDirection:'row'}}>
         <Text style={{paddingLeft:10,
          paddingBottom:5
         }}>Chi phí ship COD (mặc định):</Text>
         <Text style={{marginRight:10}}> 30.000đ</Text>
         
          
         </View>

         <View style={{borderColor:'gray',borderTopWidth:1,padding:10,flexDirection:'row',justifyContent:'space-between'}}>
            <Text>Tổng số tiền(1 sản phẩm): </Text>
            <Text style={{fontWeight:'bold',fontSize:15}}>{thanhtien}đ</Text>
          </View>

       </View>
      )
      
    }

    const renderItemPTTT=({item})=>{
      const isSelected = item.id === selectedPTTT;
      return(
        
        <TouchableOpacity style={{borderBottomWidth:1,borderColor:'#D9D9D9'}} onPress={() => handleSelectPTTT(item.id)}>
        <View style={{padding:8,flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
        <Image source={item.icon}  />
        <Text style={{marginLeft:15}}>{item.pttt}</Text>
        </View>
        <TouchableOpacity style={[styles.checkbox, isSelected && styles.checked]} onPress={() => handleSelectPTTT(item.id)}>
          {isSelected &&<Image source={require('../assets/icon_tichtron.png')} />}
        </TouchableOpacity>
        </View>
      </TouchableOpacity>
      )}
  
  return (
    <View style={styles.container}>
      <View style={{flexDirection:'row',justifyContent:'center',}}>
       <TouchableOpacity onPress={()=>{navigation.goBack()}}>
        <Image style={{height:20,width:20,position:'absolute',right:100,top:5}} source={require('../assets/icon_back.png')} />
       </TouchableOpacity>
       <Text style={styles.title}>Thanh toán</Text>
      </View>

      <View style={styles.container2}>
       <TouchableOpacity style={styles.diachi}>
         <View style={{flexDirection:'column'}}>
         <View style={{flexDirection:'row'}}>
          <Image source={require('../assets/icon_diachi.png')} />

              <Text style={{marginLeft:20}}>Vũ Văn Công</Text>
              <Text style={{marginLeft:20}}>(+84) 396 622 583</Text>
         </View>
         
          <Text>Ngõ 14 Mễ Trì Hạ, {'\n'}Phường Mễ Trì , Quận Nam Từ Liêm, Hà Nội</Text>
         
         </View>
              <Image source={require('../assets/icon_muitenphai.png')} />

       </TouchableOpacity>

    
      
       <ScrollView scrollEnabled={true} style={{width:'96%'}}>
      <FlatList
      
       data={selectedProducts}
       renderItem={renderItem}
       keyExtractor={(item)=>item.id}
       ListEmptyComponent={<Text style={{textAlign:'center',
        marginTop:20
       }}>Không có sản phẩm nào trong giỏ hàng</Text>}
       nestedScrollEnabled={true}
       
       />
  
      
      <TouchableOpacity style={styles.voucher}>
            <Image style={{marginLeft:10}} source={require('../assets/voucher.png')} /> 
            <Text style={{marginRight:200}}>Voucher</Text>
            <Image  style={{marginRight:10}} source={require('../assets/icon_muitenphai.png')} />
      </TouchableOpacity>

      <View style={styles.phuongthuc}>
          <Text style={{fontSize:17,fontWeight:'bold'}}>Phương thức thanh toán</Text>
          <FlatList
          data={dataPTTT}
          renderItem={renderItemPTTT}
          />
      </View>
      <View style={styles.phuongthuc}>
          <Text style={{fontSize:17,fontWeight:'bold'}}>Phương thức thanh toán</Text>
         <View style={{padding:10}}>
         <View style={{flexDirection:'row',justifyContent:'space-between'}}>
            <Text style={styles.tien}>Tổng tiền hàng</Text>
            <Text>111111 đ</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:3}}>
            <Text style={styles.tien}>Tổng tiền phí vận chuyển</Text>
            <Text>111111 đ</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:3}}>
            <Text style={styles.tien}>Tổng cộng Voucher giảm giá</Text>
            <Text>- 0đ</Text>
          </View>
          <View style={{flexDirection:'row',justifyContent:'space-between',marginTop:12}}>
            <Text style={styles.tien2}>Tổng tiền hàng</Text>
            <Text style={styles.tien2}>111111 đ</Text>
          </View>
         </View>
      </View>
      <View style={{padding:10}}>
        <Text>Nhấn “Đặt hàng” đồng nghĩa với việc bạn đồng ý tuân theo điều khoản của chúng tôi</Text>
      </View>


      </ScrollView>
      <View style={styles.dathang}>
       <View style={{flexDirection:'row',width:'50%',justifyContent:'space-evenly',alignItems:'center'}}>
          <Text style={{fontSize:15,fontWeight:'bold'}}>Tổng thanh toán</Text>
          <Text style={{color:'#5908B0',fontSize:15,fontWeight:'bold'}}>12222 đ</Text>
       </View>
       <TouchableOpacity style={styles.btndathang}>
           <Text style={{color:'white',fontWeight:'bold'}}>Đặt hàng</Text>
       </TouchableOpacity>

      </View>

      </View>
    </View>
  )
}

export default ManThanhToan

const styles = StyleSheet.create({
    container:{
        flex:1,
        padding:5
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
    diachi:{
      
      marginTop:10,
      height:'auto',
      width:'96%',
      backgroundColor:'#FFFFFF',
      padding:10,
      borderRadius:10,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'
      
    },
    sp:{
      marginTop:10,
      height:'auto',
      width:'100%',
      backgroundColor:'#FFFFFF',
      
      borderRadius:10,
    },
    voucher:{
      marginTop:10,
      height:'auto',
      width:'100%',
      backgroundColor:'#FFFFFF',
      padding:10,
      borderRadius:10,
      flexDirection:'row',
      alignItems:'center',
      justifyContent:'space-between'
    },
    phuongthuc:{
      marginTop:10,
      height:'auto',
      width:'100%',
      backgroundColor:'#FFFFFF',
      padding:10,
      borderRadius:10,
    },
      checkbox: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#D9D9D9',
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        
      },
      tien:{
        fontSize:14,
        
      },
      tien2:{
        fontSize:14,
        fontWeight:'bold'
      },
      dathang:{
        height:60,
        width:'100%',
        backgroundColor:'#FFFFFF',
        borderTopLeftRadius:20,
        borderTopRightRadius:20,
        flexDirection:'row',
        justifyContent:'space-around',
        alignItems:'center'
      },
      btndathang:{
        height:40,
        width:100,
        backgroundColor:'#5908B0',
        borderRadius:10,
        justifyContent:'center',
        alignItems:'center'
  
      }
     
    
})