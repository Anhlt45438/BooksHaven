import   { Collection, Db, MongoClient } from "mongodb";
import Sach from "~/models/schemas/Sach.schemas";
import User from "~/models/schemas/User.schemas";
import CuaHang from "~/models/schemas/CuaHang.schemas";
import TheLoai from "~/models/schemas/TheLoai.schemas";
import ChiTietTheLoai from "~/models/schemas/ChiTietTheLoai.schemas";
import ChiTietGioHang from "~/models/schemas/ChiTietGioHang.schemas";
import { ChiTietTinNhan } from "~/models/schemas/DetailMessage.schemas";
import HoiThoai from "~/models/schemas/ConversationMessage.schemas";
import DonHang from "~/models/schemas/DonHang.schemas";
import ChiTietDonHang from "~/models/schemas/ChiTietDonHang.schemas";
import ThanhToan from "~/models/schemas/ThanhToan.schemas";
import ThongBaoInfo from "~/models/schemas/ThongBaoInfo.schemas";
import VaiTro from "~/models/schemas/VaiTro.schemas";
import PasswordReset from "~/models/schemas/PasswordReset.schemas";
import DanhGia from "~/models/schemas/DanhGia.schemas";
import ViAdmin from "~/models/schemas/ViAdmin.schemas";
import LichSuSoDuAdmin from "~/models/schemas/LichSuSoDuAdmin.schemas";
import { get } from "http";
import Feedback from "~/models/schemas/Feedback.schemas";

const uri = `mongodb://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@${process.env.DB_IP}`;

class dataBaseServices {
  private client: MongoClient;
  private db_users: Db;
  private db_books: Db;
  private db_roles: Db;
  private db_shops: Db;
  private db_categories: Db;
  private db_cart: Db;
  private db_ratings: Db; 
  private db_notifications: Db;
  private db_conversations: Db; 
  private db_orders: Db;
  private db_payments: Db;
  private db_admin: Db;
  private db_testing: Db;

  constructor() {
    this.client = new MongoClient(uri);
    this.db_users = this.client.db(process.env.DB_USERS_NAME);
    this.db_books = this.client.db(process.env.DB_BOOKS_NAME);
    this.db_roles = this.client.db(process.env.DB_ROLES_NAME);
    this.db_shops = this.client.db(process.env.DB_SHOPS_NAME);
    this.db_categories = this.client.db(process.env.DB_CATEGORIES_NAME);
    this.db_cart = this.client.db(process.env.DB_CART_NAME);
    this.db_ratings = this.client.db(process.env.DB_RATINGS_NAME);
    this.db_notifications = this.client.db(process.env.DB_NOTIFICATIONS_NAME);
    this.db_conversations = this.client.db(process.env.DB_CONVERSATIONS_NAME);
    this.db_orders = this.client.db(process.env.DB_ORDERS_NAME);
    this.db_payments = this.client.db(process.env.DB_PAYMENTS_NAME);
    this.db_admin = this.client.db(process.env.DB_ADMIN_NAME);
    this.db_testing = this.client.db(process.env.DB_TESTING_NAME);
  }
  get chiTietVaiTro() {
    return this.db_roles.collection(process.env.DB_ROLES_CHI_TIET_VAI_TRO_COLLECTION || '');
  }
  get testing(): Collection<any> {
    return this.db_testing.collection(process.env.DB_TESTING_COLLECTION || ''); 
  }
  get ratings():Collection<DanhGia> {
    return this.db_ratings.collection(process.env.DB_RATINGS_COLLECTION || '');
  }
  get VaiTro():Collection<VaiTro> {
    return this.db_roles.collection(process.env.DB_ROLES_VAI_TRO_COLLECTION || '');
  }
  get adminWallet(): Collection<ViAdmin> {
    return this.db_admin.collection(
      process.env.DB_ADMIN_WALLET_COLLECTION || ''
    );
  }
  get feedbacks(): Collection<Feedback> {
    return this.db_admin.collection(
      process.env.DB_ADMIN_FEEDBACK_COLLECTION || ''
    ); 
  }
  get adminHistoryChangeBalance(): Collection<LichSuSoDuAdmin> {
    return this.db_admin.collection(
      process.env.DB_ADMIN_HISTORY_CHANGE_BALANCE_COLLECTION || ''
    );
  }
  async connect() {
    try {
      await Promise.all([
        this.db_users.command({ ping: 1 }),
        this.db_users.command({ ping: 1 }),

      ]);
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB kaka!",
      );
    } catch (err) {
      console.log(err);
    } finally {
      // await this.client.close();
    }
  }
  get users(): Collection<User> {
    return this.db_users.collection(
      process.env.DB_USERS_ACCOUNTS_COLLECTION || "",
    );
  }
  get books(): Collection<Sach> {
    return this.db_books.collection(
      process.env.DB_USERS_SACH_COLLECTION || ''
    );
  }
  get shops(): Collection<CuaHang> {
    return this.db_shops.collection(
      process.env.DB_SHOPS_COLLECTION || ''
    );
  }
  get categories(): Collection<TheLoai> {
    return this.db_categories.collection(
      process.env.DB_CATEGORIES_COLLECTION || ''
    );
  }
  get notifications(): Collection<any> {
    return this.db_notifications.collection(
      process.env.DB_NOTIFICATIONS_COLLECTION || ''
    );
  }
  get detailCategories(): Collection<ChiTietTheLoai> {
    return this.db_categories.collection(
      process.env.DB_CATEGORIES_CHI_TIET_COLLECTION || ''
    );
  }
  get cart(): Collection<any> {
    return this.db_cart.collection(
      process.env.DB_CART_COLLECTION || ''
    );
  }
  get tokensResetPassword(): Collection<PasswordReset> {
    return this.db_users.collection(
      process.env.DB_USERS_TOKENS_RESET_PASSWORD_COLLECTION || ''
    );
  }
  get cartDetail (): Collection<ChiTietGioHang> {
    return this.db_cart.collection(
      process.env.DB_CART_CHI_TIET_COLLECTION || ''
    );
  }
  get conversations(): Collection<HoiThoai> {
    return this.db_conversations.collection(
      process.env.DB_CONVERSATIONS_COLLECTION || ''
    );
  }
  get detailMessages(): Collection<ChiTietTinNhan> {
    return this.db_conversations.collection(
      process.env.DB_CONVERSATIONS_MESSAGE_COLLECTION || ''
    );
  }
  get payments(): Collection<ThanhToan> {
    return this.db_payments.collection(
      process.env.DB_PAYMENTS_COLLECTION || ''
    );
  }
  get orders(): Collection<DonHang> {
    return this.db_orders.collection(
      process.env.DB_ORDERS_DON_HANG_COLLECTION || ''
    );
  }
  get orderDetails (): Collection<ChiTietDonHang> {
    return this.db_orders.collection(
      process.env.DB_ORDERS_CHI_TIET_DON_HANG_COLLECTION || ''
    ); 
  }
  get notificationInfo (): Collection<ThongBaoInfo> {
    return this.db_notifications.collection(
      process.env.DB_NOTIFICATIONS_INFO_COLLECTION || ''
    );
  }
}

export default new dataBaseServices();
