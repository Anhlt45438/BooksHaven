import { ObjectId } from "mongodb";

interface ChiTietVaiTro {
    _id?: ObjectId;
    id_ctvt: ObjectId;
    id_user: ObjectId;
    id_role: ObjectId;
}

class ChiTietVaiTro {
    _id?: ObjectId;
    id_ctvt: ObjectId;
    id_user: ObjectId;
    id_role: ObjectId;

    constructor(ctvt: ChiTietVaiTro) {
        this.id_ctvt = ctvt.id_ctvt;
        this._id = ctvt._id;
        this.id_user = ctvt.id_user;
        this.id_role = ctvt.id_role;
    }
}

export default ChiTietVaiTro;