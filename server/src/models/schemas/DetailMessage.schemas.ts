import { ObjectId } from "mongodb";


interface ChiTietTinNhan {
    _id?: ObjectId;
    id_chi_tiet_tin_nhan: ObjectId;
    id_hoi_thoai: ObjectId;
    id_user_gui: ObjectId;
    duong_dan_file?: string;
    ngay_tao: Date;
    noi_dung: string;
    da_doc: boolean;
}

class ChiTietTinNhan {
    _id?: ObjectId;
    id_chi_tiet_tin_nhan: ObjectId;
    id_hoi_thoai: ObjectId;
    id_user_gui: ObjectId;
    duong_dan_file?: string;
    ngay_tao: Date;
    noi_dung: string;
    da_doc: boolean;

    constructor(chiTietTinNhan: ChiTietTinNhan) {
        this.id_chi_tiet_tin_nhan = chiTietTinNhan.id_chi_tiet_tin_nhan;
        this._id = chiTietTinNhan.id_chi_tiet_tin_nhan;
        this.id_hoi_thoai = chiTietTinNhan.id_hoi_thoai;
        this.id_user_gui = chiTietTinNhan.id_user_gui;
        this.duong_dan_file = chiTietTinNhan.duong_dan_file;
        this.ngay_tao = chiTietTinNhan.ngay_tao;
        this.noi_dung = chiTietTinNhan.noi_dung;
        this.da_doc = chiTietTinNhan.da_doc;
    }
}
export { ChiTietTinNhan };