import { useState } from "react";


function Payment({
  setPage,
  selectedService,
  currentUser,
}) {
  const [paymentMethod, setPaymentMethod] =
    useState("bank");

  const [loading, setLoading] =
    useState(false);

  const [message, setMessage] =
    useState("");

  // ========================================
  // Nếu chưa có dịch vụ
  // ========================================

  if (!selectedService) {
    return (
      <main className="payment-page">
        <div className="payment-container">
          <div className="payment-empty">
            <div className="payment-empty-icon">
              📦
            </div>

            <h2>
              Không có dịch vụ để thanh toán
            </h2>

            <p>
              Vui lòng chọn một dịch vụ trước
              khi thanh toán.
            </p>

            <button
              className="payment-btn"
              onClick={() =>
                setPage("services")
              }
            >
              Xem dịch vụ
            </button>
          </div>
        </div>
      </main>
    );
  }

  // ========================================
  // Thanh toán
  // ========================================

  async function handlePayment() {
    if (!currentUser?.id) {
      setMessage(
        "Vui lòng đăng nhập trước khi thanh toán."
      );

      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/orders",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(
              currentUser.id
            ),
          },

          body: JSON.stringify({
            MaDichVu:
              selectedService.id,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setMessage(
          data.message ||
            "Thanh toán thất bại."
        );

        return;
      }

      alert(
        "Thanh toán thành công! Đơn hàng đã được tạo."
      );

      setPage("orders");

    } catch (error) {
      console.error(
        "Lỗi thanh toán:",
        error
      );

      setMessage(
        "Không thể kết nối đến máy chủ."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="payment-page">

      <div className="payment-container">

        {/* ========================================
            HEADER
        ======================================== */}

        <div className="payment-heading">

          <button
            className="payment-back"
            onClick={() =>
              setPage("detail")
            }
          >
            ← Quay lại
          </button>

          <p className="payment-eyebrow">
            THANH TOÁN
          </p>

          <h1>
            Hoàn tất đơn hàng
          </h1>

          <p>
            Kiểm tra thông tin và chọn
            phương thức thanh toán.
          </p>

        </div>


        {/* ========================================
            CONTENT
        ======================================== */}

        <div className="payment-grid">

          {/* ======================================
              THÔNG TIN DỊCH VỤ
          ====================================== */}

          <section className="payment-card">

            <div className="payment-card-title">
              <h2>
                Thông tin dịch vụ
              </h2>
            </div>

            <div className="service-payment">

              <div className="service-payment-icon">
                💼
              </div>

              <div className="service-payment-info">

                <span>
                  DỊCH VỤ
                </span>

                <h3>
                  {selectedService.title}
                </h3>

                <p>
                  Freelancer:{" "}
                  <strong>
                    {selectedService.freelancer ||
                      "Freelancer"}
                  </strong>
                </p>

              </div>

            </div>

            <div className="payment-divider" />

            <div className="payment-info-row">
              <span>
                Danh mục
              </span>

              <strong>
                {selectedService.category}
              </strong>
            </div>

            <div className="payment-info-row">
              <span>
                Người mua
              </span>

              <strong>
                {currentUser?.name ||
                  "Khách hàng"}
              </strong>
            </div>

          </section>


          {/* ======================================
              PHƯƠNG THỨC THANH TOÁN
          ====================================== */}

          <section className="payment-card">

            <div className="payment-card-title">

              <h2>
                Phương thức thanh toán
              </h2>

              <span>
                🔒 An toàn
              </span>

            </div>


            {/* Ngân hàng */}

            <button
              className={
                paymentMethod === "bank"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("bank")
              }
            >

              <div className="payment-method-icon">
                🏦
              </div>

              <div className="payment-method-content">

                <strong>
                  Chuyển khoản ngân hàng
                </strong>

                <span>
                  Thanh toán qua tài khoản ngân hàng
                </span>

              </div>

              <div className="payment-radio">
                {paymentMethod === "bank"
                  ? "●"
                  : "○"}
              </div>

            </button>


            {/* Ví điện tử */}

            <button
              className={
                paymentMethod === "wallet"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("wallet")
              }
            >

              <div className="payment-method-icon">
                📱
              </div>

              <div className="payment-method-content">

                <strong>
                  Ví điện tử
                </strong>

                <span>
                  Thanh toán bằng ví điện tử
                </span>

              </div>

              <div className="payment-radio">
                {paymentMethod === "wallet"
                  ? "●"
                  : "○"}
              </div>

            </button>


            {/* Thẻ */}

            <button
              className={
                paymentMethod === "card"
                  ? "payment-method active"
                  : "payment-method"
              }
              onClick={() =>
                setPaymentMethod("card")
              }
            >

              <div className="payment-method-icon">
                💳
              </div>

              <div className="payment-method-content">

                <strong>
                  Thẻ ngân hàng
                </strong>

                <span>
                  Visa, Mastercard, ATM
                </span>

              </div>

              <div className="payment-radio">
                {paymentMethod === "card"
                  ? "●"
                  : "○"}
              </div>

            </button>

          </section>


          {/* ======================================
              TÓM TẮT THANH TOÁN
          ====================================== */}

          <section className="payment-card payment-summary">

            <div className="payment-card-title">

              <h2>
                Tóm tắt thanh toán
              </h2>

            </div>

            <div className="summary-row">

              <span>
                Giá dịch vụ
              </span>

              <strong>
                {selectedService.price}
              </strong>

            </div>

            <div className="summary-row">

              <span>
                Phí dịch vụ
              </span>

              <strong>
                0đ
              </strong>

            </div>

            <div className="payment-divider" />

            <div className="summary-total">

              <span>
                Tổng thanh toán
              </span>

              <strong>
                {selectedService.price}
              </strong>

            </div>

            {message && (
              <div className="payment-message">
                {message}
              </div>
            )}

            <button
              className="payment-btn payment-btn-large"
              onClick={handlePayment}
              disabled={loading}
            >
              {loading
                ? "Đang xử lý..."
                : "🔒 Thanh toán ngay"}
            </button>

            <p className="payment-note">
              Bằng việc thanh toán, bạn đồng ý
              với điều khoản sử dụng của SkillHub.
            </p>

          </section>

        </div>

      </div>

    </main>
  );
}

export default Payment;