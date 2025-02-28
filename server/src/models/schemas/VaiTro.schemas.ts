import { ObjectId } from "mongodb";

interface VaitroType {
    id_role?: ObjectId;
    ten_role: string;
}
class Vaitro {
    id_role?: ObjectId;
    ten_role: string;   
    constructor(vaitro: VaitroType) {
        this.id_role = vaitro.id_role;
        this.ten_role = vaitro.ten_role;
    }
}
export default Vaitro;