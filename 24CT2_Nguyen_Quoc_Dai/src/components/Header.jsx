function Header({ page, setPage, currentUser, onLogout }) {
  // =========================
  // Đăng xuất
  // =========================
  function handleLogout() {
    localStorage.removeItem("skillhub_current_user");
    sessionStorage.removeItem("skillhub_current_user");

    onLogout();
    setPage("home");
  }

  return (
    <header className="header">
      <div className="container header-inner">

        {/* =========================
            LOGO
        ========================= */}
        <button
          className="logo"
          onClick={() => setPage("home")}
        >
          Skill<span>Hub</span>
        </button>

        {/* =========================
            MENU
        ========================= */}
        <nav className="nav">

          {/* Trang chủ */}
          <button
            className={page === "home" ? "active" : ""}
            onClick={() => setPage("home")}
          >
            Trang chủ
          </button>

          {/* Dịch vụ */}
          <button
            className={
              page === "services" ? "active" : ""
            }
            onClick={() => setPage("services")}
          >
            Dịch vụ
          </button>

          {/* =================================
              CHỈ FREELANCER MỚI THẤY
          ================================= */}
          {currentUser?.role === "Freelancer" && (
            <>
              {/* Hồ sơ Freelancer */}
              <button
                className={
                  page === "freelancer"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage("freelancer")
                }
              >
                Freelancer
              </button>

              {/* Quản lý dịch vụ */}
              <button
                className={
                  page === "manage-services"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage("manage-services")
                }
              >
                Quản lý dịch vụ
              </button>
            </>
          )}

          {/* Đơn hàng */}
          <button
            className={
              page === "orders" ? "active" : ""
            }
            onClick={() => setPage("orders")}
          >
            Đơn hàng
          </button>

        </nav>

        {/* =========================
            TÀI KHOẢN
        ========================= */}
        <div className="header-actions">

          {currentUser ? (
            <div className="user-menu">

              <div className="user-greeting">
                <span>Xin chào</span>

                <strong>
                  {currentUser.name}
                </strong>
              </div>

              <button
                className="logout-btn"
                onClick={handleLogout}
              >
                Đăng xuất
              </button>

            </div>
          ) : (
            <>
              <button
                className="login-btn"
                onClick={() =>
                  setPage("login")
                }
              >
                Đăng nhập
              </button>

              <button
                className="register-btn"
                onClick={() =>
                  setPage("register")
                }
              >
                Đăng ký
              </button>
            </>
          )}

        </div>

      </div>
    </header>
  );
}

export default Header;