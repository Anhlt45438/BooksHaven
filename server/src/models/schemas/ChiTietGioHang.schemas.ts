import {ObjectId} from "mongodb";

interface ChiTietGioHangType  {
    id_ctgh?: ObjectId;
    id_gio_hang: ObjectId;
    id_sach: ObjectId;
    so_luong: number;
}

interface ChiTietGioHangResponseType {
    id_ctgh?: ObjectId;
    id_gio_hang: ObjectId;
    id_sach: ObjectId;
    so_luong: number;
    gia: number;

}

class ChiTietGioHang {
    id_ctgh?: ObjectId;
    id_gio_hang: ObjectId;
    id_sach: ObjectId;
    so_luong: number;

    constructor(ctgh: ChiTietGioHangType) {
        this.id_ctgh = ctgh.id_ctgh;
        this.id_gio_hang = ctgh.id_gio_hang;
        this.id_sach = ctgh.id_sach;
        this.so_luong = ctgh.so_luong;
    }
}

export default ChiTietGioHang;