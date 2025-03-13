import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
import GioHang from '~/models/schemas/GioHang.schemas';
import ChiTietGioHang from '~/models/schemas/ChiTietGioHang.schemas';

export const addToCart = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const { id_sach, so_luong } = req.body;

    // Get or create cart for user
    let cart = await databaseServices.cart.findOne({ id_user: new ObjectId(userId) });
    if (!cart) {
      cart = new GioHang({ id_user: new ObjectId(userId), id_gio_hang: new ObjectId() });
      await databaseServices.cart.insertOne(cart);
    }

    // Check if book already in cart
    const existingItem = await databaseServices.cartDetail.findOne({
      id_gio_hang: cart.id_gio_hang,
      id_sach: new ObjectId(id_sach)
    });

    if (existingItem) {
      // Update quantity
      await databaseServices.cartDetail.updateOne(
        { id_ctgh: existingItem.id_ctgh },
        { $set: { so_luong: existingItem.so_luong + so_luong } }
      );
    } else {
      // Add new item
      const cartItem = new ChiTietGioHang({
        id_ctgh: new ObjectId(),
        id_gio_hang: cart.id_gio_hang!,
        id_sach: new ObjectId(id_sach),
        so_luong
      });
      await databaseServices.cartDetail.insertOne(cartItem);
    }

    res.status(200).json({ message: 'Item added to cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error adding item to cart' });
  }
};

export const updateCartItem = async (req: Request, res: Response) => {
  try {
    const { id_ctgh } = req.params;
    const { so_luong } = req.body;

    const result = await databaseServices.cartDetail.updateOne(
      { id_ctgh: new ObjectId(id_ctgh) },
      { $set: { so_luong } }
    );

    if (result.matchedCount === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Cart item updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error updating cart item' });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { id_ctgh } = req.params;

    const result = await databaseServices.cartDetail.deleteOne({
      id_ctgh: new ObjectId(id_ctgh)
    });

    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    res.status(200).json({ message: 'Item removed from cart successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error removing item from cart' });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;

    const cart = await databaseServices.cart.findOne({
      id_user: new ObjectId(userId)
    });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const cartItems = await databaseServices.cartDetail
      .aggregate([
        {
          $match: { id_gio_hang: cart.id_gio_hang }
        },
        {
          $lookup: {
            from: 'sach',
            localField: 'id_sach',
            foreignField: '_id',
            as: 'book_info'
          }
        },
        {
          $unwind: '$book_info'
        },
        {
          $project: {
            id_ctgh: 1,
            id_gio_hang: 1,
            id_sach: 1,
            so_luong: 1,
            gia: { $multiply: ['$so_luong', '$book_info.gia'] }
          }
        }
      ]).toArray();

    res.status(200).json({
      gio_hang: cart,
      items: cartItems
    });
  } catch (error) {
    res.status(500).json({ message: 'Error getting cart' });
  }
};