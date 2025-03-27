import {ObjectId} from "mongodb";

interface CuaHangType {
    _id?: ObjectId;
    id_shop?: ObjectId;
    id_user: ObjectId;
    ten_shop: string;
    anh_shop: string;
    mo_ta: string;
    trang_thai: boolean;
    tong_tien: number;
}

class CuaHang {
    id_shop?: ObjectId;
    _id?: ObjectId;
    id_user: ObjectId;
    ten_shop: string;
    anh_shop: string;
    mo_ta: string;
    trang_thai: boolean;
    tong_tien: number;


    constructor(shop: CuaHangType) {
        this.id_shop = shop.id_shop;
        this._id = shop.id_shop;
        this.id_user = shop.id_user;
        this.ten_shop = shop.ten_shop;
        this.anh_shop = shop.anh_shop;
        this.mo_ta = shop.mo_ta;
        this.trang_thai = shop.trang_thai;
        this.tong_tien = shop.tong_tien;
    }
}
export default CuaHang;