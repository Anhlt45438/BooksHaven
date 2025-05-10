import {ObjectId} from "mongodb";

interface ThanhToanType {
    _id?: ObjectId;
    id_thanh_toan: ObjectId;
    id_don_hangs: Array<ObjectId>;
    id_user: ObjectId;
    so_tien: number;
    phuong_thuc: string;
    trang_thai: boolean;
    ngay_thanh_toan: Date;
}
class ThanhToan {
    _id?: ObjectId;
    id_thanh_toan: ObjectId;
    id_don_hangs: Array<ObjectId>;
    id_user: ObjectId;
    so_tien: number;
    phuong_thuc: string;
    trang_thai: boolean;
    ngay_thanh_toan: Date;

    constructor(thanhToan: ThanhToanType) {
        this.id_thanh_toan = thanhToan.id_thanh_toan;
        this._id = thanhToan.id_thanh_toan;
        this.id_don_hangs = thanhToan.id_don_hangs;
        this.id_user = thanhToan.id_user;
        this.so_tien = Number(thanhToan.so_tien);
        this.phuong_thuc = thanhToan.phuong_thuc;
        this.trang_thai = thanhToan.trang_thai;
        this.ngay_thanh_toan = thanhToan.ngay_thanh_toan;
    }
}
export default ThanhToan;