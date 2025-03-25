import { Request, Response } from 'express';
import  moment from 'moment';
import crypto from 'crypto';
import qs from 'qs';
import paymentService from '~/services/payments.services';
import databaseServices from '~/services/database.services';
import { ObjectId } from 'mongodb';
import ThanhToan from '~/models/schemas/ThanhToan.schemas';
import ordersService from '~/services/orders.services';
import DonHang from '~/models/schemas/DonHang.schemas';
import ChiTietDonHang from '~/models/schemas/ChiTietDonHang.schemas';
 let config = {
      "vnp_TmnCode":"YRYBOBOC",
      "vnp_HashSecret":"QHJS76FDM43H6BN76XQUBOVK9Q28MV32",
      "vnp_Url":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      "vnp_Api":"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
      // "vnp_ReturnUrl": "http://14.225.206.60:3000/api/payments/vnpay-return"
    };

export const calculateOrderTotal = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Expect array of { id_sach, so_luong }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: 'items must be an array of { id_sach, so_luong }'
      });
    }

    const result = await paymentService.calculateBooksTotal(items);

    return res.status(200).json({
      data: result
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error getting payment information'
    });
  }
};

export const createPaymentUrlController = async (req: Request, res: Response) =>  {
  // process.env.TZ = 'Asia/Ho_Chi_Minh';
    var resultsOrder: {
      order: DonHang;
      detail: ChiTietDonHang;
  }[];
    try {
      const { items } = req.body;

      resultsOrder = await ordersService.createOrders(req.decoded?.user_id!, items);
    } catch (error) {
      console.error('Create order error:', error);
      return res.status(500).json({
        message: error instanceof Error ? error.message : 'Error creating orders'
      });
    }
    let date = new Date();
    let createDate = moment(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for']
    ? Array.isArray(req.headers['x-forwarded-for'])
        ? req.headers['x-forwarded-for'][0]
        : req.headers['x-forwarded-for']
    : req.socket.remoteAddress || "::1";
        

   
    let tmnCode = config['vnp_TmnCode'];
    let secretKey = config['vnp_HashSecret'];
    let vnpUrl = config['vnp_Url'];
    let orderId = moment(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    
    let locale = 'vn';
    // if(locale === null || locale === ''){
    //     locale = 'vn';
    // }
    let currCode = 'VND';
    const payment = new ThanhToan({
      id_thanh_toan: new ObjectId(),
      id_don_hangs: resultsOrder.map(result => new ObjectId(result.order.id_don_hang)),
      id_user: new ObjectId(req.decoded?.user_id),
      so_tien: amount,
      phuong_thuc: 'vnpay',
      trang_thai: false,
      ngay_thanh_toan: new Date()
    });
    let returnUrl = `http://14.225.206.60:3000/api/payments/vnpay-return?id_thanh_toan=${payment.id_thanh_toan.toString()}&user_id=${req.decoded?.user_id}`;

    interface VNPayParams {
            vnp_Amount: number;
            vnp_BankCode?: string;
            vnp_Command: string;
            vnp_CreateDate: string;
            vnp_CurrCode: string;
            vnp_IpAddr: string;
            vnp_Locale: string;
            vnp_OrderInfo: string;
            vnp_OrderType: string;
            vnp_ReturnUrl: string;
            vnp_TmnCode: string;
            vnp_TxnRef: string;
            vnp_Version: string;
            vnp_SecureHash?: string;
            [key: string]: string | number | undefined;
        }
    
        let vnp_Params: VNPayParams = {
            vnp_Amount: amount * 100,
            vnp_BankCode: undefined,
            vnp_Command: 'pay',
            vnp_CreateDate: createDate,
            vnp_CurrCode: currCode,
            vnp_IpAddr: ipAddr as string,
            vnp_Locale: locale,
            vnp_OrderInfo:  'Thanh toan cho ma GD:' + orderId,
            vnp_OrderType: 'other',
            vnp_ReturnUrl: returnUrl,
            vnp_TmnCode: tmnCode,
            vnp_TxnRef: orderId,
            vnp_Version: '2.1.0',
            vnp_SecureHash: undefined
        };
    
        if(bankCode !== null && bankCode !== '') {
            vnp_Params.vnp_BankCode = bankCode;
        }
    
        // Encode all values in vnp_Params using encodeURIComponent
        Object.keys(vnp_Params).forEach(key => {
            if (vnp_Params[key] !== undefined) {
                vnp_Params[key] = encodeURIComponent(vnp_Params[key] as string | number).replace(/%20/g, "+");
            }
        });
    let signData = qs.stringify(vnp_Params, { encode: false });
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + qs.stringify(vnp_Params, { encode: false });
    
    
    await databaseServices.payments.insertOne(payment);
    res.status(200).json({link_payment: vnpUrl, payment_details: payment});
}

export const vnpayReturnController = async (req: Request, res: Response) =>  {
  try {
    const vnp_Params = req.query;
    const vnp_Amount = Number(vnp_Params.vnp_Amount) / 100; // Convert back from VNPay amount
    const vnp_TxnRef = vnp_Params.vnp_TxnRef as string;
    const vnp_ResponseCode = vnp_Params.vnp_ResponseCode as string;
    const userId = req.query.user_id as string;
    const id_thanh_toan = req.query.id_thanh_toan as string;


    // Create payment record
    if (vnp_ResponseCode === '00') {
      databaseServices.payments.updateOne(
        { id_thanh_toan: new ObjectId(id_thanh_toan),
          id_user: new ObjectId(userId)
        },
        { $set: { trang_thai: true } }
      );
    }

    // Redirect to frontend with status
    return res.redirect(`http://localhost:3000/payment-result?status=${vnp_ResponseCode === '00' ? 'success' : 'failed'}`);
  } catch (error) {
    console.error('Payment processing error:', error);
    return res.redirect('http://localhost:3000/payment-result?status=error');
  }
}




export const getPaymentHistory = async (req: Request, res: Response) => {
  try {
    const userId = req.decoded?.user_id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      databaseServices.payments
        .find({ id_user: new ObjectId(userId) })
        .sort({ ngay_thanh_toan: -1 })
        .skip(skip)
        .limit(limit)
        .toArray(),
      databaseServices.payments.countDocuments({ id_user: new ObjectId(userId) })
    ]);

    return res.status(200).json({
      data: payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get payment history error:', error);
    return res.status(500).json({
      message: 'Error getting payment history'
    });
  }
};

export const getPaymentById = async (req: Request, res: Response) => {
  try {
    const { paymentId } = req.params;
    const userId = req.decoded?.user_id;

    const payment = await databaseServices.payments.findOne({
      id_thanh_toan: new ObjectId(paymentId),
      id_user: new ObjectId(userId)
    });

    if (!payment) {
      return res.status(404).json({
        message: 'Payment not found'
      });
    }

    return res.status(200).json({
      data: payment
    });
  } catch (error) {
    console.error('Get payment detail error:', error);
    return res.status(500).json({
      message: 'Error getting payment details'
    });
  }
};