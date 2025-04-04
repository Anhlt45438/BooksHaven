import { signJwt } from "~/untils/jwt";
import databaseServices from "./database.services";
import { hasPassword } from "~/untils/crypto";
import { Collection, ModifyResult, ObjectId, WithId } from "mongodb";
import { AccountStatus, RolesType, TokenType } from "~/constants/enum";
import User from "~/models/schemas/User.schemas";
import ChiTietVaiTro from "~/models/schemas/ChiTietVaiTro.schemas";
import GioHang from "~/models/schemas/GioHang.schemas";

class userService {
  private signAccessToken(user_id: string): Promise<string> {
    return signJwt({
      payload: {
        user_id,
        token_type: TokenType.AccessToken,
      },
      options: {
        algorithm: "HS256",
        expiresIn: process.env.ACCESS_TOKEN_EXPIRES_IN,
      },
    });
  }




  constructor() {}

  async register(payload: {
    email: string;
    password: string;
    name: string;
    sdt: string;
  }) {
    const user_id = new ObjectId();
    const { email, password, name, sdt } = payload;

    const [accessToken] = await Promise.all([
      this.signAccessToken(user_id.toString()),
    ]);
    const dataUser = new User({
      _id: user_id,
      email: email,
      username: name,
      sdt: sdt,
      password: hasPassword(password),
      accessToken: accessToken,
      trang_thai: AccountStatus.Normal,
    });
    const defaultRole = await databaseServices.VaiTro.findOne({
      ten_role: RolesType.User
    });

    if (!defaultRole) {
      throw new Error('Default user role not found');
    }

    // Create cart for new user
    const cart = new GioHang({ 
      id_gio_hang: new ObjectId(),
      id_user: user_id 
    });

    await Promise.all([
      databaseServices.users.insertOne(dataUser),
      databaseServices.chiTietVaiTro.insertOne(
        new ChiTietVaiTro({
          id_user: user_id,
          id_role: defaultRole.id_role,
          id_ctvt: new ObjectId(),
        })
      ),
      databaseServices.cart.insertOne(cart) // Add cart creation
    ]);
    
    return dataUser;
  }
  async login(payload: { user_id: string }) {
    const [accessToken] = await Promise.all([
      this.signAccessToken(payload.user_id),
    ]);

    
    return [accessToken];
  }
  logout(payload: { user_id: string }) {
    // deletedCount
    return new Promise((resolve, reject) => {
      // databaseServices.users.updateOne(
      //   { _id: new ObjectId(payload.user_id) },
      //   { $set: { accessToken: "" } },
      // );
      resolve(true);
    });
  }


  async checkNameIsDuplicate(name_user: string): Promise<boolean> {
    const resultFindName: WithId<User> | null =
      await databaseServices.users.findOne({ name: name_user });
    return resultFindName !== null;
  }
  async getUserInfoAccount(user_id: string): Promise<WithId<User> | null> {
    try {
      const user = await databaseServices.users.findOne({
        _id: new ObjectId(user_id),
      });

      if (!user) return null;

      // Generate new access token
      const newAccessToken = await this.signAccessToken(user_id);

      // Update user with new access token
      await databaseServices.users.updateOne(
        { _id: new ObjectId(user_id) },
        { $set: { accessToken: newAccessToken } }
      );

      // Return updated user data
      return {
        ...user,
        accessToken: newAccessToken
      };
    } catch (err) {
      console.log(err);
      return null;
    }
  }

  async  updateUser(userId: string, updateData: Partial<User>): Promise<User | null> {
    try {
      // If password is being updated, hash it
      if (updateData.password) {
        updateData.password = hasPassword(updateData.password);
      }

      const  updatedUser: ModifyResult<User> = await databaseServices.users.findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: updateData },
        { returnDocument: 'after' }
      );

      if (!updatedUser) {
        return null;
      }

      // // Generate new access token if needed
      // const newAccessToken = await this.signAccessToken(userId);
      
      // // Update the access token
      // await databaseServices.users.updateOne(
      //   { _id: new ObjectId(userId) },
      //   { $set: { accessToken: newAccessToken } }
      // );

      return updatedUser.value;
    } catch (error) {
      console.error(error);
      throw new Error('Error updating user');
    }
  }
}
export default new userService();
