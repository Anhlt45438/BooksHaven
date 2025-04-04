import { ObjectId, UpdateFilter } from "mongodb";
import databaseServices from "./database.services";
import ViAdmin from "~/models/schemas/ViAdmin.schemas";

 class adminServices {
    async changeBalance(balance: number, shopId: ObjectId ,description: string) {
        const info:UpdateFilter<ViAdmin> = await databaseServices.adminWallet.findOneAndUpdate(
            {},
            { $inc: { so_du: balance } },
            { returnDocument: 'after' }
        );
        await databaseServices.adminHistoryChangeBalance.insertOne({
            so_du_thay_doi: balance,
            thoi_gian: new Date(),
            id_shop:shopId,
            mo_ta: description
        });
        console.log(info);
        return info;
    }
    async getAdminInfoWallet() {
        let  info =  await  databaseServices.adminWallet.findOne({});
        return info;
    }
    async getHistoryChangeBalance(page: number = 1, limit: number = 10) {
        const skip = (page - 1) * limit;
        
        const [history, total] = await Promise.all([
            databaseServices.adminHistoryChangeBalance
                .find({})
                .sort({ thoi_gian: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            databaseServices.adminHistoryChangeBalance.countDocuments({})
        ]);

        return {
            history,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }
}
export default new adminServices();