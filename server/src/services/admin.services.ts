import { InsertOneResult, ObjectId, UpdateFilter } from "mongodb";
import databaseServices from "./database.services";
import ViAdmin from "~/models/schemas/ViAdmin.schemas";
import { AdminHistoryChangeBalanceStatus } from "~/constants/enum";
import LichSuSoDuAdmin from "~/models/schemas/LichSuSoDuAdmin.schemas";

 class adminServices {
    async changeBalanceShopAtAdmin(balance: number, shopId: ObjectId ,description: string) {
        const info:UpdateFilter<ViAdmin> = await databaseServices.adminWallet.findOneAndUpdate(
            {},
            { $inc: { tong_tien_shop: balance } },
            { returnDocument: 'after' }
        );
        const lichSoDu:LichSuSoDuAdmin = new LichSuSoDuAdmin({
            so_du_thay_doi: balance,
            thoi_gian: new Date(),
            id_shop:shopId,
            mo_ta: description,
            type: AdminHistoryChangeBalanceStatus.tien_cua_shop
        });
        await databaseServices.adminHistoryChangeBalance.insertOne({
          ...lichSoDu
        },
    );
        return lichSoDu;
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

    async getHistoryChangeBalanceByDateRange(page: number = 1, limit: number = 10, startDate?: Date, endDate?: Date) {
        const skip = (page - 1) * limit;
        
        // Xây dựng query dựa trên khoảng thời gian
        const query: any = {};
        if (startDate || endDate) {
            query.thoi_gian = {};
            if (startDate) {
                query.thoi_gian.$gte = startDate;
            }
            if (endDate) {
                query.thoi_gian.$lte = endDate;
            }
        }
        
        const [history, total] = await Promise.all([
            databaseServices.adminHistoryChangeBalance
                .find(query)
                .sort({ thoi_gian: -1 })
                .skip(skip)
                .limit(limit)
                .toArray(),
            databaseServices.adminHistoryChangeBalance.countDocuments(query)
        ]);

        // Thêm thông tin shop cho mỗi giao dịch
        const historyWithShopInfo = await Promise.all(
            history.map(async (item) => {
                let shopInfo = null;
                if (item.id_shop) {
                    shopInfo = await databaseServices.shops.findOne(
                        { _id: item.id_shop },
                        { projection: { ten_shop: 1 } }
                    );
                }
                return {
                    ...item,
                    shop_info: shopInfo
                };
            })
        );

        return {
            history: historyWithShopInfo,
            pagination: {
                total,
                page,
                limit,
                totalPages: Math.ceil(total / limit)
            }
        };
    }

    async getRevenueSummaryByDateRange(startDate?: Date, endDate?: Date) {
        // Xây dựng query dựa trên khoảng thời gian
        const query: any = {};
        if (startDate || endDate) {
            query.thoi_gian = {};
            if (startDate) {
                query.thoi_gian.$gte = startDate;
            }
            if (endDate) {
                query.thoi_gian.$lte = endDate;
            }
        }
        
        // Lấy tổng doanh thu từ shop trong khoảng thời gian
        const shopRevenueResult = await databaseServices.adminHistoryChangeBalance.aggregate([
            { $match: { ...query, type: AdminHistoryChangeBalanceStatus.tien_cua_shop } },
            { $group: { _id: null, total: { $sum: "$so_du_thay_doi" } } }
        ]).toArray();
        
        // Lấy tổng doanh thu của admin trong khoảng thời gian
        const adminRevenueResult = await databaseServices.adminHistoryChangeBalance.aggregate([
            { $match: { ...query, type: AdminHistoryChangeBalanceStatus.tien_cua_admin } },
            { $group: { _id: null, total: { $sum: "$so_du_thay_doi" } } }
        ]).toArray();
        
        // Lấy dữ liệu doanh thu theo ngày để vẽ biểu đồ
        const dailyRevenue = await databaseServices.adminHistoryChangeBalance.aggregate([
            { $match: query },
            {
                $group: {
                    _id: {
                        year: { $year: "$thoi_gian" },
                        month: { $month: "$thoi_gian" },
                        day: { $dayOfMonth: "$thoi_gian" },
                        type: "$type"
                    },
                    total: { $sum: "$so_du_thay_doi" }
                }
            },
            { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } }
        ]).toArray();
        
        // Định dạng dữ liệu cho biểu đồ
        const formattedDailyRevenue = dailyRevenue.map(item => ({
            date: `${item._id.year}-${String(item._id.month).padStart(2, '0')}-${String(item._id.day).padStart(2, '0')}`,
            type: item._id.type,
            amount: item.total
        }));
        
        return {
            total_shop_revenue: shopRevenueResult.length > 0 ? shopRevenueResult[0].total : 0,
            total_admin_revenue: adminRevenueResult.length > 0 ? adminRevenueResult[0].total : 0,
            total_revenue: (shopRevenueResult.length > 0 ? shopRevenueResult[0].total : 0) + 
                          (adminRevenueResult.length > 0 ? adminRevenueResult[0].total : 0),
            daily_revenue: formattedDailyRevenue
        };
    }
}
export default new adminServices();