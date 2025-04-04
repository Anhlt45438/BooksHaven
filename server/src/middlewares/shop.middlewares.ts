import { Request, Response, NextFunction } from 'express';

export const validateWithdrawalRequest = (req: Request, res: Response, next: NextFunction) => {
  const { tai_khoan, ngan_hang, so_tien } = req.body;

  // Validate bank account number
  if (!tai_khoan || typeof tai_khoan !== 'string' || tai_khoan.trim().length < 10) {
    return res.status(400).json({
      message: 'Invalid bank account number'
    });
  }

  // Validate bank name
  if (!ngan_hang || typeof ngan_hang !== 'string' || ngan_hang.trim().length < 1) {
    return res.status(400).json({
      message: 'Tên ngân hàng không hợ'
    });
  }

  // Validate withdrawal amount
  const amount = Number(so_tien);
  if (isNaN(amount) || amount <= 0) {
    return res.status(400).json({
      message: 'Số tiền rút không hợp lệ'
    });
  }

  // Minimum withdrawal amount
  if (amount < 50000) {
    return res.status(400).json({
      message: 'Số tiền rút tối thiểu 50,000 VND'
    });
  }

  // Clean data
  req.body.tai_khoan = tai_khoan.trim();
  req.body.ngan_hang = ngan_hang.trim();
  req.body.so_tien = amount;

  next();
};