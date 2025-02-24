import { Collection, Db, MongoClient } from "mongodb";
import Sach from "~/models/schemas/Sach.schemas";
import User from "~/models/schemas/User.schemas";

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@${process.env.DB_IP}`;

class dataBaseServices {
  private client: MongoClient;
  private db_users: Db;
  private db_books: Db;


  constructor() {
    this.client = new MongoClient(uri);
    this.db_users = this.client.db(process.env.DB_USERS_NAME);
    this.db_books = this.client.db(process.env.DB_BOOKS_NAME);
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
    return this.db_users.collection(
      process.env.DB_USERS_SACH_COLLECTION || ''
    );
  }
  
}

export default new dataBaseServices();
