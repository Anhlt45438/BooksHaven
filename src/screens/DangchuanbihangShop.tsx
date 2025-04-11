import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  FlatList,
} from "react-native";
import { getAccessToken } from "../redux/storageHelper";
import { useFocusEffect, useNavigation } from "@react-navigation/native";

const Cholayhang = () => {
  const [data, setData] = useState([]);
   const navigation = useNavigation();
   const dang_giao_hang = "đang giao hàng"
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);

   const getOrder = async (page) => {
      const accessToken = await getAccessToken();
      if (!accessToken) {
        console.log("Không có accessToken");
        return;
      }
  
      try {
        const response = await fetch(
        `http://14.225.206.60:3000/api/orders/shop?page=${page}&limit=10&status_order=đang chuẩn bị hàng`,
      
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );
  
        if (!response.ok) {
          throw new Error("Không thể lấy dữ liệu đơn hàng");
        }
  
        const orderData = await response.json();
        console.log("Dữ liệu đơn hàng:", orderData);
  
        if (!Array.isArray(orderData.data)) {
          console.error("Lỗi: orderData.data không phải là một mảng!", orderData);
          setData([]);
          return;
        }
  
        // Lọc đơn hàng chỉ hiển thị những đơn có trang_thai là "chờ xác nhận"
        const filteredOrders = orderData.data.filter(
          (order) => order.trang_thai === "đang chuẩn bị hàng"
        );
  
        setData(filteredOrders);
        console.log(orderData.data);
        
        setTotalPages(orderData.pagination.totalPages)
        console.log("số trang",orderData.pagination.totalPages);
        
        console.log("Dữ liệu đơn hàng:", data);
  
      } catch (error) {
        console.error("Lỗi khi tải đơn hàng:", error.message);
      }
    };
  

  useEffect(() => {
    getOrder(currentPage);
  }, [currentPage]);

  useFocusEffect(
    useCallback(() => {
      getOrder(currentPage); // Làm mới dữ liệu khi tab được focus
    }, [currentPage])
  );

  const ShopDetail = ({ shopId }) => {
    const [shopData, setShopData] = useState(null);

    useEffect(() => {
      const fetchShop = async () => {
        const accessToken = await getAccessToken();
        if (!accessToken) return;
        console.log("ID Shop cần fetch:", shopId);

        try {
          const response = await fetch(
            `http://14.225.206.60:3000/api/shops/get-shop-info/${shopId}`,
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
              },
              body: JSON.stringify({}),
            }
          );

          if (!response.ok) throw new Error(`Lỗi HTTP: ${response.status}`);

          const data = await response.json();
          console.log("Dữ liệu shop:", data);

          if (!data || !data.data) {
            console.error("API không trả về dữ liệu hợp lệ");
            return;
          }

          setShopData(data.data);
        } catch (error) {
          console.error("Lỗi khi tải thông tin shop:", error.message);
        }
      };

      fetchShop();
    }, [shopId]);

    return (
      <View style={styles.shopInfo}>
        <Image
          source={{ uri: shopData?.logo || "https://via.placeholder.com/20" }}
          style={styles.shopLogo}
        />
        <Text style={styles.shopName}>
          {shopData ? shopData.ten_shop : "Đang tải..."}
        </Text>
      </View>
    );
  };

   const sendnotification = async (iduser,id)=>{
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.error("Không có accessToken");
          return;
        }
        const response = await fetch(
          `http://14.225.206.60:3000/api/notifications/send-to-user`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ 
              id_user: iduser,
              noi_dung_thong_bao: `đơn hàng của bạn với mã vận đơn ${id} đang được giao`,
              tieu_de: "Thông báo",
             }),
          }
        );
  
         // Kiểm tra phản hồi từ server
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Lỗi từ server: ${errorData.message || response.status}`);
      }else{
       console.log("thành công");
        
      }
  
      } catch (error) {
        console.error("Lỗi khi gửi thông báo:", error);
      }
    }

  const updateOrderStatus = async (orderId,status) => {
      try {
        const accessToken = await getAccessToken();
        if (!accessToken) {
          console.error("Không có accessToken");
          return;
        }
  
        const response = await fetch(
          `http://14.225.206.60:3000/api/orders/${orderId}/status`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ trang_thai: status }),
          }
        );
  
        const data = await response.json();
        console.log("Kết quả cập nhật:", data);
        console.log("fswf",response.status);
        if (response.ok) {
          getOrder(); // Cập nhật lại danh sách đơn hàng
          console.log("fswf",response.status);
          
        }
      } catch (error) {
        console.error("Lỗi cập nhật đơn hàng:", error);
      }
    };

    const ProductCard = ({ item }) => {
       return (
         <View style={styles.container}>
           <TouchableOpacity onPress={() => navigation.navigate('ChitietdonhangShop', { order: item })}>
             <View style={styles.header}>
               <ShopDetail shopId={item.id_shop} />
               <Text style={styles.status}>{item.trang_thai ? item.trang_thai : "Đang cập nhật"}</Text>
             </View>
     
             {/* Hiển thị tất cả sản phẩm trong chi tiết đơn hàng */}
             {item.chi_tiet_don_hang.map((detail, index) => (
               <View key={index} style={styles.productContainer}>
                  <Text>{(index + 1).toString()}</Text>
                 <Image
                   source={{ uri: detail.book?.anh || "https://via.placeholder.com/60" }}
                   style={styles.productImage}
                 />
                 <View style={styles.productInfo}>
                 <Text style={styles.productTitle} numberOfLines={2}>
     {detail.book && detail.book.ten_sach ? detail.book.ten_sach : "Đang tải..."}
   </Text>
   
   <Text style={styles.quantity}>
     x{detail.details && detail.details.so_luong ? detail.details.so_luong : 0}
   </Text>
   
                 </View>
               </View>
             ))}
     
             <View style={styles.footer}>
                  <Text style={styles.totalPrice}>
                 Tổng số tiền ({item.chi_tiet_don_hang.length} sản phẩm): 
               </Text>
               <Text style={styles.highlight}>
     {item.tong_tien !== undefined && item.tong_tien !== null ? item.tong_tien : "Đang cập nhật"}
   </Text>
   
               {/* Đặt nút "Hủy" phía trên nút "Xác nhận" */}
               <View style={styles.buttonContainer}>
                
     
                 <TouchableOpacity
                   style={styles.confirmButton}
                   onPress={() => {
                    updateOrderStatus(item.id_don_hang,"đang giao hàng"),
                    sendnotification(item.id_user,item.id_don_hang)}
                  }
                 >
                   <Text style={styles.buttonText}>Xác nhận</Text>
                 </TouchableOpacity>
               </View>
             </View>
           </TouchableOpacity>
         </View>
       );
     };
     
    
  return (
     <View style={{ flex: 1 }}>
    <FlatList
      data={data}
      keyExtractor={(item) => item._id.toString()}
      renderItem={({ item }) => <ProductCard item={item} />}
      ListEmptyComponent={
        <Text style={styles.emptyText}>Không có đơn hàng nào</Text>
      }
    />

        <View style={styles.pagination}>
          {[...Array(totalPages)].map((_, index) => {
            const page = index + 1;
            return (
              <TouchableOpacity
                key={page}
                onPress={() => setCurrentPage(page)}
                style={[
                  styles.pageButton,
                  currentPage === page && styles.pageButtonActive,
                ]}
              >
                <Text style={styles.pageText}>{page}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    padding: 10,
    borderRadius: 10,
    margin: 10,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },
  shopInfo: {
    flexDirection: "row",
    alignItems: "center",
  },
  buttonContainer: {
    flexDirection: "column", // Chuyển nút "Hủy" lên trên
    marginTop: 10,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#FF5252",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    marginBottom: 5, // Khoảng cách giữa nút "Hủy" và "Xác nhận"
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  shopLogo: {
    width: 20,
    height: 20,
    borderRadius: 10,
    marginRight: 5,
  },
  shopName: {
    fontWeight: "bold",
    fontSize: 14,
  },
  status: {
    color: "red",
    fontWeight: "bold",
  },
  productContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  productImage: {
    width: 60,
    height: 60,
    borderRadius: 5,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productTitle: {
    fontSize: 14,
    fontWeight: "bold",
  },
  quantity: {
    fontSize: 12,
    color: "gray",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  totalPrice: {
    fontSize: 14,
  },
  highlight: {
    color: "red",
    fontWeight: "bold",
  },
  contactButton: {
    borderColor: "#ff4500",
    borderWidth: 1,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: 5,
  },
  contactText: {
    color: "#ff4500",
    fontWeight: "bold",
  },
  emptyText: {
    textAlign: "center",
    marginVertical: 20,
    fontSize: 16,
    color: "gray",
  },pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
    flexWrap: 'wrap',
  },
  pageButton: {
    padding: 10,
    margin: 4,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: '#ccc',
  },
  pageButtonActive: {
    backgroundColor: '#007bff',
  },
  pageText: {
    color: '#000',
  },
});

export default Cholayhang;
