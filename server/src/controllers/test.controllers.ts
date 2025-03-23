import { Request, Response } from 'express';
import databaseServices from '~/services/database.services';

export const convertStringToInt = async (req: Request, res: Response) => {
  try {


    // Get the specified collection
    const selectedCollection = databaseServices.books;
    if (!selectedCollection) {
      return res.status(400).json({
        message: 'Collection not found'
      });
    }
    var  field: string = "gia";
    // Convert string to integer for the specified field
    const result = await selectedCollection.updateMany(
      { [field]: { $type: 'string' } },
      [{ $set: { [field]: { $toInt: `$${field}` } } }]
    );

    return res.status(200).json({
      message: 'Field type conversion completed',
      data: {
        matchedCount: result.matchedCount,
        modifiedCount: result.modifiedCount
      }
    });

  } catch (error) {
    console.error('Convert string to int error:', error);
    return res.status(500).json({
      message: 'Error converting field type'
    });
  }
};