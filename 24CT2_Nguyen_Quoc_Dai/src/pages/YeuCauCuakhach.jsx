import { useEffect, useState } from "react";

// ========================================
// Trang yêu cầu của tôi
// ========================================

function YeuCauCuaToi({
  setPage,
  currentUser,
}) {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // Lấy yêu cầu của khách hàng
  // ========================================

  async function loadRequests() {
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
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/requests/my",
        {
          method: "GET",

          headers: {
            "Content-Type":
              "application/json",

            "X-User-Id": String(
              currentUser.id
            ),
          },
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Không thể tải yêu cầu."
        );

        return;
      }

      setRequests(
        Array.isArray(data.requests)
          ? data.requests
          : []
      );

    } catch (err) {

      console.error(
        "Lỗi loadRequests:",
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
    loadRequests();
  }, [currentUser]);

  // ========================================
  // Kiểm tra đăng nhập
  // ========================================

  if (!currentUser) {
    return (
      <main className="page">

        <div className="container">

          <div className="empty-services">

            <div>🔒</div>

            <h3>
              Bạn chưa đăng nhập
            </h3>

            <p>
              Vui lòng đăng nhập để xem
              các yêu cầu của bạn.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                setPage("login")
              }
            >
              Đăng nhập
            </button>

          </div>

        </div>

      </main>
    );
  }

  // ========================================
  // Kiểm tra quyền
  // ========================================

  if (currentUser.role !== "KhachHang") {
    return (
      <main className="page">

        <div className="container">

          <div className="empty-services">

            <div>⚠️</div>

            <h3>
              Không có quyền truy cập
            </h3>

            <p>
              Chỉ Khách hàng mới có thể
              xem yêu cầu của mình.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                setPage("home")
              }
            >
              Về trang chủ
            </button>

          </div>

        </div>

      </main>
    );
  }

  // ========================================
  // Đổi tên trạng thái
  // ========================================

  function getStatusText(status) {
    switch (status) {

      case "DangTimFreelancer":
        return "Đang tìm Freelancer";

      case "DaNhan":
        return "Đã nhận";

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
              YÊU CẦU
            </p>

            <h1>
              Yêu cầu của tôi
            </h1>

          </div>

          <div className="empty-services">

            <div>⏳</div>

            <h3>
              Đang tải yêu cầu...
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

        {/* ========================================
            TIÊU ĐỀ
        ======================================== */}

        <div className="page-title">

          <p className="eyebrow">
            YÊU CẦU
          </p>

          <h1>
            Yêu cầu của tôi
          </h1>

          <p>
            Theo dõi các yêu cầu bạn đã đăng
            để tìm Freelancer.
          </p>

        </div>


        {/* ========================================
            THÔNG BÁO
        ======================================== */}

        {error && (
          <div className="form-message error">
            {error}
          </div>
        )}


        {/* ========================================
            KHÔNG CÓ YÊU CẦU
        ======================================== */}

        {requests.length === 0 ? (

          <div className="empty-services">

            <div>📝</div>

            <h3>
              Bạn chưa đăng yêu cầu nào
            </h3>

            <p>
              Hãy đăng yêu cầu để Freelancer
              có thể tìm thấy công việc phù hợp.
            </p>

            <button
              className="primary-btn"
              onClick={() =>
                setPage("create-request")
              }
            >
              Đăng yêu cầu
            </button>

          </div>

        ) : (

          <div className="request-list">

            {requests.map((request) => (

              <div
                className="request-item"
                key={request.MaYeuCau}
              >

                {/* Icon */}

                <div className="request-item-icon">
                  📝
                </div>


                {/* Thông tin */}

                <div className="request-item-main">

                  <span className="request-code">
                    #YC
                    {String(
                      request.MaYeuCau
                    ).padStart(3, "0")}
                  </span>

                  <h3>
                    {request.TieuDe}
                  </h3>

                  <p>
                    {request.MoTa}
                  </p>

                  <div className="request-meta">

                    <span>
                      📂 {request.DanhMuc}
                    </span>

                    <span>
                      💰{" "}
                      {Number(
                        request.NganSach
                      ).toLocaleString("vi-VN")}
                      đ
                    </span>

                    <span>
                      📅{" "}
                      {new Date(
                        request.NgayDang
                      ).toLocaleDateString(
                        "vi-VN"
                      )}
                    </span>

                  </div>

                </div>


                {/* Trạng thái */}

                <span
                  className={getStatusClass(
                    request.TrangThai
                  )}
                >
                  {getStatusText(
                    request.TrangThai
                  )}
                </span>

              </div>

            ))}

          </div>

        )}


        {/* ========================================
            NÚT ĐĂNG YÊU CẦU
        ======================================== */}

        {requests.length > 0 && (

          <button
            className="primary-btn request-add-btn"
            onClick={() =>
              setPage("create-request")
            }
          >
            + Đăng yêu cầu mới
          </button>

        )}

      </div>

    </main>
  );
}

export default YeuCauCuaToi;