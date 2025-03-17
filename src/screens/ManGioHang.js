import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import ItemTatCaGioHang from '../components/ItemTatCaGioHang';
import { useNavigation } from '@react-navigation/native';
import ManThanhToan from "./ManThanhToan";
import { useAppDispatch, useAppSelector } from '../redux/hooks';


const ManGioHang = () => {
  const navigation=useNavigation();
  const [data, setData] = useState([]);
  const [tongtientatca, setTongtientatca] = useState(0);
  const [sosanphamtatca, setSosanphamtatca] = useState(0);
  const [selectedItems, setSelectedItems] = useState({});
  const [quantities, setQuantities] = useState({});

  const accessToken = useAppSelector(state => state.user.user?.accessToken);
console.log('User Access Token:', accessToken);

useEffect(() => {
  const fetchCartData = async () => {
    if (!accessToken) {
      console.log('Không có accessToken');
      return;
    }

    try {
      const response = await fetch('http://192.168.1.151:3000/api/cart', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
      });

      if (!response.ok) {
        throw new Error('Không thể lấy dữ liệu giỏ hàng');
      }

      const cartData = await response.json();
      console.log('Dữ liệu giỏ hàng:', cartData);

      if (!cartData.data.items || !Array.isArray(cartData.data.items)) {
        console.error('Lỗi: cartData.items không phải là một mảng!', cartData);
        return;
      }

      setData(cartData.data.items); // Đặt items thay vì cả cartData
      
    } catch (error) {
      console.error('Lỗi khi tải giỏ hàng:', error.message);
    }
  };

  fetchCartData();
}, [accessToken]);

  // Sử dụng:
  // const token = getUserToken();
  // console.log("Token của người dùng:", token);
  
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
  
 
  const handleCheckChange = (checked, gia, soLuong, id) => {
    setSelectedItems(prev => ({
      ...prev,
      [id]: checked,
    }));
  
    if (checked) {
      setTongtientatca(prev => prev + gia * soLuong);
      setSosanphamtatca(prev => prev + soLuong);
    } else {
      setTongtientatca(prev => prev - gia * soLuong);
      setSosanphamtatca(prev => prev - soLuong);
    }
  };
  
  const handleUpdateQuantity = (id, newQuantity, gia, isChecked) => {
    setQuantities(prev => ({
      ...prev,
      [id]: newQuantity,
    }));
  
    if (isChecked) {
      setTongtientatca(prev => prev + gia * (newQuantity - (quantities[id] || 1)));
      setSosanphamtatca(prev => prev + (newQuantity - (quantities[id] || 1)));
    }
  };
  
          
       

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Giỏ hàng</Text>

      <View style={styles.tabtatca}>
            <FlatList
              data={data}
              keyExtractor={item => item.id_ctgh}
              renderItem={({ item }) => (
                <ItemTatCaGioHang
                  item={item}
                  onCheckChange={(checked, tongTienMoisp) =>
                    handleCheckChange(checked, tongTienMoisp, quantities[item.id_sach] || 1, item.id_sach)
                  }
                  onUpdateQuantity={(newQuantity, isChecked) =>
                    handleUpdateQuantity(item.id_sach, newQuantity, item.gia, isChecked)
                  }
                  isChecked={!!selectedItems[item.id_sach]}
                  quantity={quantities[item.id_sach] || 1}  
                  onDelete={handleDeleteItem} 
                />
              )}
              ListEmptyComponent={<Text style={{marginTop:100,fontSize:16}}>Không có sản phẩm nào trong giỏ hàng</Text>}
            />
           
            <View style={styles.bottomContainer}>
              <Text style={styles.totalText}>Tổng tiền: {tongtientatca}đ</Text>
              <TouchableOpacity style={styles.btnThanhtoan} onPress={()=>{
              
                const selectedProducts = data.filter((item) => selectedItems[item.id]).map((item) => ({
                  ...item,
                  soluong: quantities[item.id],
                }));
                navigation.navigate('ManThanhToan',{selectedProducts,tongtientatca})
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
