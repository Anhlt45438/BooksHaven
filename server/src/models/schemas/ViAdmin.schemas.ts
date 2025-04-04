import { ObjectId } from "mongodb";

interface ViAdminType {
    _id?: ObjectId;
    tong_tien_shop: number;
    tien_thu_duoc: number;
    so_the: number;
    ten_the: string;
    ten_chu_the: string;
    ngay_het_han?: string;
    ngay_tao: string;
}

class ViAdmin {
    _id?: ObjectId;
    tong_tien_shop: number;
    so_the: number;
    ten_the: string;
    ten_chu_the: string;
    ngay_het_han?: string;
    ngay_tao: string;
    tien_thu_duoc: number;
    constructor(data: ViAdminType) {
        this._id = data._id || new ObjectId();
        this.tong_tien_shop = Number(data.tong_tien_shop) || 0;
        this.so_the = Number(data.so_the) ;
        this.ten_the = data.ten_the || "";
        this.ten_chu_the = data.ten_chu_the || "";
        this.ngay_het_han = data.ngay_het_han || "";
        this.ngay_tao = data.ngay_tao || "";
        this.tien_thu_duoc = Number(data.tien_thu_duoc) || 0;
    }
    
}
export default ViAdmin;