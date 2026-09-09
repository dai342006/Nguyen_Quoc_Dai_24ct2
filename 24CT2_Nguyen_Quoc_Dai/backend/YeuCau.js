const { pool } = require("./db");

// ======================================================
// YÊU CẦU CỦA KHÁCH HÀNG
// ======================================================

module.exports = function YeuCau(app) {

  // ====================================================
  // API ĐĂNG YÊU CẦU
  // ====================================================

  app.post("/api/requests", async (req, res) => {
    try {
      const userId = Number(
        req.headers["x-user-id"]
      );

      const {
        TieuDe,
        MoTa,
        DanhMuc,
        NganSach,
      } = req.body;

      const title = String(
        TieuDe || ""
      ).trim();

      const description = String(
        MoTa || ""
      ).trim();

      const category = String(
        DanhMuc || ""
      ).trim();

      const budget = Number(
        NganSach
      );

      // ==========================================
      // Kiểm tra người dùng
      // ==========================================

      if (!userId) {
        return res.status(400).json({
          message:
            "Thiếu thông tin người dùng!",
        });
      }

      // ==========================================
      // Kiểm tra dữ liệu
      // ==========================================

      if (
        !title ||
        !description ||
        !category ||
        NganSach === undefined ||
        NganSach === ""
      ) {
        return res.status(400).json({
          message:
            "Vui lòng nhập đầy đủ thông tin!",
        });
      }

      if (
        Number.isNaN(budget) ||
        budget <= 0
      ) {
        return res.status(400).json({
          message:
            "Ngân sách phải lớn hơn 0!",
        });
      }

      // ==========================================
      // Kiểm tra tài khoản
      // ==========================================

      const userResult =
        await pool.query(
          `
          SELECT
            ma_nguoi_dung,
            vai_tro
          FROM nguoi_dung
          WHERE ma_nguoi_dung = $1
          `,
          [userId]
        );

      if (
        userResult.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Không tìm thấy người dùng!",
        });
      }

      // ==========================================
      // Chỉ Khách hàng được đăng yêu cầu
      // ==========================================

      if (
        userResult.rows[0].vai_tro !==
        "KhachHang"
      ) {
        return res.status(403).json({
          message:
            "Chỉ Khách hàng mới được đăng yêu cầu!",
        });
      }

      // ==========================================
      // Thêm yêu cầu vào database
      // ==========================================

      const result =
        await pool.query(
          `
          INSERT INTO yeu_cau
          (
            ma_nguoi_dang,
            tieu_de,
            mo_ta,
            danh_muc,
            ngan_sach,
            trang_thai
          )
          VALUES
          (
            $1,
            $2,
            $3,
            $4,
            $5,
            'DangTimFreelancer'
          )
          RETURNING
            ma_yeu_cau,
            ma_nguoi_dang,
            tieu_de,
            mo_ta,
            danh_muc,
            ngan_sach,
            trang_thai,
            ngay_dang
          `,
          [
            userId,
            title,
            description,
            category,
            budget,
          ]
        );

      // ==========================================
      // Trả kết quả
      // ==========================================

      res.status(201).json({
        message:
          "Đăng yêu cầu thành công!",

        request:
          result.rows[0],
      });

    } catch (error) {

      console.error(
        "Lỗi đăng yêu cầu:",
        error
      );

      res.status(500).json({
        message:
          "Không thể đăng yêu cầu!",
      });
    }
  });


  // ====================================================
  // API LẤY YÊU CẦU CỦA TÔI
  // ====================================================

  app.get(
    "/api/requests/my",
    async (req, res) => {

      try {
        const userId = Number(
          req.headers["x-user-id"]
        );

        // ==========================================
        // Kiểm tra user
        // ==========================================

        if (!userId) {
          return res.status(400).json({
            message:
              "Thiếu mã người dùng!",
          });
        }

        // ==========================================
        // Kiểm tra tài khoản
        // ==========================================

        const userResult =
          await pool.query(
            `
            SELECT
              ma_nguoi_dung,
              vai_tro
            FROM nguoi_dung
            WHERE ma_nguoi_dung = $1
            `,
            [userId]
          );

        if (
          userResult.rows.length === 0
        ) {
          return res.status(404).json({
            message:
              "Không tìm thấy người dùng!",
          });
        }

        // ==========================================
        // Chỉ Khách hàng được xem
        // ==========================================

        if (
          userResult.rows[0].vai_tro !==
          "KhachHang"
        ) {
          return res.status(403).json({
            message:
              "Chỉ Khách hàng mới được xem yêu cầu của mình!",
          });
        }

        // ==========================================
        // Lấy danh sách yêu cầu
        // ==========================================

        const result =
          await pool.query(
            `
            SELECT
              ma_yeu_cau AS "MaYeuCau",
              ma_nguoi_dang AS "MaNguoiDang",
              tieu_de AS "TieuDe",
              mo_ta AS "MoTa",
              danh_muc AS "DanhMuc",
              ngan_sach AS "NganSach",
              trang_thai AS "TrangThai",
              ngay_dang AS "NgayDang"

            FROM yeu_cau

            WHERE ma_nguoi_dang = $1

            ORDER BY
              ma_yeu_cau DESC
            `,
            [userId]
          );

        // ==========================================
        // Trả dữ liệu
        // ==========================================

        res.json({
          role: "KhachHang",
          requests:
            result.rows,
        });

      } catch (error) {

        console.error(
          "Lỗi lấy yêu cầu:",
          error
        );

        res.status(500).json({
          message:
            "Không thể lấy danh sách yêu cầu!",
        });
      }
    }
  );

};