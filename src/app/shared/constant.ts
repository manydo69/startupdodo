export const DEVICE_TYPE = {
    MOBILE: "MOBILE",
    TABLET: "TABLET",
    PC: "PC",
}

export const BOOK_STATUS_LIST = [
    "BAN", "DRAFT", "CHO_DUYET", "CHUA_HOAN_THANH", "HOAN_THANH",
]

export const STATUS = {
    BAN: "BAN",
    DRAFT: "DRAFT",
    CHO_DUYET: "CHO_DUYET",
    CHUA_HOAN_THANH: "CHUA_HOAN_THANH",
    HOAN_THANH: "HOAN_THANH"
}

export const BOOK_FILTER_LIST = [
    { id: 'name', label: 'Tên' }, { id: 'createDate', label: 'Ngày tạo' }, { id: 'author', label: 'Tác giả' }, { id: 'status', label: 'Trạng thái' }
]

export const POST_FILTER_LIST = [
    { id: 'title', label: 'Tiêu đề' }, { id: 'createDate', label: 'Ngày tạo' }, { id: 'createUser', label: 'Tác giả' }
]

export const CHAPTER_TYPE = {
    TRUYEN_TRANH: "TRUYEN_TRANH",
    TRUYEN_CHU: "TRUYEN_CHU"
}

export const TRANSACTION_STATUS = {
    THANHCONG: "THANHCONG",
    THATBAI: "THATBAI"
}

export const TRANSACTION_TYPE = {
    THANHCONG: "THANHCONG",
    THATBAI: "THATBAI"
}

export const VNPAY_ERROR_CODE = [
    { code: '00', message: 'Giao dịch thành công' },
    { code: '07', message: 'Trừ tiền thành công. Giao dịch bị nghi ngờ (liên quan tới lừa đảo, giao dịch bất thường).' },
    { code: '09', message: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng chưa đăng ký dịch vụ InternetBanking tại ngân hàng.' },
    { code: '10', message: 'Giao dịch không thành công do: Khách hàng xác thực thông tin thẻ/tài khoản không đúng quá 3 lần' },
    { code: '11', message: 'Giao dịch không thành công do: Đã hết hạn chờ thanh toán. Xin quý khách vui lòng thực hiện lại giao dịch.' },
    { code: '12', message: 'Giao dịch không thành công do: Thẻ/Tài khoản của khách hàng bị khóa.' },
    { code: '13', message: 'Giao dịch không thành công do Quý khách nhập sai mật khẩu xác thực giao dịch (OTP). Xin quý khách vui lòng thực hiện lại giao dịch.' },
    { code: '24', message: 'Giao dịch không thành công do: Khách hàng hủy giao dịch' },
    { code: '51', message: 'Giao dịch không thành công do: Tài khoản của quý khách không đủ số dư để thực hiện giao dịch.' },
    { code: '65', message: 'Giao dịch không thành công do: Tài khoản của Quý khách đã vượt quá hạn mức giao dịch trong ngày.' },
    { code: '75', message: 'Ngân hàng thanh toán đang bảo trì.' },
    { code: '79', message: 'Giao dịch không thành công do: KH nhập sai mật khẩu thanh toán quá số lần quy định. Xin quý khách vui lòng thực hiện lại giao dịch' },
    { code: '99', message: 'Các lỗi khác (lỗi còn lại, không có trong danh sách mã lỗi đã liệt kê)' },
]

export const BANK = [
    { id: 1, name: 'Ngân hàng Nông nghiệp và Phát triển Nông thôn Việt Nam (Agribank)', code: 970499 },
    { id: 2, name: 'Ngân hàng TMCP Công thương Việt Nam (Vietinbank)', code: 970489 },
    { id: 3, name: 'Ngân hàng TMCP Đông Á (DongABank)', code: 970406 },
    { id: 4, name: 'Ngân hàng TMCP Sài Gòn Công thương (Saigonbank)', code: 161087 },
    { id: 5, name: 'Ngân hàng TMCP Đầu tư và Phát triển Việt Nam (BIDV)', code: 970488 },
    { id: 6, name: 'Ngân hàng TMCP Đông Nam Á (SeABank)', code: 970468 },
    { id: 7, name: 'Ngân hàng TMCP Dầu khí Toàn cầu (GP.Bank)', code: 970408 },
    { id: 8, name: 'Ngân hàng TMCP Xăng dầu Petrolimex (PG Bank)', code: 970430 },
    { id: 9, name: 'Ngân hàng TMCP Đại chúng Việt Nam (PVcomBank)', code: 970412 },
    { id: 10, name: 'Ngân hàng TMCP Kiên Long (Kienlongbank)', code: 970452 },
    { id: 11, name: 'Ngân hàng TMCP BảnViệt(Vietcapital Bank)', code: 970454 },
    { id: 12, name: 'Ngân hàng ViệtNam Thương Tín (VietBank)', code: 970433 },
    { id: 13, name: 'Ngân hàng TMCP Đại Dương (OceanBank)', code: 970414 },
    { id: 14, name: 'Ngân hàng TMCP Sài Gòn Thương Tín (Sacombank)', code: 970403 },
    { id: 15, name: 'Ngân hàng TMCP An Bình (ABBank)', code: 970459 },
    { id: 16, name: 'Ngân hàng Liên doanh Việt Nga', code: 970421 },
    { id: 17, name: 'Ngân hàng TMCP Ngoại Thương Việt Nam (VCB)', code: 686868 },
    { id: 18, name: 'Ngân hàng TMCP Á Châu (ACB)', code: 970416 },
    { id: 19, name: 'Ngân hàng TMCP Xuất nhập khẩu Việt Nam (Eximbank)', code: 452999 },
    { id: 20, name: 'Ngân hàng TMCP Tiên Phong (TPBank)', code: 970423 },
    { id: 21, name: 'Ngân hàng TMCP Sài Gòn Hà Nội (SHB)', code: 970443 },
    { id: 22, name: 'Ngân hàng TMCP Phát Triển Thành Phố Hồ Chí Minh (HDBank)', code: 970437 },
    { id: 23, name: 'Ngân hàng TMCP Quân Đội MBBank)', code: 970422 },
    { id: 24, name: 'Ngân hàng TMCP Việt Nam Thịnh Vượng (VPBank)', code: 981957 },
    { id: 25, name: 'Ngân hàng TMCP Quốc Tế Việt Nam(VIB)', code: 180906 },
    { id: 26, name: 'Ngân hàng TMCP Việt Á', code: 166888 },
    { id: 27, name: 'Ngân hàng TMCP Kỹ Thương Việt Nam (Techcombank)', code: 888899 },
    { id: 28, name: 'Ngân hàng TMCP Phương Đông (OCB)', code: 970448 },
    { id: 29, name: 'Ngân hàng TMCP Quốc Dân (NCB)', code: 818188 },
    { id: 30, name: 'Ngân hàng TNHH MTV Hongleong Việt Nam (HLBVN)', code: 970442 },
    { id: 31, name: 'Ngân hàng TMCP Bưu Điện Liên Việt (LienVietPostBank)', code: 970449 },
    { id: 32, name: 'Ngân hàng TMCP Bắc Á (BacABank)', code: 970409 },
    { id: 33, name: 'Ngân hàng TMCP Bảo Việt (BVB)', code: 970438 },
    { id: 34, name: 'Ngân hàng TNHH MTV Shinhan Việt Nam (ShinhanVN)', code: 970424 },
    { id: 35, name: 'Ngân hàng Liên doanh VID Public (VID Public)', code: 970439 },
    { id: 36, name: 'Ngân hàng TMCP Sài Gòn (SCB)', code: 157979 },
    { id: 37, name: 'Ngân hàng TMCP Hàng Hải Việt nam (MaritimeBank)', code: 970426 },
    { id: 38, name: 'Ngân hàng TMCP Nam Á', code: 970428 },
    { id: 39, name: 'Ngân hàng TNHH Indovina', code: 970434 },
    { id: 40, name: 'Ngân hàng Woori Việt Nam', code: 970457 },
    { id: 41, name: 'Ngân hàng IBK', code: 970455 },
    { id: 42, name: 'Ngân hàng Hợp Tác Xã Việt Nam (Co-op Bank)', code: 970446 },
    { id: 43, name: 'Ngân hàng TNHH MTV CIMB (CIMB)', code: 422589 },
    { id: 44, name: 'Ngân hàng TNHH MTV United Overseas (UOB)', code: 970458 },
]
