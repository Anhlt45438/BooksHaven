import { ObjectId } from "mongodb";

interface ThongBaoType {
    _id? : ObjectId;
    id_thong_bao: ObjectId;
    id_nguoi_gui: ObjectId;
    id_nguoi_nhan: ObjectId;
    noi_dung_thong_bao: string;
    id_role?: ObjectId;
    ngay_tao: Date;
    tieu_de: string;
    da_doc: boolean;
}
class ThongBao {
    _id? : ObjectId;
    id_thong_bao: ObjectId;
    id_nguoi_gui: ObjectId;
    id_nguoi_nhan: ObjectId;
    id_role?: ObjectId;

    noi_dung_thong_bao: string;
    ngay_tao: Date; 
    tieu_de: string;

    da_doc: boolean;
    constructor(data: ThongBaoType) { 
        this.id_thong_bao = data.id_thong_bao;
        this._id = this.id_thong_bao;
        this.id_nguoi_gui = data.id_nguoi_gui;
        this.noi_dung_thong_bao = data.noi_dung_thong_bao;
        this.ngay_tao = data.ngay_tao;
        this.da_doc = data.da_doc;
        this.tieu_de = data.tieu_de;
        this.id_nguoi_nhan = data.id_nguoi_nhan;
        this.id_role = data.id_role;

    }
}
export default ThongBao;