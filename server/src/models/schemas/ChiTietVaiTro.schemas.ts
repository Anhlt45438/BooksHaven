import { ObjectId } from "mongodb";

interface ChiTietVaiTro {
    id_ctvt?: ObjectId;
    id_user: ObjectId;
    id_role: ObjectId;
}

class ChiTietVaiTro {
    id_ctvt?: ObjectId;
    id_user: ObjectId;
    id_role: ObjectId;

    constructor(ctvt: ChiTietVaiTro) {
        this.id_ctvt = ctvt.id_ctvt;
        this.id_user = ctvt.id_user;
        this.id_role = ctvt.id_role;
    }
}

export default ChiTietVaiTro;