import axios from 'axios';

const BASE_API = 'http://10.0.2.2:3000/api';

export const getShopInfoAPI = async (user_id: string) => {
  const url = `${BASE_API}/shops/get-shop-info-from-user-id/${user_id}`;
  const response = await axios.get(url);
  return response.data.data;
};

// API đăng ký shop, thêm Authorization header
export const createShopAPI = async (shopData: any, accessToken: string) => {
  const url = `${BASE_API}/shops/create`;
  const response = await axios.post(url, shopData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`, // Thêm accessToken vào header
    },
  });
  return response.data;
};
// API cập nhật shop
export const updateShopAPI = async (
  shopData: any,
  shopId: string,
  accessToken: string,
) => {
  const url = `${BASE_API}/shops/update/${shopId}`;
  const response = await axios.put(url, shopData, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};
