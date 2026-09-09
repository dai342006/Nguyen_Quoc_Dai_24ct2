const { pool } = require("./db");

// ======================================================
// DỊCH VỤ
// ======================================================

module.exports = function DichVu(app) {

  // ====================================================
  // LẤY TẤT CẢ DỊCH VỤ
  // ====================================================

  app.get("/api/services", async (req, res) => {
    try {

      const result =
        await pool.query(`
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
            ON d.ma_nguoi_dung =
               n.ma_nguoi_dung

          WHERE n.vai_tro = 'Freelancer'

          ORDER BY d.ma_dich_vu DESC
        `);

      res.json(result.rows);

    } catch (error) {

      console.error(
        "Lỗi lấy tất cả dịch vụ:",
        error
      );

      res.status(500).json({
        message:
          "Không thể lấy danh sách dịch vụ!",
      });
    }
  });


  // ====================================================
  // LẤY DỊCH VỤ CỦA FREELANCER
  // ====================================================

  app.get("/api/services/my", async (req, res) => {
    try {

      const userId = Number(
        req.headers["x-user-id"]
      );

      if (!userId) {
        return res.status(400).json({
          message:
            "Thiếu thông tin người dùng!",
        });
      }

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
            "Bạn không có quyền sử dụng chức năng này!",
        });
      }

      const result =
        await pool.query(
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

      console.error(
        "Lỗi lấy dịch vụ:",
        error
      );

      res.status(500).json({
        message:
          "Không thể lấy danh sách dịch vụ!",
      });
    }
  });


  // ====================================================
  // THÊM DỊCH VỤ
  // ====================================================

  app.post("/api/services", async (req, res) => {
    try {

      const userId = Number(
        req.headers["x-user-id"]
      );

      const {
        TenDichVu,
        MoTa,
        DanhMuc,
        Gia,
      } = req.body;

      const name = String(
        TenDichVu || ""
      ).trim();

      const description =
        String(
          MoTa || ""
        ).trim();

      const category =
        String(
          DanhMuc || ""
        ).trim();

      const price =
        Number(Gia);

      if (!userId) {
        return res.status(400).json({
          message:
            "Thiếu thông tin người dùng!",
        });
      }

      if (
        !name ||
        !category ||
        Gia === undefined ||
        Gia === ""
      ) {
        return res.status(400).json({
          message:
            "Vui lòng nhập đầy đủ thông tin!",
        });
      }

      if (
        Number.isNaN(price) ||
        price <= 0
      ) {
        return res.status(400).json({
          message:
            "Giá dịch vụ không hợp lệ!",
        });
      }

      const userResult =
        await pool.query(
          `
          SELECT vai_tro
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
            "Chỉ Freelancer mới được tạo dịch vụ!",
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
        message:
          "Thêm dịch vụ thành công!",
      });

    } catch (error) {

      console.error(
        "Lỗi thêm dịch vụ:",
        error
      );

      res.status(500).json({
        message:
          "Không thể thêm dịch vụ!",
      });
    }
  });


  // ====================================================
  // SỬA DỊCH VỤ
  // ====================================================

  app.put("/api/services/:id", async (req, res) => {
    try {

      const userId = Number(
        req.headers["x-user-id"]
      );

      const serviceId = Number(
        req.params.id
      );

      const {
        TenDichVu,
        MoTa,
        DanhMuc,
        Gia,
      } = req.body;

      const name = String(
        TenDichVu || ""
      ).trim();

      const description =
        String(
          MoTa || ""
        ).trim();

      const category =
        String(
          DanhMuc || ""
        ).trim();

      const price =
        Number(Gia);

      if (
        !userId ||
        !serviceId
      ) {
        return res.status(400).json({
          message:
            "Dữ liệu không hợp lệ!",
        });
      }

      if (
        !name ||
        !category
      ) {
        return res.status(400).json({
          message:
            "Vui lòng nhập đầy đủ thông tin!",
        });
      }

      if (
        Number.isNaN(price) ||
        price <= 0
      ) {
        return res.status(400).json({
          message:
            "Giá dịch vụ không hợp lệ!",
        });
      }

      const result =
        await pool.query(
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

      if (
        result.rowCount === 0
      ) {
        return res.status(404).json({
          message:
            "Không tìm thấy dịch vụ hoặc bạn không có quyền sửa!",
        });
      }

      res.json({
        message:
          "Cập nhật dịch vụ thành công!",
      });

    } catch (error) {

      console.error(
        "Lỗi sửa dịch vụ:",
        error
      );

      res.status(500).json({
        message:
          "Không thể cập nhật dịch vụ!",
      });
    }
  });


  // ====================================================
  // XÓA DỊCH VỤ
  // ====================================================

  app.delete("/api/services/:id", async (req, res) => {
    try {

      const userId = Number(
        req.headers["x-user-id"]
      );

      const serviceId = Number(
        req.params.id
      );

      if (
        !userId ||
        !serviceId
      ) {
        return res.status(400).json({
          message:
            "Dữ liệu không hợp lệ!",
        });
      }

      const result =
        await pool.query(
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

      if (
        result.rowCount === 0
      ) {
        return res.status(404).json({
          message:
            "Không tìm thấy dịch vụ hoặc bạn không có quyền xóa!",
        });
      }

      res.json({
        message:
          "Xóa dịch vụ thành công!",
      });

    } catch (error) {

      console.error(
        "Lỗi xóa dịch vụ:",
        error
      );

      res.status(500).json({
        message:
          "Không thể xóa dịch vụ!",
      });
    }
  });

};