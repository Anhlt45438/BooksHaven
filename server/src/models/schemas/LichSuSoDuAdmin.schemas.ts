import { ObjectId } from "mongodb";
import { AdminHistoryChangeBalanceStatus } from "~/constants/enum";

interface LichSuSoDuAdminType {
    _id?: ObjectId;
    thoi_gian: Date;
    so_du_thay_doi: number;
    id_shop: ObjectId;
    mo_ta: string;
    type: AdminHistoryChangeBalanceStatus
}

class LichSuSoDuAdmin {
    _id?: ObjectId;
    thoi_gian: Date;
    so_du_thay_doi: number; 
    id_shop: ObjectId;
    mo_ta: string;
    type: AdminHistoryChangeBalanceStatus
    constructor(data: LichSuSoDuAdminType) {
        this._id = data._id;
        this.thoi_gian = data.thoi_gian;
        this.so_du_thay_doi = Number(data.so_du_thay_doi);
        this.id_shop = data.id_shop;
        this.mo_ta = data.mo_ta;
        this.type = data.type;
    }
}
export default LichSuSoDuAdmin;