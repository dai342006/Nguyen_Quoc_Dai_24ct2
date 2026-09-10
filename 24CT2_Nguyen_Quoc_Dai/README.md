# # SkillHub - Digital Skill Marketplace (Kết nối việc làm người có kỹ năng số với khách hàng)
# link Dự án: https://skillhub-digital.vercel.app/

## Giới thiệu

**SkillHub** là website **mua bán và thuê kỹ năng số**, được xây dựng nhằm kết nối khách hàng với các Freelancer.

Khách hàng có thể tìm kiếm dịch vụ, đặt dịch vụ hoặc đăng yêu cầu riêng. Freelancer có thể đăng dịch vụ, quản lý dịch vụ và nhận các yêu cầu từ khách hàng.

## Mục tiêu

- Kết nối khách hàng với Freelancer.
- Hỗ trợ tìm kiếm và lựa chọn dịch vụ số.
- Cho phép khách hàng đăng yêu cầu công việc.
- Cho phép Freelancer nhận và quản lý yêu cầu.
- Quản lý đơn hàng và thanh toán dịch vụ.
- Hỗ trợ đánh giá dịch vụ sau khi hoàn thành.

## Chức năng chính

### Khách hàng

- Đăng ký tài khoản.
- Đăng nhập.
- Xem trang chủ.
- Xem danh sách dịch vụ.
- Tìm kiếm và lọc dịch vụ.
- Xem chi tiết dịch vụ.
- Đặt dịch vụ.
- Quản lý đơn hàng.
- Đăng yêu cầu tìm Freelancer.
- Xem các yêu cầu đã đăng.
- Thanh toán dịch vụ.
- Đánh giá dịch vụ.

### Freelancer

- Đăng ký tài khoản Freelancer.
- Đăng nhập.
- Xem hồ sơ Freelancer.
- Quản lý dịch vụ.
- Thêm dịch vụ.
- Cập nhật dịch vụ.
- Xóa dịch vụ.
- Xem yêu cầu của khách hàng.
- Nhận yêu cầu.
- Quản lý đơn hàng.

## Công nghệ sử dụng

### Frontend

- React
- Vite
- JavaScript
- HTML
- CSS

### Backend

- Node.js
- Express.js

### Database

- PostgreSQL
- Supabase

### Deploy

- Vercel
- Render

## Cấu trúc thư mục

```text
24CT2_Nguyen_Quoc_Dai/
│
├── backend/
│   ├── server.js
│   ├── db.js
│   ├── NguoiDung.js
│   ├── DichVu.js
│   ├── DonHang.js
│   ├── DanhGia.js
│   └── YeuCau.js
│
├── src/
│   ├── components/
│   │   ├── Header.jsx
│   │   ├── Footer.jsx
│   │   └── ServiceCard.jsx
│   │
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Services.jsx
│   │   ├── ServiceDetail.jsx
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── Freelancer.jsx
│   │   ├── Orders.jsx
│   │   ├── ManageServices.jsx
│   │   ├── Payment.jsx
│   │   ├── DangYeuCau.jsx
│   │   ├── YeuCauCuaToi.jsx
│   │   └── YeuCauFreelancer.jsx
│   │
│   ├── data/
│   │   └── services.js
│   │
│   ├── styles/
│   │   ├── global.css
│   │   ├── header.css
│   │   ├── home.css
│   │   ├── services.css
│   │   ├── detail.css
│   │   ├── auth.css
│   │   ├── freelancer.css
│   │   ├── orders.css
│   │   ├── payment.css
│   │   ├── DangYeuCau.css
│   │   ├── YeuCauCuaToi.css
│   │   └── YeuCauFreelancer.css
│   │
│   └── App.jsx
│
├── package.json
└── README.md

