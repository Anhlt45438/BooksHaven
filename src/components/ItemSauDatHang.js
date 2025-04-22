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
            <View style={{marginLeft:5}}>
              <Text style={{fontWeight:'bold', fontSize:18}}>Sách: {book.book.ten_sach}</Text>
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
            <Text style={{ fontWeight: 'bold', fontSize: 18, padding: 10 }}>{shopName}</Text>
                {/* {shop.products.map((product) => ( */}
                    {/* <View
                    //  key={product.id_ctgh} 
                     style={{ flexDirection: 'row', padding: 10, borderColor: '#D9D9D9', borderTopWidth: 1 }}>
                        <Image style={{ height: 80, width: 50 }} source={{uri:item.chi_tiet_don_hang[0].book.anh}} />
                        <View style={{ paddingLeft: 10, flex: 1 }}>
                            <Text style={{ fontSize: 16 }}>Sách: {item.chi_tiet_don_hang[0].book.ten_sach}</Text>
                            <Text style={{borderWidth:1,borderColor:'gray',width:100,fontSize:12,marginTop:10,backgroundColor:'#D9D9D9'}}>Trả hàng miễn phí</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Giá: {formatPrice(item.chi_tiet_don_hang[0].book.gia)}</Text>
                                
                                <Text>Số lượng: {item.chi_tiet_don_hang[0].details.so_luong}</Text>
                            </View>
                        </View>
                    </View> */}
                {/* // ))} */}
                <FlatList
                data={item.chi_tiet_don_hang}
                renderItem={({item})=> <BookItem book={item}  />}
                keyExtractor={(book)=>book.details.id_ctdh}
                />
               
                
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