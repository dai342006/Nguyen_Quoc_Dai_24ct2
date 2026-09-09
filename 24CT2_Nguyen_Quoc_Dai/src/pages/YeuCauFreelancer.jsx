import { useEffect, useState } from "react";

// ========================================
// Freelancer xem yêu cầu khách hàng
// ========================================

function YeuCauFreelancer({
  setPage,
  currentUser,
}) {
  const [requests, setRequests] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [acceptingId, setAcceptingId] =
    useState(null);

  // ========================================
  // Lấy danh sách yêu cầu
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
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/requests",
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
            "Không thể tải danh sách yêu cầu."
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
  // Nhận yêu cầu
  // ========================================

  async function handleAccept(requestId) {
    setError("");
    setMessage("");
    setAcceptingId(requestId);

    try {

      const response = await fetch(
        `https://nguyen-quoc-dai-24ct2.onrender.com/api/requests/${requestId}/accept`,
        {
          method: "PUT",

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
            "Không thể nhận yêu cầu."
        );

        return;
      }

      setMessage(
        data.message ||
          "Nhận yêu cầu thành công!"
      );

      // Tải lại danh sách
      await loadRequests();

    } catch (err) {

      console.error(
        "Lỗi nhận yêu cầu:",
        err
      );

      setError(
        "Không thể kết nối đến máy chủ."
      );

    } finally {
      setAcceptingId(null);
    }
  }

  // ========================================
  // Kiểm tra quyền
  // ========================================

  if (!currentUser) {
    return (
      <main className="page">

        <div className="container">

          <div className="empty-services">

            <div>
              🔒
            </div>

            <h3>
              Bạn chưa đăng nhập
            </h3>

            <p>
              Vui lòng đăng nhập bằng tài khoản
              Freelancer.
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

  if (
    currentUser.role !==
    "Freelancer"
  ) {
    return (
      <main className="page">

        <div className="container">

          <div className="empty-services">

            <div>
              ⚠️
            </div>

            <h3>
              Không có quyền truy cập
            </h3>

            <p>
              Chỉ Freelancer mới có thể
              xem các yêu cầu này.
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
  // Loading
  // ========================================

  if (loading) {
    return (
      <main className="page">

        <div className="container">

          <div className="page-title">

            <p className="eyebrow">
              FREELANCER
            </p>

            <h1>
              Yêu cầu khách hàng
            </h1>

          </div>

          <div className="empty-services">

            <div>
              ⏳
            </div>

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
            FREELANCER
          </p>

          <h1>
            Yêu cầu khách hàng
          </h1>

          <p>
            Xem các công việc khách hàng đang
            tìm Freelancer và nhận yêu cầu phù hợp.
          </p>

        </div>


        {/* ========================================
            THÔNG BÁO
        ======================================== */}

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


        {/* ========================================
            KHÔNG CÓ YÊU CẦU
        ======================================== */}

        {requests.length === 0 ? (

          <div className="empty-services">

            <div>
              📭
            </div>

            <h3>
              Hiện chưa có yêu cầu mới
            </h3>

            <p>
              Khách hàng chưa đăng yêu cầu
              hoặc các yêu cầu đã được nhận.
            </p>

          </div>

        ) : (

          <div className="freelancer-request-list">

            {requests.map((request) => (

              <div
                className="freelancer-request-card"
                key={request.MaYeuCau}
              >

                {/* Icon */}

                <div className="freelancer-request-icon">
                  📝
                </div>


                {/* Nội dung */}

                <div className="freelancer-request-content">

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


                  <div className="freelancer-request-meta">

                    <span>
                      👤{" "}
                      {request.TenKhachHang}
                    </span>

                    <span>
                      📂{" "}
                      {request.DanhMuc}
                    </span>

                    <span>
                      💰{" "}
                      {Number(
                        request.NganSach
                      ).toLocaleString(
                        "vi-VN"
                      )}
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


                {/* Trạng thái + nhận */}

                <div className="freelancer-request-action">

                  <span className="status pending">
                    Đang tìm Freelancer
                  </span>

                  <button
                    className="primary-btn"
                    onClick={() =>
                      handleAccept(
                        request.MaYeuCau
                      )
                    }
                    disabled={
                      acceptingId ===
                      request.MaYeuCau
                    }
                  >
                    {acceptingId ===
                    request.MaYeuCau
                      ? "Đang nhận..."
                      : "Nhận đơn"}
                  </button>

                </div>

              </div>

            ))}

          </div>

        )}

      </div>

    </main>
  );
}

export default YeuCauFreelancer;