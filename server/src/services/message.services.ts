import { ObjectId } from 'mongodb';
import { ChiTietTinNhan } from '~/models/schemas/DetailMessage.schemas';
import databaseServices from './database.services';
import { Socket } from 'socket.io';

export class MessageService {
  static async sendMessage(data: { 
    conversation_id: string, 
    content: string, 
    user_id: string, 
    file_path?: string 
  }, socket: Socket) {
    try {
      const message = new ChiTietTinNhan({
        id_chi_tiet_tin_nhan: new ObjectId(),
        id_hoi_thoai: new ObjectId(data.conversation_id),
        id_user_gui: new ObjectId(data.user_id),
        noi_dung: data.content,
        duong_dan_file: data.file_path,
        ngay_tao: new Date(),
        da_doc: false,
      });

      await Promise.all([
        databaseServices.detailMessages.insertOne(message),
        databaseServices.conversations.updateOne(
          { id_hoi_thoai: new ObjectId(data.conversation_id) },
          { 
            $set: { 
              ngay_cap_nhat: new Date(),
              tin_nhan_cuoi: data.content,
              id_nguoi_gui_cuoi: new ObjectId(data.user_id),
              nguoi_nhan_da_doc: false,
            } 
          }
        )
      ]);

      return message;
    } catch (error) {
      throw error;
    }
  }

  static async markAsRead(data: { 
    conversation_id: string, 
    user_id: string 
  }) {
    try {
      await Promise.all([
        databaseServices.detailMessages.updateMany(
          {
            id_hoi_thoai: new ObjectId(data.conversation_id),
            id_user_gui: { $ne: new ObjectId(data.user_id) },
            da_doc: false
          },
          { $set: { da_doc: true } }
        ),
        databaseServices.conversations.updateOne(
          { id_hoi_thoai: new ObjectId(data.conversation_id) },
          { $set: { nguoi_nhan_da_doc: true } }
        )
      ]);
    } catch (error) {
      throw error;
    }
  }
}