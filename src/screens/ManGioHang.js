import {  FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ItemTatCaGioHang from '../components/ItemTatCaGioHang';

const Data=[
  { id: '1', ten: 'Sản phẩm 1', gia: 10000,theloai:'In stock',shop:'ABC ShopShop' },
  { id: '2', ten: 'Sản phẩm 2 Sản phẩm 2 Sản phẩm 2 Sản phẩm 2 Sản phẩm 2v ', gia: 20000,theloai:'In stock',shop:'ABC ShopShop'  },
  { id: '3', ten: 'Sản phẩm 3', gia: 30000,theloai:'In stock',shop:'ABC ShopShop'  },
  { id: '4', ten: 'Sản phẩm 4', gia: 40000,theloai:'In stock',shop:'ABC ShopShop'  },
  { id: '5', ten: 'Sản phẩm 5', gia: 50000,theloai:'In stock',shop:'ABC ShopShop'  },
]

const ManGioHang = () => {
  const [tab, setTab] = useState('tatca'); // Trạng thái để biết tab nào đang mở
  const [tongtientatca, setTongtientatca] = useState(0); // Trạng thái để biết tab nào đang mở
  const [sosanphamtatca, setSosanphamtatca] = useState(0); // Trạng thái để biết tab nào đang mở
  
  const tinhTongtienTatca=()=>{

  }
  const tongSanpham=()=>{

  }
  const renderTabContent = () => {
    switch (tab) {
      case 'tatca':
        return (
          <View style={styles.tabtatca}>
            <FlatList
            data={Data}
            keyExtractor={item=>item.id}
            renderItem={({item}) => <ItemTatCaGioHang item={item} />}
            />
            <View style={{flexDirection:'row',height:60,width:'100%',backgroundColor:'#F0F6D0',justifyContent:'center',alignItems:'center'}}>
           <Text style={{fontSize:16,fontWeight:'bold'}}>Tổng tiền:{tongtientatca}đ</Text>
           <TouchableOpacity style={styles.btnThanhtoan}>
           
              <Text style={{color:'white',fontWeight:'bold',fontSize:16}}>Thanh toán({sosanphamtatca})</Text>
            
           </TouchableOpacity>
           <Text>{}</Text>
            </View>
          </View>
        );
      case 'damua':
        return (
          <View style={styles.tabdamua}>
            <TextInput style={styles.ip} placeholder="Tên" />
            <TextInput style={styles.ip} placeholder="Email" />
            <TextInput style={styles.ip} placeholder="Mật khẩu" secureTextEntry />
          </View>
        );
      default:
        return null;
    }
  };
  
  return (
    <View style={styles.container}>
    <Text style={styles.title}>Giỏ hàng</Text>
    
   <View style={styles.tabContainer}>
    <TouchableOpacity onPress={()=>setTab('tatca')}  style={[styles.tabButton, tab === 'tatca' && styles.activeTab]}>
      <Text style={{color:'black',fontSize:18,fontWeight:'bold', textShadowColor:'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 }, 
        textShadowRadius: 4, }}>Tất cả</Text>
    </TouchableOpacity>
    <TouchableOpacity onPress={()=>setTab('damua')}  style={[styles.tabButton, tab === 'damua' && styles.activeTab]}>
      <Text style={{color:'black',fontSize:18,fontWeight:'bold', textShadowColor:'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 1, height: 1 }, 
        textShadowRadius: 4, }}>Đã mua</Text>
    </TouchableOpacity>
    

   </View>
   {renderTabContent()}

    </View>
  )
}


export default ManGioHang

const styles = StyleSheet.create({
    container:{
        flex:1,
        flexDirection:'column'
    },
    title:{
        fontSize:36,
        fontWeight:'bold',
        textShadowColor:'rgba(0, 0, 0, 0.5)',
        textShadowOffset: { width: 2, height: 2 }, 
        textShadowRadius: 4, 
        padding:10


    },
    tabContainer:{

      flexDirection:'row',
      justifyContent:'space-evenly'
    },
    tabButton:{
      flex: 1,
      paddingVertical: 10,
      alignItems: 'center',
      backgroundColor: '#E1DEDE',
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 4,
      elevation: 5, 
      

    },
    activeTab:{
      backgroundColor: '#EF6363',
    },
    tabtatca:{
      flex:1,
      justifyContent:'center',
      alignItems:'center',
      
    },
    btnThanhtoan:{
      height:40,
      width:140,
      marginLeft:90,
      backgroundColor:'#5908B0',
      borderRadius:12,
      justifyContent:'center',
      alignItems:'center',
      shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5,
    shadowRadius: 4,

    // Hiệu ứng bóng đổ trên Android
    elevation: 5,
    }
   
})