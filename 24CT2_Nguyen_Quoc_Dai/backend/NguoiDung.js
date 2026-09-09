const bcrypt = require("bcryptjs");

const { pool } = require("./db");

// ======================================================
// NGƯỜI DÙNG
// ======================================================

module.exports = function NguoiDung(app) {

  // ====================================================
  // API ĐĂNG KÝ
  // ====================================================

  app.post("/api/register", async (req, res) => {
    try {
      const {
        HoTen,
        Email,
        MatKhau,
        VaiTro,
      } = req.body;

      const name = String(
        HoTen || ""
      ).trim();

      const email = String(
        Email || ""
      ).trim().toLowerCase();

      const password = String(
        MatKhau || ""
      );

      const role =
        VaiTro === "Freelancer"
          ? "Freelancer"
          : "KhachHang";

      // Kiểm tra dữ liệu
      if (
        !name ||
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Vui lòng nhập đầy đủ thông tin!",
        });
      }

      if (name.length < 2) {
        return res.status(400).json({
          message:
            "Họ và tên phải có ít nhất 2 ký tự!",
        });
      }

      if (
        !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
          email
        )
      ) {
        return res.status(400).json({
          message:
            "Email không đúng định dạng!",
        });
      }

      if (password.length < 6) {
        return res.status(400).json({
          message:
            "Mật khẩu phải có ít nhất 6 ký tự!",
        });
      }

      // Kiểm tra email đã tồn tại
      const existing =
        await pool.query(
          `
          SELECT ma_nguoi_dung
          FROM nguoi_dung
          WHERE email = $1
          `,
          [email]
        );

      if (
        existing.rows.length > 0
      ) {
        return res.status(409).json({
          message:
            "Email này đã được đăng ký!",
        });
      }

      // Mã hóa mật khẩu
      const hashedPassword =
        await bcrypt.hash(
          password,
          10
        );

      // Thêm người dùng
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
        message:
          "Đăng ký thành công!",
        role: role,
      });

    } catch (error) {

      console.error(
        "Lỗi đăng ký:",
        error
      );

      res.status(500).json({
        message:
          "Đã xảy ra lỗi máy chủ khi đăng ký!",
      });
    }
  });


  // ====================================================
  // API ĐĂNG NHẬP
  // ====================================================

  app.post("/api/login", async (req, res) => {
    try {

      const {
        Email,
        MatKhau,
      } = req.body;

      const email = String(
        Email || ""
      ).trim().toLowerCase();

      const password = String(
        MatKhau || ""
      );

      if (
        !email ||
        !password
      ) {
        return res.status(400).json({
          message:
            "Vui lòng nhập email và mật khẩu!",
        });
      }

      // Lấy người dùng
      const result =
        await pool.query(
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

      if (
        result.rows.length === 0
      ) {
        return res.status(401).json({
          message:
            "Email hoặc mật khẩu không đúng!",
        });
      }

      const user =
        result.rows[0];

      // Kiểm tra mật khẩu
      const passwordCorrect =
        await bcrypt.compare(
          password,
          user.mat_khau
        );

      if (!passwordCorrect) {
        return res.status(401).json({
          message:
            "Email hoặc mật khẩu không đúng!",
        });
      }

      res.json({
        message:
          "Đăng nhập thành công!",

        user: {
          id:
            user.ma_nguoi_dung,

          name:
            user.ho_ten,

          email:
            user.email,

          role:
            user.vai_tro,
        },
      });

    } catch (error) {

      console.error(
        "Lỗi đăng nhập:",
        error
      );

      res.status(500).json({
        message:
          "Đã xảy ra lỗi máy chủ khi đăng nhập!",
      });
    }
  });

};