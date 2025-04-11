import { ObjectId } from "mongodb";
import { FeedbackStatus } from "~/constants/enum";

interface FeedbackMessage {
  id_message: ObjectId;
  sender_id: ObjectId;
  content: string;
  created_at: Date;
  is_admin: boolean;
}

interface FeedbackType {
  _id?: ObjectId;
  id_user: ObjectId;
  tieu_de: string;
  noi_dung: string;
  ngay_tao: Date;
  trang_thai: FeedbackStatus;
  phan_hoi: FeedbackMessage[];
}

export default class Feedback {
  _id: ObjectId;
  id_user: ObjectId;
  tieu_de: string;
  noi_dung: string;
  ngay_tao: Date;
  trang_thai: FeedbackStatus;
  phan_hoi: FeedbackMessage[];

  constructor(feedback: FeedbackType) {
    this._id = feedback._id || new ObjectId();
    this.id_user = feedback.id_user;
    this.tieu_de = feedback.tieu_de;
    this.noi_dung = feedback.noi_dung;
    this.ngay_tao = feedback.ngay_tao;
    this.trang_thai = feedback.trang_thai;
    this.phan_hoi = feedback.phan_hoi;
  }
}