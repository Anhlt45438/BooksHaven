import { ObjectId } from "mongodb";
import VaiTro from "./VaiTro.schemas";

interface ThongBaoInfoType {
    _id?: ObjectId;
    roles: VaiTro[];
    noi_dung_thong_bao: string;
    ngay_tao: Date;
    tieu_de: string;
    id_user?: ObjectId;
}

class ThongBaoInfo {
    _id?: ObjectId;
    roles: VaiTro[];
    noi_dung_thong_bao: string;
    ngay_tao: Date; 
    tieu_de: string;
    id_user?: ObjectId
    constructor(data:ThongBaoInfoType) {
        this._id = data._id || new ObjectId();
        this.roles = data.roles || [];
        this.noi_dung_thong_bao = data.noi_dung_thong_bao;
        this.ngay_tao = data.ngay_tao || new Date();
        this.tieu_de = data.tieu_de;
        this.id_user = data.id_user;
    }
}
export default ThongBaoInfo;