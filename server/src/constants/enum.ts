export enum AccountStatus {
    Warning,
    Normal,
    Ban,
}

export enum TokenType {
    AccessToken,
    RefreshToken,
}
export enum RolesType {
    Admin = "admin",
    User = "user",
    Shop = "shop",
}
export enum TrangThaiDonHangStatus {
    da_huy = "đã hủy",
    chua_thanh_toan = "chưa thanh toán",
    cho_xac_nhan = "chờ xác nhận",
    dang_chuan_bi = "đang chuẩn bị hàng",
    dang_giao_hang = "đang giao hàng",
    da_nhan_hang = "đã nhận hàng",
}
export enum AdminHistoryChangeBalanceStatus {
    tien_cua_shop = "tiền của shop",
    tien_cua_admin = "tiền của admin",
}

export enum FeedbackStatus {
  Pending = 'cho_phan_hoi',
  InProgress = 'dang_xu_ly',
  Resolved = 'da_giai_quyet'
}