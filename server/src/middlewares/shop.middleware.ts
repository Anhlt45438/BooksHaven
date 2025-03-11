import { Request, Response, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';

export const checkUserHasShop = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userId = req.params.userId;
        
        if (!ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: 'Invalid user ID format'
            });
        }

        const shop = await databaseServices.shops.findOne({
            id_user: new ObjectId(userId)
        });

        if (!shop) {
            return res.status(404).json({
                message: 'No shop found for this user'
            });
        }

        next();
    } catch (error) {
        return res.status(500).json({
            message: 'Error checking shop existence'
        });
    }
};