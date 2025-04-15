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

// Controller để phục vụ trang turnover.html
export const serveTurnoverPage = (req: Request, res: Response) => {
  const filePath = path.join(process.cwd(), 'public', 'turnover.html');
  res.sendFile(filePath);
};