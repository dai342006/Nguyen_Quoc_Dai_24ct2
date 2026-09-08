// Trang chi tiết dịch vụ
function ServiceDetail({
  service,
  setPage,
  currentUser,
}) {

  // ========================================
  // Kiểm tra dịch vụ
  // ========================================

  if (!service) {
    return (
      <main className="page">

        <div className="container">

          <div className="empty-services">

            <div>
              ⚠️
            </div>

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
  // Thanh toán
  // ========================================

  function handlePayment() {

    // Chưa đăng nhập
    if (!currentUser) {

      alert(
        "Vui lòng đăng nhập bằng tài khoản Khách hàng để thanh toán."
      );

      setPage("login");
      return;
    }

    // Không phải khách hàng
    if (currentUser.role !== "KhachHang") {

      alert(
        "Chỉ tài khoản Khách hàng mới có thể đặt dịch vụ."
      );

      return;
    }

    // Kiểm tra mã dịch vụ
    if (!service.id) {

      alert(
        "Không tìm thấy mã dịch vụ."
      );

      return;
    }

    // Chuyển sang trang thanh toán
    setPage("payment");
  }

  // ========================================
  // Giá dịch vụ
  // ========================================

  const price = service.price;

  // ========================================
  // Giao diện
  // ========================================

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
              CHI TIẾT DỊCH VỤ
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
              THÔNG TIN DỊCH VỤ
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

              ⭐{" "}

              {service.rating ||
                "5.0"}

              <span>

                • Đánh giá

              </span>

            </div>


            <div className="big-price">

              {price}

            </div>


            {/* =========================
                THANH TOÁN
            ========================= */}

            <button
              className="primary-btn"
              onClick={handlePayment}
            >
              Thanh toán ngay
            </button>


            {/* =========================
                LIÊN HỆ
            ========================= */}

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


            {/* =========================
                FREELANCER
            ========================= */}

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