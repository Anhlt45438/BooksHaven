import axios from 'axios';

// Dùng 10.0.2.2 cho Android emulator; nếu iOS hoặc web, dùng localhost nếu phù hợp
const BASE_API = 'http://10.0.2.2:3000/api';

export const loginUser = async (credentials: { email: string; password: string }) => {
    const url = `${BASE_API}/users/login`;
    const response = await axios.post(url, credentials);
    return response.data;
};

export const registerUser = async (formData: {
    name: string;
    email: string;
    sđt: string;
    dia_chi: string;
    password: string;
}) => {
    const url = `${BASE_API}/users/register`;
    const payload = {
        name: formData.name,
        email: formData.email,
        sđt: formData.sđt,
        dia_chi: formData.dia_chi,
        password: formData.password,
    };

    const response = await axios.post(url, payload);
    return response.data;
};

export const logoutUser = async (accessToken: string) => {
    const url = `${BASE_API}/users/logout`;
    const response = await axios.post(url, {}, {
        headers: {
            'Authorization': `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
        },
    });
    return response.data;
};

// Hàm lấy thông tin tài khoản theo user_id (bao gồm accessToken)
export const getUserInfoAccount = async (user_id: string) => {
    const url = `${BASE_API}/users/user-info-account?user_id=${user_id}`;
    const response = await axios.get(url);
    return response.data;
};
