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
  serveTurnoverPage
} from '~/controllers/admin.site.controllers';
import { authMiddleware } from '~/middlewares/auth.middleware';
import { checkUserRole } from '~/middlewares/role.middleware';
import { RolesType } from '~/constants/enum';
import express from 'express';
import path from 'path';

const adminSiteRouter = Router();

// Phục vụ các file tĩnh (JS, CSS, images) từ thư mục admin
adminSiteRouter.use('/static', express.static(path.join(__dirname, '..', 'sites', 'admin')));

// Phục vụ các file hình ảnh từ thư mục image
adminSiteRouter.use('/image', express.static(path.join(__dirname, '..', 'sites', 'admin', 'image')));

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
adminSiteRouter.get('/turnover', serveTurnoverPage);
adminSiteRouter.use('/image', express.static(path.join(__dirname, '..', 'sites', 'admin', 'image')));
export default adminSiteRouter;