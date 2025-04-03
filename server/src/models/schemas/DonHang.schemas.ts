import { ObjectId } from 'mongodb';
import {  TrangThaiDonHangStatus } from '~/constants/enum';

interface DonHangType  {
    _id?: ObjectId;
    id_don_hang?: ObjectId; 
    id_user: ObjectId;
    id_shop: ObjectId;
    ngay_mua: Date;
    tong_tien: number;
    trang_thai: TrangThaiDonHangStatus;
}

class DonHang {
    _id?: ObjectId;
    id_don_hang?: ObjectId;
    id_user: ObjectId;
    id_shop: ObjectId;
    ngay_mua: Date;
    tong_tien: number;
    trang_thai: TrangThaiDonHangStatus;

    constructor(donHang: DonHangType) {
        this.id_don_hang = donHang.id_don_hang;
        this._id = donHang.id_don_hang;
        this.id_user = donHang.id_user;
        this.id_shop = donHang.id_shop;
        this.ngay_mua = donHang.ngay_mua;
        this.trang_thai = donHang.trang_thai;
        this.tong_tien = Number(donHang.tong_tien);
    }
}
export default DonHang;