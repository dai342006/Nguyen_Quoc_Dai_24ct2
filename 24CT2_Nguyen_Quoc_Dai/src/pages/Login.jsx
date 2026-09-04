// Trang đăng nhập
function Login({ setPage }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Skill<span>Hub</span></div>
        <h1>Chào mừng trở lại</h1>
        <p>Đăng nhập để tiếp tục sử dụng SkillHub.</p>

        <label>Email</label>
        <input type="email" placeholder="you@example.com" />

        <label>Mật khẩu</label>
        <input type="password" placeholder="••••••••" />

        <div className="form-row">
          <label className="checkbox"><input type="checkbox" /> Ghi nhớ</label>
          <button className="link-btn">Quên mật khẩu?</button>
        </div>

        <button className="primary-btn full" onClick={() => setPage("home")}>
          Đăng nhập
        </button>

        <p className="auth-switch">
          Chưa có tài khoản?{" "}
          <button className="link-btn" onClick={() => setPage("register")}>
            Đăng ký ngay
          </button>
        </p>
      </div>
    </main>
  );
}

export default Login;
