// Thanh menu đầu trang
function Header({ page, setPage }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <button className="logo" onClick={() => setPage("home")}>
          Skill<span>Hub</span>
        </button>

        <nav className="nav">
          <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>Trang chủ</button>
          <button className={page === "services" ? "active" : ""} onClick={() => setPage("services")}>Dịch vụ</button>
          <button className={page === "freelancer" ? "active" : ""} onClick={() => setPage("freelancer")}>Freelancer</button>
          <button className={page === "orders" ? "active" : ""} onClick={() => setPage("orders")}>Đơn hàng</button>
        </nav>

        <div className="header-actions">
          <button className="login-btn" onClick={() => setPage("login")}>Đăng nhập</button>
          <button className="register-btn" onClick={() => setPage("register")}>Đăng ký</button>
        </div>
      </div>
    </header>
  );
}

export default Header;
