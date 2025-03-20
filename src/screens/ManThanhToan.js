import {
    FlatList,
    Image,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';
import React, { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import ItemThanhToan from '../components/ItemThanhToan';

const ManThanhToan = () => {
    const dataPTTT = [
        { id: 1, pttt: 'Thanh toán khi nhận hàng', icon: require('../assets/ttknh.png') },
        { id: 2, pttt: 'VNPay', icon: require('../assets/vnp.png') },
    ];

    const navigation = useNavigation();
    const route = useRoute();
    const { selectedProducts, tongtientatca } = route.params || { selectedProducts: [] };

    const [selectedPTTT, setSelectedPTTT] = useState(null); // Lưu trạng thái phương thức thanh toán
    const [shopName, setShopName] = useState("");
    


    const handleSelectPTTT = (id) => {
        setSelectedPTTT(id);
    };
    console.log("Sản phẩm đã chọn:",selectedProducts);
    
    
   
      
    
   
    // const groupProductsByShop = (products) => {
    //     const grouped = products.reduce((result, product) => {
    //         const shopId = product.book_info.id_shop; // Lấy id_shop chính xác
            
    //         if (!result[shopId]) {
    //             result[shopId] = {
    //                 shopName: `Shop ${shopId}`, // Hoặc bạn có thể lấy từ API
    //                 products: [],
    //                 shippingFee: 30000, // mỗi shop 1 phí ship
    //             };
    //             useEffect(() => {
    //                 fetchShopInfo(product.book_info.id_shop)
           
    //               }, [])
                  
                
    //         }
    
    //         result[shopId].products.push(product); // Nhóm sản phẩm vào đúng shop
    //         return result;
    //     }, {});
    
    //     return Object.values(grouped); // trả về mảng các shop đã nhóm
    // };
    
    // const groupedShops = groupProductsByShop(selectedProducts);

    // console.log("Nhóm:",groupedShops);


    // const renderShopSection = ({ item
    //     // : shop
    //  }) => {
   
    //     // const totalShopPrice = shop.products.reduce((sum, product) => sum + product.book_info.gia * product.so_luong, 0);
    //     // const totalWithShipping = totalShopPrice + shop.shippingFee;
    //     // console.log("  ",totalShopPrice);
    //     // console.log("  ",shop.products);
       
      
        
    //     return (
    //         <View style={styles.sp}>
    //             <Text style={{ fontWeight: 'bold', fontSize: 16, padding: 10 }}>{shopName}</Text>
    //             {/* {shop.products.map((product) => ( */}
    //                 <View
    //                 //  key={product.id_ctgh} 
    //                  style={{ flexDirection: 'row', padding: 10, borderColor: '#D9D9D9', borderTopWidth: 1 }}>
    //                     <Image style={{ height: 80, width: 50 }} source={{uri:item.book_info.anh}} />
    //                     <View style={{ paddingLeft: 10, flex: 1 }}>
    //                         <Text style={{ fontSize: 16 }}>Sách: {item.book_info.ten_sach}</Text>
    //                         <Text style={{borderWidth:1,borderColor:'gray',width:100,fontSize:12,marginTop:10,backgroundColor:'#D9D9D9'}}>Trả hàng miễn phí</Text>
    //                         <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 }}>
    //                             <Text style={{ fontWeight: 'bold', fontSize: 15 }}>Giá: {item.book_info.gia.toLocaleString('vi-VN')} đ</Text>
                                
    //                             <Text>Số lượng: {item.so_luong}</Text>
    //                         </View>
    //                     </View>
    //                 </View>
    //             {/* // ))} */}
    //             <View style={{ flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: 10, paddingTop: 5 }}>
    //                 <Text>Phí ship COD (mặc định):</Text>
    //                 <Text>
    //                     {/* {shop.shippingFee.toLocaleString('vi-VN')}  */}
    //                     đ</Text>
    //             </View>
    //             <View style={{ borderColor: 'gray', borderTopWidth: 1, padding: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
    //                 <Text>Tổng tiền shop 
    //                     {/* ({shop.products.length} sản phẩm): */}
    //                      </Text>
    //                 <Text style={{ fontWeight: 'bold', fontSize: 15 }}>
    //                     {/* {totalWithShipping.toLocaleString('vi-VN')} */}
    //                      đ</Text>
    //             </View>
    //         </View>
    //     );
    // };

    // const calculateTotalAllShops = (groupedShops) => {
    //     let totalProductPrice = 0;
    //     let totalShippingFee = 0;
    //     groupedShops.forEach(shop => {

    //         const shopTotal = shop.products.reduce((sum, product) => sum + product.book_info.gia * product.so_luong, 0);

    //         totalProductPrice += shopTotal;
    //         totalShippingFee += shop.shippingFee;
    //     });
    //     const totalPayment = totalProductPrice + totalShippingFee;
    //     return { totalProductPrice, totalShippingFee, totalPayment };
    // };

    // const { totalProductPrice, totalShippingFee, totalPayment } = calculateTotalAllShops(groupedShops);

    const renderItemPTTT = ({ item }) => {
        const isSelected = item.id === selectedPTTT;
        return (
            <TouchableOpacity style={{ borderBottomWidth: 1, borderColor: '#D9D9D9' }} onPress={() => handleSelectPTTT(item.id)}>
                <View style={{ padding: 8, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Image source={item.icon} />
                        <Text style={{ marginLeft: 15 }}>{item.pttt}</Text>
                    </View>
                    <TouchableOpacity style={[styles.checkbox, isSelected && styles.checked]} onPress={() => handleSelectPTTT(item.id)}>
                        {isSelected && <Image source={require('../assets/icon_tichtron.png')} />}
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        );
    };

    return (
        <View style={styles.container}>
            {/* Header */}
            <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <Image style={{ height: 20, width: 20, position: 'absolute', right: 100, top: 5 }} source={require('../assets/icon_back.png')} />
                </TouchableOpacity>
                <Text style={styles.title}>Thanh toán</Text>
            </View>

            <View style={styles.container2}>
                {/* Địa chỉ */}
                <TouchableOpacity style={styles.diachi}>
                    <View style={{ flexDirection: 'column' }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Image source={require('../assets/icon_diachi.png')} />
                            <Text style={{ marginLeft: 20 }}>Vũ Văn Công</Text>
                            <Text style={{ marginLeft: 20 }}>(+84) 396 622 583</Text>
                        </View>
                        <Text>
                            Ngõ 14 Mễ Trì Hạ, {'\n'}Phường Mễ Trì , Quận Nam Từ Liêm, Hà Nội
                        </Text>
                    </View>
                    <Image source={require('../assets/icon_muitenphai.png')} />
                </TouchableOpacity>

                {/* Outer FlatList thay cho ScrollView */}
                <FlatList
                    styles={{width: '98%'}}
                    data={[{}]} // dummy data, chỉ có 1 item
                    keyExtractor={(_, index) => index.toString()}
                    renderItem={() => (
                        <View style={{padding: 5,}}>
                            {/* Danh sách shop */}
                            <FlatList
                                data={selectedProducts}
                                renderItem={({ item }) => (
                                    <ItemThanhToan
                                      item={item}
                                     
                                  
                                    />
                                  )}
                                keyExtractor={(item, index) => item.id_sach?.toString() || index.toString()} 
                                nestedScrollEnabled={true}
                                ListEmptyComponent={<Text style={{textAlign:'center'}}>Không có sản phẩm nào được thanh toán</Text>}
                            />

                            {/* Phương thức thanh toán */}
                            <View style={styles.phuongthuc}>
                                <Text style={{ fontSize: 17, fontWeight: 'bold' }}>Phương thức thanh toán</Text>
                                <FlatList
                                    data={dataPTTT}
                                    renderItem={renderItemPTTT}
                                    keyExtractor={(item) => item.id.toString()}
                                    nestedScrollEnabled={true}
                                />
                            </View>

                            {/* Tóm tắt thanh toán */}
                            <View style={styles.phuongthuc}>
                                <View style={{ padding: 10 }}>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                                        <Text style={styles.tien}>Tổng tiền hàng</Text>
                                        <Text>
                                            {/* {totalProductPrice.toLocaleString('vi-VN')} */}
                                             đ</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 3 }}>
                                        <Text style={styles.tien}>Tổng tiền phí vận chuyển</Text>
                                        <Text>+
                                             {/* {totalShippingFee.toLocaleString('vi-VN')} */}
                                             
                                             đ</Text>
                                    </View>
                                    <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 }}>
                                        <Text style={styles.tien2}>Tổng thanh toán</Text>
                                        <Text style={styles.tien2}>
                                            {/* {totalPayment.toLocaleString('vi-VN')} */}
                                             đ</Text>
                                    </View>
                                </View>
                            </View>

                            {/* Disclaimer */}
                            <View style={{ padding: 10 }}>
                                <Text>
                                    Nhấn “Đặt hàng” đồng nghĩa với việc bạn đồng ý tuân theo điều khoản của chúng tôi
                                </Text>
                            </View>
                        </View>
                    )}
                />

                {/* Thanh đặt hàng */}
                <View style={styles.dathang}>
                    <View style={{ flexDirection: 'row', width: '50%', justifyContent: 'space-evenly', alignItems: 'center' }}>
                        <Text style={{ fontSize: 15, fontWeight: 'bold' }}>Tổng thanh toán</Text>
                        <Text style={{ color: '#5908B0', fontSize: 15, fontWeight: 'bold' }}>
                            {/* {totalPayment.toLocaleString('vi-VN')} đ */}
                        </Text>
                    </View>
                    <TouchableOpacity style={styles.btndathang}>
                        <Text style={{ color: 'white', fontWeight: 'bold' }}>Đặt hàng</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

export default ManThanhToan;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 5,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    container2: {
        flex: 1,
        backgroundColor: '#D9D9D9',
        marginTop: 20,
        alignItems: 'center',
    },
    diachi: {
        marginTop: 10,
        width: '98%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    sp: {
        marginTop: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
    },
    phuongthuc: {
        marginTop: 10,
        width: '100%',
        backgroundColor: '#FFFFFF',
        padding: 10,
        borderRadius: 10,
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
    tien: {
        fontSize: 14,
    },
    tien2: {
        fontSize: 14,
        fontWeight: 'bold',
    },
    dathang: {
        height: 60,
        width: '100%',
        backgroundColor: '#FFFFFF',
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center',
    },
    btndathang: {
        height: 40,
        width: 100,
        backgroundColor: '#5908B0',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
    },
});
