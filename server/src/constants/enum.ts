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
    chua_thanh_toan = "chưa thanh toán",
    cho_xac_nhan = "chờ xác nhận",
    dang_chuan_bi = "đang chuẩn bị hàng",
    dang_giao_hang = "đang giao hàng",
    da_nhan_hang = "đã nhận hàng",
    da_hoan_thanh_don = "đã hoàn thành đơn"
}