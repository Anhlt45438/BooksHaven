import { Image, StyleSheet, Text, View } from 'react-native'
import React, { useEffect, useState } from 'react'

    const renderShopSection = ({ item
        // : shop
     }) => {
            const [shopName, setShopName] = useState("");
        
        useEffect(() => {
            const fetchShopName = async () => {
              try {
                const response = await fetch(`http://10.0.2.2:3000/api/shops/get-shop-info/${item.book_info.id_shop}`, {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ id_shop: item.book_info.id_shop }),
                });
          
                console.log("id shop:", item.book_info.id_shop);
          
                const shop = await response.json();
                console.log("tt shop:", shop);
          
                setShopName(shop.data.ten_shop);
                console.log("ten shop:", shop.ten_shop);
                
              } catch (error) {
                console.error("Lỗi khi lấy tên shop:", error);
                setShopName("Không xác định");
              }
            };
          
            fetchShopName();
          }, [item.book_info.id_shop]);
          console.log("id_sach: ",item.book_info.id_shop);

    
        // const totalShopPrice = shop.products.reduce((sum, product) => sum + product.book_info.gia * product.so_luong, 0);
        // const totalWithShipping = totalShopPrice + shop.shippingFee;
        // console.log("  ",totalShopPrice);
        // console.log("  ",shop.products);
       
      
        
        return (
            <View style={styles.sp}>
                <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 10 }}>{shopName}</Text>
                {/* {shop.products.map((product) => ( */}
                    <View
                    //  key={product.id_ctgh} 
                     style={{ flexDirection: 'row', padding: 10, borderColor: '#D9D9D9', borderTopWidth: 1 }}>
                        <Image style={{ height: 80, width: 50 }} source={{uri:item.book_info.anh}} />
                        <View style={{ paddingLeft: 10, flex: 1 }}>
                            <Text style={{ fontSize: 16 }}>Sách: {item.book_info.ten_sach}</Text>
                            <Text style={{borderWidth:1,borderColor:'gray',width:100,fontSize:12,marginTop:10,backgroundColor:'#D9D9D9'}}>Trả hàng miễn phí</Text>
                            <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
                                <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Giá: {item.book_info.gia.toLocaleString('vi-VN')} đ</Text>
                                
                                <Text>Số lượng: {item.so_luong}</Text>
                            </View>
                        </View>
                    </View>
                {/* // ))} */}
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 5 }}>
                    <Text>Phí ship COD (mặc định):</Text>
                    <Text>
                        {/* {shop.shippingFee.toLocaleString('vi-VN')}  */}
                        đ</Text>
                </View>
                <View style={{ borderColor: 'gray', borderTopWidth: 1, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text>Tổng tiền shop 
                        {/* ({shop.products.length} sản phẩm): */}
                         </Text>
                    <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
                        {/* {totalWithShipping.toLocaleString('vi-VN')} */}
                         đ</Text>
                </View>
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