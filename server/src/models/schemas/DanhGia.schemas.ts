import {ObjectId} from 'mongodb';

interface DanhGiaType  {
    id_danh_gia?: ObjectId,
    id_user: ObjectId,
    id_sach: ObjectId,
    danh_gia: Number,
    binh_luan: String,
    ngay_tao: Date
}
class DanhGia {
    id_danh_gia?: ObjectId;
    id_user: ObjectId;
    id_sach: ObjectId;
    danh_gia: Number;
    binh_luan: String;
    ngay_tao: Date;

    constructor(danhGia: DanhGiaType) {
        this.id_danh_gia = danhGia.id_danh_gia;
        this.id_user = danhGia.id_user;
        this.id_sach = danhGia.id_sach;
        this.danh_gia = danhGia.danh_gia;
        this.binh_luan = danhGia.binh_luan;
        this.ngay_tao = danhGia.ngay_tao;
    }
}
export default DanhGia;