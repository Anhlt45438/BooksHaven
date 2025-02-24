import {ObjectId} from 'mongodb';

interface TinNhanType {
    id_tin_nhan?: ObjectId;
    id_hoi_thoai: ObjectId;
    noi_dung: String;
    duong_dan_file: String;
    ngay_tao: Date;
    trang_thai: Number;
    id_user: ObjectId;
}
class TinNhan {
    id_tin_nhan?: ObjectId;
    id_hoi_thoai: ObjectId;
    noi_dung: String;
    duong_dan_file: String;
    ngay_tao: Date;
    trang_thai: Number;
    id_user: ObjectId;

    constructor(tinNhan: TinNhanType) {
        this.id_tin_nhan = tinNhan.id_tin_nhan;
        this.id_hoi_thoai = tinNhan.id_hoi_thoai;
        this.noi_dung = tinNhan.noi_dung;
        this.duong_dan_file = tinNhan.duong_dan_file;
        this.ngay_tao = tinNhan.ngay_tao;
        this.trang_thai = tinNhan.trang_thai;
        this.id_user = tinNhan.id_user;
    }
}
export default TinNhan; 