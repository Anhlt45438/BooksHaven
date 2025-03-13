import {ObjectId} from "mongodb";

interface GioHangType{
    _id?: ObjectId;
    id_gio_hang: ObjectId;
    id_user: ObjectId;
 
}
class GioHang{
    _id?: ObjectId;
    id_gio_hang: ObjectId;
    id_user: ObjectId;

    constructor(gioHang: GioHangType){
        this.id_gio_hang = gioHang.id_gio_hang;
        this._id = gioHang.id_gio_hang;
        this.id_user = gioHang.id_user;
    }
}
export default GioHang;