import { FlatList, Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useAppSelector } from '../redux/hooks';
import { getAccessToken } from '../redux/storageHelper';

    const renderShopSection = ({ item,onTotalPriceChange
        // : shop
     }) => {
     
            const [shopName, setShopName] = useState("");
            
            const [tongTienMoiSP, setTongTienMoiSP] = useState(0);

              
            
        


        useEffect(() => {
            const fetchShopName = async () => {
                const accessToken = await getAccessToken();
              try {
                const response = await fetch(`http://14.225.206.60:3000/api/shops/get-shop-info/${item.chi_tiet_don_hang[0].book.id_shop}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                    'Authorization': `Bearer ${accessToken}`,
                  },
                  body: JSON.stringify({ id_shop: item.chi_tiet_don_hang[0].book.id_shop }),
                });
          
              
          
                const shop = await response.json();
                console.log("tt shop:", shop);
          
                setShopName(shop.data.ten_shop);

                
              } catch (error) {
                console.error("Lỗi khi lấy tên shop:", error);
                setShopName("Không xác định");
              }
            };
          
            fetchShopName();
          }, [item.chi_tiet_don_hang[0].book.id_shop]);
         

        //   console.log("soluongmua",item.so_luong_mua);


        const formatPrice = (price) => {
          return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
        };
    
        // const totalShopPrice = shop.products.reduce((sum, product) => sum + product.book_info.gia * product.so_luong, 0);
        // const totalWithShipping = totalShopPrice + shop.shippingFee;
        // console.log("  ",totalShopPrice);
        // console.log("  ",shop.products);
       
      const BookItem=({book})=>{
         return(
          <View style={{flexDirection:'row',marginTop:5,justifyContent:'space-between',padding:10,alignItems:'center'}}>
            <View style={{flexDirection:'row',width:'70%'}}>
            <Image style={{height:90,width:70}} source={{uri:book.book.anh}} />
            <View style={{marginLeft:5,justifyContent:'space-evenly'}}>
              <Text style={{fontWeight:'bold', fontSize:15,height:40}}>Sách: {book.book.ten_sach}</Text>
              <Text style={{marginTop:10,fontSize:15}}>Giá: <Text style={{fontWeight:'bold',fontSize:15}}>{formatPrice(book.book.gia)}</Text></Text>
              <Text style={{fontSize:15}}>Số lượng còn: <Text style={{fontWeight:'bold',fontSize:15}}>{book.book.so_luong}</Text> quyển</Text>
            </View>
            </View>
            <Text style={{fontSize:18}}>x{book.details.so_luong}</Text>
          </View>
         )
      }
        
        return (
            <View style={styles.sp}>
            <Text style={{ fontWeight: 'bold', fontSize: 17, padding: 10 }}>{shopName}</Text>
            <View style={{borderColor:'gray',borderBottomWidth:1,borderTopWidth:1}}>
                <FlatList 
                data={item.chi_tiet_don_hang}
                renderItem={({item})=> <BookItem book={item}  />}
                keyExtractor={(book)=>book.details.id_ctdh}
                />
            </View>
                <Text style={{paddingLeft:15,padding:10,fontSize:15}}>Trạng thái đơn hàng: <Text style={{fontWeight:'bold'}}>{item.trang_thai}</Text></Text>
               
                
            </View>
        );
    };

export default renderShopSection

const styles = StyleSheet.create({
    sp: {
        marginTop: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
})