import { ObjectId, UpdateFilter } from "mongodb";
import databaseServices from "./database.services";
import ViAdmin from "~/models/schemas/ViAdmin.schemas";
import { AdminHistoryChangeBalanceStatus } from "~/constants/enum";

 class adminServices {
    async changeBalanceShopAtAdmin(balance: number, shopId: ObjectId ,description: string) {
        const info:UpdateFilter<ViAdmin> = await databaseServices.adminWallet.findOneAndUpdate(
            {},
            { $inc: { tong_tien_shop: balance } },
            { returnDocument: 'after' }
        );
        await databaseServices.adminHistoryChangeBalance.insertOne({
            so_du_thay_doi: balance,
            thoi_gian: new Date(),
            id_shop:shopId,
            mo_ta: description,
            type: AdminHistoryChangeBalanceStatus.tien_cua_shop
        });
        return info;
    }
    async changeBalanceAtAdmin(balance: number, shopId: ObjectId ,description: string) {
        const info:UpdateFilter<ViAdmin> = await databaseServices.adminWallet.findOneAndUpdate(
            {},
            { $inc: { tien_thu_duoc: balance } },
            { returnDocument: 'after' }
        );
        await databaseServices.adminHistoryChangeBalance.insertOne({
            so_du_thay_doi: balance,
            thoi_gian: new Date(),
            id_shop:shopId,
            mo_ta: description,
            type: AdminHistoryChangeBalanceStatus.tien_cua_admin
        });
        return info;
    }
    async getAdminInfoWallet() {
        let  info =  await  databaseServices.adminWallet.findOne({});
        return info;
    }
    async getHistoryChangeBalance(page: number = 1, limit: number = 10, type: AdminHistoryChangeBalanceStatus) {
        const skip = (page - 1) * limit;
        
        const [history, total] = await Promise.all([
            databaseServices.adminHistoryChangeBalance
                .find({
                   type: type
                })
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