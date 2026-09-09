const { pool } = require("./db");

function YeuCau(app) {

  // =====================================================
  // KHÁCH HÀNG - ĐĂNG YÊU CẦU
  // =====================================================
  app.post("/api/requests", async (req, res) => {
    try {
      const userId = Number(req.headers["x-user-id"]);

      const {
        TieuDe,
        MoTa,
        DanhMuc,
        NganSach,
      } = req.body;

      const tieuDe = String(TieuDe || "").trim();
      const moTa = String(MoTa || "").trim();
      const danhMuc = String(DanhMuc || "").trim();
      const nganSach = Number(NganSach);

      if (!userId) {
        return res.status(400).json({
          message: "Thiếu thông tin người dùng!",
        });
      }

      if (!tieuDe || !moTa || !danhMuc) {
        return res.status(400).json({
          message: "Vui lòng nhập đầy đủ thông tin!",
        });
      }

      if (Number.isNaN(nganSach) || nganSach < 0) {
        return res.status(400).json({
          message: "Ngân sách không hợp lệ!",
        });
      }

      // Kiểm tra người dùng
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

      if (userResult.rows[0].vai_tro !== "KhachHang") {
        return res.status(403).json({
          message: "Chỉ Khách hàng mới được đăng yêu cầu!",
        });
      }

      // Tạo yêu cầu
      const result = await pool.query(
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
          tieuDe,
          moTa,
          danhMuc,
          nganSach,
        ]
      );

      res.status(201).json({
        message: "Đăng yêu cầu thành công!",
        request: result.rows[0],
      });

    } catch (error) {
      console.error("Lỗi đăng yêu cầu:", error);

      res.status(500).json({
        message: "Không thể đăng yêu cầu!",
      });
    }
  });


  // =====================================================
  // KHÁCH HÀNG - XEM YÊU CẦU CỦA TÔI
  // =====================================================
  app.get("/api/requests/my", async (req, res) => {
    try {
      const userId = Number(req.headers["x-user-id"]);

      if (!userId) {
        return res.status(400).json({
          message: "Thiếu thông tin người dùng!",
        });
      }

      // Kiểm tra người dùng
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

      if (userResult.rows[0].vai_tro !== "KhachHang") {
        return res.status(403).json({
          message: "Chỉ Khách hàng mới có thể xem yêu cầu của mình!",
        });
      }

      // Lấy yêu cầu của khách hàng
      const result = await pool.query(
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

          y.ma_freelancer AS "MaFreelancer",
          f.ho_ten AS "TenFreelancer"

        FROM yeu_cau y

        LEFT JOIN nguoi_dung f
          ON y.ma_freelancer = f.ma_nguoi_dung

        WHERE y.ma_nguoi_dang = $1

        ORDER BY y.ma_yeu_cau DESC
        `,
        [userId]
      );

      // Trả về object có requests
      // để frontend YeuCauCuaToi sử dụng
      res.json({
        requests: result.rows,
      });

    } catch (error) {
      console.error("Lỗi lấy yêu cầu của tôi:", error);

      res.status(500).json({
        message: "Không thể lấy danh sách yêu cầu!",
      });
    }
  });


  // =====================================================
  // FREELANCER - XEM CÁC YÊU CẦU ĐANG CHỜ
  // =====================================================
  app.get("/api/requests", async (req, res) => {
    try {
      const userId = Number(req.headers["x-user-id"]);

      if (!userId) {
        return res.status(400).json({
          message: "Thiếu thông tin người dùng!",
        });
      }

      // Kiểm tra người dùng
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
          message: "Chỉ Freelancer mới được xem danh sách yêu cầu!",
        });
      }

      const result = await pool.query(
        `
        SELECT
          y.ma_yeu_cau AS "MaYeuCau",
          y.ma_nguoi_dang AS "MaKhachHang",

          c.ho_ten AS "TenKhachHang",

          y.tieu_de AS "TieuDe",
          y.mo_ta AS "MoTa",
          y.danh_muc AS "DanhMuc",
          y.ngan_sach AS "NganSach",
          y.trang_thai AS "TrangThai",
          y.ngay_dang AS "NgayDang",

          y.ma_freelancer AS "MaFreelancer"

        FROM yeu_cau y

        INNER JOIN nguoi_dung c
          ON y.ma_nguoi_dang = c.ma_nguoi_dung

        WHERE y.trang_thai = 'DangTimFreelancer'

        ORDER BY y.ma_yeu_cau DESC
        `
      );

      res.json(result.rows);

    } catch (error) {
      console.error("Lỗi lấy yêu cầu Freelancer:", error);

      res.status(500).json({
        message: "Không thể lấy danh sách yêu cầu!",
      });
    }
  });


  // =====================================================
  // FREELANCER - NHẬN YÊU CẦU
  // =====================================================
  app.put("/api/requests/:id/accept", async (req, res) => {

    const client = await pool.connect();

    try {
      const userId = Number(req.headers["x-user-id"]);
      const requestId = Number(req.params.id);

      if (!userId || !requestId) {
        return res.status(400).json({
          message: "Dữ liệu không hợp lệ!",
        });
      }


      // =================================================
      // 1. KIỂM TRA FREELANCER
      // =================================================

      const userResult = await client.query(
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
          message: "Chỉ Freelancer mới được nhận yêu cầu!",
        });
      }


      // =================================================
      // 2. BẮT ĐẦU TRANSACTION
      // =================================================

      await client.query("BEGIN");


      // =================================================
      // 3. LẤY YÊU CẦU VÀ KHÓA DÒNG
      // =================================================

      const requestResult = await client.query(
        `
        SELECT
          ma_yeu_cau,
          ma_nguoi_dang,
          tieu_de,
          mo_ta,
          danh_muc,
          ngan_sach,
          trang_thai,
          ma_freelancer
        FROM yeu_cau
        WHERE ma_yeu_cau = $1
        FOR UPDATE
        `,
        [requestId]
      );

      if (requestResult.rows.length === 0) {

        await client.query("ROLLBACK");

        return res.status(404).json({
          message: "Không tìm thấy yêu cầu!",
        });
      }

      const request = requestResult.rows[0];


      // =================================================
      // 4. KIỂM TRA YÊU CẦU ĐÃ ĐƯỢC NHẬN CHƯA
      // =================================================

      if (request.trang_thai !== "DangTimFreelancer") {

        await client.query("ROLLBACK");

        return res.status(409).json({
          message: "Yêu cầu này đã được Freelancer khác nhận!",
        });
      }


      // =================================================
      // 5. TẠO ĐƠN HÀNG
      // =================================================

      const orderResult = await client.query(
        `
        INSERT INTO don_hang
        (
          ma_nguoi_mua,
          ma_dich_vu,
          ma_yeu_cau,
          ma_freelancer,
          gia,
          trang_thai
        )
        VALUES
        (
          $1,
          NULL,
          $2,
          $3,
          $4,
          'ChoXuLy'
        )
        RETURNING
          ma_don_hang,
          ma_nguoi_mua,
          ma_yeu_cau,
          ma_freelancer,
          gia,
          trang_thai,
          ngay_dat
        `,
        [
          request.ma_nguoi_dang,
          request.ma_yeu_cau,
          userId,
          request.ngan_sach,
        ]
      );


      // =================================================
      // 6. CẬP NHẬT YÊU CẦU
      // =================================================

      await client.query(
        `
        UPDATE yeu_cau
        SET
          ma_freelancer = $1,
          trang_thai = 'DaNhan'
        WHERE ma_yeu_cau = $2
        `,
        [
          userId,
          requestId,
        ]
      );


      // =================================================
      // 7. HOÀN TẤT TRANSACTION
      // =================================================

      await client.query("COMMIT");


      // =================================================
      // 8. TRẢ KẾT QUẢ
      // =================================================

      res.json({
        message: "Nhận yêu cầu thành công và đã tạo đơn hàng!",

        request: {
          ma_yeu_cau: request.ma_yeu_cau,
          trang_thai: "DaNhan",
          ma_freelancer: userId,
        },

        order: orderResult.rows[0],
      });

    } catch (error) {

      try {
        await client.query("ROLLBACK");
      } catch (rollbackError) {
        console.error(
          "Lỗi rollback:",
          rollbackError.message
        );
      }

      console.error(
        "Lỗi nhận yêu cầu:",
        error
      );

      res.status(500).json({
        message: "Không thể nhận yêu cầu!",
        error: error.message,
      });

    } finally {

      client.release();

    }
  });
}


module.exports = YeuCau;