import {Request, Response} from 'express';
import {ObjectId} from 'mongodb';
import databaseServices from '~/services/database.services';
import CuaHang from '~/models/schemas/CuaHang.schemas';
import ChiTietVaiTro from '~/models/schemas/ChiTietVaiTro.schemas';
import {RolesType} from '~/constants/enum';
import sachServices from '~/services/sach.services';

export const getShopInfo = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.id;

    if (!shopId) {
      return res.status(400).json({
        message: 'Shop ID is required',
      });
    }

    const shop = await databaseServices.shops.findOne({
      _id: new ObjectId(shopId),
    });

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found',
      });
    }

    return res.status(200).json({
      message: 'Shop information retrieved successfully',
      data: shop,
    });
  } catch (error) {
    console.error('Get shop info error:', error);
    return res.status(500).json({
      message: 'Error retrieving shop information',
    });
  }
};

export const createShop = async (req: Request, res: Response) => {
  try {
    const {ten_shop, anh_shop, mo_ta} = req.body;
    const userId = req.decoded?.user_id;

    if (!userId) {
      return res.status(401).json({
        message: 'User not authenticated',
      });
    }

    // Check if user already has a shop
    const existingShop = await databaseServices.shops.findOne({
      id_user: new ObjectId(userId),
    });

    if (existingShop) {
      return res.status(400).json({
        message: 'User already has a shop',
      });
    }

    // Check if shop name already exists
    const shopWithSameName = await databaseServices.shops.findOne({
      ten_shop,
    });

    if (shopWithSameName) {
      return res.status(400).json({
        message: 'Shop name already exists',
      });
    }
    const id_shop: ObjectId = new ObjectId();
    const newShop = new CuaHang({
      id_user: new ObjectId(userId),
      id_shop: id_shop,
      ten_shop,
      anh_shop,
      mo_ta,
      trang_thai: true, 
      tong_tien: 0
    });
    const result = await databaseServices.shops.insertOne(newShop);
    // Add shop role to user's roles after shop creation
    const shopRole = await databaseServices.VaiTro.findOne({
      ten_role: RolesType.Shop,
    });
    if (!shopRole) {
      throw new Error('Shop role not found');
    }
    await databaseServices.chiTietVaiTro.insertOne(
      new ChiTietVaiTro({
        id_user: new ObjectId(userId),
        id_role: shopRole.id_role,
        id_ctvt: new ObjectId(),
      }),
    );
    return res.status(201).json({
      message: 'Shop created successfully',
      data: {
        id_shop: result.insertedId,
        ...newShop,
      },
    });
  } catch (error) {
    console.error('Create shop error:', error);
    return res.status(500).json({
      message: 'Error creating shop',
    });
  }
};
export const getShopByUserId = async (req: Request, res: Response) => {
  try {
    const userId = req.params.userId;

    if (!userId) {
      return res.status(400).json({
        message: 'User ID is required',
      });
    }

    const shop = await databaseServices.shops.findOne({
      id_user: new ObjectId(userId),
    });

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found for this user',
      });
    }

    return res.status(200).json({
      message: 'Shop information retrieved successfully',
      data: shop,
    });
  } catch (error) {
    console.error('Get shop by user ID error:', error);
    return res.status(500).json({
      message: 'Error retrieving shop information',
    });
  }
};

export const updateShop = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.id;
    // Extract only valid shop fields from request body
    const { ten_shop, anh_shop, mo_ta, trang_thai } = req.body;
    const updateData = {
      ...(ten_shop !== undefined && { ten_shop }),
      ...(anh_shop !== undefined && { anh_shop }),
      ...(mo_ta !== undefined && { mo_ta }),
      ...(trang_thai !== undefined && { trang_thai })
    };
    
    const updatedShop = await databaseServices.shops.findOneAndUpdate(
      { _id: new ObjectId(shopId) },
      { $set: updateData },
      { returnDocument: 'after' }
    );

    if (!updatedShop) {
      return res.status(404).json({
        message: 'Shop not found'
      });
    }

    return res.status(200).json({
      message: 'Shop updated successfully',
      data: updatedShop
    });

  } catch (error) {
    console.error('Update shop error:', error);
    return res.status(500).json({
      message: 'Error updating shop'
    });
  }
};

export const getShopProducts = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;

    // Get shop by user ID
    const shop = await databaseServices.shops.findOne({
      id_user: new ObjectId(userId)
    });

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found for this user'
      });
    }

    // Get books belonging to the shop
    const books = await databaseServices.books
      .find({ id_shop: shop.id_shop, trang_thai: true })
      .toArray();

    // Get categories for each book using sachService
    const booksWithCategories = await Promise.all(
      books.map(async (book) => {
        const categories = await sachServices.getBookCategories(book._id);
        return {
          ...book,
          the_loai: categories
        };
      })
    );

    return res.status(200).json({
      message: 'Shop products retrieved successfully',
      data: booksWithCategories
    });

  } catch (error) {
    console.error('Get shop products error:', error);
    return res.status(500).json({
      message: 'Error retrieving shop products'
    });
  }
};

export const getShopProductsByIdShop = async (req: Request, res: Response) => {
  try {
    const shopId = req.params.id;

    // Get shop by user ID
    const shop = await databaseServices.shops.findOne({
      _id: new ObjectId(shopId)
    });

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found for this user'
      });
    }

    // Get books belonging to the shop
    const books = await databaseServices.books
      .find({ 
        id_shop: shop.id_shop, 
        trang_thai: true

      })
      .toArray();

    // Get categories for each book using sachService
    const booksWithCategories = await Promise.all(
      books.map(async (book) => {
        const categories = await sachServices.getBookCategories(book._id);
        return {
          ...book,
          the_loai: categories
        };
      })
    );

    return res.status(200).json({
      message: 'Shop products retrieved successfully',
      data: booksWithCategories
    });


  } catch (error) {
    console.error('Get shop products error:', error);
    return res.status(500).json({
      message: 'Error retrieving shop products'
    });
  }
};

export const getShopProductsByIdUser = async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    // Get shop by user ID
    const shop = await databaseServices.shops.findOne({
      id_user: new ObjectId(userId)
    });

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found for this user'
      });
    }

     // Get books belonging to the shop
     const books = await databaseServices.books
     .find({ 
        id_shop: shop.id_shop,
        trang_thai: true
      })
     .toArray();

    // Get categories for each book using sachService
    const booksWithCategories = await Promise.all(
      books.map(async (book) => {
        const categories = await sachServices.getBookCategories(book._id);
        return {
          ...book,
          the_loai: categories
        };
      })
    );

    return res.status(200).json({
      message: 'Shop products retrieved successfully',
      data: booksWithCategories
    });

  } catch (error) {
    console.error('Get shop products error:', error);
    return res.status(500).json({
      message: 'Error retrieving shop products'
    });
  }
};

export const getShopProductsByStatus = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { type } = req.body;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const shop = await databaseServices.shops.findOne({
      id_user: new ObjectId(userId)
    });

    if (!shop) {
      return res.status(404).json({
        message: 'Shop not found for this user'
      });
    }

    let query: any = { id_shop: shop.id_shop };
    switch (type) {
      case 'con_hang':
        query.trang_thai = true;
        query.so_luong = { $gt: 0 };
        break;
      case 'het_hang':
        query.trang_thai = true;
        query.so_luong = 0;
        break;
      case 'chua_duyet':
        query.trang_thai = false;
        break;
      default:
        return res.status(400).json({
          message: 'Invalid type parameter. Must be "con_hang", "het_hang", or "chua_duyet"'
        });
    }

    const total = await databaseServices.books.countDocuments(query);
    const books = await databaseServices.books
      .find(query)
      .skip(skip)
      .limit(limit)
      .toArray();

    const booksWithCategories = await Promise.all(
      books.map(async (book) => {
        const categories = await sachServices.getBookCategories(book._id);
        return {
          ...book,
          the_loai: categories
        };
      })
    );

    return res.status(200).json({
      message: 'Shop products retrieved successfully',
      data: booksWithCategories,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });

  } catch (error) {
    console.error('Get shop products by status error:', error);
    return res.status(500).json({
      message: 'Error retrieving shop products'
    });
  }
};

