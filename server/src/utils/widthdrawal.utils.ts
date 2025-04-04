import { transporter } from "~/controllers/users.controllers";
import { getGenerateTemplate } from "./email.utils";
import { formatCurrency } from "./format.utils";

export const sendMailWithdrawalMoneyShop = async (data: {
    email_shop: string;
    ten_shop: string;
    ma_giao_dich: string;
    ngay_rut: Date;
    phan_tram_thue: number;
    so_tien_rut: number;
    tien_thue: number;
    tien_thuc_nhan: number;
    ten_ngan_hang: string;
    so_tai_khoan: string;
    mo_ta: string;
  }) => {
    const html = await getHtmlWithdrawalMoneyShop(data);
    const info = await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: data.email_shop,
        subject: `Thông tin rút tiền #${data.ma_giao_dich} - Books Haven`,
        html: html
    });
    return true;
}
const getHtmlWithdrawalMoneyShop = async (data: {
  ten_shop: string;
  ma_giao_dich: string;
  ngay_rut: Date;
  phan_tram_thue: number;
  so_tien_rut: number;
  tien_thue: number;
  tien_thuc_nhan: number;
  ten_ngan_hang: string;
  so_tai_khoan: string;
  mo_ta: string;
}) => {

  const replacements = {
    ten_shop: data.ten_shop,
    ma_giao_dich: data.ma_giao_dich,
    ngay_rut: new Date(data.ngay_rut).toLocaleString('vi-VN'),
    phan_tram_thue: data.phan_tram_thue.toString(),
    so_tien_rut: formatCurrency(data.so_tien_rut),
    tien_thue: formatCurrency(data.tien_thue),
    tien_thuc_nhan: formatCurrency(data.tien_thuc_nhan),
    ten_ngan_hang: data.ten_ngan_hang,
    so_tai_khoan: data.so_tai_khoan,
    mo_ta: data.mo_ta,
    format_currency: formatCurrency(data.so_tien_rut)
  };

  return await getGenerateTemplate('shop-withdrawal-information', replacements);
};