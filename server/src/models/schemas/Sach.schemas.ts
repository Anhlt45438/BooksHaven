import { ObjectId } from 'mongodb';

interface SachType {
    _id?: ObjectId;
    id_sach?: ObjectId;
    ten_sach: string;
    tac_gia: string;
    mo_ta: string;
    gia: number;
    so_luong: number;
    anh: string;
    trang_thai: boolean;
    so_trang: number;
    kich_thuoc: string;
    da_ban: number;
    id_shop: ObjectId;
} 

export interface SachWithCategories extends SachType {
    the_loai: Array<{
        id_the_loai: ObjectId;
        ten_the_loai: string;
    }>;
}

class Sach {
    id_sach?: ObjectId;
    _id?: ObjectId;
    ten_sach: string;
    tac_gia: string;
    mo_ta: string;
    gia: number;
    so_luong: number;
    anh: string;
    trang_thai: boolean;
    so_trang: number;
    kich_thuoc: string;
    id_shop: ObjectId;
    da_ban: number;

    constructor(sach: SachType) {
        this.id_sach = sach.id_sach;
        this.ten_sach = sach.ten_sach;
        this._id = sach.id_sach;
        this.tac_gia = sach.tac_gia;
        this.mo_ta = sach.mo_ta;
        this.gia = Number(sach.gia);
        this.so_luong = Number(sach.so_luong);
        this.anh = sach.anh;
        this.trang_thai = sach.trang_thai || false;
        this.so_trang = Number(sach.so_trang);
        this.kich_thuoc = sach.kich_thuoc;
        this.id_shop = sach.id_shop;
        this.da_ban = Number(sach.da_ban);
    }
}

export default Sach;