// ========================================
// React
// useState: dùng để lưu và thay đổi dữ liệu
// trong giao diện đăng nhập
// ========================================
import { useState } from "react";


// ========================================
// COMPONENT LOGIN
// Trang đăng nhập tài khoản
// ========================================
function Login({
  setPage,
  onLoginSuccess
}) {

  // ======================================
  // Dữ liệu Email
  // ======================================
  const [email, setEmail] = useState("");


  // ======================================
  // Dữ liệu Mật khẩu
  // ======================================
  const [password, setPassword] =
    useState("");


  // ======================================
  // Hiển thị / ẩn mật khẩu
  // false: đang ẩn
  // true: đang hiện
  // ======================================
  const [showPassword, setShowPassword] =
    useState(false);


  // ======================================
  // Ghi nhớ đăng nhập
  // true: lưu Local Storage
  // false: lưu Session Storage
  // ======================================
  const [remember, setRemember] =
    useState(true);


  // ======================================
  // Lưu các lỗi của form
  // ======================================
  const [errors, setErrors] =
    useState({});


  // ======================================
  // Thông báo lỗi từ Server
  // ======================================
  const [serverMessage, setServerMessage] =
    useState("");


  // ======================================
  // Trạng thái đang đăng nhập
  // true: đang gửi dữ liệu
  // false: bình thường
  // ======================================
  const [isLoading, setIsLoading] =
    useState(false);


  // ========================================
  // KIỂM TRA DỮ LIỆU FORM
  // ========================================

  function validate() {

    // Tạo object để lưu lỗi
    const e = {};


    // ======================================
    // Kiểm tra Email
    // ======================================

    const cleanEmail =
      email.trim();


    // Email không được để trống
    if (!cleanEmail) {

      e.email =
        "Vui lòng nhập email.";

    }

    // Kiểm tra định dạng Email
    else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
        cleanEmail
      )
    ) {

      e.email =
        "Email không đúng định dạng.";

    }


    // ======================================
    // Kiểm tra Mật khẩu
    // ======================================

    if (!password) {

      e.password =
        "Vui lòng nhập mật khẩu.";

    }


    // Lưu lỗi vào state
    setErrors(e);


    // Nếu không có lỗi thì trả về true
    return Object.keys(e).length === 0;
  }


  // ========================================
  // XỬ LÝ ĐĂNG NHẬP
  // ========================================

  async function handleSubmit(e) {

    // Không cho form tự reload trang
    e.preventDefault();


    // Xóa thông báo cũ
    setServerMessage("");


    // Kiểm tra dữ liệu
    if (!validate()) return;


    // Bật trạng thái loading
    setIsLoading(true);


    try {

      // ====================================
      // Gửi dữ liệu đăng nhập đến Backend
      // ====================================

      const response =
        await fetch(
          "https://nguyen-quoc-dai-24ct2.onrender.com/api/login",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              // Gửi Email
              Email:
                email
                  .trim()
                  .toLowerCase(),

              // Gửi Mật khẩu
              MatKhau:
                password,
            }),
          }
        );


      // Đọc dữ liệu Server trả về
      const data =
        await response.json();


      // ====================================
      // Kiểm tra đăng nhập có thành công
      // hay không
      // ====================================

      if (!response.ok) {

        setServerMessage(
          data.message ||
            "Đăng nhập thất bại."
        );

        return;
      }


      // ====================================
      // Xóa thông tin đăng nhập cũ
      // ====================================

      localStorage.removeItem(
        "skillhub_current_user"
      );

      sessionStorage.removeItem(
        "skillhub_current_user"
      );


      // ====================================
      // Chọn nơi lưu tài khoản
      // ====================================

      const storage =
        remember
          ? localStorage
          : sessionStorage;


      // Lưu thông tin người dùng
      storage.setItem(
        "skillhub_current_user",
        JSON.stringify(data.user)
      );


      // ====================================
      // Thông báo cho App biết đăng nhập
      // thành công
      // ====================================

      onLoginSuccess(data.user);


      // Hiển thị thông báo
      alert(
        `Đăng nhập thành công! Xin chào ${data.user.name}.`
      );


      // Chuyển về trang chủ
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


  // ========================================
  // GIAO DIỆN TRANG ĐĂNG NHẬP
  // ========================================

  return (

    <main className="auth-page">

      <div className="auth-card">


        {/* ==================================
            LOGO SKILLHUB
        ================================== */}

        <div className="auth-brand">
          Skill<span>Hub</span>
        </div>


        {/* ==================================
            TIÊU ĐỀ
        ================================== */}

        <div className="auth-heading">

          {/* Dòng chữ nhỏ phía trên */}
          <p className="auth-eyebrow">
            DIGITAL SKILL MARKETPLACE
          </p>


          {/* Tiêu đề chính */}
          <h1>
            Chào mừng trở lại
          </h1>


          {/* Mô tả */}
          <p>
            Đăng nhập để tiếp tục sử dụng
            SkillHub.
          </p>

        </div>


        {/* ==================================
            FORM ĐĂNG NHẬP
        ================================== */}

        <form
          onSubmit={handleSubmit}
          noValidate
        >


          {/* ==================================
              EMAIL
          ================================== */}

          <label htmlFor="login-email">
            Email
          </label>


          <input
            id="login-email"

            type="email"

            value={email}

            onChange={(e) => {

              // Cập nhật Email
              setEmail(
                e.target.value
              );

              // Xóa lỗi Email
              setErrors((old) => ({
                ...old,
                email: "",
              }));

              // Xóa thông báo Server
              setServerMessage("");
            }}

            className={
              errors.email
                ? "input-error"
                : ""
            }

            placeholder="you@example.com"

            autoComplete="email"
          />


          {/* Hiển thị lỗi Email */}
          {errors.email && (

            <small className="field-error">

              {errors.email}

            </small>

          )}


          {/* ==================================
              MẬT KHẨU
          ================================== */}

          <label htmlFor="login-password">
            Mật khẩu
          </label>


          <div className="password-field">


            <input
              id="login-password"

              // Nếu showPassword = true
              // thì hiện text
              // Ngược lại là password
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

                // Xóa thông báo Server
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


            {/* ==================================
                NÚT HIỆN / ẨN MẬT KHẨU
            ================================== */}

            <button
              type="button"

              className="password-toggle"

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


          {/* Hiển thị lỗi Mật khẩu */}
          {errors.password && (

            <small className="field-error">

              {errors.password}

            </small>

          )}


          {/* ==================================
              TÙY CHỌN ĐĂNG NHẬP
          ================================== */}

          <div className="login-options">


            {/* Ghi nhớ đăng nhập */}

            <label className="terms-row remember-row">

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

              className="link-btn"

              onClick={() =>
                setServerMessage(
                  "Tính năng khôi phục mật khẩu sẽ được bổ sung sau."
                )
              }
            >
              Quên mật khẩu?
            </button>

          </div>


          {/* ==================================
              THÔNG BÁO SERVER
          ================================== */}

          {serverMessage && (

            <div className="form-message error">

              {serverMessage}

            </div>

          )}


          {/* ==================================
              NÚT ĐĂNG NHẬP
          ================================== */}

          <button
            type="submit"

            className="primary-btn full"

            disabled={isLoading}
          >

            {isLoading
              ? "Đang đăng nhập..."
              : "Đăng nhập"}

          </button>

        </form>


        {/* ==================================
            CHUYỂN SANG TRANG ĐĂNG KÝ
        ================================== */}

        <div className="auth-divider">

          <span>
            Chưa có tài khoản?
          </span>

        </div>


        <button
          className="auth-outline-btn"

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


// ========================================
// EXPORT COMPONENT
// Cho phép App.jsx sử dụng Login
// ========================================

export default Login;