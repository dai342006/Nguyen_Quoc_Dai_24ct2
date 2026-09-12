function Header({
  page,
  setPage,
  currentUser,
  onLogout,
}) {

  // =========================
  // Đăng xuất
  // =========================
  function handleLogout() {
    localStorage.removeItem(
      "skillhub_current_user"
    );

    sessionStorage.removeItem(
      "skillhub_current_user"
    );

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
          onClick={() =>
            setPage("home")
          }
        >
          Skill<span>Hub</span>
        </button>


        {/* =========================
            MENU
        ========================= */}
        <nav className="nav">

          {/* Trang chủ */}
          <button
            className={
              page === "home"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("home")
            }
          >
            Trang chủ
          </button>


          {/* Dịch vụ */}
          <button
            className={
              page === "services"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("services")
            }
          >
            Dịch vụ
          </button>


          {/* =================================
              CHỈ KHÁCH HÀNG MỚI THẤY
          ================================= */}
          {currentUser?.role ===
            "KhachHang" && (
            <>

              {/* Đăng yêu cầu */}
              <button
                className={
                  page === "create-request"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage(
                    "create-request"
                  )
                }
              >
                Đăng yêu cầu
              </button>


              {/* Yêu cầu của tôi */}
              <button
                className={
                  page === "my-requests"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage(
                    "my-requests"
                  )
                }
              >
                Yêu cầu của tôi
              </button>

            </>
          )}


          {/* =================================
              CHỈ FREELANCER MỚI THẤY
          ================================= */}
          {currentUser?.role ===
            "Freelancer" && (
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
                  page ===
                  "manage-services"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage(
                    "manage-services"
                  )
                }
              >
                Quản lý dịch vụ
              </button>


              {/* Yêu cầu khách hàng */}
              <button
                className={
                  page ===
                  "freelancer-requests"
                    ? "active"
                    : ""
                }
                onClick={() =>
                  setPage(
                    "freelancer-requests"
                  )
                }
              >
                Yêu cầu khách hàng
              </button>

            </>
          )}


          {/* =================================
              CHỈ ADMIN MỚI THẤY
          ================================= */}
          {currentUser?.role ===
            "Admin" && (

            <button
              className={
                page === "admin"
                  ? "active"
                  : ""
              }
              onClick={() =>
                setPage("admin")
              }
            >
              Quản trị
            </button>

          )}


          {/* Đơn hàng */}
          <button
            className={
              page === "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              setPage("orders")
            }
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

                <span>
                  Xin chào
                </span>

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

              {/* Đăng nhập */}
              <button
                className="login-btn"
                onClick={() =>
                  setPage("login")
                }
              >
                Đăng nhập
              </button>


              {/* Đăng ký */}
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