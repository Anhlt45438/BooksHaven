import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import ItemTatCaGioHang from '../components/ItemTatCaGioHang';
import { useNavigation } from '@react-navigation/native';
import ManThanhToan from "./ManThanhToan";

const Data = [
  { id: '1', ten: 'Sản phẩm 1', gia: 10000, theloai: 'In stock', shop: 'ABC ShopShop' ,soluong:3,anh:{uri:'https://simg.zalopay.com.vn/zlp-website/assets/Toi_Ac_Va_Hinh_Phat_Fyodor_Dostoevsky_5735b91186.jpg'}},
  { id: '2', ten: 'Sản phẩm 2 Sản phẩm 2 Sản phẩm 2 Sản phẩm 2 Sản phẩm 2v ', gia: 20000, theloai: 'In stock', shop: 'ABC ShopShop',anh:{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSViVJ25Z427iPCqpBqK9krp3swOhB86R02qA&s'} },
  { id: '3', ten: 'Sản phẩm 3', gia: 30000, theloai: 'In stock', shop: 'ABC ShopShop' ,soluong:1,anh:{uri:'https://cafefcdn.com/203337114487263232/2021/12/27/photo-1-16405775983341682453197.jpg'}},
  { id: '4', ten: 'Sản phẩm 4', gia: 40000, theloai: 'In stock', shop: 'ABC ShopShop3' ,soluong:1,anh:{uri:'https://simg.zalopay.com.vn/zlp-website/assets/Toi_Ac_Va_Hinh_Phat_Fyodor_Dostoevsky_5735b91186.jpg'}},
  { id: '5', ten: 'Sản phẩm 5', gia: 50000, theloai: 'In stock', shop: 'ABC ShopShop5' ,soluong:1,anh:{uri:'https://simg.zalopay.com.vn/zlp-website/assets/Toi_Ac_Va_Hinh_Phat_Fyodor_Dostoevsky_5735b91186.jpg'}},
  { id: '6', ten: 'Sản phẩm 6', gia: 60000, theloai: 'In stock', shop: 'ABC ShopShop6' ,soluong:1,anh:{uri:'https://pos.nvncdn.com/86c7ad-50310/art/artCT/20230602_t8u5NvLA.jpg'}},
  { id: '7', ten: 'Sản phẩm 7', gia: 70000, theloai: 'In stock', shop: 'ABC ShopShop7',soluong:1 ,anh:{uri:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5fOpwWtznzwyHjzCXUMS-EnOcUreKWg5njA&s'}},
  { id: '8', ten: 'Sản phẩm 8', gia: 80000, theloai: 'In stock', shop: 'ABC ShopShop8',soluong:1,anh:{uri:'https://ntthnue.edu.vn/uploads/Images/2023/10/017.jpeg'} },
  { id: '9', ten: 'Sản phẩm 9', gia: 90000, theloai: 'In stock', shop: 'ABC ShopShop9',soluong:1 ,anh:{uri:'https://nqhtutor.edu.vn/upload/assets/fm/20221207/fq7i-3-cuon-sach-chac-han-se-thay-doi-tu-duy-cua-ban-2.png'} },
];

const ManGioHang = () => {
  const navigation=useNavigation();
  const [data, setData] = useState(Data)
  
  const [tongtientatca, setTongtientatca] = useState(0);
  const [sosanphamtatca, setSosanphamtatca] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState(
    Data.reduce((acc, item) => {
      acc[item.id] = item.soluong || 1; // Lấy sẵn số lượng từ Data
      return acc;
    }, {})
  );
  
  const handleDeleteItem = (id) => {
    const deletedItem = data.find(item => item.id === id);
    const updatedCart = data.filter(item => item.id !== id);
    setData(updatedCart);
  
    // Nếu sản phẩm bị xóa đang được chọn, cập nhật tổng tiền và số sản phẩm
    if (selectedItems[id]) {
      setTongtientatca(prev => prev - (deletedItem.gia * quantities[id]));
      setSosanphamtatca(prev => prev - 1);
    }
  
    // Xóa sản phẩm khỏi danh sách các sản phẩm đã chọn
    setSelectedItems(prev => {
      const updatedSelectedItems = { ...prev };
      delete updatedSelectedItems[id];
      return updatedSelectedItems;
    });
  
    // Xóa số lượng của sản phẩm bị xóa
    setQuantities(prev => {
      const updatedQuantities = { ...prev };
      delete updatedQuantities[id];
      return updatedQuantities;
    });
  };
  
 
  const handleCheckChange = (checked, tongTienMoisp, soLuong, id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: checked,
    }));
  
    if (checked) {
      setTongtientatca(prev => prev + tongTienMoisp * soLuong);
      setSosanphamtatca(prev => prev + 1);
    } else {
      setTongtientatca(prev => prev - tongTienMoisp * soLuong);
      setSosanphamtatca(prev => prev - 1);
    }
  };

  const handleUpdateQuantity = (id, newQuantity, gia, isChecked) => {
    const oldQuantity = quantities[id];

    setQuantities(prev => ({
      ...prev,
      [id]: newQuantity,
    }));

    if (isChecked) {
      const chenhLech = newQuantity - oldQuantity;
      setTongtientatca(prev => prev + gia * chenhLech);
    }
  };

  
          
       

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>

      <View style={styles.tabtatca}>
            <FlatList
              data={data}
              keyExtractor={item => item.id.toString()}
              renderItem={({ item }) => (
                <ItemTatCaGioHang
                  item={item}
                  onCheckChange={(checked, tongTienMoisp) =>
                    handleCheckChange(checked, tongTienMoisp, quantities[item.id] || 1, item.id)
                  }
                  onUpdateQuantity={(newQuantity, isChecked) =>
                    handleUpdateQuantity(item.id, newQuantity, item.gia, isChecked)
                  }
                  isChecked={!!selectedItems[item.id]}
                  quantity={quantities[item.id] || 1}  
                  onDelete={handleDeleteItem} 
                />
              )}
              ListEmptyComponent={<Text>Không có sản phẩm nào trong giỏ hàng</Text>}
            />
           
            <View style={styles.bottomContainer}>
              <Text style={styles.totalText}>Tổng tiền: {tongtientatca}đ</Text>
              <TouchableOpacity style={styles.btnThanhtoan} onPress={()=>{
              
                const selectedProducts = data.filter((item) => selectedItems[item.id]).map((item) => ({
                  ...item,
                  soluong: quantities[item.id],
                }));
                navigation.navigate('Payments',{selectedProducts,tongtientatca})
              }}>
                <Text style={styles.btnText}>Thanh toán ({sosanphamtatca})</Text>
              </TouchableOpacity>
            </View>
          </View>
    </View>
  );
};

export default ManGioHang;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  title: {
    fontSize: 36,
    fontWeight: 'bold',
    padding: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  tabButton: {
    flex: 1,
    paddingVertical: 10,
    alignItems: 'center',
    backgroundColor: '#E1DEDE',
  },
  activeTab: {
    backgroundColor: '#EF6363',
  },
  tabText: {
    color: 'black',
    fontSize: 18,
    fontWeight: 'bold',
  },
  tabtatca: {
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    backgroundColor:'#D9D9D9'
  },
  bottomContainer: {
    flexDirection: 'row',
    height: 60,
    width: '100%',
    backgroundColor: '#F0F6D0',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
  },
  totalText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  btnThanhtoan: {
    height: 40,
    width: 140,
    backgroundColor: '#5908B0',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  btnText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  tabdamua: {
    padding: 16,
  },
  ip: {
    height: 40,
    borderWidth: 1,
    marginBottom: 8,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
});
