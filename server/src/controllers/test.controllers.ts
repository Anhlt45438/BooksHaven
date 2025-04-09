import { Request, Response } from 'express';
import databaseServices from '~/services/database.services';

export const convertStringToInt = async (req: Request, res: Response) => {
  try {


    // Get the specified collection
    const selectedCollection = databaseServices.books;
    var countHandleDatabase:number = 0;

    // const userAddressResult = await databaseServices.users.updateMany(
    //   { 
    //     $or: [
    //       { dia_chi: { $eq: undefined } },
    //       { dia_chi: "" },
    //       { dia_chi: { $exists: false } }
    //     ] 
    //   },
    //   { $set: { dia_chi: "Ngo 5, nhat thanh, Xã Quý Sơn, Huyện Lục Ngạn, Bắc Giang" } }
    // );
    // countHandleDatabase += userAddressResult.modifiedCount;



    var  fields: Array<string> = ["so_trang", "so_luong", "gia", "da_ban"];
    for (var field of fields) {
       // Convert string to integer for the specified field
      const result = await selectedCollection.updateMany(
        { 
          $or: [
            { [field]: { $type: 'string' } },
            { [field]: { $exists: false } }
          ]
        },
        [
          { 
            $set: { 
              [field]: {
                $cond: {
                  if: { $eq: [{ $type: `$${field}` }, "missing"] },
                  then: 0,
                  else: { $toInt: `$${field}` }
                }
              }
            } 
          }
        ]
      );
      countHandleDatabase += result.modifiedCount;
    }

    // selectedCollection.updateMany(
    //  {}, {$set :{da_ban:0}} 
    // )
    const result = await databaseServices.shops.updateMany(
      { tong_tien: { $exists: false } },
      { $set: { tong_tien: 0 } }
    );
    countHandleDatabase += result.modifiedCount;


    return res.status(200).json({
      message: 'Field type conversion completed',
      data: {
        modifiedCount: countHandleDatabase
      }
    });

  } catch (error) {
    console.error('Convert string to int error:', error);
    return res.status(500).json({
      message: 'Error converting field type'
    });
  }
};
export const testingApp = async (req: Request, res: Response) => {
  await databaseServices.testing.insertOne({
    body: req.body
  });
  console.log(req.body);
  return res.status(200).json({
    message: 'block puzzle'
  });
};