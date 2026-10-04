// =========================================================
// LOGIN
// Trang đăng nhập tài khoản SkillHub
// =========================================================

// CSS riêng cho trang đăng nhập
import "../styles/login.css";

// React
import { useState } from "react";


// =========================================================
// COMPONENT LOGIN
// =========================================================

function Login({
  setPage,
  onLoginSuccess
}) {

  // =======================================================
  // STATE EMAIL
  // Lưu email người dùng nhập
  // =======================================================

  const [email, setEmail] = useState("");


  // =======================================================
  // STATE MẬT KHẨU
  // Lưu mật khẩu người dùng nhập
  // =======================================================

  const [password, setPassword] = useState("");


  // =======================================================
  // HIỂN THỊ / ẨN MẬT KHẨU
  //
  // false = đang ẩn
  // true  = đang hiện
  // =======================================================

  const [showPassword, setShowPassword] =
    useState(false);


  // =======================================================
  // GHI NHỚ ĐĂNG NHẬP
  //
  // true  = lưu localStorage
  // false = lưu sessionStorage
  // =======================================================

  const [remember, setRemember] =
    useState(true);


  // =======================================================
  // LƯU LỖI CỦA FORM
  // =======================================================

  const [errors, setErrors] =
    useState({});


  // =======================================================
  // THÔNG BÁO TỪ SERVER
  // =======================================================

  const [serverMessage, setServerMessage] =
    useState("");


  // =======================================================
  // TRẠNG THÁI ĐĂNG NHẬP
  //
  // true  = đang gửi dữ liệu
  // false = bình thường
  // =======================================================

  const [isLoading, setIsLoading] =
    useState(false);


  // =======================================================
  // KIỂM TRA DỮ LIỆU FORM
  // =======================================================

  function validate() {

    // Object dùng để lưu lỗi
    const e = {};


    // =====================================================
    // KIỂM TRA EMAIL
    // =====================================================

    const cleanEmail = email.trim();


    // Email bỏ trống
    if (!cleanEmail) {

      e.email =
        "Vui lòng nhập email.";

    }

    // Email sai định dạng
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {

      e.email =
        "Email không đúng định dạng.";

    }


    // =====================================================
    // KIỂM TRA MẬT KHẨU
    // =====================================================

    if (!password) {

      e.password =
        "Vui lòng nhập mật khẩu.";

    }


    // Lưu lỗi vào state
    setErrors(e);


    // Nếu không có lỗi thì trả về true
    return Object.keys(e).length === 0;
  }


  // =======================================================
  // XỬ LÝ ĐĂNG NHẬP
  // =======================================================

  async function handleSubmit(e) {

    // Không cho form reload trang
    e.preventDefault();


    // Xóa thông báo cũ
    setServerMessage("");


    // Kiểm tra dữ liệu
    if (!validate()) {
      return;
    }


    // Bật trạng thái loading
    setIsLoading(true);


    try {

      // ===================================================
      // GỬI DỮ LIỆU ĐĂNG NHẬP ĐẾN BACKEND
      // ===================================================

      const response = await fetch(
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/login",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({

            // Email
            Email:
              email
                .trim()
                .toLowerCase(),

            // Mật khẩu
            MatKhau:
              password,
          }),
        }
      );


      // ===================================================
      // ĐỌC DỮ LIỆU BACKEND TRẢ VỀ
      // ===================================================

      const data =
        await response.json();


      // ===================================================
      // KIỂM TRA KẾT QUẢ ĐĂNG NHẬP
      // ===================================================

      if (!response.ok) {

        setServerMessage(
          data.message ||
          "Đăng nhập thất bại."
        );

        return;
      }


      // ===================================================
      // XÓA THÔNG TIN ĐĂNG NHẬP CŨ
      // ===================================================

      localStorage.removeItem(
        "skillhub_current_user"
      );

      sessionStorage.removeItem(
        "skillhub_current_user"
      );


      // ===================================================
      // CHỌN NƠI LƯU TÀI KHOẢN
      // ===================================================

      const storage =
        remember
          ? localStorage
          : sessionStorage;


      // ===================================================
      // LƯU NGƯỜI DÙNG
      // ===================================================

      storage.setItem(
        "skillhub_current_user",
        JSON.stringify(data.user)
      );


      // ===================================================
      // BÁO CHO APP BIẾT ĐĂNG NHẬP THÀNH CÔNG
      // ===================================================

      onLoginSuccess(data.user);


      // ===================================================
      // THÔNG BÁO
      // ===================================================

      alert(
        `Đăng nhập thành công! Xin chào ${data.user.name}.`
      );


      // ===================================================
      // CHUYỂN VỀ TRANG CHỦ
      // ===================================================

      setPage("home");


    } catch (error) {

      // In lỗi ra Console
      console.error(error);


      // Thông báo lỗi kết nối
      setServerMessage(
        "Không thể kết nối đến máy chủ. Hãy kiểm tra backend có đang chạy không."
      );


    } finally {

      // Tắt loading
      setIsLoading(false);
    }
  }


  // =======================================================
  // GIAO DIỆN
  // =======================================================

  return (

    <main className="login-page">

      {/* =================================================
          CARD ĐĂNG NHẬP
      ================================================= */}

      <div className="login-card">


        {/* =================================================
            LOGO SKILLHUB
        ================================================= */}

        <div className="login-brand">
          Skill<span>Hub</span>
        </div>


        {/* =================================================
            TIÊU ĐỀ
        ================================================= */}

        <div className="login-heading">

          {/* Chữ nhỏ */}
          <p className="login-eyebrow">
            DIGITAL SKILL MARKETPLACE
          </p>


          {/* Tiêu đề */}
          <h1>
            Chào mừng trở lại
          </h1>


          {/* Mô tả */}
          <p>
            Đăng nhập để tiếp tục sử dụng SkillHub.
          </p>

        </div>


        {/* =================================================
            FORM
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          noValidate
        >


          {/* =================================================
              EMAIL
          ================================================= */}

          <label htmlFor="login-email">
            Email
          </label>


          <input
            id="login-email"

            type="email"

            value={email}

            onChange={(e) => {

              // Cập nhật email
              setEmail(
                e.target.value
              );

              // Xóa lỗi email
              setErrors((old) => ({
                ...old,
                email: "",
              }));

              // Xóa thông báo server
              setServerMessage("");

            }}

            /*
               Nếu có lỗi:
               input sẽ có class input-error
            */
            className={
              errors.email
                ? "input-error"
                : ""
            }

            placeholder="you@example.com"

            autoComplete="email"
          />


          {/* Hiển thị lỗi email */}

          {errors.email && (

            <small className="login-field-error">
              {errors.email}
            </small>

          )}


          {/* =================================================
              MẬT KHẨU
          ================================================= */}

          <label htmlFor="login-password">
            Mật khẩu
          </label>


          <div className="login-password-field">


            <input
              id="login-password"

              /*
                 Nếu showPassword = true
                 thì hiện mật khẩu.
                 Ngược lại che mật khẩu.
              */
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              value={password}

              onChange={(e) => {

                // Cập nhật mật khẩu
                setPassword(
                  e.target.value
                );

                // Xóa lỗi mật khẩu
                setErrors((old) => ({
                  ...old,
                  password: "",
                }));

                // Xóa thông báo server
                setServerMessage("");

              }}

              className={
                errors.password
                  ? "input-error"
                  : ""
              }

              placeholder="Nhập mật khẩu"

              autoComplete="current-password"
            />


            {/* =================================================
                NÚT HIỆN / ẨN MẬT KHẨU
            ================================================= */}

            <button
              type="button"

              className="login-password-toggle"

              onClick={() =>
                setShowPassword(
                  (v) => !v
                )
              }
            >
              {showPassword
                ? "Ẩn"
                : "Hiện"}
            </button>


          </div>


          {/* Hiển thị lỗi mật khẩu */}

          {errors.password && (

            <small className="login-field-error">
              {errors.password}
            </small>

          )}


          {/* =================================================
              TÙY CHỌN ĐĂNG NHẬP
          ================================================= */}

          <div className="login-options">


            {/* Ghi nhớ đăng nhập */}

            <label className="login-remember">

              <input
                type="checkbox"

                checked={remember}

                onChange={(e) =>
                  setRemember(
                    e.target.checked
                  )
                }
              />

              <span>
                Ghi nhớ đăng nhập
              </span>

            </label>


            {/* Quên mật khẩu */}

            <button
              type="button"

              className="login-link"

              onClick={() =>
                setServerMessage(
                  "Tính năng khôi phục mật khẩu sẽ được bổ sung sau."
                )
              }
            >
              Quên mật khẩu?
            </button>


          </div>


          {/* =================================================
              THÔNG BÁO SERVER
          ================================================= */}

          {serverMessage && (

            <div className="login-message">
              {serverMessage}
            </div>

          )}


          {/* =================================================
              NÚT ĐĂNG NHẬP
          ================================================= */}

          <button
            type="submit"

            className="login-submit"

            disabled={isLoading}
          >
            {isLoading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}
          </button>


        </form>


        {/* =================================================
            CHUYỂN SANG ĐĂNG KÝ
        ================================================= */}

        <div className="login-divider">
          <span>
            Chưa có tài khoản?
          </span>
        </div>


        <button
          type="button"

          className="login-register-btn"

          onClick={() =>
            setPage("register")
          }
        >
          Tạo tài khoản mới
        </button>


      </div>

    </main>
  );
}


// =========================================================
// EXPORT
// =========================================================

export default Login;