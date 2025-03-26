import { ObjectId } from "mongodb";

interface HoiThoaiType {
    _id?: ObjectId;
    id_hoi_thoai: ObjectId;
    id_user_1: ObjectId;
    id_user_2: ObjectId;
    tin_nhan_cuoi?: string;
    id_nguoi_nhan_cuoi?: ObjectId;

    ngay_cap_nhat: Date;
 
}

class HoiThoai {
    _id?: ObjectId;
    id_hoi_thoai: ObjectId;
    id_user_1: ObjectId;
    id_user_2: ObjectId;
    tin_nhan_cuoi?: string;
    ngay_cap_nhat: Date;
    id_nguoi_nhan_cuoi?: ObjectId;


    constructor(data: HoiThoaiType) {
        this.id_hoi_thoai = data.id_hoi_thoai;
        this._id = data.id_hoi_thoai;
        this.id_user_1 = data.id_user_1;
        this.id_user_2 = data.id_user_2;
        this.tin_nhan_cuoi = data.tin_nhan_cuoi;
        this.ngay_cap_nhat = data.ngay_cap_nhat;
        this.id_nguoi_nhan_cuoi = data.id_nguoi_nhan_cuoi;
    }
}
export default HoiThoai;