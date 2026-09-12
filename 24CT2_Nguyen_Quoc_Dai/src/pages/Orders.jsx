import { useEffect, useState } from "react";

// ======================================================
// TRANG QUẢN LÝ ĐƠN HÀNG
// ======================================================

function Orders({ setPage, currentUser }) {

  // Danh sách đơn hàng
  const [orders, setOrders] = useState([]);

  // Trạng thái loading
  const [loading, setLoading] = useState(true);

  // Thông báo lỗi
  const [error, setError] = useState("");

  // Thông báo thành công
  const [message, setMessage] = useState("");

  // ====================================================
  // PHẦN ĐÁNH GIÁ
  // ====================================================

  // Đơn hàng đang được đánh giá
  const [reviewOrder, setReviewOrder] = useState(null);

  // Số sao
  const [rating, setRating] = useState(5);

  // Bình luận
  const [comment, setComment] = useState("");

  // Đang gửi đánh giá
  const [reviewLoading, setReviewLoading] = useState(false);

  // Danh sách đơn đã đánh giá
  const [reviewedOrders, setReviewedOrders] = useState({});


  // ========================================
  // Lấy đơn hàng
  // ========================================

  async function loadOrders() {

    if (!currentUser?.id) {
      setError(
        "Không tìm thấy thông tin người dùng."
      );

      setLoading(false);

      return;
    }

    try {

      setLoading(true);
      setError("");

      const response = await fetch(
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/orders",
        {
          method: "GET",

          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(
              currentUser.id
            ),
          },
        }
      );

      const data = await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Không thể tải đơn hàng."
        );

        return;
      }

      const orderList = Array.isArray(
        data.orders
      )
        ? data.orders
        : [];

      setOrders(orderList);

      // ==================================================
      // KIỂM TRA ĐƠN ĐÃ ĐÁNH GIÁ
      // ==================================================

      if (
        currentUser.role === "KhachHang"
      ) {

        const completedOrders =
          orderList.filter(
            (order) =>
              order.TrangThai ===
              "HoanThanh"
          );

        const reviewed = {};

        await Promise.all(
          completedOrders.map(
            async (order) => {

              try {

                const reviewResponse =
                  await fetch(
                    `https://nguyen-quoc-dai-24ct2.onrender.com/api/reviews/order/${order.MaDonHang}`
                  );

                if (!reviewResponse.ok) {
                  return;
                }

                const reviewData =
                  await reviewResponse.json();

                if (
                  Array.isArray(reviewData) &&
                  reviewData.length > 0
                ) {
                  reviewed[
                    order.MaDonHang
                  ] = true;
                }

              } catch (err) {

                console.error(
                  "Lỗi kiểm tra đánh giá:",
                  err
                );

              }

            }
          )
        );

        setReviewedOrders(reviewed);

      }

    } catch (err) {

      console.error(
        "Lỗi loadOrders:",
        err
      );

      setError(
        "Không thể kết nối đến máy chủ."
      );

    } finally {

      setLoading(false);

    }

  }


  // ========================================
  // Load khi mở trang
  // ========================================

  useEffect(() => {

    loadOrders();

  }, [currentUser]);


  // ========================================
  // Cập nhật trạng thái đơn hàng
  // ========================================

  async function updateStatus(
    orderId,
    status
  ) {

    setError("");
    setMessage("");

    try {

      const response = await fetch(
        `https://nguyen-quoc-dai-24ct2.onrender.com/api/orders/${orderId}/status`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            "X-User-Id": String(
              currentUser.id
            ),
          },

          body: JSON.stringify({
            TrangThai: status,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Không thể cập nhật trạng thái."
        );

        return;
      }

      setMessage(
        data.message ||
        "Cập nhật thành công!"
      );

      await loadOrders();

    } catch (err) {

      console.error(
        "Lỗi updateStatus:",
        err
      );

      setError(
        "Không thể kết nối đến máy chủ."
      );

    }

  }


  // ========================================
  // Mở form đánh giá
  // ========================================

  function openReview(order) {

    setReviewOrder(order);

    // Mặc định 5 sao
    setRating(5);

    // Xóa bình luận cũ
    setComment("");

    setError("");
    setMessage("");

  }


  // ========================================
  // Đóng form đánh giá
  // ========================================

  function closeReview() {

    setReviewOrder(null);

    setRating(5);

    setComment("");

  }


  // ========================================
  // Gửi đánh giá
  // ========================================

  async function submitReview() {

    if (!reviewOrder) {
      return;
    }

    if (
      rating < 1 ||
      rating > 5
    ) {

      setError(
        "Vui lòng chọn số sao từ 1 đến 5."
      );

      return;
    }

    setReviewLoading(true);

    setError("");
    setMessage("");

    try {

      const response = await fetch(
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/reviews",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",

            "X-User-Id": String(
              currentUser.id
            ),
          },

          body: JSON.stringify({

            MaDonHang:
              reviewOrder.MaDonHang,

            Diem: rating,

            BinhLuan: comment,

          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {

        setError(
          data.message ||
          "Không thể gửi đánh giá."
        );

        return;
      }

      // Đánh dấu đơn hàng đã đánh giá
      setReviewedOrders(
        (old) => ({
          ...old,
          [reviewOrder.MaDonHang]:
            true,
        })
      );

      setMessage(
        data.message ||
        "Đánh giá thành công!"
      );

      // Đóng form
      closeReview();

    } catch (err) {

      console.error(
        "Lỗi submitReview:",
        err
      );

      setError(
        "Không thể kết nối đến máy chủ."
      );

    } finally {

      setReviewLoading(false);

    }

  }


  // ========================================
  // Đổi tên trạng thái
  // ========================================

  function getStatusText(status) {

    switch (status) {

      case "ChoXuLy":
      case "ChoXacNhan":

        return "Chờ xác nhận";

      case "DangThucHien":

        return "Đang thực hiện";

      case "HoanThanh":

        return "Hoàn thành";

      case "DaHuy":

        return "Đã hủy";

      default:

        return status;
    }

  }


  // ========================================
  // Class trạng thái
  // ========================================

  function getStatusClass(status) {

    switch (status) {

      case "HoanThanh":

        return "status done";

      case "DaHuy":

        return "status cancelled";

      case "DangThucHien":

        return "status pending";

      case "ChoXuLy":
      case "ChoXacNhan":
      default:

        return "status pending";
    }

  }


  // ========================================
  // Loading
  // ========================================

  if (loading) {

    return (
      <main className="page">

        <div className="container">

          <div className="page-title">

            <p className="eyebrow">
              QUẢN LÝ
            </p>

            <h1>
              Đơn hàng
            </h1>

          </div>

          <div className="empty-services">

            <div>
              ⏳
            </div>

            <h3>
              Đang tải đơn hàng...
            </h3>

            <p>
              Vui lòng chờ một chút.
            </p>

          </div>

        </div>

      </main>
    );

  }


  return (
    <main className="page">

      <div className="container">

        {/* =========================
            TIÊU ĐỀ
        ========================= */}

        <div className="page-title">

          <p className="eyebrow">
            QUẢN LÝ
          </p>

          <h1>

            {currentUser?.role ===
            "Freelancer"
              ? "Đơn hàng nhận được"
              : "Đơn hàng của tôi"}

          </h1>

          <p>

            {currentUser?.role ===
            "Freelancer"
              ? "Theo dõi và xử lý các đơn hàng khách hàng đã đặt."
              : "Theo dõi tiến độ các dịch vụ bạn đã thuê."}

          </p>

        </div>


        {/* =========================
            THÔNG BÁO
        ========================= */}

        {message && (

          <div className="form-message success">

            {message}

          </div>

        )}

        {error && (

          <div className="form-message error">

            {error}

          </div>

        )}


        {/* =========================
            KHÔNG CÓ ĐƠN
        ========================= */}

        {orders.length === 0 ? (

          <div className="empty-services">

            <div>
              📦
            </div>

            <h3>
              Chưa có đơn hàng
            </h3>

            <p>

              {currentUser?.role ===
              "Freelancer"
                ? "Hiện chưa có khách hàng đặt dịch vụ của bạn."
                : "Bạn chưa đặt dịch vụ nào."}

            </p>

          </div>

        ) : (

          <div className="order-list">

            {orders.map(
              (order) => (

                <div
                  className="order-row"
                  key={
                    order.MaDonHang
                  }
                >

                  {/* =================
                      ICON
                  ================= */}

                  <div className="order-icon">
                    📦
                  </div>


                  {/* =================
                      THÔNG TIN
                  ================= */}

                  <div className="order-main">

                    <span>

                      #DH
                      {String(
                        order.MaDonHang
                      ).padStart(3, "0")}

                    </span>

                    <h3>

                      {order.TenDichVu ||
                        order.TieuDeYeuCau ||
                        "Đơn hàng"}

                    </h3>

                    <p>

                      {currentUser?.role ===
                      "Freelancer"

                        ? `Khách hàng: ${
                            order.TenKhachHang ||
                            "Không có thông tin"
                          }`

                        : `Freelancer: ${
                            order.TenFreelancer ||
                            "Không có thông tin"
                          }`}

                    </p>

                    <small>

                      Ngày đặt:{" "}

                      {new Date(
                        order.NgayDat
                      ).toLocaleDateString(
                        "vi-VN"
                      )}

                    </small>

                  </div>


                  {/* =================
                      GIÁ
                  ================= */}

                  <div className="order-price">

                    {Number(
                      order.Gia
                    ).toLocaleString(
                      "vi-VN"
                    )}

                    đ

                  </div>


                  {/* =================
                      TRẠNG THÁI
                  ================= */}

                  <span
                    className={
                      getStatusClass(
                        order.TrangThai
                      )
                    }
                  >

                    {getStatusText(
                      order.TrangThai
                    )}

                  </span>


                  {/* =========================
                      FREELANCER CẬP NHẬT
                  ========================= */}

                  {currentUser?.role ===
                    "Freelancer" &&

                    order.TrangThai !==
                      "HoanThanh" &&

                    order.TrangThai !==
                      "DaHuy" && (

                      <div className="order-actions">

                        {/* Chờ xác nhận */}

                        {(order.TrangThai ===
                          "ChoXuLy" ||

                          order.TrangThai ===
                            "ChoXacNhan") && (

                          <button
                            className="primary-btn"
                            onClick={() =>
                              updateStatus(
                                order.MaDonHang,
                                "DangThucHien"
                              )
                            }
                          >

                            Xác nhận đơn

                          </button>

                        )}


                        {/* Đang thực hiện */}

                        {order.TrangThai ===
                          "DangThucHien" && (

                          <button
                            className="primary-btn"
                            onClick={() =>
                              updateStatus(
                                order.MaDonHang,
                                "HoanThanh"
                              )
                            }
                          >

                            Hoàn thành

                          </button>

                        )}

                      </div>

                    )}


                  {/* =========================
                      KHÁCH HÀNG ĐÁNH GIÁ
                  ========================= */}

                  {currentUser?.role ===
                    "KhachHang" &&

                    order.TrangThai ===
                      "HoanThanh" && (

                      <div className="order-actions">

                        {reviewedOrders[
                          order.MaDonHang
                        ] ? (

                          <button
                            className="secondary-btn"
                            disabled
                          >

                            ✓ Đã đánh giá

                          </button>

                        ) : (

                          <button
                            className="primary-btn"
                            onClick={() =>
                              openReview(
                                order
                              )
                            }
                          >

                            ⭐ Đánh giá

                          </button>

                        )}

                      </div>

                    )}

                </div>

              )
            )}

          </div>

        )}


        {/* =========================
            XEM DỊCH VỤ
        ========================= */}

        <button
          className="primary-btn"
          onClick={() =>
            setPage("services")
          }
        >

          Khám phá thêm dịch vụ

        </button>


        {/* ==================================================
            FORM ĐÁNH GIÁ
        ================================================== */}

        {reviewOrder && (

          <div className="review-overlay">

            <div className="review-modal">

              {/* Nút đóng */}

              <button
                className="review-close"
                onClick={
                  closeReview
                }
              >
                ×
              </button>


              {/* Tiêu đề */}

              <p className="eyebrow">
                ĐÁNH GIÁ DỊCH VỤ
              </p>

              <h2>
                {reviewOrder.TenDichVu ||
                  reviewOrder.TieuDeYeuCau ||
                  "Đơn hàng"}
              </h2>

              <p className="review-description">

                Hãy chia sẻ trải nghiệm
                của bạn về dịch vụ.

              </p>


              {/* =================
                  CHỌN SAO
              ================= */}

              <div className="review-stars">

                {[1, 2, 3, 4, 5].map(
                  (star) => (

                    <button
                      key={star}
                      type="button"
                      className={
                        star <= rating
                          ? "star active"
                          : "star"
                      }
                      onClick={() =>
                        setRating(star)
                      }
                    >
                      ★
                    </button>

                  )
                )}

              </div>

              <p className="review-rating-text">

                {rating}/5 sao

              </p>


              {/* =================
                  BÌNH LUẬN
              ================= */}

              <label className="review-label">

                Bình luận

              </label>

              <textarea
                className="review-textarea"
                value={comment}
                onChange={(e) =>
                  setComment(
                    e.target.value
                  )
                }
                placeholder="Nhập nhận xét của bạn..."
                rows="5"
              />


              {/* =================
                  NÚT
              ================= */}

              <div className="review-buttons">

                <button
                  className="secondary-btn"
                  onClick={
                    closeReview
                  }
                  disabled={
                    reviewLoading
                  }
                >

                  Hủy

                </button>


                <button
                  className="primary-btn"
                  onClick={
                    submitReview
                  }
                  disabled={
                    reviewLoading
                  }
                >

                  {reviewLoading
                    ? "Đang gửi..."
                    : "Gửi đánh giá"}

                </button>

              </div>

            </div>

          </div>

        )}

      </div>

    </main>
  );
}

export default Orders;