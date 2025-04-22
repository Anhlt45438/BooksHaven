import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const ItemChiTietDonHang = ({item}) => {
  return (
    <View
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
                        </View>
  )
}

export default ItemChiTietDonHang

const styles = StyleSheet.create({})