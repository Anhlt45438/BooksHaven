import AsyncStorage from '@react-native-async-storage/async-storage';

export const storeAccessToken = async (token: string) => {
    try {
        await AsyncStorage.setItem('accessToken', token);
    } catch (error) {
        console.error('Lỗi khi lưu accessToken:', error);
    }
};

export const getAccessToken = async () => {
    try {
        const token = await AsyncStorage.getItem('accessToken');
        return token;
    } catch (error) {
        console.error('Lỗi khi lấy accessToken:', error);
        return null;
    }
};

export const removeAccessToken = async () => {
    try {
        await AsyncStorage.removeItem('accessToken');
    } catch (error) {
        console.error('Lỗi khi xóa accessToken:', error);
    }
};