import { useState } from "react";

function Payment({ setPage, selectedService, currentUser }) {
  const [paymentMethod, setPaymentMethod] = useState("bank");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showQR, setShowQR] = useState(false);

  // =========================
  // THÔNG TIN TÀI KHOẢN NHẬN
  // =========================
  const bankId = "VCB";
  const accountNumber = "1032829115";
  const accountName = "NGUYEN QUOC DAI";

  // =========================
  // KIỂM TRA DỊCH VỤ
  // =========================
  if (!selectedService) {
    return (
      <main className="payment-page">
        <div className="payment-container">
          <div className="payment-card">
            <h2>Không có dịch vụ để thanh toán</h2>

            <button
              className="payment-back-btn"
              onClick={() => setPage("services")}
            >
              ← Quay lại dịch vụ
            </button>
          </div>
        </div>
      </main>
    );
  }

  // =========================
  // CHUYỂN GIÁ DỊCH VỤ THÀNH SỐ
  // Ví dụ: "300.000đ" → 300000
  // =========================
  const amount = Number(
    String(selectedService.price).replace(/[^\d]/g, "")
  );

  // =========================
  // TẠO NỘI DUNG CHUYỂN KHOẢN
  // =========================
  const transferContent = `SKILLHUB DV${selectedService.id}`;

  // =========================
  // TẠO LINK QR VIETQR
  // =========================
  const qrUrl =
    `https://img.vietqr.io/image/${bankId}-${accountNumber}-compact2.png` +
    `?amount=${amount}` +
    `&addInfo=${encodeURIComponent(transferContent)}` +
    `&accountName=${encodeURIComponent(accountName)}`;

  // =========================
  // BẤM THANH TOÁN
  // Lần đầu → hiện QR
  // =========================
  function handlePayment() {
    if (!currentUser?.id) {
      setMessage("Vui lòng đăng nhập trước khi thanh toán.");
      return;
    }

    if (paymentMethod !== "bank") {
      setMessage("Hiện tại hệ thống hỗ trợ thanh toán bằng QR ngân hàng.");
      return;
    }

    if (!amount || amount <= 0) {
      setMessage("Giá dịch vụ không hợp lệ.");
      return;
    }

    setMessage("");
    setShowQR(true);
  }

  // =========================
  // XÁC NHẬN ĐÃ CHUYỂN KHOẢN
  // =========================
  async function confirmPayment() {
    if (!currentUser?.id) {
      setMessage("Vui lòng đăng nhập trước khi thanh toán.");
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
            "X-User-Id": String(currentUser.id),
          },
          body: JSON.stringify({
            MaDichVu: selectedService.id,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Không thể tạo đơn hàng."
        );
        return;
      }

      alert(
        "Đã ghi nhận thanh toán và tạo đơn hàng thành công!"
      );

      setPage("orders");
    } catch (error) {
      console.log(error);
      setMessage("Không thể kết nối đến máy chủ.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="payment-page">
      <div className="payment-container">

        {/* =========================
            PHẦN TIÊU ĐỀ
        ========================= */}
        <div className="payment-heading">
          <button
            className="payment-back-btn"
            onClick={() => setPage("services")}
          >
            ← Quay lại
          </button>

          <p className="payment-eyebrow">
            SKILLHUB PAYMENT
          </p>

          <h1>Thanh toán dịch vụ</h1>

          <p>
            Kiểm tra thông tin và thực hiện thanh toán
            cho dịch vụ bạn đã chọn.
          </p>
        </div>

        <div className="payment-grid">

          {/* =========================
              THÔNG TIN DỊCH VỤ
          ========================= */}
          <section className="payment-card">
            <h2>Thông tin dịch vụ</h2>

            <div className="payment-service">
              <h3>
                {selectedService.title ||
                  selectedService.TieuDe ||
                  "Dịch vụ"}
              </h3>

              <p>
                {selectedService.category ||
                  selectedService.LoaiDichVu ||
                  "Dịch vụ số"}
              </p>
            </div>

            <div className="payment-price-box">
              <span>Giá dịch vụ</span>

              <strong>
                {selectedService.price}
              </strong>
            </div>
          </section>

          {/* =========================
              PHƯƠNG THỨC THANH TOÁN
          ========================= */}
          <section className="payment-card">
            <h2>Phương thức thanh toán</h2>

            <div className="payment-methods">

              <button
                type="button"
                className={`payment-method ${
                  paymentMethod === "bank"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("bank")
                }
              >
                <div className="payment-method-icon">
                  🏦
                </div>

                <div>
                  <strong>
                    Chuyển khoản ngân hàng
                  </strong>

                  <span>
                    Quét mã QR VietQR
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`payment-method ${
                  paymentMethod === "wallet"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("wallet")
                }
              >
                <div className="payment-method-icon">
                  💳
                </div>

                <div>
                  <strong>
                    Ví điện tử
                  </strong>

                  <span>
                  
                  </span>
                </div>
              </button>

              <button
                type="button"
                className={`payment-method ${
                  paymentMethod === "card"
                    ? "active"
                    : ""
                }`}
                onClick={() =>
                  setPaymentMethod("card")
                }
              >
                <div className="payment-method-icon">
                  💰
                </div>

                <div>
                  <strong>
                    
                  </strong>

                  <span>
                    
                  </span>
                </div>
              </button>

            </div>
          </section>

          {/* =========================
              TỔNG THANH TOÁN
          ========================= */}
          <section className="payment-card payment-summary">
            <h2>Chi tiết thanh toán </h2>

            <div className="payment-row">
              <span>Giá dịch vụ </span>
              <strong>{selectedService.price}</strong>
            </div>

            <div className="payment-row">
              <span>Phí thanh toán </span>
              <strong>0đ</strong>
            </div>

            <div className="payment-total">
              <span>Tổng thanh toán </span>

              <strong>
                {selectedService.price}
              </strong>
            </div>

            {message && (
              <div className="payment-message">
                {message}
              </div>
            )}

            {!showQR ? (
              <button
                className="payment-submit-btn"
                onClick={handlePayment}
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : "Thanh toán ngay"}
              </button>
            ) : (
              <div className="qr-payment-section">

                <h3>
                  Quét mã QR để thanh toán
                </h3>

                <p className="qr-description">
                  Mở ứng dụng ngân hàng và quét mã QR
                  bên dưới.
                </p>

                {/* =========================
                    QR CODE
                ========================= */}
                <div className="qr-image-box">
                  <img
                    src={qrUrl}
                    alt="Mã QR thanh toán SkillHub"
                    className="qr-image"
                  />
                </div>

                {/* =========================
                    THÔNG TIN CHUYỂN KHOẢN
                ========================= */}
                <div className="qr-info">

                  <div className="qr-info-row">
                    <span>Ngân hàng</span>
                    <strong>
                      Vietcombank
                    </strong>
                  </div>

                  <div className="qr-info-row">
                    <span>Số tài khoản</span>
                    <strong>
                      {accountNumber}
                    </strong>
                  </div>

                  <div className="qr-info-row">
                    <span>Chủ tài khoản</span>
                    <strong>
                      {accountName}
                    </strong>
                  </div>

                  <div className="qr-info-row">
                    <span>Số tiền</span>
                    <strong className="qr-amount">
                      {selectedService.price}
                    </strong>
                  </div>

                  <div className="qr-info-row">
                    <span>Nội dung</span>
                    <strong>
                      {transferContent}
                    </strong>
                  </div>

                </div>

                {/* =========================
                    XÁC NHẬN
                ========================= */}
                <button
                  className="payment-submit-btn"
                  onClick={confirmPayment}
                  disabled={loading}
                >
                  {loading
                    ? "Đang tạo đơn hàng..."
                    : "✓ Tôi đã thanh toán"}
                </button>

                <button
                  className="qr-back-btn"
                  onClick={() => {
                    setShowQR(false);
                    setMessage("");
                  }}
                >
                  ← Thay đổi phương thức
                </button>

              </div>
            )}

          </section>

        </div>
      </div>
    </main>
  );
}

export default Payment;