import axios from 'axios';
import {getAccessToken} from '../redux/storageHelper.ts';
import {store} from "../redux/store.tsx";
import {logoutUserThunk} from "../redux/userSlice.tsx";
import {navigationRef} from '../../App.tsx';

const BASE_API = 'http://14.225.206.60:3000/api';

const apiClient = axios.create({
    baseURL: BASE_API,
    timeout: 10000,
});

// Thêm interceptor cho phản hồi
apiClient.interceptors.response.use(
    response => response, // Trả về phản hồi nếu thành công
    async error => {
        if (error.response && error.response.status === 401) {
            // Token hết hạn, thực hiện đăng xuất
            await store.dispatch(logoutUserThunk());
            // Chuyển hướng đến màn hình đăng nhập
            if (navigationRef.isReady()) {
                navigationRef.navigate('Login');
            }
        }
        return Promise.reject(error); // Trả về lỗi để các hàm gọi API xử lý tiếp nếu cần
    }
);

export const loginUser = async (credentials: {
    email: string;
    password: string;
}) => {
    const url = '/users/login';
    const response = await apiClient.post(url, credentials);
    return response.data;
};

export const registerUser = async (formData: {
    name: string;
    email: string;
    sdt: string;
    dia_chi: string;
    password: string;
    assetToken: string;
}) => {
    const url = '/users/register';
    const payload = {...formData};
    const response = await apiClient.post(url, payload);
    return response.data;
};

export const logoutUser = async () => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error('Không có accessToken');
    }
    const url = '/users/logout';
    const response = await apiClient.post(
        url,
        {},
        {
            headers: {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json',
            },
        },
    );
    return response.data;
};

export const getUserInfoAccount = async (user_id: string) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error('Không có accessToken');
    }
    const url = `/users/user-info-account?user_id=${user_id}`;
    const response = await apiClient.get(url, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};

export const updateUserService = async (
    userId: string,
    updateData: {
        username?: string;
        email?: string;
        sdt?: string;
        dia_chi?: string;
        avatar?: string | null;
        trang_thai?: number;
        assetToken: string;
    }
) => {
    const accessToken = await getAccessToken();
    if (!accessToken) {
        throw new Error('Không có accessToken');
    }
    const url = `/users/update/${userId}`;
    const response = await apiClient.put(url, updateData, {
        headers: {
            Authorization: `Bearer ${accessToken}`,
        },
    });
    return response.data;
};
