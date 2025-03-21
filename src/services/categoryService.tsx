import axios from 'axios';

// Giữ nguyên BASE_API như bạn đang dùng
// 10.0.2.2 cho Android Emulator, nếu iOS/web thì thay localhost
const BASE_API = 'http://14.225.206.60:3000/api';

// Lấy danh sách thể loại
export const getCategories = async () => {
    const url = `${BASE_API}/categories`;
    const response = await axios.get(url);
    return response.data;
};

// Tạo mới một thể loại (nếu cần)
export const createCategory = async (payload: {
    id_the_loai: string;
    ten_the_loai: string;
}) => {
    const url = `${BASE_API}/categories`;
    const response = await axios.post(url, payload);
    return response.data;
};

// Tương tự, nếu có API update, delete, ... bạn thêm ở đây
