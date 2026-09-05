import { useState } from "react";

// Trang chi tiết dịch vụ
function ServiceDetail({
  service,
  setPage,
  currentUser,
}) {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // ========================================
  // Kiểm tra dịch vụ
  // ========================================
  if (!service) {
    return (
      <main className="page">
        <div className="container">
          <div className="empty-services">
            <div>⚠️</div>

            <h3>
              Không tìm thấy dịch vụ
            </h3>

            <button
              className="primary-btn"
              onClick={() =>
                setPage("services")
              }
            >
              Quay lại danh sách dịch vụ
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // Đặt dịch vụ
  // ========================================
  async function handleOrder() {
    setMessage("");
    setError("");

    // Chưa đăng nhập
    if (!currentUser) {
      alert(
        "Vui lòng đăng nhập bằng tài khoản Khách hàng để đặt dịch vụ."
      );

      setPage("login");
      return;
    }

    // Freelancer không được đặt
    if (currentUser.role !== "KhachHang") {
      setError(
        "Chỉ tài khoản Khách hàng mới có thể đặt dịch vụ."
      );
      return;
    }

    // Kiểm tra mã dịch vụ
    if (!service.id) {
      setError(
        "Không tìm thấy mã dịch vụ."
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(
              currentUser.id
            ),
          },

          body: JSON.stringify({
            MaDichVu: service.id,
          }),
        }
      );

      const data = await response.json();

      console.log(
        "POST /api/orders:",
        data
      );

      if (!response.ok) {
        setError(
          data.message ||
            "Đặt dịch vụ thất bại."
        );
        return;
      }

      setMessage(
        data.message ||
          "Đặt dịch vụ thành công!"
      );

      // Chuyển sang trang đơn hàng
      setTimeout(() => {
        setPage("orders");
      }, 1000);

    } catch (err) {
      console.error(
        "Lỗi đặt dịch vụ:",
        err
      );

      setError(
        "Không thể kết nối đến máy chủ."
      );
    } finally {
      setIsLoading(false);
    }
  }

  // ========================================
  // Giá dịch vụ
  // ========================================
  const price = service.price;

  return (
    <main className="page">
      <div className="container">

        {/* =========================
            QUAY LẠI
        ========================= */}
        <button
          className="back-btn"
          onClick={() =>
            setPage("services")
          }
        >
          ← Quay lại
        </button>

        <div className="detail-grid">

          {/* =========================
              CHI TIẾT
          ========================= */}
          <div className="detail-left">

            <div className="detail-cover">
              {service.icon || "💼"}
            </div>

            <div className="detail-section">

              <p className="eyebrow">
                {service.category ||
                  "DỊCH VỤ"}
              </p>

              <h2>
                {service.title}
              </h2>

              <p>
                {service.description ||
                  "Freelancer chưa cung cấp mô tả cho dịch vụ này."}
              </p>

              <p>
                Dịch vụ được cung cấp bởi{" "}
                <strong>
                  {service.freelancer ||
                    "Freelancer"}
                </strong>
                . Bạn có thể trao đổi yêu cầu
                trước khi đặt dịch vụ.
              </p>

              {/* Freelancer */}
              <div className="seller-box">
                <div className="avatar">
                  👨‍💻
                </div>

                <div>
                  <strong>
                    {service.freelancer ||
                      "Freelancer"}
                  </strong>

                  <span>
                    Freelancer chuyên nghiệp
                  </span>
                </div>
              </div>

            </div>
          </div>

          {/* =========================
              THÔNG TIN ĐẶT DỊCH VỤ
          ========================= */}
          <aside className="price-box">

            <div className="service-category">
              {service.category ||
                "Dịch vụ"}
            </div>

            <h2>
              {service.title}
            </h2>

            <div className="rating-big">
              ⭐ {service.rating || "5.0"}

              <span>
                • Đánh giá
              </span>
            </div>

            <div className="big-price">
              {price}
            </div>

            {/* Thông báo */}
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

            {/* Nút đặt */}
            <button
              className="primary-btn"
              onClick={handleOrder}
              disabled={isLoading}
            >
              {isLoading
                ? "Đang đặt dịch vụ..."
                : "Thuê dịch vụ"}
            </button>

            {/* Liên hệ */}
            <button
              className="secondary-btn"
              onClick={() => {
                alert(
                  "Chức năng liên hệ Freelancer sẽ được bổ sung sau."
                );
              }}
            >
              Liên hệ Freelancer
            </button>

            {/* Freelancer */}
            <div className="seller-box">

              <div className="avatar">
                👨‍💻
              </div>

              <div>
                <strong>
                  {service.freelancer ||
                    "Freelancer"}
                </strong>

                <span>
                  Freelancer chuyên nghiệp
                </span>
              </div>

            </div>

          </aside>

        </div>
      </div>
    </main>
  );
}

export default ServiceDetail;