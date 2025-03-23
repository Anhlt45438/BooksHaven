import axios from 'axios';

const BASE_API = 'http://14.225.206.60:3000/api';

// Lấy danh sách sách (có phân trang)
export const getBooks = async (page: number = 1, limit: number = 20) => {
    const url = `${BASE_API}/books?page=${page}&limit=${limit}`;
    const response = await axios.get(url);
    return response.data;
};

// Tạo mới sách
export const createBook = async (payload: {
    id_sach: string;
    ten_sach: string;
    tac_gia: string;
    mo_ta: string;
    gia: string;
    so_luong: string;
    anh: string;
    trang_thai: string;
    so_trang: string;
    kich_thuoc: string;
    id_shop: string;
    the_loai: any[];
}) => {
    const url = `${BASE_API}/books`;
    const response = await axios.post(url, payload);
    return response.data;
};
