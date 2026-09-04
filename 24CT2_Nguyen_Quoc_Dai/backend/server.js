const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const { sql, connectDB } = require("./db");

const app = express();

// =========================
// Cấu hình Middleware
// =========================
app.use(cors());
app.use(express.json());

// =========================
// Trang kiểm tra Backend
// =========================
app.get("/", (req, res) => {
  res.json({
    message: "Backend Digital Skill Marketplace đang chạy!",
  });
});

// =========================
// API ĐĂNG KÝ
// =========================
app.post("/api/register", async (req, res) => {
  try {
    // Nhận dữ liệu từ Frontend
    const { HoTen, Email, MatKhau, VaiTro } = req.body;

    // Làm sạch dữ liệu
    const name = String(HoTen || "").trim();
    const email = String(Email || "").trim().toLowerCase();
    const password = String(MatKhau || "");

    // Chỉ cho phép 2 vai trò
    const role =
      VaiTro === "Freelancer"
        ? "Freelancer"
        : "KhachHang";

    // =========================
    // Kiểm tra dữ liệu
    // =========================

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    if (name.length < 2) {
      return res.status(400).json({
        message: "Họ và tên phải có ít nhất 2 ký tự!",
      });
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({
        message: "Email không đúng định dạng!",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Mật khẩu phải có ít nhất 6 ký tự!",
      });
    }

    // =========================
    // Kiểm tra email đã tồn tại
    // =========================

    const existing = await sql.query`
      SELECT MaNguoiDung
      FROM NguoiDung
      WHERE Email = ${email}
    `;

    if (existing.recordset.length > 0) {
      return res.status(409).json({
        message: "Email này đã được đăng ký!",
      });
    }

    // =========================
    // Mã hóa mật khẩu
    // =========================

    const hashedPassword = await bcrypt.hash(password, 10);

    // =========================
    // Thêm người dùng vào SQL
    // =========================

    await sql.query`
      INSERT INTO NguoiDung
      (
        HoTen,
        Email,
        MatKhau,
        VaiTro
      )
      VALUES
      (
        ${name},
        ${email},
        ${hashedPassword},
        ${role}
      )
    `;

    // =========================
    // Trả kết quả
    // =========================

    res.status(201).json({
      message: "Đăng ký thành công!",
      role: role,
    });

  } catch (error) {
    console.error("Lỗi đăng ký:", error);

    res.status(500).json({
      message: "Đã xảy ra lỗi máy chủ khi đăng ký!",
    });
  }
});

// =========================
// API ĐĂNG NHẬP
// =========================
app.post("/api/login", async (req, res) => {
  try {
    // Nhận dữ liệu từ Frontend
    const { Email, MatKhau } = req.body;

    const email = String(Email || "").trim().toLowerCase();
    const password = String(MatKhau || "");

    // =========================
    // Kiểm tra dữ liệu
    // =========================

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu!",
      });
    }

    // =========================
    // Tìm tài khoản
    // =========================

    const result = await sql.query`
      SELECT
        MaNguoiDung,
        HoTen,
        Email,
        MatKhau,
        VaiTro
      FROM NguoiDung
      WHERE Email = ${email}
    `;

    // Không tìm thấy tài khoản
    if (result.recordset.length === 0) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng!",
      });
    }

    // Lấy thông tin người dùng
    const user = result.recordset[0];

    // =========================
    // Kiểm tra mật khẩu
    // =========================

    const passwordCorrect = await bcrypt.compare(
      password,
      user.MatKhau
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng!",
      });
    }

    // =========================
    // Đăng nhập thành công
    // =========================

    res.json({
      message: "Đăng nhập thành công!",

      user: {
        id: user.MaNguoiDung,
        name: user.HoTen,
        email: user.Email,
        role: user.VaiTro,
      },
    });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);

    res.status(500).json({
      message: "Đã xảy ra lỗi máy chủ khi đăng nhập!",
    });
  }
});

// =========================
// Khởi động Server
// =========================
async function startServer() {
  try {
    // Kết nối SQL Server
    await connectDB();

    // Chạy server
    app.listen(5000, () => {
      console.log(
        "Server đang chạy tại http://localhost:5000"
      );
    });

  } catch (error) {
    console.log(
      "Không thể khởi động server vì SQL Server chưa kết nối."
    );
  }
}
// =========================
// API LẤY DỊCH VỤ CỦA FREELANCER
// =========================
app.get("/api/services/my", async (req, res) => {
    try {
      const userId = Number(req.headers["x-user-id"]);
  
      if (!userId) {
        return res.status(400).json({
          message: "Thiếu thông tin người dùng!",
        });
      }
  
      const userResult = await sql.query`
        SELECT MaNguoiDung, VaiTro
        FROM NguoiDung
        WHERE MaNguoiDung = ${userId}
      `;
  
      if (userResult.recordset.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng!",
        });
      }
  
      if (userResult.recordset[0].VaiTro !== "Freelancer") {
        return res.status(403).json({
          message: "Bạn không có quyền sử dụng chức năng này!",
        });
      }
  
      const result = await sql.query`
        SELECT
          MaDichVu,
          MaNguoiDung,
          TenDichVu,
          MoTa,
          DanhMuc,
          Gia,
          TrangThai,
          NgayTao
        FROM DichVu
        WHERE MaNguoiDung = ${userId}
        ORDER BY MaDichVu DESC
      `;
  
      res.json(result.recordset);
    } catch (error) {
      console.error("Lỗi lấy dịch vụ:", error);
  
      res.status(500).json({
        message: "Không thể lấy danh sách dịch vụ!",
      });
    }
  });
  
  // =========================
  // API THÊM DỊCH VỤ
  // =========================
  app.post("/api/services", async (req, res) => {
    try {
      const userId = Number(req.headers["x-user-id"]);
  
      const {
        TenDichVu,
        MoTa,
        DanhMuc,
        Gia,
      } = req.body;
  
      const name = String(TenDichVu || "").trim();
      const description = String(MoTa || "").trim();
      const category = String(DanhMuc || "").trim();
      const price = Number(Gia);
  
      if (!userId) {
        return res.status(400).json({
          message: "Thiếu thông tin người dùng!",
        });
      }
  
      if (!name || !category || !Gia) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ thông tin!",
        });
      }
  
      if (Number.isNaN(price) || price <= 0) {
        return res.status(400).json({
          message: "Giá dịch vụ không hợp lệ!",
        });
      }
  
      const userResult = await sql.query`
        SELECT VaiTro
        FROM NguoiDung
        WHERE MaNguoiDung = ${userId}
      `;
  
      if (userResult.recordset.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy người dùng!",
        });
      }
  
      if (userResult.recordset[0].VaiTro !== "Freelancer") {
        return res.status(403).json({
          message: "Chỉ Freelancer mới được tạo dịch vụ!",
        });
      }
  
      await sql.query`
        INSERT INTO DichVu (
          MaNguoiDung,
          TenDichVu,
          MoTa,
          DanhMuc,
          Gia,
          TrangThai
        )
        VALUES (
          ${userId},
          ${name},
          ${description},
          ${category},
          ${price},
          'DangBan'
        )
      `;
  
      res.status(201).json({
        message: "Thêm dịch vụ thành công!",
      });
    } catch (error) {
      console.error("Lỗi thêm dịch vụ:", error);
  
      res.status(500).json({
        message: "Không thể thêm dịch vụ!",
      });
    }
  });
  
  // =========================
  // API SỬA DỊCH VỤ
  // =========================
  app.put("/api/services/:id", async (req, res) => {
    try {
      const userId = Number(req.headers["x-user-id"]);
      const serviceId = Number(req.params.id);
  
      const {
        TenDichVu,
        MoTa,
        DanhMuc,
        Gia,
      } = req.body;
  
      const name = String(TenDichVu || "").trim();
      const description = String(MoTa || "").trim();
      const category = String(DanhMuc || "").trim();
      const price = Number(Gia);
  
      if (!userId || !serviceId) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ!",
        });
      }
  
      if (!name || !category || !Gia) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ thông tin!",
        });
      }
  
      if (Number.isNaN(price) || price <= 0) {
        return res.status(400).json({
          message: "Giá dịch vụ không hợp lệ!",
        });
      }
  
      const result = await sql.query`
        UPDATE DichVu
        SET
          TenDichVu = ${name},
          MoTa = ${description},
          DanhMuc = ${category},
          Gia = ${price}
        WHERE
          MaDichVu = ${serviceId}
          AND MaNguoiDung = ${userId}
      `;
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Không tìm thấy dịch vụ hoặc bạn không có quyền sửa!",
        });
      }
  
      res.json({
        message: "Cập nhật dịch vụ thành công!",
      });
    } catch (error) {
      console.error("Lỗi sửa dịch vụ:", error);
  
      res.status(500).json({
        message: "Không thể cập nhật dịch vụ!",
      });
    }
  });
  
  // =========================
  // API XÓA DỊCH VỤ
  // =========================
  app.delete("/api/services/:id", async (req, res) => {
    try {
      const userId = Number(req.headers["x-user-id"]);
      const serviceId = Number(req.params.id);
  
      if (!userId || !serviceId) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ!",
        });
      }
  
      const result = await sql.query`
        DELETE FROM DichVu
        WHERE
          MaDichVu = ${serviceId}
          AND MaNguoiDung = ${userId}
      `;
  
      if (result.rowsAffected[0] === 0) {
        return res.status(404).json({
          message: "Không tìm thấy dịch vụ hoặc bạn không có quyền xóa!",
        });
      }
  
      res.json({
        message: "Xóa dịch vụ thành công!",
      });
    } catch (error) {
      console.error("Lỗi xóa dịch vụ:", error);
  
      res.status(500).json({
        message: "Không thể xóa dịch vụ!",
      });
    }
  });
// Chạy server
startServer();