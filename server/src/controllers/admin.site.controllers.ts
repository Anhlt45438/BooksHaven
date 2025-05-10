import { Request, Response } from 'express';
import path from 'path';

// Controller để phục vụ trang admin.html
export const serveAdminPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'admin.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang login.html
export const serveLoginPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'login.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang product.html
export const serveProductPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'product.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang productApproval.html
export const serveProductApprovalPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'productApproval.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang history.html
export const serveHistoryPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'history.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang report.html
export const serveReportPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'report.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang announcement.html
export const serveAnnouncementPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'announcement.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang send-announcement.html
export const serveSendAnnouncementPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'send-announcement.html');
  res.sendFile(filePath);
};


export const revenuePage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'revenue.html');
  res.sendFile(filePath);
};

// API để lấy thông tin ví admin
export const getAdminWalletInfo = async (req: Request, res: Response) => {
  try {
    const adminServices = (await import('~/services/admin.services')).default;
    const walletInfo = await adminServices.getAdminInfoWallet();
    if (walletInfo) {
      walletInfo.tong_tien_shop = Number(walletInfo.tong_tien_shop);
      walletInfo.tien_thu_duoc = Number(walletInfo.tien_thu_duoc);
    }
    return res.status(200).json({
      message: 'Get admin wallet info successfully',
      data: walletInfo
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting admin wallet info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// API để lấy lịch sử giao dịch của ví admin theo khoảng thời gian
export const getAdminWalletHistoryByDateRange = async (req: Request, res: Response) => {
  try {
    const adminServices = (await import('~/services/admin.services')).default;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const fromDate = req.query.fromDate as string;
    const toDate = req.query.toDate as string;
    
    let startDate = fromDate ? new Date(fromDate) : undefined;
    let endDate = toDate ? new Date(toDate) : undefined;
    
    if (endDate) {
      // Đặt thời gian kết thúc là cuối ngày
      endDate.setHours(23, 59, 59, 999);
    }
    
    const result = await adminServices.getHistoryChangeBalanceByDateRange(page, limit, startDate, endDate);
    
    return res.status(200).json({
      message: 'Get admin wallet history by date range successfully',
      data: result.history,
      pagination: result.pagination
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting admin wallet history by date range',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

// API để lấy tổng doanh thu theo khoảng thời gian
export const getAdminRevenueSummary = async (req: Request, res: Response) => {
  try {
    const adminServices = (await import('~/services/admin.services')).default;
    const fromDate = req.query.fromDate as string;
    const toDate = req.query.toDate as string;
    
    let startDate = fromDate ? new Date(fromDate) : undefined;
    let endDate = toDate ? new Date(toDate) : undefined;
    
    if (endDate) {
      // Đặt thời gian kết thúc là cuối ngày
      endDate.setHours(23, 59, 59, 999);
    }
    
    const result = await adminServices.getRevenueSummaryByDateRange(startDate, endDate);
    
    return res.status(200).json({
      message: 'Get admin revenue summary by date range successfully',
      data: result
    });
  } catch (error) {
    return res.status(500).json({
      message: 'Error getting admin revenue summary by date range',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};