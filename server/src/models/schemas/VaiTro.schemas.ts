import { ObjectId } from "mongodb";

interface VaiTroType {
    _id?: ObjectId;
    id_role: ObjectId;
    ten_role: string;
}

class VaiTro {
    _id?: ObjectId;
    id_role: ObjectId;
    ten_role: string;   
    constructor(vaitro: VaiTroType) {
        this._id = vaitro.id_role;  // Use id_role as _id
        this.id_role = vaitro.id_role;
        this.ten_role = vaitro.ten_role;
    }
}

export default VaiTro;