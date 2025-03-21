import {ObjectId} from "mongodb";

interface ChiTietTheLoaiType {
    _id?: ObjectId;
    id_cttl: ObjectId;
    id_the_loai: ObjectId;
    id_sach: ObjectId;
}
class ChiTietTheLoai {
    _id?: ObjectId;
    id_cttl: ObjectId;
    id_the_loai: ObjectId;
    id_sach: ObjectId;

    constructor(cttl: ChiTietTheLoaiType) {
        this.id_cttl = cttl.id_cttl;
        this._id = this.id_cttl;
        this.id_the_loai = cttl.id_the_loai;
        this.id_sach = cttl.id_sach;
    }
}
export default ChiTietTheLoai;