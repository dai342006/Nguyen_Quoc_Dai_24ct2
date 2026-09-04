import { useState } from "react";

function Login({ setPage, onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [errors, setErrors] = useState({});
  const [serverMessage, setServerMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  function validate() {
    const e = {};
    const cleanEmail = email.trim();
    if (!cleanEmail) e.email = "Vui lòng nhập email.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) e.email = "Email không đúng định dạng.";
    if (!password) e.password = "Vui lòng nhập mật khẩu.";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setServerMessage("");
    if (!validate()) return;
    setIsLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Email: email.trim().toLowerCase(), MatKhau: password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setServerMessage(data.message || "Đăng nhập thất bại.");
        return;
      }
      localStorage.removeItem("skillhub_current_user");
      sessionStorage.removeItem("skillhub_current_user");
      const storage = remember ? localStorage : sessionStorage;
      storage.setItem("skillhub_current_user", JSON.stringify(data.user));
      onLoginSuccess(data.user);
      alert(`Đăng nhập thành công! Xin chào ${data.user.name}.`);
      setPage("home");
    } catch (error) {
      console.error(error);
      setServerMessage("Không thể kết nối đến máy chủ. Hãy kiểm tra backend có đang chạy không.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Skill<span>Hub</span></div>
        <div className="auth-heading">
          <p className="auth-eyebrow">DIGITAL SKILL MARKETPLACE</p>
          <h1>Chào mừng trở lại</h1>
          <p>Đăng nhập để tiếp tục sử dụng SkillHub.</p>
        </div>

        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="login-email">Email</label>
          <input id="login-email" type="email" value={email} onChange={(e) => { setEmail(e.target.value); setErrors((old) => ({ ...old, email: "" })); setServerMessage(""); }} className={errors.email ? "input-error" : ""} placeholder="you@example.com" autoComplete="email" />
          {errors.email && <small className="field-error">{errors.email}</small>}

          <label htmlFor="login-password">Mật khẩu</label>
          <div className="password-field">
            <input id="login-password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => { setPassword(e.target.value); setErrors((old) => ({ ...old, password: "" })); setServerMessage(""); }} className={errors.password ? "input-error" : ""} placeholder="Nhập mật khẩu" autoComplete="current-password" />
            <button type="button" className="password-toggle" onClick={() => setShowPassword((v) => !v)}>{showPassword ? "Ẩn" : "Hiện"}</button>
          </div>
          {errors.password && <small className="field-error">{errors.password}</small>}

          <div className="login-options">
            <label className="terms-row remember-row">
              <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
              <span>Ghi nhớ đăng nhập</span>
            </label>
            <button type="button" className="link-btn" onClick={() => setServerMessage("Tính năng khôi phục mật khẩu sẽ được bổ sung sau.")}>Quên mật khẩu?</button>
          </div>

          {serverMessage && <div className="form-message error">{serverMessage}</div>}

          <button type="submit" className="primary-btn full" disabled={isLoading}>
            {isLoading ? "Đang đăng nhập..." : "Đăng nhập"}
          </button>
        </form>

        <div className="auth-divider"><span>Chưa có tài khoản?</span></div>
        <button className="auth-outline-btn" onClick={() => setPage("register")}>Tạo tài khoản mới</button>
      </div>
    </main>
  );
}

export default Login;
