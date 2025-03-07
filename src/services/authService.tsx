import axios from 'axios';

// Dùng 10.0.2.2 cho Android emulator; nếu iOS hoặc web, có thể dùng localhost
const BASE_API = 'http://10.0.2.2:3000/api';

export const loginUser = async (credentials: { email: string; password: string }) => {
    const url = `${BASE_API}/users/login`;
    const response = await axios.post(url, credentials);
    return response.data;
};

export const registerUser = async (formData: {
    name: string;
    email: string;
    phone: string;
    address: string;
    password: string;
}) => {
    const url = `${BASE_API}/users/register`;
    const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        password: formData.password,
    };

    const response = await axios.post(url, payload);
    return response.data;
};
