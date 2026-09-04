const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { sql, connectDB } = require("./db");

const app = express();

app.use(cors());
app.use(express.json());

// Kiểm tra server
app.get("/", (req, res) => {
  res.json({
    message: "Backend Digital Skill Marketplace đang chạy!",
  });
});

// API đăng ký tài khoản
app.post("/api/register", async (req, res) => {
  try {
    const { HoTen, Email, MatKhau } = req.body;

    if (!HoTen || !Email || !MatKhau) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    // Kiểm tra email đã tồn tại chưa
    const result = await sql.query`
      SELECT * FROM NguoiDung
      WHERE Email = ${Email}
    `;

    if (result.recordset.length > 0) {
      return res.status(400).json({
        message: "Email đã tồn tại!",
      });
    }

    // Mã hóa mật khẩu
    const matKhauMaHoa = await bcrypt.hash(MatKhau, 10);

    // Lưu tài khoản vào SQL Server
    await sql.query`
      INSERT INTO NguoiDung
      (HoTen, Email, MatKhau, VaiTro)
      VALUES
      (${HoTen}, ${Email}, ${matKhauMaHoa}, 'KhachHang')
    `;

    res.status(201).json({
      message: "Đăng ký thành công!",
    });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    res.status(500).json({
      message: "Lỗi server!",
    });
  }
});

// Kết nối SQL rồi mới chạy server
connectDB().then(() => {
  app.listen(5000, () => {
    console.log("Server đang chạy tại http://localhost:5000");
  });
});