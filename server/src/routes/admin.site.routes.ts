import { Router } from 'express';
import {
  serveAdminPage,
  serveLoginPage,
  serveProductPage,
  serveProductApprovalPage,
  serveHistoryPage,
  serveReportPage,
  serveAnnouncementPage,
  serveSendAnnouncementPage,
  revenuePage,
  getAdminWalletInfo,
  getAdminWalletHistoryByDateRange,
  getAdminRevenueSummary
} from '~/controllers/admin.site.controllers';
import express from 'express';
import path from 'path';

const adminSiteRouter = Router();

// Phục vụ các file tĩnh (JS, CSS, images) từ thư mục public
adminSiteRouter.use('/static', express.static(path.join(__dirname, '..', '..', 'public')));

// Phục vụ các file hình ảnh từ thư mục public/images
adminSiteRouter.use('/image', express.static(path.join(__dirname, '..', '..', 'public', 'images')));

// Route cho trang login (không cần xác thực)
adminSiteRouter.get('/login', serveLoginPage);

// Các routes cần xác thực và quyền admin
adminSiteRouter.get('/', serveAdminPage);
adminSiteRouter.get('/products', serveProductPage);
adminSiteRouter.get('/product-approval', serveProductApprovalPage);
adminSiteRouter.get('/history', serveHistoryPage);
adminSiteRouter.get('/reports', serveReportPage);
adminSiteRouter.get('/announcements', serveAnnouncementPage);
adminSiteRouter.get('/send-announcement', serveSendAnnouncementPage);

adminSiteRouter.get("/revenue", revenuePage)
// API endpoints cho doanh thu
adminSiteRouter.get('/api/admin/wallet/info', getAdminWalletInfo);
adminSiteRouter.get('/api/admin/wallet/history', getAdminWalletHistoryByDateRange);
adminSiteRouter.get('/api/admin/revenue/summary', getAdminRevenueSummary);

export default adminSiteRouter;