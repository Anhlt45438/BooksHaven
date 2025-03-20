import { ObjectId } from "mongodb";

interface ThongBaoType {
    _id? : ObjectId;
    id_thong_bao: ObjectId;
    id_user: ObjectId;
    noi_dung_thong_bao: string;
    ngay_tao: Date;
    da_doc: boolean;
}
class ThongBao {
    _id? : ObjectId;
    id_thong_bao: ObjectId;
    id_user: ObjectId;
    noi_dung_thong_bao: string;
    ngay_tao: Date; 
    da_doc: boolean;
    constructor(data: ThongBaoType) { 
        this.id_thong_bao = data.id_thong_bao;
        this._id = this.id_thong_bao;
        this.id_user = data.id_user;
        this.noi_dung_thong_bao = data.noi_dung_thong_bao;
        this.ngay_tao = data.ngay_tao;
        this.da_doc = data.da_doc;
    }
}
export default ThongBao;