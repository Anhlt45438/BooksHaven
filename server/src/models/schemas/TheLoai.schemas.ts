import { ObjectId } from 'mongodb';

interface TheLoaiType {
    id_the_loai?: ObjectId;
    ten_the_loai: string;
}

class TheLoai {
        id_the_loai?: ObjectId;
        ten_the_loai: string;
    
        constructor(theLoai: TheLoaiType) {
            this.id_the_loai = theLoai.id_the_loai;
            this.ten_the_loai = theLoai.ten_the_loai;
        }
}
export default TheLoai;