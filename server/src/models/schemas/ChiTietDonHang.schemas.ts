
import {ObjectId} from "mongodb";

interface ChiTietDonHangType {
    id_ctdh?: ObjectId;
    id_don_hang: ObjectId;
    id_sach: ObjectId;
    so_luong: number;
    don_gia: number;
}

class ChiTietDonHang {
    id_ctdh?: ObjectId;
    id_don_hang: ObjectId;
    id_sach: ObjectId;
    so_luong: number;
    don_gia: number;

    constructor(ctdh: ChiTietDonHangType) {
        this.id_ctdh = ctdh.id_ctdh;
        this.id_don_hang = ctdh.id_don_hang;
        this.id_sach = ctdh.id_sach;
        this.so_luong = ctdh.so_luong;
        this.don_gia = ctdh.don_gia;
    }
}
export default ChiTietDonHang;