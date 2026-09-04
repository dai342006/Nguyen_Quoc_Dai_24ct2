import { useState } from "react";

function Register({ setPage }) {
  const [HoTen, setHoTen] = useState("");
  const [Email, setEmail] = useState("");
  const [MatKhau, setMatKhau] = useState("");
  const [message, setMessage] = useState("");

  async function handleRegister(e) {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:5000/api/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            HoTen,
            Email,
            MatKhau,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(data.message);
        return;
      }

      alert(data.message);

      setPage("login");

    } catch (error) {
      console.error(error);
      setMessage("Không thể kết nối đến server!");
    }
  }

  return (
    <main className="auth-page">
      <div className="auth-card">

        <div className="auth-brand">
          Skill<span>Hub</span>
        </div>

        <h1>Tạo tài khoản</h1>

        <p>
          Tham gia SkillHub và bắt đầu ngay hôm nay.
        </p>

        <form onSubmit={handleRegister}>

          <label>Họ và tên</label>
          <input
            value={HoTen}
            onChange={(e) => setHoTen(e.target.value)}
            placeholder="Nguyễn Văn A"
          />

          <label>Email</label>
          <input
            type="email"
            value={Email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
          />

          <label>Mật khẩu</label>
          <input
            type="password"
            value={MatKhau}
            onChange={(e) => setMatKhau(e.target.value)}
            placeholder="Tối thiểu 6 ký tự"
          />

          {message && (
            <p style={{ color: "red" }}>
              {message}
            </p>
          )}

          <button
            type="submit"
            className="primary-btn full"
          >
            Tạo tài khoản
          </button>

        </form>

        <p className="auth-switch">
          Đã có tài khoản?{" "}
          <button
            className="link-btn"
            onClick={() => setPage("login")}
          >
            Đăng nhập
          </button>
        </p>

      </div>
    </main>
  );
}

export default Register;