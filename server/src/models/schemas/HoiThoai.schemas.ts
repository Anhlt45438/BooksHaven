import {ObjectId} from 'mongodb';

interface HoiThoaitype  {
    id_hoi_thoai?: ObjectId,
    id_user: ObjectId,
    id_shop: ObjectId,
    ngay_tao: Date,
    ngay_cap_nhat: Date,
    trang_thai: Number
}

class HoiThoai {
    id_hoi_thoai?: ObjectId;
    id_user: ObjectId;
    id_shop: ObjectId;
    ngay_tao: Date;
    ngay_cap_nhat: Date;
    trang_thai: Number;

    constructor(hoiThoai: HoiThoaitype) {
        this.id_hoi_thoai = hoiThoai.id_hoi_thoai;
        this.id_user = hoiThoai.id_user;
        this.id_shop = hoiThoai.id_shop;
        this.ngay_tao = hoiThoai.ngay_tao;
        this.ngay_cap_nhat = hoiThoai.ngay_cap_nhat;
        this.trang_thai = hoiThoai.trang_thai;
    }
}
export default HoiThoai;