import { useState } from "react";

// ========================================
// Trang đăng yêu cầu tìm Freelancer
// ========================================

function DangYeuCau({
  setPage,
  currentUser,
}) {
  const [form, setForm] = useState({
    TieuDe: "",
    MoTa: "",
    DanhMuc: "Lap trinh",
    NganSach: "",
  });

  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ========================================
  // Kiểm tra tài khoản
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
              Vui lòng đăng nhập bằng tài khoản
              Khách hàng để đăng yêu cầu.
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
              Chỉ Khách hàng mới có thể đăng yêu cầu.
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
  // Thay đổi dữ liệu form
  // ========================================

  function handleChange(e) {
    const {
      name,
      value,
    } = e.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));

    setError("");
    setMessage("");
  }

  // ========================================
  // Kiểm tra dữ liệu
  // ========================================

  function validate() {
    if (!form.TieuDe.trim()) {
      setError(
        "Vui lòng nhập tiêu đề yêu cầu."
      );
      return false;
    }

    if (form.TieuDe.trim().length < 5) {
      setError(
        "Tiêu đề phải có ít nhất 5 ký tự."
      );
      return false;
    }

    if (!form.MoTa.trim()) {
      setError(
        "Vui lòng nhập mô tả yêu cầu."
      );
      return false;
    }

    if (!form.DanhMuc) {
      setError(
        "Vui lòng chọn danh mục."
      );
      return false;
    }

    if (
      form.NganSach === "" ||
      Number(form.NganSach) <= 0
    ) {
      setError(
        "Ngân sách phải lớn hơn 0."
      );
      return false;
    }

    return true;
  }

  // ========================================
  // Đăng yêu cầu
  // ========================================

  async function handleSubmit(e) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!validate()) {
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/requests",
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
            TieuDe:
              form.TieuDe.trim(),

            MoTa:
              form.MoTa.trim(),

            DanhMuc:
              form.DanhMuc,

            NganSach:
              Number(form.NganSach),
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        setError(
          data.message ||
            "Không thể đăng yêu cầu."
        );
        return;
      }

      setMessage(
        "Đăng yêu cầu thành công!"
      );

      setForm({
        TieuDe: "",
        MoTa: "",
        DanhMuc: "Lap trinh",
        NganSach: "",
      });

    } catch (error) {

      console.error(
        "Lỗi đăng yêu cầu:",
        error
      );

      setError(
        "Không thể kết nối đến máy chủ."
      );

    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="page">

      <div className="container">

        {/* ========================================
            TIÊU ĐỀ
        ======================================== */}

        <div className="page-title">

          <p className="eyebrow">
            TÌM FREELANCER
          </p>

          <h1>
            Đăng yêu cầu
          </h1>

          <p>
            Hãy mô tả công việc bạn cần.
            Freelancer sẽ xem và nhận yêu cầu phù hợp.
          </p>

        </div>


        {/* ========================================
            FORM
        ======================================== */}

        <div className="request-layout">

          <section className="request-card">

            <form
              onSubmit={handleSubmit}
              noValidate
            >

              {/* Tiêu đề */}

              <label htmlFor="TieuDe">
                Tiêu đề yêu cầu
              </label>

              <input
                id="TieuDe"
                name="TieuDe"
                value={form.TieuDe}
                onChange={handleChange}
                placeholder="Ví dụ: Cần thiết kế logo cho cửa hàng"
                maxLength={200}
              />


              {/* Mô tả */}

              <label htmlFor="MoTa">
                Mô tả công việc
              </label>

              <textarea
                id="MoTa"
                name="MoTa"
                value={form.MoTa}
                onChange={handleChange}
                placeholder="Mô tả chi tiết công việc, yêu cầu, thời gian..."
                rows={7}
              />


              {/* Danh mục */}

              <label htmlFor="DanhMuc">
                Danh mục
              </label>

              <select
                id="DanhMuc"
                name="DanhMuc"
                value={form.DanhMuc}
                onChange={handleChange}
              >
                <option value="Lap trinh">
                  Lập trình
                </option>

                <option value="Thiet ke">
                  Thiết kế
                </option>

                <option value="Video">
                  Video
                </option>

                <option value="Noi dung">
                  Nội dung
                </option>

                <option value="Marketing">
                  Marketing
                </option>

                <option value="Mang xa hoi">
                  Mạng xã hội
                </option>
              </select>


              {/* Ngân sách */}

              <label htmlFor="NganSach">
                Ngân sách dự kiến
              </label>

              <div className="request-price">

                <input
                  id="NganSach"
                  name="NganSach"
                  type="number"
                  min="1"
                  value={form.NganSach}
                  onChange={handleChange}
                  placeholder="500000"
                />

                <span>
                  VNĐ
                </span>

              </div>


              {/* Thông báo */}

              {error && (
                <div className="form-message error">
                  {error}
                </div>
              )}

              {message && (
                <div className="form-message success">
                  {message}
                </div>
              )}


              {/* Nút */}

              <div className="request-actions">

                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() =>
                    setPage("home")
                  }
                  disabled={isLoading}
                >
                  Hủy
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={isLoading}
                >
                  {isLoading
                    ? "Đang đăng..."
                    : "Đăng yêu cầu"}
                </button>

              </div>

            </form>

          </section>


          {/* ========================================
              GỢI Ý
          ======================================== */}

          <aside className="request-help">

            <div className="request-help-icon">
              💡
            </div>

            <h3>
              Mẹo đăng yêu cầu
            </h3>

            <p>
              Mô tả càng chi tiết, Freelancer
              càng dễ hiểu công việc bạn cần.
            </p>

            <div className="request-tip">

              <strong>
                ✓ Tiêu đề rõ ràng
              </strong>

              <span>
                Nêu chính xác công việc cần làm.
              </span>

            </div>

            <div className="request-tip">

              <strong>
                ✓ Mô tả cụ thể
              </strong>

              <span>
                Nêu yêu cầu và kết quả mong muốn.
              </span>

            </div>

            <div className="request-tip">

              <strong>
                ✓ Ngân sách hợp lý
              </strong>

              <span>
                Đưa ra ngân sách dự kiến cho công việc.
              </span>

            </div>

          </aside>

        </div>

      </div>

    </main>
  );
}

export default DangYeuCau;