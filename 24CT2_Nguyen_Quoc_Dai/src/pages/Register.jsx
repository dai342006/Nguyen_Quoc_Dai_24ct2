// =========================================================
// REGISTER
// Trang đăng ký tài khoản SkillHub
// =========================================================

// CSS riêng cho trang đăng ký
import "../styles/register.css";

// React
import { useState } from "react";


// =========================================================
// COMPONENT REGISTER
// =========================================================

function Register({ setPage }) {

  // =======================================================
  // DỮ LIỆU FORM
  // =======================================================

  const [form, setForm] = useState({
    // Họ và tên
    HoTen: "",

    // Email
    Email: "",

    // Mật khẩu
    MatKhau: "",

    // Xác nhận mật khẩu
    XacNhanMatKhau: "",

    // Vai trò mặc định là Khách hàng
    VaiTro: "KhachHang",
  });


  // =======================================================
  // HIỂN THỊ / ẨN MẬT KHẨU
  // =======================================================

  const [showPassword, setShowPassword] =
    useState(false);


  // Hiển thị / ẩn mật khẩu xác nhận

  const [showConfirmPassword, setShowConfirmPassword] =
    useState(false);


  // =======================================================
  // ĐỒNG Ý ĐIỀU KHOẢN
  // =======================================================

  const [acceptedTerms, setAcceptedTerms] =
    useState(false);


  // =======================================================
  // LƯU LỖI FORM
  // =======================================================

  const [errors, setErrors] =
    useState({});


  // =======================================================
  // THÔNG BÁO TỪ SERVER
  // =======================================================

  const [serverMessage, setServerMessage] =
    useState("");


  // =======================================================
  // TRẠNG THÁI ĐĂNG KÝ
  // =======================================================

  const [isLoading, setIsLoading] =
    useState(false);


  // =======================================================
  // XỬ LÝ KHI NGƯỜI DÙNG NHẬP DỮ LIỆU
  // =======================================================

  function handleChange(e) {

    // Lấy tên ô nhập và giá trị
    const { name, value } = e.target;


    // Cập nhật form
    setForm((old) => ({
      ...old,
      [name]: value,
    }));


    // Xóa lỗi của ô đang nhập
    setErrors((old) => ({
      ...old,
      [name]: "",
    }));


    // Xóa thông báo cũ
    setServerMessage("");
  }


  // =======================================================
  // KIỂM TRA DỮ LIỆU FORM
  // =======================================================

  function validate() {

    // Object chứa lỗi
    const e = {};


    // =====================================================
    // HỌ VÀ TÊN
    // =====================================================

    const name = form.HoTen.trim();


    // Email
    const email = form.Email.trim();


    // Kiểm tra họ tên
    if (!name) {

      e.HoTen =
        "Vui lòng nhập họ và tên.";

    } else if (name.length < 2) {

      e.HoTen =
        "Họ và tên phải có ít nhất 2 ký tự.";

    }


    // =====================================================
    // KIỂM TRA EMAIL
    // =====================================================

    if (!email) {

      e.Email =
        "Vui lòng nhập email.";

    } else if (
      !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
    ) {

      e.Email =
        "Email không đúng định dạng.";

    }


    // =====================================================
    // KIỂM TRA MẬT KHẨU
    // =====================================================

    if (!form.MatKhau) {

      e.MatKhau =
        "Vui lòng nhập mật khẩu.";

    } else if (form.MatKhau.length < 6) {

      e.MatKhau =
        "Mật khẩu phải có ít nhất 6 ký tự.";

    }


    // =====================================================
    // KIỂM TRA XÁC NHẬN MẬT KHẨU
    // =====================================================

    if (!form.XacNhanMatKhau) {

      e.XacNhanMatKhau =
        "Vui lòng nhập lại mật khẩu.";

    } else if (
      form.MatKhau !== form.XacNhanMatKhau
    ) {

      e.XacNhanMatKhau =
        "Mật khẩu xác nhận không khớp.";

    }


    // =====================================================
    // KIỂM TRA VAI TRÒ
    // =====================================================

    if (!form.VaiTro) {

      e.VaiTro =
        "Vui lòng chọn vai trò.";

    }


    // =====================================================
    // KIỂM TRA ĐIỀU KHOẢN
    // =====================================================

    if (!acceptedTerms) {

      e.AcceptedTerms =
        "Bạn cần đồng ý với điều khoản sử dụng.";

    }


    // Lưu lỗi
    setErrors(e);


    // Trả về true nếu không có lỗi
    return Object.keys(e).length === 0;
  }


  // =======================================================
  // XỬ LÝ ĐĂNG KÝ
  // =======================================================

  async function handleSubmit(e) {

    // Không cho trình duyệt reload
    e.preventDefault();


    // Xóa thông báo cũ
    setServerMessage("");


    // Kiểm tra dữ liệu
    if (!validate()) {
      return;
    }


    // Bật loading
    setIsLoading(true);


    try {

      // ===================================================
      // GỬI DỮ LIỆU ĐẾN BACKEND
      // ===================================================

      const response = await fetch(
        "https://nguyen-quoc-dai-24ct2.onrender.com/api/register",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({

            // Họ tên
            HoTen:
              form.HoTen.trim(),

            // Email
            Email:
              form.Email.trim().toLowerCase(),

            // Mật khẩu
            MatKhau:
              form.MatKhau,

            // Vai trò
            VaiTro:
              form.VaiTro,
          }),
        }
      );


      // ===================================================
      // ĐỌC DỮ LIỆU SERVER
      // ===================================================

      const data =
        await response.json();


      // ===================================================
      // KIỂM TRA KẾT QUẢ
      // ===================================================

      if (!response.ok) {

        setServerMessage(
          data.message ||
          "Đăng ký thất bại."
        );

        return;
      }


      // ===================================================
      // ĐĂNG KÝ THÀNH CÔNG
      // ===================================================

      alert(
        `Đăng ký thành công với vai trò ${
          form.VaiTro === "Freelancer"
            ? "Freelancer"
            : "Khách hàng"
        }!`
      );


      // Chuyển sang đăng nhập
      setPage("login");


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
  // GIAO DIỆN TRANG ĐĂNG KÝ
  // =======================================================

  return (

    <main className="register-page">

      {/* =================================================
          CARD ĐĂNG KÝ
      ================================================= */}

      <div className="register-card">


        {/* =================================================
            LOGO
        ================================================= */}

        <div className="register-brand">
          Skill<span>Hub</span>
        </div>


        {/* =================================================
            TIÊU ĐỀ
        ================================================= */}

        <div className="register-heading">

          {/* Chữ nhỏ */}
          <p className="register-eyebrow">
            THAM GIA SKILLHUB
          </p>


          {/* Tiêu đề */}
          <h1>
            Tạo tài khoản
          </h1>


          {/* Mô tả */}
          <p>
            Đăng ký để tìm kiếm và thuê các kỹ năng số
            hoặc cung cấp dịch vụ của bạn.
          </p>

        </div>


        {/* =================================================
            FORM ĐĂNG KÝ
        ================================================= */}

        <form
          onSubmit={handleSubmit}
          noValidate
        >


          {/* =================================================
              HỌ VÀ TÊN
          ================================================= */}

          <label htmlFor="HoTen">
            Họ và tên
          </label>


          <input
            id="HoTen"

            name="HoTen"

            value={form.HoTen}

            onChange={handleChange}

            className={
              errors.HoTen
                ? "input-error"
                : ""
            }

            placeholder="Nguyễn Văn A"

            autoComplete="name"
          />


          {/* Lỗi họ tên */}

          {errors.HoTen && (

            <small className="register-field-error">
              {errors.HoTen}
            </small>

          )}


          {/* =================================================
              EMAIL
          ================================================= */}

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
              errors.Email
                ? "input-error"
                : ""
            }

            placeholder="you@example.com"

            autoComplete="email"
          />


          {/* Lỗi email */}

          {errors.Email && (

            <small className="register-field-error">
              {errors.Email}
            </small>

          )}


          {/* =================================================
              MẬT KHẨU
          ================================================= */}

          <label htmlFor="MatKhau">
            Mật khẩu
          </label>


          <div className="register-password-field">


            <input
              id="MatKhau"

              name="MatKhau"

              type={
                showPassword
                  ? "text"
                  : "password"
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


            {/* Nút hiện / ẩn mật khẩu */}

            <button
              type="button"

              className="register-password-toggle"

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


          {/* Lỗi mật khẩu */}

          {errors.MatKhau && (

            <small className="register-field-error">
              {errors.MatKhau}
            </small>

          )}


          {/* =================================================
              XÁC NHẬN MẬT KHẨU
          ================================================= */}

          <label htmlFor="XacNhanMatKhau">
            Xác nhận mật khẩu
          </label>


          <div className="register-password-field">


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


            {/* Nút hiện / ẩn */}

            <button
              type="button"

              className="register-password-toggle"

              onClick={() =>
                setShowConfirmPassword(
                  (v) => !v
                )
              }
            >
              {showConfirmPassword
                ? "Ẩn"
                : "Hiện"}
            </button>


          </div>


          {/* Lỗi xác nhận mật khẩu */}

          {errors.XacNhanMatKhau && (

            <small className="register-field-error">
              {errors.XacNhanMatKhau}
            </small>

          )}


          {/* =================================================
              CHỌN VAI TRÒ
          ================================================= */}

          <label>
            Bạn muốn đăng ký với vai trò
          </label>


          <div className="role-options">


            {/* ==============================
                KHÁCH HÀNG
            ============================== */}

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


            {/* ==============================
                FREELANCER
            ============================== */}

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


          {/* Lỗi vai trò */}

          {errors.VaiTro && (

            <small className="register-field-error">
              {errors.VaiTro}
            </small>

          )}


          {/* =================================================
              ĐIỀU KHOẢN
          ================================================= */}

          <label className="register-terms">

            <input
              type="checkbox"

              checked={acceptedTerms}

              onChange={(e) => {

                // Cập nhật trạng thái đồng ý
                setAcceptedTerms(
                  e.target.checked
                );


                // Xóa lỗi điều khoản
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


          {/* Lỗi điều khoản */}

          {errors.AcceptedTerms && (

            <small className="register-field-error">
              {errors.AcceptedTerms}
            </small>

          )}


          {/* =================================================
              THÔNG BÁO SERVER
          ================================================= */}

          {serverMessage && (

            <div className="register-message">
              {serverMessage}
            </div>

          )}


          {/* =================================================
              NÚT ĐĂNG KÝ
          ================================================= */}

          <button
            type="submit"

            className="register-submit"

            disabled={isLoading}
          >
            {isLoading
              ? "Đang tạo tài khoản..."
              : "Tạo tài khoản"}
          </button>


        </form>


        {/* =================================================
            CHUYỂN SANG ĐĂNG NHẬP
        ================================================= */}

        <div className="register-divider">

          <span>
            Đã có tài khoản?
          </span>

        </div>


        <button
          type="button"

          className="register-login-btn"

          onClick={() =>
            setPage("login")
          }
        >
          Đăng nhập
        </button>


      </div>

    </main>
  );
}


// =========================================================
// EXPORT COMPONENT
// =========================================================

export default Register;