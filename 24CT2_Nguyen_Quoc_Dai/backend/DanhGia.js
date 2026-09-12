const { pool } = require("./db");

// ======================================================
// ĐÁNH GIÁ
// ======================================================

module.exports = function DanhGia(app) {

  // ====================================================
  // API THÊM ĐÁNH GIÁ
  // ====================================================

  app.post("/api/reviews", async (req, res) => {
    try {

      // Lấy mã người dùng từ header
      const userId = Number(
        req.headers["x-user-id"]
      );

      // Lấy dữ liệu từ frontend
      const {
        MaDonHang,
        Diem,
        BinhLuan,
      } = req.body;

      const orderId = Number(MaDonHang);
      const rating = Number(Diem);
      const comment = String(
        BinhLuan || ""
      ).trim();

      // Kiểm tra dữ liệu
      if (!userId || !orderId || !rating) {
        return res.status(400).json({
          message: "Thiếu thông tin đánh giá!",
        });
      }

      // Điểm chỉ từ 1 đến 5
      if (rating < 1 || rating > 5) {
        return res.status(400).json({
          message: "Điểm đánh giá phải từ 1 đến 5 sao!",
        });
      }

      // ==================================================
      // KIỂM TRA NGƯỜI DÙNG
      // ==================================================

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

      // Chỉ khách hàng được đánh giá
      if (
        userResult.rows[0].vai_tro !==
        "KhachHang"
      ) {
        return res.status(403).json({
          message:
            "Chỉ Khách hàng mới được đánh giá!",
        });
      }

      // ==================================================
      // KIỂM TRA ĐƠN HÀNG
      // ==================================================

      const orderResult = await pool.query(
        `
        SELECT
          ma_don_hang,
          ma_nguoi_mua,
          trang_thai
        FROM don_hang
        WHERE ma_don_hang = $1
        `,
        [orderId]
      );

      if (orderResult.rows.length === 0) {
        return res.status(404).json({
          message: "Không tìm thấy đơn hàng!",
        });
      }

      const order = orderResult.rows[0];

      // Chỉ chủ đơn hàng mới được đánh giá
      if (
        Number(order.ma_nguoi_mua) !==
        userId
      ) {
        return res.status(403).json({
          message:
            "Bạn không có quyền đánh giá đơn hàng này!",
        });
      }

      // Chỉ đánh giá khi đã hoàn thành
      if (
        order.trang_thai !==
        "HoanThanh"
      ) {
        return res.status(400).json({
          message:
            "Chỉ có thể đánh giá đơn hàng đã hoàn thành!",
        });
      }

      // ==================================================
      // KIỂM TRA ĐÃ ĐÁNH GIÁ CHƯA
      // ==================================================

      const existingReview =
        await pool.query(
          `
          SELECT ma_danh_gia
          FROM danh_gia
          WHERE ma_don_hang = $1
          AND ma_nguoi_danh_gia = $2
          `,
          [
            orderId,
            userId,
          ]
        );

      if (
        existingReview.rows.length > 0
      ) {
        return res.status(409).json({
          message:
            "Bạn đã đánh giá đơn hàng này!",
        });
      }

      // ==================================================
      // THÊM ĐÁNH GIÁ
      // ==================================================

      await pool.query(
        `
        INSERT INTO danh_gia
        (
          ma_don_hang,
          ma_nguoi_danh_gia,
          diem,
          binh_luan
        )
        VALUES
        ($1, $2, $3, $4)
        `,
        [
          orderId,
          userId,
          rating,
          comment,
        ]
      );

      return res.status(201).json({
        message:
          "Đánh giá thành công!",
      });

    } catch (error) {

      console.error(
        "Lỗi thêm đánh giá:",
        error
      );

      return res.status(500).json({
        message:
          "Không thể thêm đánh giá!",
      });
    }
  });


  // ====================================================
  // API LẤY ĐÁNH GIÁ CỦA ĐƠN HÀNG
  // ====================================================

  app.get(
    "/api/reviews/order/:id",
    async (req, res) => {

      try {

        const orderId = Number(
          req.params.id
        );

        if (!orderId) {
          return res.status(400).json({
            message:
              "Mã đơn hàng không hợp lệ!",
          });
        }

        const result =
          await pool.query(
            `
            SELECT
              dg.ma_danh_gia AS "MaDanhGia",
              dg.ma_don_hang AS "MaDonHang",
              dg.ma_nguoi_danh_gia AS "MaNguoiDanhGia",
              dg.diem AS "Diem",
              dg.binh_luan AS "BinhLuan",
              dg.ngay_danh_gia AS "NgayDanhGia",
              nd.ho_ten AS "TenNguoiDanhGia"
            FROM danh_gia dg
            INNER JOIN nguoi_dung nd
              ON dg.ma_nguoi_danh_gia =
                 nd.ma_nguoi_dung
            WHERE dg.ma_don_hang = $1
            ORDER BY dg.ma_danh_gia DESC
            `,
            [orderId]
          );

        res.json(result.rows);

      } catch (error) {

        console.error(
          "Lỗi lấy đánh giá:",
          error
        );

        res.status(500).json({
          message:
            "Không thể lấy đánh giá!",
        });
      }
    }
  );

};