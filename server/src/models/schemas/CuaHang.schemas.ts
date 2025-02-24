import {ObjectId} from "mongodb";

interface CuaHangType {
    id_shop?: ObjectId;
    id_user: ObjectId;
    ten_shop: string;
    anh_shop: string;
    mo_ta: string;
    trang_thai: boolean;
}

class CuaHang {
    id_shop?: ObjectId;
    id_user: ObjectId;
    ten_shop: string;
    anh_shop: string;
    mo_ta: string;
    trang_thai: boolean;

    constructor(shop: CuaHangType) {
        this.id_shop = shop.id_shop;
        this.id_user = shop.id_user;
        this.ten_shop = shop.ten_shop;
        this.anh_shop = shop.anh_shop;
        this.mo_ta = shop.mo_ta;
        this.trang_thai = shop.trang_thai;
    }
}
export default CuaHang;