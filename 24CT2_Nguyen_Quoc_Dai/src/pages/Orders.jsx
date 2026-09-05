import { useEffect, useState } from "react";

// Trang quản lý đơn hàng
function Orders({ setPage, currentUser }) {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  // ========================================
  // Lấy đơn hàng
  // ========================================
  async function loadOrders() {
    if (!currentUser?.id) {
      setError("Không tìm thấy thông tin người dùng.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "http://localhost:5000/api/orders",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(currentUser.id),
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

      setOrders(
        Array.isArray(data.orders)
          ? data.orders
          : []
      );

    } catch (err) {
      console.error("Lỗi loadOrders:", err);

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
  // Cập nhật trạng thái
  // ========================================
  async function updateStatus(orderId, status) {
    setError("");
    setMessage("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/orders/${orderId}/status`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(currentUser.id),
          },
          body: JSON.stringify({
            TrangThai: status,
          }),
        }
      );

      const data = await response.json();

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
  // Đổi tên trạng thái
  // ========================================
  function getStatusText(status) {
    switch (status) {
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
            <div>⏳</div>

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
            {currentUser?.role === "Freelancer"
              ? "Đơn hàng nhận được"
              : "Đơn hàng của tôi"}
          </h1>

          <p>
            {currentUser?.role === "Freelancer"
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

            <div>📦</div>

            <h3>
              Chưa có đơn hàng
            </h3>

            <p>
              {currentUser?.role === "Freelancer"
                ? "Hiện chưa có khách hàng đặt dịch vụ của bạn."
                : "Bạn chưa đặt dịch vụ nào."}
            </p>

          </div>

        ) : (

          <div className="order-list">

            {orders.map((order) => (

              <div
                className="order-row"
                key={order.MaDonHang}
              >

                {/* Icon */}
                <div className="order-icon">
                  📦
                </div>

                {/* Thông tin */}
                <div className="order-main">

                  <span>
                    #DH
                    {String(
                      order.MaDonHang
                    ).padStart(3, "0")}
                  </span>

                  <h3>
                    {order.TenDichVu}
                  </h3>

                  <p>
                    {currentUser?.role === "Freelancer"
                      ? `Khách hàng: ${order.TenKhachHang}`
                      : `Freelancer: ${order.TenFreelancer}`}
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

                {/* Giá */}
                <div className="order-price">
                  {Number(
                    order.Gia
                  ).toLocaleString(
                    "vi-VN"
                  )}
                  đ
                </div>

                {/* Trạng thái */}
                <span
                  className={getStatusClass(
                    order.TrangThai
                  )}
                >
                  {getStatusText(
                    order.TrangThai
                  )}
                </span>

                {/* Freelancer cập nhật */}
                {currentUser?.role ===
                  "Freelancer" &&
                  order.TrangThai !==
                    "HoanThanh" &&
                  order.TrangThai !==
                    "DaHuy" && (

                    <div className="order-actions">

                      {order.TrangThai ===
                        "ChoXacNhan" && (
                        <button
                          className="primary-btn"
                          onClick={() =>
                            updateStatus(
                              order.MaDonHang,
                              "DangThucHien"
                            )
                          }
                        >
                          Nhận đơn
                        </button>
                      )}

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

              </div>

            ))}

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

      </div>
    </main>
  );
}

export default Orders;