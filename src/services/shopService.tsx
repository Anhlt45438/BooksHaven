// shopService.ts
import axios from 'axios';

const BASE_API = 'http://10.0.2.2:3000/api'; // API endpoint cho Android Emulator

// API đăng ký shop
export const registerShopAPI = async (shopData: {
  ten_shop: string;
  email: string;
  phoneNumber: string;
  address: string;
  province: string;
  district: string;
  ward: string;
  mo_ta: string;
}) => {
  const url = `${BASE_API}/shops/create`;
  const payload = {
    ten_shop: shopData.ten_shop,
    email: shopData.email,
    phoneNumber: shopData.phoneNumber,
    address: shopData.address,
    province: shopData.province,
    district: shopData.district,
    ward: shopData.ward,
    mo_ta: shopData.mo_ta,
  };
  const response = await axios.post(url, payload);
  return response.data; // Trả về dữ liệu shop vừa được tạo
};

// API lấy thông tin shop
export const getShopInfoAPI = async (shop_id: string) => {
  const url = `${BASE_API}/shops/get-shop-info/${shop_id}`; // API endpoint để lấy thông tin shop theo shopId
  const response = await axios.get(url);
  return response.data; // Trả về dữ liệu shop
};
