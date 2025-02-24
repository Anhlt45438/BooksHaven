import { signJwt } from "~/untils/jwt";
import databaseServices from "./database.services";
import { hasPassword } from "~/untils/crypto";
import { ObjectId, WithId } from "mongodb";
import { AccountStatus, TokenType } from "~/constants/enum";
import User from "~/models/schemas/User.schemas";

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
  }) {
    const user_id = new ObjectId();
    const { email, password, name } = payload;

    const [accessToken] = await Promise.all([
      this.signAccessToken(user_id.toString()),
    ]);
    const dataUser = new User({
      _id: user_id,
      email: email,
      username: name,
      password: hasPassword(password),
      accessToken: accessToken,
      trang_thai: AccountStatus.Normal,
    });
    await Promise.all([
      databaseServices.users.insertOne(dataUser),
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
      const resultGet: WithId<User> | null =
        await databaseServices.users.findOne({
          _id: new ObjectId(user_id),
        });
      return resultGet;
    } catch (err) {
      console.log(err);
      return null;
    }
  }

}
export default new userService();
