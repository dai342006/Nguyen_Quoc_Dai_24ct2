const { pool } = require("./db");

// ======================================================
// YÊU CẦU
// ======================================================

module.exports = function YeuCau(app) {

  // ====================================================
  // API ĐĂNG YÊU CẦU - KHÁCH HÀNG
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
      // Chỉ Khách hàng được đăng
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
      // Thêm yêu cầu
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
  // API LẤY YÊU CẦU CỦA TÔI - KHÁCH HÀNG
  // ====================================================

  app.get(
    "/api/requests/my",
    async (req, res) => {

      try {

        const userId = Number(
          req.headers["x-user-id"]
        );

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
        // Lấy yêu cầu
        // ==========================================

        const result =
          await pool.query(
            `
            SELECT
              y.ma_yeu_cau AS "MaYeuCau",
              y.ma_nguoi_dang AS "MaNguoiDang",
              y.ma_freelancer AS "MaFreelancer",
              y.tieu_de AS "TieuDe",
              y.mo_ta AS "MoTa",
              y.danh_muc AS "DanhMuc",
              y.ngan_sach AS "NganSach",
              y.trang_thai AS "TrangThai",
              y.ngay_dang AS "NgayDang",

              f.ho_ten AS "TenFreelancer"

            FROM yeu_cau y

            LEFT JOIN nguoi_dung f
              ON y.ma_freelancer =
                 f.ma_nguoi_dung

            WHERE y.ma_nguoi_dang = $1

            ORDER BY
              y.ma_yeu_cau DESC
            `,
            [userId]
          );

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


  // ====================================================
  // API LẤY TẤT CẢ YÊU CẦU - FREELANCER
  // ====================================================

  app.get(
    "/api/requests",
    async (req, res) => {

      try {

        const userId = Number(
          req.headers["x-user-id"]
        );

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

        // Chỉ Freelancer
        if (
          userResult.rows[0].vai_tro !==
          "Freelancer"
        ) {
          return res.status(403).json({
            message:
              "Chỉ Freelancer mới được xem yêu cầu!",
          });
        }

        // ==========================================
        // Lấy các yêu cầu đang tìm Freelancer
        // ==========================================

        const result =
          await pool.query(
            `
            SELECT
              y.ma_yeu_cau AS "MaYeuCau",
              y.ma_nguoi_dang AS "MaNguoiDang",
              y.tieu_de AS "TieuDe",
              y.mo_ta AS "MoTa",
              y.danh_muc AS "DanhMuc",
              y.ngan_sach AS "NganSach",
              y.trang_thai AS "TrangThai",
              y.ngay_dang AS "NgayDang",

              n.ho_ten AS "TenKhachHang"

            FROM yeu_cau y

            INNER JOIN nguoi_dung n
              ON y.ma_nguoi_dang =
                 n.ma_nguoi_dung

            WHERE
              y.trang_thai =
              'DangTimFreelancer'

            ORDER BY
              y.ma_yeu_cau DESC
            `
          );

        res.json({
          role: "Freelancer",
          requests:
            result.rows,
        });

      } catch (error) {

        console.error(
          "Lỗi lấy danh sách yêu cầu Freelancer:",
          error
        );

        res.status(500).json({
          message:
            "Không thể lấy danh sách yêu cầu!",
        });
      }
    }
  );


  // ====================================================
  // API FREELANCER NHẬN YÊU CẦU
  // ====================================================

  app.put(
    "/api/requests/:id/accept",
    async (req, res) => {

      try {

        const userId = Number(
          req.headers["x-user-id"]
        );

        const requestId = Number(
          req.params.id
        );

        if (
          !userId ||
          !requestId
        ) {
          return res.status(400).json({
            message:
              "Dữ liệu không hợp lệ!",
          });
        }

        // ==========================================
        // Kiểm tra tài khoản Freelancer
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

        if (
          userResult.rows[0].vai_tro !==
          "Freelancer"
        ) {
          return res.status(403).json({
            message:
              "Chỉ Freelancer mới được nhận yêu cầu!",
          });
        }

        // ==========================================
        // Nhận yêu cầu
        // Chỉ nhận nếu còn đang tìm Freelancer
        // ==========================================

        const result =
          await pool.query(
            `
            UPDATE yeu_cau

            SET
              ma_freelancer = $1,
              trang_thai = 'DaNhan'

            WHERE
              ma_yeu_cau = $2
              AND trang_thai =
                  'DangTimFreelancer'

            RETURNING
              ma_yeu_cau,
              ma_freelancer,
              trang_thai
            `,
            [
              userId,
              requestId,
            ]
          );

        // ==========================================
        // Không cập nhật được
        // ==========================================

        if (
          result.rowCount === 0
        ) {
          return res.status(409).json({
            message:
              "Yêu cầu này đã được Freelancer khác nhận hoặc không còn tồn tại!",
          });
        }

        // ==========================================
        // Thành công
        // ==========================================

        res.json({
          message:
            "Nhận yêu cầu thành công!",
          request:
            result.rows[0],
        });

      } catch (error) {

        console.error(
          "Lỗi nhận yêu cầu:",
          error
        );

        res.status(500).json({
          message:
            "Không thể nhận yêu cầu!",
        });
      }
    }
  );

};