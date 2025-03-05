import { ObjectId } from 'mongodb';

interface DonHangType  {
    id_don_hang?: ObjectId; 
    id_user: ObjectId;
    id_shop: ObjectId;
    ngay_mua: Date;
    trang_thai: boolean;
    tong_tien: number;
}

class DonHang {
    id_don_hang?: ObjectId;
    id_user: ObjectId;
    id_shop: ObjectId;
    ngay_mua: Date;
    trang_thai: boolean;
    tong_tien: number;

    constructor(donHang: DonHangType) {
        this.id_don_hang = donHang.id_don_hang;
        this.id_user = donHang.id_user;
        this.id_shop = donHang.id_shop;
        this.ngay_mua = donHang.ngay_mua;
        this.trang_thai = donHang.trang_thai;
        this.tong_tien = donHang.tong_tien;
    }
}
export default DonHang;