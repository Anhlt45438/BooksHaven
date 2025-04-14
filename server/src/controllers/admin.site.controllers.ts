import { Request, Response } from 'express';
import path from 'path';

// Controller để phục vụ trang admin.html
export const serveAdminPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'admin.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang login.html
export const serveLoginPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'login.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang product.html
export const serveProductPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'product.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang productApproval.html
export const serveProductApprovalPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'productApproval.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang history.html
export const serveHistoryPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'history.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang report.html
export const serveReportPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'report.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang announcement.html
export const serveAnnouncementPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'announcement.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang send-announcement.html
export const serveSendAnnouncementPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'send-announcement.html');
  res.sendFile(filePath);
};

// Controller để phục vụ trang turnover.html
export const serveTurnoverPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'dist', 'sites', 'admin', 'turnover.html');
  res.sendFile(filePath);
};