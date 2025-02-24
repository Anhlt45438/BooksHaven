import { ObjectId } from "mongodb";

interface RoleType {
    id_role?: ObjectId;
    role_name: string;
}

class Role {
    id_role?: ObjectId;
    role_name: string;

    constructor(role: RoleType) {
        this.id_role = role.id_role;
        this.role_name = role.role_name;
    }
}

export default Role;