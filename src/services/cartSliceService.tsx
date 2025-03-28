import {getAccessToken} from "../redux/storageHelper.ts";
const API_URL = "http://14.225.206.60:3000/api/cart";

export const fetchCartAPI = async () => {
    try {
        const accessToken = await getAccessToken();
        if (!accessToken) throw new Error("Chưa đăng nhập");

        const response = await fetch(API_URL, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
        });

        if (!response.ok) throw new Error("Lỗi khi lấy giỏ hàng");

        const cartData = await response.json();
        return cartData.data.items; // Trả về danh sách sản phẩm trong giỏ
    } catch (error) {
        throw new Error(error.message);
    }
};
