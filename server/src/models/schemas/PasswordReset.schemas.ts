import { ObjectId } from "mongodb";

interface PasswordResetType {
  _id?: ObjectId;
  user_id: ObjectId;
  email: string;
  token: string;
  expires: Date;
  created_at?: Date;
}

export default class PasswordReset {
  _id?: ObjectId;
  user_id: ObjectId;
  email: string;
  token: string;
  expires: Date;
  created_at: Date;

  constructor(passwordReset: PasswordResetType) {
    this._id = passwordReset._id;
    this.user_id = passwordReset.user_id;
    this.email = passwordReset.email;
    this.token = passwordReset.token;
    this.expires = passwordReset.expires;
    this.created_at = passwordReset.created_at || new Date();
  }
}