import { getGenerateTemplate } from './email.utils';
import { formatCurrency } from './format.utils'; 

interface BillItem {
  ten_sach: string;
  giam_gia: string;
  so_luong: number;
  don_gia: number;
  thanh_tien: number;
}

export const generateBillHTML = async (data: {
  shop_address: string;
  shop_name: string;
  shop_phone: string;
  username: string;
  dia_chi: string;
  sdt: string;
  id_don_hang: string;
  items: BillItem[];
  tong_tien: number;
  tong_tien_ship: number;
}) => {
  const today = new Date();
  
  const replacements = {
    shop_address: data.shop_address,
    shop_name: data.shop_name,
    shop_phone: data.shop_phone,
    username: data.username,
    dia_chi: data.dia_chi,
    sdt: data.sdt,
    id_don_hang: data.id_don_hang,
    days: today.getDate().toString(),
    month: (today.getMonth() + 1).toString(),
    year: today.getFullYear().toString(),
    each_items: data.items.map((item, index) => (
      `<tr>
          <td style="width: 40%">${item.ten_sach}</td>
          <td style="width: 20%">${item.giam_gia}</td>
          <td style="width: 5%">${item.so_luong}</td>
          <td style="width: 15%">${formatCurrency(item.don_gia)}</td>
          <td style="width: 20%">${formatCurrency(item.thanh_tien)}</td>
       </tr> `
    )).join('\n'),
    tong_tien: formatCurrency(data.tong_tien),
    tong_tien_ship: formatCurrency(data.tong_tien_ship),
  };

  return getGenerateTemplate('bill-order', replacements);
};