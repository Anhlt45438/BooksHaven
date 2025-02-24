import { Collection, Db, MongoClient } from "mongodb";
import User from "~/models/schemas/User.schemas";

const uri = `mongodb+srv://${process.env.DB_USERNAME}:${encodeURIComponent(process.env.DB_PASSWORD || "")}@${process.env.DB_IP}`;

class dataBaseServices {
  private client: MongoClient;
  private db_users: Db;

  constructor() {
    this.client = new MongoClient(uri);
    this.db_users = this.client.db(process.env.DB_USERS_NAME);
  }

  async connect() {
    try {
      await Promise.all([
        this.db_users.command({ ping: 1 }),
      ]);
      console.log(
        "Pinged your deployment. You successfully connected to MongoDB kaka!",
      );
    } catch (err) {
      console.log(err);
    } finally {
      await this.client.close();
    }
  }
  get users(): Collection<User> {
    return this.db_users.collection(
      process.env.DB_USERS_ACCOUNTS_COLLECTION || "",
    );
  }
  
}

export default new dataBaseServices();
