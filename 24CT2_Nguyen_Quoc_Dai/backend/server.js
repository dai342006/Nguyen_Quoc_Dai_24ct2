const express = require("express");
const cors = require("cors");

const { connectDB } = require("./db");

// Các module chức năng
const NguoiDung = require("./NguoiDung");
const DichVu = require("./DichVu");
const DonHang = require("./DonHang");
const DanhGia = require("./DanhGia");
const YeuCau = require("./YeuCau");

// ======================================================
// KHỞI TẠO APP
// ======================================================

const app = express();

const PORT = process.env.PORT || 5000;

// ======================================================
// MIDDLEWARE
// ======================================================

app.use(cors());
app.use(express.json());

// ======================================================
// API KIỂM TRA BACKEND
// ======================================================

app.get("/", (req, res) => {
  res.json({
    message: "Backend SkillHub đang chạy!",
  });
});

// ======================================================
// ĐĂNG KÝ CÁC MODULE
// ======================================================

NguoiDung(app);
DichVu(app);
DonHang(app);
DanhGia(app);
YeuCau(app);

// ======================================================
// KHỞI ĐỘNG SERVER
// ======================================================

async function startServer() {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(
        `Server đang chạy tại http://localhost:${PORT}`
      );
    });

  } catch (error) {
    console.log(
      "Không thể khởi động server vì chưa kết nối được Supabase."
    );
  }
}

startServer();