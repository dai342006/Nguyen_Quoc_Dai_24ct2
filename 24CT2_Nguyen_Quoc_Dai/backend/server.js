const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");

const { pool, connectDB } = require("./db");

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
// API ĐĂNG KÝ
// ======================================================

app.post("/api/register", async (req, res) => {
  try {
    const { HoTen, Email, MatKhau, VaiTro } = req.body;

    const name = String(HoTen || "").trim();
    const email = String(Email || "").trim().toLowerCase();
    const password = String(MatKhau || "");

    const role =
      VaiTro === "Freelancer"
        ? "Freelancer"
        : "KhachHang";

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

    const existing = await pool.query(
      `
      SELECT ma_nguoi_dung
      FROM nguoi_dung
      WHERE email = $1
      `,
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        message: "Email này đã được đăng ký!",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await pool.query(
      `
      INSERT INTO nguoi_dung
      (
        ho_ten,
        email,
        mat_khau,
        vai_tro
      )
      VALUES ($1, $2, $3, $4)
      `,
      [
        name,
        email,
        hashedPassword,
        role,
      ]
    );

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

// ======================================================
// API ĐĂNG NHẬP
// ======================================================

app.post("/api/login", async (req, res) => {
  try {
    const { Email, MatKhau } = req.body;

    const email = String(Email || "").trim().toLowerCase();
    const password = String(MatKhau || "");

    if (!email || !password) {
      return res.status(400).json({
        message: "Vui lòng nhập email và mật khẩu!",
      });
    }

    const result = await pool.query(
      `
      SELECT
        ma_nguoi_dung,
        ho_ten,
        email,
        mat_khau,
        vai_tro
      FROM nguoi_dung
      WHERE email = $1
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng!",
      });
    }

    const user = result.rows[0];

    const passwordCorrect = await bcrypt.compare(
      password,
      user.mat_khau
    );

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Email hoặc mật khẩu không đúng!",
      });
    }

    res.json({
      message: "Đăng nhập thành công!",

      user: {
        id: user.ma_nguoi_dung,
        name: user.ho_ten,
        email: user.email,
        role: user.vai_tro,
      },
    });

  } catch (error) {
    console.error("Lỗi đăng nhập:", error);

    res.status(500).json({
      message: "Đã xảy ra lỗi máy chủ khi đăng nhập!",
    });
  }
});

// ======================================================
// API LẤY TẤT CẢ DỊCH VỤ
// ======================================================

app.get("/api/services", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        d.ma_dich_vu AS "MaDichVu",
        d.ma_nguoi_dung AS "MaNguoiDung",
        d.ten_dich_vu AS "TenDichVu",
        d.mo_ta AS "MoTa",
        d.danh_muc AS "DanhMuc",
        d.gia AS "Gia",
        'DangBan' AS "TrangThai",
        n.ho_ten AS "TenFreelancer"
      FROM dich_vu d
      INNER JOIN nguoi_dung n
        ON d.ma_nguoi_dung = n.ma_nguoi_dung
      WHERE n.vai_tro = 'Freelancer'
      ORDER BY d.ma_dich_vu DESC
    `);

    res.json(result.rows);

  } catch (error) {
    console.error("Lỗi lấy tất cả dịch vụ:", error);

    res.status(500).json({
      message: "Không thể lấy danh sách dịch vụ!",
    });
  }
});

// ======================================================
// API LẤY DỊCH VỤ CỦA FREELANCER
// ======================================================

app.get("/api/services/my", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);

    if (!userId) {
      return res.status(400).json({
        message: "Thiếu thông tin người dùng!",
      });
    }

    const userResult = await pool.query(
      `
      SELECT
        ma_nguoi_dung,
        vai_tro
      FROM nguoi_dung
      WHERE ma_nguoi_dung = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }

    if (userResult.rows[0].vai_tro !== "Freelancer") {
      return res.status(403).json({
        message: "Bạn không có quyền sử dụng chức năng này!",
      });
    }

    const result = await pool.query(
      `
      SELECT
        ma_dich_vu AS "MaDichVu",
        ma_nguoi_dung AS "MaNguoiDung",
        ten_dich_vu AS "TenDichVu",
        mo_ta AS "MoTa",
        danh_muc AS "DanhMuc",
        gia AS "Gia",
        'DangBan' AS "TrangThai"
      FROM dich_vu
      WHERE ma_nguoi_dung = $1
      ORDER BY ma_dich_vu DESC
      `,
      [userId]
    );

    res.json(result.rows);

  } catch (error) {
    console.error("Lỗi lấy dịch vụ:", error);

    res.status(500).json({
      message: "Không thể lấy danh sách dịch vụ!",
    });
  }
});

// ======================================================
// API THÊM DỊCH VỤ
// ======================================================

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

    if (!name || !category || Gia === undefined || Gia === "") {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    if (Number.isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: "Giá dịch vụ không hợp lệ!",
      });
    }

    const userResult = await pool.query(
      `
      SELECT vai_tro
      FROM nguoi_dung
      WHERE ma_nguoi_dung = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }

    if (userResult.rows[0].vai_tro !== "Freelancer") {
      return res.status(403).json({
        message: "Chỉ Freelancer mới được tạo dịch vụ!",
      });
    }

    await pool.query(
      `
      INSERT INTO dich_vu
      (
        ma_nguoi_dung,
        ten_dich_vu,
        mo_ta,
        danh_muc,
        gia
      )
      VALUES ($1, $2, $3, $4, $5)
      `,
      [
        userId,
        name,
        description,
        category,
        price,
      ]
    );

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

// ======================================================
// API SỬA DỊCH VỤ
// ======================================================

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

    if (!name || !category) {
      return res.status(400).json({
        message: "Vui lòng nhập đầy đủ thông tin!",
      });
    }

    if (Number.isNaN(price) || price <= 0) {
      return res.status(400).json({
        message: "Giá dịch vụ không hợp lệ!",
      });
    }

    const result = await pool.query(
      `
      UPDATE dich_vu
      SET
        ten_dich_vu = $1,
        mo_ta = $2,
        danh_muc = $3,
        gia = $4
      WHERE
        ma_dich_vu = $5
        AND ma_nguoi_dung = $6
      `,
      [
        name,
        description,
        category,
        price,
        serviceId,
        userId,
      ]
    );

    if (result.rowCount === 0) {
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

// ======================================================
// API XÓA DỊCH VỤ
// ======================================================

app.delete("/api/services/:id", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const serviceId = Number(req.params.id);

    if (!userId || !serviceId) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ!",
      });
    }

    const result = await pool.query(
      `
      DELETE FROM dich_vu
      WHERE
        ma_dich_vu = $1
        AND ma_nguoi_dung = $2
      `,
      [
        serviceId,
        userId,
      ]
    );

    if (result.rowCount === 0) {
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

// ======================================================
// API TẠO ĐƠN HÀNG
// ======================================================

app.post("/api/orders", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const serviceId = Number(req.body.MaDichVu);

    if (!userId || !serviceId) {
      return res.status(400).json({
        message: "Thiếu thông tin khách hàng hoặc dịch vụ!",
      });
    }

    // Kiểm tra người dùng
    const customerResult = await pool.query(
      `
      SELECT
        ma_nguoi_dung,
        vai_tro
      FROM nguoi_dung
      WHERE ma_nguoi_dung = $1
      `,
      [userId]
    );

    if (customerResult.rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy tài khoản!",
      });
    }

    if (customerResult.rows[0].vai_tro !== "KhachHang") {
      return res.status(403).json({
        message: "Chỉ Khách hàng mới được đặt dịch vụ!",
      });
    }

    // Lấy dịch vụ
    const serviceResult = await pool.query(
      `
      SELECT
        ma_dich_vu,
        ma_nguoi_dung,
        gia
      FROM dich_vu
      WHERE ma_dich_vu = $1
      `,
      [serviceId]
    );

    if (serviceResult.rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy dịch vụ!",
      });
    }

    const service = serviceResult.rows[0];

    // Không cho tự mua dịch vụ
    if (service.ma_nguoi_dung === userId) {
      return res.status(400).json({
        message: "Bạn không thể tự đặt dịch vụ của mình!",
      });
    }

    // Kiểm tra đơn đang xử lý
    const existingOrder = await pool.query(
      `
      SELECT ma_don_hang
      FROM don_hang
      WHERE
        ma_nguoi_mua = $1
        AND ma_dich_vu = $2
        AND trang_thai IN (
          'ChoXuLy',
          'DangThucHien'
        )
      `,
      [
        userId,
        serviceId,
      ]
    );

    if (existingOrder.rows.length > 0) {
      return res.status(409).json({
        message: "Bạn đã có đơn hàng đang xử lý cho dịch vụ này!",
      });
    }

    // Tạo đơn
    await pool.query(
      `
      INSERT INTO don_hang
      (
        ma_nguoi_mua,
        ma_dich_vu,
        gia,
        trang_thai
      )
      VALUES ($1, $2, $3, 'ChoXuLy')
      `,
      [
        userId,
        service.ma_dich_vu,
        service.gia,
      ]
    );

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

// ======================================================
// API LẤY ĐƠN HÀNG
// ======================================================

app.get("/api/orders", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);

    if (!userId) {
      return res.status(400).json({
        message: "Thiếu mã người dùng!",
      });
    }

    const userResult = await pool.query(
      `
      SELECT
        ma_nguoi_dung,
        ho_ten,
        vai_tro
      FROM nguoi_dung
      WHERE ma_nguoi_dung = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }

    const user = userResult.rows[0];

    // ==================================================
    // KHÁCH HÀNG
    // ==================================================

    if (user.vai_tro === "KhachHang") {
      const result = await pool.query(
        `
        SELECT
          d.ma_don_hang AS "MaDonHang",
          d.ma_nguoi_mua AS "MaKhachHang",
          d.ma_dich_vu AS "MaDichVu",
          dv.ma_nguoi_dung AS "MaFreelancer",
          d.gia AS "Gia",
          d.trang_thai AS "TrangThai",
          d.ngay_dat AS "NgayDat",

          dv.ten_dich_vu AS "TenDichVu",

          f.ho_ten AS "TenFreelancer"

        FROM don_hang d

        INNER JOIN dich_vu dv
          ON d.ma_dich_vu = dv.ma_dich_vu

        INNER JOIN nguoi_dung f
          ON dv.ma_nguoi_dung = f.ma_nguoi_dung

        WHERE d.ma_nguoi_mua = $1

        ORDER BY d.ma_don_hang DESC
        `,
        [userId]
      );

      return res.json({
        role: "KhachHang",
        orders: result.rows,
      });
    }

    // ==================================================
    // FREELANCER
    // ==================================================

    if (user.vai_tro === "Freelancer") {
      const result = await pool.query(
        `
        SELECT
          d.ma_don_hang AS "MaDonHang",
          d.ma_nguoi_mua AS "MaKhachHang",
          d.ma_dich_vu AS "MaDichVu",
          dv.ma_nguoi_dung AS "MaFreelancer",
          d.gia AS "Gia",
          d.trang_thai AS "TrangThai",
          d.ngay_dat AS "NgayDat",

          dv.ten_dich_vu AS "TenDichVu",

          c.ho_ten AS "TenKhachHang"

        FROM don_hang d

        INNER JOIN dich_vu dv
          ON d.ma_dich_vu = dv.ma_dich_vu

        INNER JOIN nguoi_dung c
          ON d.ma_nguoi_mua = c.ma_nguoi_dung

        WHERE dv.ma_nguoi_dung = $1

        ORDER BY d.ma_don_hang DESC
        `,
        [userId]
      );

      return res.json({
        role: "Freelancer",
        orders: result.rows,
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

// ======================================================
// API CẬP NHẬT TRẠNG THÁI ĐƠN
// ======================================================

app.put("/api/orders/:id/status", async (req, res) => {
  try {
    const userId = Number(req.headers["x-user-id"]);
    const orderId = Number(req.params.id);

    let { TrangThai } = req.body;

    if (!userId || !orderId || !TrangThai) {
      return res.status(400).json({
        message: "Dữ liệu không hợp lệ!",
      });
    }

    // Tương thích với trạng thái cũ
    if (TrangThai === "ChoXacNhan") {
      TrangThai = "ChoXuLy";
    }

    const allowedStatuses = [
      "ChoXuLy",
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
    const userResult = await pool.query(
      `
      SELECT vai_tro
      FROM nguoi_dung
      WHERE ma_nguoi_dung = $1
      `,
      [userId]
    );

    if (userResult.rows.length === 0) {
      return res.status(404).json({
        message: "Không tìm thấy người dùng!",
      });
    }

    if (userResult.rows[0].vai_tro !== "Freelancer") {
      return res.status(403).json({
        message: "Chỉ Freelancer mới được cập nhật trạng thái đơn!",
      });
    }

    // Chỉ sửa đơn của dịch vụ mình
    const result = await pool.query(
      `
      UPDATE don_hang d
      SET trang_thai = $1

      FROM dich_vu dv

      WHERE
        d.ma_dich_vu = dv.ma_dich_vu
        AND d.ma_don_hang = $2
        AND dv.ma_nguoi_dung = $3
      `,
      [
        TrangThai,
        orderId,
        userId,
      ]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({
        message: "Không tìm thấy đơn hàng hoặc bạn không có quyền!",
      });
    }

    res.json({
      message: "Cập nhật trạng thái thành công!",
    });

  } catch (error) {
    console.error("Lỗi cập nhật trạng thái:", error);

    res.status(500).json({
      message: "Không thể cập nhật trạng thái đơn hàng!",
    });
  }
});

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