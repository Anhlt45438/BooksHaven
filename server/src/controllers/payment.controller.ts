
import { Request, Response } from 'express';
import { ObjectId } from 'mongodb';
import databaseServices from '~/services/database.services';
 let config = {
      "vnp_TmnCode":"YRYBOBOC",
      "vnp_HashSecret":"QHJS76FDM43H6BN76XQUBOVK9Q28MV32",
      "vnp_Url":"https://sandbox.vnpayment.vn/paymentv2/vpcpay.html",
      "vnp_Api":"https://sandbox.vnpayment.vn/merchant_webapi/api/transaction",
      "vnp_ReturnUrl": "http://14.225.206.60:3000/api/payments/vnpay-return"
    };
    

const SHIPPING_COST = 30000; // 30,000 VND shipping cost per book

export const calculateOrderTotal = async (req: Request, res: Response) => {
  try {
    const { items } = req.body; // Expect array of { id_sach, so_luong }

    if (!Array.isArray(items)) {
      return res.status(400).json({
        message: 'items must be an array of { id_sach, so_luong }'
      });
    }

    // Convert string IDs to ObjectIds
    const objectIds = items.map(item => new ObjectId(item.id_sach));

    // Get books information
    const books = await databaseServices.books
      .find({ _id: { $in: objectIds } })
      .toArray();

    // Calculate total with quantity and shipping cost
    const booksWithShipping = books.map(book => {
      const orderItem = items.find(item => item.id_sach === book._id.toString());
      const quantity = orderItem?.so_luong || 1;
      return {
        _id: book._id,
        ten_sach: book.ten_sach,
        tac_gia: book.tac_gia,
        gia: book.gia,
        so_luong: quantity,
        shipping_cost: SHIPPING_COST,
        subtotal: book.gia * quantity,
        total_price: (book.gia * quantity) + (SHIPPING_COST)
      };
    });

    const totalAmount = booksWithShipping.reduce((sum, book) => sum + book.total_price, 0);
    const totalShipping = booksWithShipping.reduce((sum, book) => sum + book.shipping_cost, 0);

    return res.status(200).json({
      data: {
        books: booksWithShipping,
        total_amount: totalAmount,
        shipping_total: totalShipping
      }
    });

  } catch (error) {
    return res.status(500).json({
      message: 'Error getting payment information'
    });
  }
};

export const createPaymentUrlController = async (req: Request, res: Response) =>  {
  process.env.TZ = 'Asia/Ho_Chi_Minh';
    
    let date = new Date();
    let createDate = require("moment")(date).format('YYYYMMDDHHmmss');
    
    let ipAddr = req.headers['x-forwarded-for'] || process.env.DB_IP;
        

   
    let tmnCode = config['vnp_TmnCode'];
    let secretKey = config['vnp_HashSecret'];
    let vnpUrl = config['vnp_Url'];
    let returnUrl = config['vnp_ReturnUrl'];
    let orderId = require("moment")(date).format('DDHHmmss');
    let amount = req.body.amount;
    let bankCode = req.body.bankCode;
    
    let locale = 'vn';
    // if(locale === null || locale === ''){
    //     locale = 'vn';
    // }
    let currCode = 'VND';
  
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
    let querystring = require('qs');
    let signData = querystring.stringify(vnp_Params, { encode: false });
    let crypto = require("crypto");     
    let hmac = crypto.createHmac("sha512", secretKey);
    let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex"); 
    vnp_Params['vnp_SecureHash'] = signed;
    vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });
    // console.log(vnpUrl);
    res.status(200).json({data: vnpUrl});
}
export const vnpayReturnController = async (req: Request, res: Response) =>  {
  let vnp_Params = req.query;

  let secureHash = vnp_Params['vnp_SecureHash'];

  delete vnp_Params['vnp_SecureHash'];
  delete vnp_Params['vnp_SecureHashType'];


  let config = require('config');
  let tmnCode = config.get('vnp_TmnCode');
  let secretKey = config.get('vnp_HashSecret');

  let querystring = require('qs');
  let signData = querystring.stringify(vnp_Params, { encode: false });
  let crypto = require("crypto");     
  let hmac = crypto.createHmac("sha512", secretKey);
  let signed = hmac.update(new Buffer(signData, 'utf-8')).digest("hex");     

  if(secureHash === signed){ 
    return res.status(200).json({Message: 'Đơn hàng đã được thanh toán'});
  } else {
    return res.status(200).json({RspCode: '97', Message: 'Fail checksum'});
  }
}