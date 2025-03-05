import { Collection, Db, MongoClient } from "mongodb";
import Sach from "~/models/schemas/Sach.schemas";
import User from "~/models/schemas/User.schemas";
import CuaHang from "~/models/schemas/CuaHang.schemas";

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@${process.env.DB_IP}`;

class dataBaseServices {
  private client: MongoClient;
  private db_users: Db;
  private db_books: Db;
  private db_roles: Db;
  private db_shops: Db;

  constructor() {
    this.client = new MongoClient(uri);
    this.db_users = this.client.db(process.env.DB_USERS_NAME);
    this.db_books = this.client.db(process.env.DB_BOOKS_NAME);
    this.db_roles = this.client.db(process.env.DB_ROLES_NAME);
    this.db_shops = this.client.db(process.env.DB_SHOPS_NAME);
  }
  get chiTietVaiTro() {
    return this.db_roles.collection(process.env.DB_ROLES_CHI_TIET_VAI_TRO_COLLECTION || '');
  }
  
  get VaiTro() {
    return this.db_roles.collection(process.env.DB_ROLES_VAI_TRO_COLLECTION || '');
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
}

export default new dataBaseServices();
