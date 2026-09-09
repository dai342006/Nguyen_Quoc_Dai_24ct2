const { pool } = require("./db");

// ======================================================
// ĐƠN HÀNG
// ======================================================

module.exports = function DonHang(app) {

  // ====================================================
  // API TẠO ĐƠN HÀNG
  // ====================================================

  app.post("/api/orders", async (req, res) => {
    try {

      const userId = Number(
        req.headers["x-user-id"]
      );

      const serviceId = Number(
        req.body.MaDichVu
      );

      if (
        !userId ||
        !serviceId
      ) {
        return res.status(400).json({
          message:
            "Thiếu thông tin khách hàng hoặc dịch vụ!",
        });
      }

      // Kiểm tra người dùng
      const customerResult =
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
        customerResult.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Không tìm thấy tài khoản!",
        });
      }

      if (
        customerResult.rows[0].vai_tro !==
        "KhachHang"
      ) {
        return res.status(403).json({
          message:
            "Chỉ Khách hàng mới được đặt dịch vụ!",
        });
      }

      // Lấy dịch vụ
      const serviceResult =
        await pool.query(
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

      if (
        serviceResult.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Không tìm thấy dịch vụ!",
        });
      }

      const service =
        serviceResult.rows[0];

      // Không cho tự mua dịch vụ
      if (
        service.ma_nguoi_dung ===
        userId
      ) {
        return res.status(400).json({
          message:
            "Bạn không thể tự đặt dịch vụ của mình!",
        });
      }

      // Kiểm tra đơn đang xử lý
      const existingOrder =
        await pool.query(
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

      if (
        existingOrder.rows.length > 0
      ) {
        return res.status(409).json({
          message:
            "Bạn đã có đơn hàng đang xử lý cho dịch vụ này!",
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
        VALUES (
          $1,
          $2,
          $3,
          'ChoXuLy'
        )
        `,
        [
          userId,
          service.ma_dich_vu,
          service.gia,
        ]
      );

      res.status(201).json({
        message:
          "Đặt dịch vụ thành công!",
      });

    } catch (error) {

      console.error(
        "Lỗi tạo đơn hàng:",
        error
      );

      res.status(500).json({
        message:
          "Không thể tạo đơn hàng!",
      });
    }
  });


  // ====================================================
  // API LẤY ĐƠN HÀNG
  // ====================================================

  app.get("/api/orders", async (req, res) => {
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

      const userResult =
        await pool.query(
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

      if (
        userResult.rows.length === 0
      ) {
        return res.status(404).json({
          message:
            "Không tìm thấy người dùng!",
        });
      }

      const user =
        userResult.rows[0];


      // ==================================================
      // KHÁCH HÀNG
      // ==================================================

      if (
        user.vai_tro === "KhachHang"
      ) {

        const result =
          await pool.query(
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
              ON d.ma_dich_vu =
                 dv.ma_dich_vu

            INNER JOIN nguoi_dung f
              ON dv.ma_nguoi_dung =
                 f.ma_nguoi_dung

            WHERE
              d.ma_nguoi_mua = $1

            ORDER BY
              d.ma_don_hang DESC
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

      if (
        user.vai_tro === "Freelancer"
      ) {

        const result =
          await pool.query(
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
              ON d.ma_dich_vu =
                 dv.ma_dich_vu

            INNER JOIN nguoi_dung c
              ON d.ma_nguoi_mua =
                 c.ma_nguoi_dung

            WHERE
              dv.ma_nguoi_dung = $1

            ORDER BY
              d.ma_don_hang DESC
            `,
            [userId]
          );

        return res.json({
          role: "Freelancer",
          orders: result.rows,
        });
      }


      return res.status(403).json({
        message:
          "Vai trò tài khoản không hợp lệ!",
      });

    } catch (error) {

      console.error(
        "Lỗi lấy đơn hàng:",
        error
      );

      res.status(500).json({
        message:
          "Không thể lấy danh sách đơn hàng!",
      });
    }
  });


  // ====================================================
  // API CẬP NHẬT TRẠNG THÁI ĐƠN
  // ====================================================

  app.put(
    "/api/orders/:id/status",
    async (req, res) => {

      try {

        const userId = Number(
          req.headers["x-user-id"]
        );

        const orderId = Number(
          req.params.id
        );

        let {
          TrangThai,
        } = req.body;

        if (
          !userId ||
          !orderId ||
          !TrangThai
        ) {
          return res.status(400).json({
            message:
              "Dữ liệu không hợp lệ!",
          });
        }

        // Tương thích trạng thái cũ
        if (
          TrangThai ===
          "ChoXacNhan"
        ) {
          TrangThai =
            "ChoXuLy";
        }

        const allowedStatuses = [
          "ChoXuLy",
          "DangThucHien",
          "HoanThanh",
          "DaHuy",
        ];

        if (
          !allowedStatuses.includes(
            TrangThai
          )
        ) {
          return res.status(400).json({
            message:
              "Trạng thái đơn hàng không hợp lệ!",
          });
        }

        // Kiểm tra Freelancer
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
              "Chỉ Freelancer mới được cập nhật trạng thái đơn!",
          });
        }

        // Chỉ sửa đơn của dịch vụ mình
        const result =
          await pool.query(
            `
            UPDATE don_hang d

            SET trang_thai = $1

            FROM dich_vu dv

            WHERE
              d.ma_dich_vu =
                dv.ma_dich_vu

              AND d.ma_don_hang =
                $2

              AND dv.ma_nguoi_dung =
                $3
            `,
            [
              TrangThai,
              orderId,
              userId,
            ]
          );

        if (
          result.rowCount === 0
        ) {
          return res.status(404).json({
            message:
              "Không tìm thấy đơn hàng hoặc bạn không có quyền!",
          });
        }

        res.json({
          message:
            "Cập nhật trạng thái thành công!",
        });

      } catch (error) {

        console.error(
          "Lỗi cập nhật trạng thái:",
          error
        );

        res.status(500).json({
          message:
            "Không thể cập nhật trạng thái đơn hàng!",
        });
      }
    }
  );

};