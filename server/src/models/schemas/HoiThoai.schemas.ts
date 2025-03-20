import {ObjectId} from 'mongodb';

interface HoiThoaitype  {
    id_hoi_thoai?: ObjectId,
    id_user: ObjectId,
    ngay_cap_nhat : Date,
}

class HoiThoai {
    id_hoi_thoai?: ObjectId;
    id_user: ObjectId;
    ngay_cap_nhat: Date;

    constructor(hoiThoai: HoiThoaitype) {
        this.id_hoi_thoai = hoiThoai.id_hoi_thoai;
        this.id_user = hoiThoai.id_user;
        this.ngay_cap_nhat = hoiThoai.ngay_cap_nhat;
    }
}
export default HoiThoai;