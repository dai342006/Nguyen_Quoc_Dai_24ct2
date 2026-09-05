import { useEffect, useState } from "react";

// =========================
// Components
// =========================
import Header from "./components/Header";
import Footer from "./components/Footer";

// =========================
// Pages
// =========================
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Freelancer from "./pages/Freelancer";
import Orders from "./pages/Orders";
import ManageServices from "./pages/ManageServices";

// =========================
// Data
// =========================
import services from "./data/services";

// =========================
// CSS
// =========================
import "./styles/global.css";
import "./styles/header.css";
import "./styles/home.css";
import "./styles/services.css";
import "./styles/detail.css";
import "./styles/auth.css";
import "./styles/freelancer.css";
import "./styles/orders.css";

// =========================
// App
// =========================
function App() {
  // Trang hiện tại
  const [page, setPage] = useState("home");

  // Dịch vụ đang được chọn
  const [selectedService, setSelectedService] = useState(
    services[0]
  );

  // Người dùng hiện tại
  const [currentUser, setCurrentUser] = useState(null);

  // ========================================
  // Kiểm tra đăng nhập khi mở website
  // ========================================
  useEffect(() => {
    const saved =
      localStorage.getItem("skillhub_current_user") ||
      sessionStorage.getItem("skillhub_current_user");

    if (saved) {
      try {
        setCurrentUser(JSON.parse(saved));
      } catch {
        localStorage.removeItem("skillhub_current_user");
        sessionStorage.removeItem("skillhub_current_user");
      }
    }
  }, []);

  // ========================================
  // Kiểm tra quyền truy cập
  // ========================================
  function checkPermission(targetPage) {
    // Các trang yêu cầu đăng nhập
    const protectedPages = [
      "orders",
      "freelancer",
      "manage-services",
    ];

    // Nếu không phải trang cần đăng nhập
    if (!protectedPages.includes(targetPage)) {
      return true;
    }

    // Chưa đăng nhập
    if (!currentUser) {
      alert(
        "Vui lòng đăng nhập để sử dụng chức năng này."
      );

      setPage("login");

      return false;
    }

    // ========================================
    // Freelancer
    // ========================================

    // Chỉ Freelancer được vào hồ sơ Freelancer
    if (targetPage === "freelancer") {
      if (currentUser.role === "Freelancer") {
        return true;
      }

      alert(
        "Chỉ Freelancer mới có thể truy cập trang này."
      );

      setPage("home");

      return false;
    }

    // Chỉ Freelancer được quản lý dịch vụ
    if (targetPage === "manage-services") {
      if (currentUser.role === "Freelancer") {
        return true;
      }

      alert(
        "Chỉ Freelancer mới có quyền quản lý dịch vụ."
      );

      setPage("home");

      return false;
    }

    // ========================================
    // Đơn hàng
    // ========================================

    if (targetPage === "orders") {
      if (
        currentUser.role === "KhachHang" ||
        currentUser.role === "Freelancer"
      ) {
        return true;
      }
    }

    // ========================================
    // Không có quyền
    // ========================================

    alert(
      "Bạn không có quyền truy cập chức năng này."
    );

    setPage("home");

    return false;
  }

  // ========================================
  // Hàm chuyển trang
  // ========================================
  function navigateTo(targetPage) {
    if (checkPermission(targetPage)) {
      setPage(targetPage);
    }
  }

  // ========================================
  // Hiển thị trang
  // ========================================
  const renderPage = () => {
    switch (page) {
      // ------------------------------------
      // Trang chủ
      // ------------------------------------
      case "home":
        return (
          <Home
            setPage={navigateTo}
            setSelectedService={setSelectedService}
          />
        );

      // ------------------------------------
      // Danh sách dịch vụ
      // ------------------------------------
      case "services":
        return (
          <Services
            setPage={navigateTo}
            setSelectedService={setSelectedService}
          />
        );

      // ------------------------------------
      // Chi tiết dịch vụ
      // ------------------------------------
      case "detail":
  return (
    <ServiceDetail
      service={selectedService}
      setPage={navigateTo}
      currentUser={currentUser}
    />
  );

      // ------------------------------------
      // Đăng nhập
      // ------------------------------------
      case "login":
        return (
          <Login
            setPage={navigateTo}
            onLoginSuccess={setCurrentUser}
          />
        );

      // ------------------------------------
      // Đăng ký
      // ------------------------------------
      case "register":
        return (
          <Register
            setPage={navigateTo}
          />
        );

      // ------------------------------------
      // Hồ sơ Freelancer
      // ------------------------------------
      case "freelancer":
        return (
          <Freelancer
            setPage={navigateTo}
            currentUser={currentUser}
          />
        );

      // ------------------------------------
      // Quản lý dịch vụ Freelancer
      // ------------------------------------
      case "manage-services":
        return (
          <ManageServices
            currentUser={currentUser}
          />
        );

      // ------------------------------------
      // Đơn hàng
      // ------------------------------------
      case "orders":
  return (
    <Orders
      setPage={navigateTo}
      currentUser={currentUser}
    />
  );

      // ------------------------------------
      // Mặc định
      // ------------------------------------
      default:
        return (
          <Home
            setPage={navigateTo}
            setSelectedService={setSelectedService}
          />
        );
    }
  };

  // ========================================
  // Trang đăng nhập / đăng ký
  // ========================================
  const authPage =
    page === "login" ||
    page === "register";

  // ========================================
  // Giao diện
  // ========================================
  return (
    <div className="app">

      {/* =========================
          HEADER
      ========================= */}
      {!authPage && (
        <Header
          page={page}
          setPage={navigateTo}
          currentUser={currentUser}
          onLogout={() => {
            setCurrentUser(null);
            setPage("home");
          }}
        />
      )}

      {/* =========================
          WELCOME BAR
      ========================= */}
      {currentUser && page === "home" && (
        <div className="welcome-bar">
          <div className="container">

            <strong>
              👋 Xin chào, {currentUser.name}!
            </strong>

            <span>
              {currentUser.role === "Freelancer"
                ? "Bạn đang sử dụng tài khoản Freelancer."
                : "Chúc bạn có một ngày thật hiệu quả trên SkillHub."}
            </span>

          </div>
        </div>
      )}

      {/* =========================
          PAGE CONTENT
      ========================= */}
      {renderPage()}

      {/* =========================
          FOOTER
      ========================= */}
      {!authPage && (
        <Footer
          setPage={navigateTo}
        />
      )}

    </div>
  );
}

export default App;