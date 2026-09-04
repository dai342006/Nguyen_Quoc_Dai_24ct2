import { useState } from "react";

function Register({ setPage }) {
  const [form, setForm] = useState({
    HoTen: "",
    Email: "",
    MatKhau: "",
    XacNhanMatKhau: "",
    VaiTro: "KhachHang",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function handleChange(e) {
    const { name, value } = e.target;

    setForm((old) => ({
      ...old,
      [name]: value,
    }));

    setErrors((old) => ({
      ...old,
      [name]: "",
    }));

    setServerMessage("");
  }

  function validate() {
    const e = {};

    const name = form.HoTen.trim();
    const email = form.Email.trim();

    if (!name) {
      e.HoTen = "Vui lòng nhập họ và tên.";
    } else if (name.length < 2) {
      e.HoTen = "Họ và tên phải có ít nhất 2 ký tự.";
    }

    if (!email) {
      e.Email = "Vui lòng nhập email.";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      e.Email = "Email không đúng định dạng.";
    }

    if (!form.MatKhau) {
      e.MatKhau = "Vui lòng nhập mật khẩu.";
    } else if (form.MatKhau.length < 6) {
      e.MatKhau = "Mật khẩu phải có ít nhất 6 ký tự.";
    }

    if (!form.XacNhanMatKhau) {
      e.XacNhanMatKhau = "Vui lòng nhập lại mật khẩu.";
    } else if (form.MatKhau !== form.XacNhanMatKhau) {
      e.XacNhanMatKhau = "Mật khẩu xác nhận không khớp.";
    }

    if (!form.VaiTro) {
      e.VaiTro = "Vui lòng chọn vai trò.";
    }

    if (!acceptedTerms) {
      e.AcceptedTerms = "Bạn cần đồng ý với điều khoản sử dụng.";
    }

    setErrors(e);

    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();

    setServerMessage("");

    if (!validate()) return;

    setIsLoading(true);

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            HoTen: form.HoTen.trim(),
            Email: form.Email.trim().toLowerCase(),
            MatKhau: form.MatKhau,
            VaiTro: form.VaiTro,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setServerMessage(
          data.message || "Đăng ký thất bại."
        );
        return;
      }

      alert(
        `Đăng ký thành công với vai trò ${
          form.VaiTro === "Freelancer"
            ? "Freelancer"
            : "Khách hàng"
        }!`
      );

      setPage("login");
    } catch (error) {
      console.error(error);

      setServerMessage(
        "Không thể kết nối đến máy chủ. Hãy kiểm tra backend có đang chạy không."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        {/* Logo */}
        <div className="auth-brand">
          Skill<span>Hub</span>
        </div>

        {/* Tiêu đề */}
        <div className="auth-heading">
          <p className="auth-eyebrow">
            THAM GIA SKILLHUB
          </p>

          <h1>Tạo tài khoản</h1>

          <p>
            Đăng ký để tìm kiếm và thuê các kỹ năng số
            hoặc cung cấp dịch vụ của bạn.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate>

          {/* Họ tên */}
          <label htmlFor="HoTen">
            Họ và tên
          </label>

          <input
            id="HoTen"
            name="HoTen"
            value={form.HoTen}
            onChange={handleChange}
            className={
              errors.HoTen ? "input-error" : ""
            }
            placeholder="Nguyễn Văn A"
            autoComplete="name"
          />

          {errors.HoTen && (
            <small className="field-error">
              {errors.HoTen}
            </small>
          )}

          {/* Email */}
          <label htmlFor="Email">
            Email
          </label>

          <input
            id="Email"
            name="Email"
            type="email"
            value={form.Email}
            onChange={handleChange}
            className={
              errors.Email ? "input-error" : ""
            }
            placeholder="you@example.com"
            autoComplete="email"
          />

          {errors.Email && (
            <small className="field-error">
              {errors.Email}
            </small>
          )}

          {/* Mật khẩu */}
          <label htmlFor="MatKhau">
            Mật khẩu
          </label>

          <div className="password-field">
            <input
              id="MatKhau"
              name="MatKhau"
              type={
                showPassword ? "text" : "password"
              }
              value={form.MatKhau}
              onChange={handleChange}
              className={
                errors.MatKhau
                  ? "input-error"
                  : ""
              }
              placeholder="Ít nhất 6 ký tự"
              autoComplete="new-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowPassword((v) => !v)
              }
            >
              {showPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {errors.MatKhau && (
            <small className="field-error">
              {errors.MatKhau}
            </small>
          )}

          {/* Xác nhận mật khẩu */}
          <label htmlFor="XacNhanMatKhau">
            Xác nhận mật khẩu
          </label>

          <div className="password-field">
            <input
              id="XacNhanMatKhau"
              name="XacNhanMatKhau"
              type={
                showConfirmPassword
                  ? "text"
                  : "password"
              }
              value={form.XacNhanMatKhau}
              onChange={handleChange}
              className={
                errors.XacNhanMatKhau
                  ? "input-error"
                  : ""
              }
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
            />

            <button
              type="button"
              className="password-toggle"
              onClick={() =>
                setShowConfirmPassword(
                  (v) => !v
                )
              }
            >
              {showConfirmPassword ? "Ẩn" : "Hiện"}
            </button>
          </div>

          {errors.XacNhanMatKhau && (
            <small className="field-error">
              {errors.XacNhanMatKhau}
            </small>
          )}

          {/* Chọn vai trò */}
          <label>
            Bạn muốn đăng ký với vai trò
          </label>

          <div className="role-options">

            {/* Khách hàng */}
            <label className="role-option">
              <input
                type="radio"
                name="VaiTro"
                value="KhachHang"
                checked={
                  form.VaiTro === "KhachHang"
                }
                onChange={handleChange}
              />

              <span>
                🛒 Khách hàng
              </span>
            </label>

            {/* Freelancer */}
            <label className="role-option">
              <input
                type="radio"
                name="VaiTro"
                value="Freelancer"
                checked={
                  form.VaiTro === "Freelancer"
                }
                onChange={handleChange}
              />

              <span>
                💼 Freelancer
              </span>
            </label>

          </div>

          {errors.VaiTro && (
            <small className="field-error">
              {errors.VaiTro}
            </small>
          )}

          {/* Điều khoản */}
          <label className="terms-row">
            <input
              type="checkbox"
              checked={acceptedTerms}
              onChange={(e) => {
                setAcceptedTerms(
                  e.target.checked
                );

                setErrors((old) => ({
                  ...old,
                  AcceptedTerms: "",
                }));
              }}
            />

            <span>
              Tôi đồng ý với điều khoản sử dụng.
            </span>
          </label>

          {errors.AcceptedTerms && (
            <small className="field-error">
              {errors.AcceptedTerms}
            </small>
          )}

          {/* Thông báo server */}
          {serverMessage && (
            <div className="form-message error">
              {serverMessage}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="primary-btn full"
            disabled={isLoading}
          >
            {isLoading
              ? "Đang tạo tài khoản..."
              : "Tạo tài khoản"}
          </button>

        </form>

        {/* Đăng nhập */}
        <div className="auth-divider">
          <span>Đã có tài khoản?</span>
        </div>

        <button
          className="auth-outline-btn"
          onClick={() => setPage("login")}
        >
          Đăng nhập
        </button>

      </div>
    </main>
  );
}

export default Register;