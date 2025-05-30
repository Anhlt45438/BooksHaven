import { ObjectId } from "mongodb";
import { AccountStatus } from "~/constants/enum";

interface UserType {
    _id?:  ObjectId;
    username: string;
    password: string; 
    sdt?: string, 
    email: string,
    dia_chi?: string, 
    avatar?: string, 
    trang_thai: AccountStatus,
    accessToken: string;
}
class User {
    _id?:  ObjectId;
    username: string;
    password: string; 
    sdt?: string; 
    email: string;
    dia_chi?: string; 
    avatar?: string; 
    trang_thai: AccountStatus;
    accessToken: string;
    
    constructor(user: UserType) {
        this._id = user._id;
        this.username = user.username;
        this.password = user.password;
        this.sdt = user.sdt;
        this.email = user.email;
        this.dia_chi = user.dia_chi;
        this.avatar = user.avatar;
        this.trang_thai = user.trang_thai;
        this.accessToken = user.accessToken;
    }
    getId = () => {
        return this._id?.toString() || '';
    }
}
export default User;