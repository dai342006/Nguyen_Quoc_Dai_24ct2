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
  // =========================
// API LẤY TẤT CẢ DỊCH VỤ
// =========================
app.get("/api/services", async (req, res) => {
  try {
    const result = await sql.query`
      SELECT
        d.MaDichVu,
        d.MaNguoiDung,
        d.TenDichVu,
        d.MoTa,
        d.DanhMuc,
        d.Gia,
        d.TrangThai,
        d.NgayTao,
        n.HoTen AS TenFreelancer
      FROM DichVu d
      INNER JOIN NguoiDung n
        ON d.MaNguoiDung = n.MaNguoiDung
      WHERE d.TrangThai = 'DangBan'
      ORDER BY d.MaDichVu DESC
    `;

    res.json(result.recordset);
  } catch (error) {
    console.error("Lỗi lấy tất cả dịch vụ:", error);

    res.status(500).json({
      message: "Không thể lấy danh sách dịch vụ!",
    });
  }
});
// =========================
// API TẠO ĐƠN HÀNG
// =========================
app.post("/api/orders", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const serviceId = Number(req.body.MaDichVu);

    if (!userId || !serviceId) {
      return res.status(400).json({
        message: "Thiếu thông tin khách hàng hoặc dịch vụ!",
      });
    }

    // =========================
    // Kiểm tra khách hàng
    // =========================
    const customerResult = await sql.query`
      SELECT MaNguoiDung, VaiTro
      FROM NguoiDung
      WHERE MaNguoiDung = ${userId}
    `;

    if (customerResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản!",
      });
    }

    if (customerResult.recordset[0].VaiTro !== "KhachHang") {
      return res.status(403).json({
        message: "Chỉ Khách hàng mới được đặt dịch vụ!",
      });
    }

    // =========================
    // Lấy thông tin dịch vụ
    // =========================
    const serviceResult = await sql.query`
      SELECT
        MaDichVu,
        MaNguoiDung,
        Gia,
        TrangThai
      FROM DichVu
      WHERE MaDichVu = ${serviceId}
    `;

    if (serviceResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy dịch vụ!",
      });
    }

    const service = serviceResult.recordset[0];

    // Chỉ được đặt dịch vụ đang bán
    if (service.TrangThai !== "DangBan") {
      return res.status(400).json({
        message: "Dịch vụ này hiện không còn nhận đơn!",
      });
    }

    // =========================
    // Không cho Freelancer tự đặt dịch vụ của mình
    // =========================
    if (service.MaNguoiDung === userId) {
      return res.status(400).json({
        message: "Bạn không thể tự đặt dịch vụ của mình!",
      });
    }

    // =========================
    // Kiểm tra đơn trùng
    // =========================
    const existingOrder = await sql.query`
      SELECT MaDonHang
      FROM DonHang
      WHERE
        MaKhachHang = ${userId}
        AND MaDichVu = ${serviceId}
        AND TrangThai IN ('ChoXacNhan', 'DangThucHien')
    `;

    if (existingOrder.recordset.length > 0) {
      return res.status(409).json({
        message: "Bạn đã có đơn hàng đang xử lý cho dịch vụ này!",
      });
    }

    // =========================
    // Tạo đơn hàng
    // =========================
    await sql.query`
      INSERT INTO DonHang (
        MaKhachHang,
        MaDichVu,
        MaFreelancer,
        Gia,
        TrangThai
      )
      VALUES (
        ${userId},
        ${service.MaDichVu},
        ${service.MaNguoiDung},
        ${service.Gia},
        'ChoXacNhan'
      )
    `;

    res.status(201).json({
      message: "Đặt dịch vụ thành công!",
    });

  } catch (error) {
    console.error("Lỗi tạo đơn hàng:", error);

    res.status(500).json({
      message: "Không thể tạo đơn hàng!",
    });
  }
});
// =========================
// API LẤY ĐƠN HÀNG
// =========================
app.get("/api/orders", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);

    if (!userId) {
      return res.status(400).json({
        message: "Thiếu mã người dùng!",
      });
    }

    // Lấy thông tin người dùng
    const userResult = await sql.query`
      SELECT MaNguoiDung, HoTen, VaiTro
      FROM NguoiDung
      WHERE MaNguoiDung = ${userId}
    `;

    if (userResult.recordset.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }

    const user = userResult.recordset[0];

    // =========================
    // KHÁCH HÀNG
    // =========================
    if (user.VaiTro === "KhachHang") {
      const result = await sql.query`
        SELECT
          d.MaDonHang,
          d.MaKhachHang,
          d.MaDichVu,
          d.MaFreelancer,
          d.Gia,
          d.TrangThai,
          d.NgayDat,

          dv.TenDichVu,

          f.HoTen AS TenFreelancer

        FROM DonHang d

        INNER JOIN DichVu dv
          ON d.MaDichVu = dv.MaDichVu

        INNER JOIN NguoiDung f
          ON d.MaFreelancer = f.MaNguoiDung

        WHERE d.MaKhachHang = ${userId}

        ORDER BY d.MaDonHang DESC
      `;

      return res.json({
        role: "KhachHang",
        orders: result.recordset,
      });
    }

    // =========================
    // FREELANCER
    // =========================
    if (user.VaiTro === "Freelancer") {
      const result = await sql.query`
        SELECT
          d.MaDonHang,
          d.MaKhachHang,
          d.MaDichVu,
          d.MaFreelancer,
          d.Gia,
          d.TrangThai,
          d.NgayDat,

          dv.TenDichVu,

          c.HoTen AS TenKhachHang

        FROM DonHang d

        INNER JOIN DichVu dv
          ON d.MaDichVu = dv.MaDichVu

        INNER JOIN NguoiDung c
          ON d.MaKhachHang = c.MaNguoiDung

        WHERE d.MaFreelancer = ${userId}

        ORDER BY d.MaDonHang DESC
      `;

      return res.json({
        role: "Freelancer",
        orders: result.recordset,
      });
    }

    return res.status(403).json({
      message: "Vai trò tài khoản không hợp lệ!",
    });

  } catch (error) {
    console.error("Lỗi lấy đơn hàng:", error);

    res.status(500).json({
      message: "Không thể lấy danh sách đơn hàng!",
    });
  }
});

// =========================
// API CẬP NHẬT TRẠNG THÁI ĐƠN
// =========================
app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const orderId = Number(req.params.id);
    const { TrangThai } = req.body;

    if (!userId || !orderId || !TrangThai) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ!",
      });
    }

    // Chỉ cho phép các trạng thái này
    const allowedStatuses = [
      "ChoXacNhan",
      "DangThucHien",
      "HoanThanh",
      "DaHuy",
    ];

    if (!allowedStatuses.includes(TrangThai)) {
      return res.status(400).json({
        message: "Trạng thái đơn hàng không hợp lệ!",
      });
    }

    // Kiểm tra Freelancer
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
        message: "Chỉ Freelancer mới được cập nhật trạng thái đơn!",
      });
    }

    // Chỉ được sửa đơn thuộc Freelancer đó
    const result = await sql.query`
      UPDATE DonHang
      SET TrangThai = ${TrangThai}
      WHERE
        MaDonHang = ${orderId}
        AND MaFreelancer = ${userId}
    `;

    if (result.rowsAffected[0] === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng hoặc bạn không có quyền!",
      });
    }

    res.json({
      message: "Cập nhật trạng thái thành công!",
    });

  } catch (error) {
    console.error("Lỗi cập nhật đơn hàng:", error);

    res.status(500).json({
      message: "Không thể cập nhật trạng thái đơn hàng!",
    });
  }
});
// Chạy server
startServer();