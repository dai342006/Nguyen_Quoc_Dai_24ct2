import { useEffect, useState } from "react";

function ManageServices({ currentUser }) {
  const [services, setServices] = useState([]);

  const [form, setForm] = useState({
    TenDichVu: "",
    MoTa: "",
    DanhMuc: "Lập trình",
    Gia: "",
  });

  const [editingId, setEditingId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ========================================
  // Kiểm tra tài khoản hiện tại
  // ========================================
  function checkUser() {
    if (!currentUser) {
      setError("Bạn chưa đăng nhập.");
      return false;
    }

    if (!currentUser.id) {
      setError(
        "Không tìm thấy mã người dùng. Vui lòng đăng xuất và đăng nhập lại."
      );
      console.log("currentUser:", currentUser);
      return false;
    }

    if (currentUser.role !== "Freelancer") {
      setError(
        "Tài khoản này không có quyền quản lý dịch vụ."
      );
      return false;
    }

    return true;
  }

  // ========================================
  // Lấy danh sách dịch vụ
  // ========================================
  async function loadServices() {
    setError("");

    if (!checkUser()) {
      return;
    }

    try {
      const response = await fetch(
        "http://localhost:5000/api/services/my",
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(currentUser.id),
          },
        }
      );

      const data = await response.json();

      console.log("GET /api/services/my:", data);

      if (!response.ok) {
        setError(
          data.message || "Không thể tải danh sách dịch vụ."
        );
        return;
      }

      setServices(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Lỗi loadServices:", err);

      setError(
        "Không thể kết nối đến máy chủ. Hãy kiểm tra backend đang chạy tại http://localhost:5000."
      );
    }
  }

  // ========================================
  // Khi mở trang
  // ========================================
  useEffect(() => {
    loadServices();
  }, [currentUser]);

  // ========================================
  // Thay đổi dữ liệu form
  // ========================================
  function handleChange(e) {
    const { name, value } = e.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));

    setMessage("");
    setError("");
  }

  // ========================================
  // Kiểm tra form
  // ========================================
  function validateForm() {
    if (!form.TenDichVu.trim()) {
      setError("Vui lòng nhập tên dịch vụ.");
      return false;
    }

    if (!form.DanhMuc.trim()) {
      setError("Vui lòng chọn danh mục.");
      return false;
    }

    if (!form.Gia || Number(form.Gia) <= 0) {
      setError("Vui lòng nhập giá dịch vụ hợp lệ.");
      return false;
    }

    return true;
  }

  // ========================================
  // Thêm / sửa dịch vụ
  // ========================================
  async function handleSubmit(e) {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!checkUser()) {
      return;
    }

    if (!validateForm()) {
      return;
    }

    setLoading(true);

    try {
      const url = editingId
        ? `http://localhost:5000/api/services/${editingId}`
        : "http://localhost:5000/api/services";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
          "X-User-Id": String(currentUser.id),
        },
        body: JSON.stringify({
          TenDichVu: form.TenDichVu.trim(),
          MoTa: form.MoTa.trim(),
          DanhMuc: form.DanhMuc,
          Gia: Number(form.Gia),
        }),
      });

      const data = await response.json();

      console.log(`${method} ${url}:`, data);

      if (!response.ok) {
        setError(
          data.message || "Thao tác thất bại."
        );
        return;
      }

      setMessage(
        data.message ||
          (editingId
            ? "Cập nhật dịch vụ thành công!"
            : "Thêm dịch vụ thành công!")
      );

      resetForm();

      await loadServices();
    } catch (err) {
      console.error("Lỗi handleSubmit:", err);

      setError(
        "Không thể kết nối đến máy chủ. Hãy kiểm tra backend."
      );
    } finally {
      setLoading(false);
    }
  }

  // ========================================
  // Chỉnh sửa dịch vụ
  // ========================================
  function handleEdit(service) {
    setEditingId(service.MaDichVu);

    setForm({
      TenDichVu: service.TenDichVu || "",
      MoTa: service.MoTa || "",
      DanhMuc: service.DanhMuc || "Lập trình",
      Gia: service.Gia ?? "",
    });

    setMessage("");
    setError("");

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }

  // ========================================
  // Xóa dịch vụ
  // ========================================
  async function handleDelete(id) {
    if (!checkUser()) {
      return;
    }

    const confirmDelete = window.confirm(
      "Bạn có chắc chắn muốn xóa dịch vụ này?"
    );

    if (!confirmDelete) {
      return;
    }

    setMessage("");
    setError("");

    try {
      const response = await fetch(
        `http://localhost:5000/api/services/${id}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
            "X-User-Id": String(currentUser.id),
          },
        }
      );

      const data = await response.json();

      console.log("DELETE:", data);

      if (!response.ok) {
        setError(
          data.message || "Xóa dịch vụ thất bại."
        );
        return;
      }

      setMessage(
        data.message || "Xóa dịch vụ thành công!"
      );

      await loadServices();
    } catch (err) {
      console.error("Lỗi handleDelete:", err);

      setError(
        "Không thể kết nối đến máy chủ."
      );
    }
  }

  // ========================================
  // Reset form
  // ========================================
  function resetForm() {
    setForm({
      TenDichVu: "",
      MoTa: "",
      DanhMuc: "Lập trình",
      Gia: "",
    });

    setEditingId(null);
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
            Quản lý dịch vụ
          </h1>

          <p>
            Xin chào{" "}
            <strong>
              {currentUser?.name || "Freelancer"}
            </strong>
            . Hãy quản lý các dịch vụ của bạn tại đây.
          </p>
        </div>

        {/* ========================================
            FORM
        ======================================== */}
        <section className="manage-service-form">

          <h2>
            {editingId
              ? "Chỉnh sửa dịch vụ"
              : "Thêm dịch vụ mới"}
          </h2>

          <form onSubmit={handleSubmit}>

            {/* Tên */}
            <div>
              <label htmlFor="TenDichVu">
                Tên dịch vụ
              </label>

              <input
                id="TenDichVu"
                name="TenDichVu"
                value={form.TenDichVu}
                onChange={handleChange}
                placeholder="Ví dụ: Thiết kế website ReactJS"
              />
            </div>

            {/* Danh mục */}
            <div>
              <label htmlFor="DanhMuc">
                Danh mục
              </label>

              <select
                id="DanhMuc"
                name="DanhMuc"
                value={form.DanhMuc}
                onChange={handleChange}
              >
                <option value="Lập trình">
                  Lập trình
                </option>

                <option value="Thiết kế">
                  Thiết kế
                </option>

                <option value="Marketing">
                  Marketing
                </option>

                <option value="Viết nội dung">
                  Viết nội dung
                </option>

                <option value="Dịch vụ khác">
                  Dịch vụ khác
                </option>
              </select>
            </div>

            {/* Giá */}
            <div>
              <label htmlFor="Gia">
                Giá dịch vụ (VNĐ)
              </label>

              <input
                id="Gia"
                type="number"
                name="Gia"
                value={form.Gia}
                onChange={handleChange}
                placeholder="300000"
                min="1"
              />
            </div>

            {/* Mô tả */}
            <div>
              <label htmlFor="MoTa">
                Mô tả
              </label>

              <textarea
                id="MoTa"
                name="MoTa"
                value={form.MoTa}
                onChange={handleChange}
                placeholder="Mô tả chi tiết về dịch vụ..."
                rows="5"
              />
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

            {/* Nút */}
            <div className="service-form-actions">

              <button
                type="submit"
                className="primary-btn"
                disabled={loading}
              >
                {loading
                  ? "Đang xử lý..."
                  : editingId
                  ? "Lưu thay đổi"
                  : "Thêm dịch vụ"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="auth-outline-btn"
                  onClick={resetForm}
                >
                  Hủy chỉnh sửa
                </button>
              )}

            </div>

          </form>
        </section>

        {/* ========================================
            DANH SÁCH DỊCH VỤ
        ======================================== */}
        <section className="my-services">

          <div className="section-heading">

            <div>
              <p className="eyebrow">
                DANH SÁCH
              </p>

              <h2>
                Dịch vụ của tôi
              </h2>
            </div>

            <span>
              {services.length} dịch vụ
            </span>

          </div>

          {services.length === 0 ? (

            <div className="empty-services">

              <div>📦</div>

              <h3>
                Chưa có dịch vụ
              </h3>

              <p>
                Hãy tạo dịch vụ đầu tiên của bạn.
              </p>

            </div>

          ) : (

            <div className="service-management-grid">

              {services.map((service) => (

                <article
                  className="management-service-card"
                  key={service.MaDichVu}
                >

                  <div className="management-service-top">

                    <span className="service-category">
                      {service.DanhMuc}
                    </span>

                    <span className="service-status">
                      {service.TrangThai}
                    </span>

                  </div>

                  <h3>
                    {service.TenDichVu}
                  </h3>

                  <p>
                    {service.MoTa ||
                      "Chưa có mô tả."}
                  </p>

                  <strong className="service-price">
                    {Number(
                      service.Gia
                    ).toLocaleString("vi-VN")}{" "}
                    đ
                  </strong>

                  <div className="management-actions">

                    <button
                      type="button"
                      className="edit-btn"
                      onClick={() =>
                        handleEdit(service)
                      }
                    >
                      Sửa
                    </button>

                    <button
                      type="button"
                      className="delete-btn"
                      onClick={() =>
                        handleDelete(
                          service.MaDichVu
                        )
                      }
                    >
                      Xóa
                    </button>

                  </div>

                </article>

              ))}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}

export default ManageServices;