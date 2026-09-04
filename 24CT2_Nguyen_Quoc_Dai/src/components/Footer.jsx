// Phần cuối trang
function Footer({ setPage }) {
  return (
    <footer className="footer">
      <div className="container footer-grid">
        <div>
          <div className="footer-logo">Skill<span>Hub</span></div>
          <p>Nền tảng kết nối và thuê kỹ năng số đơn giản, nhanh chóng.</p>
        </div>

        <div>
          <h4>Khám phá</h4>
          <button onClick={() => setPage("services")}>Dịch vụ</button>
          <button onClick={() => setPage("freelancer")}>Freelancer</button>
        </div>

        <div>
          <h4>Tài khoản</h4>
          <button onClick={() => setPage("login")}>Đăng nhập</button>
          <button onClick={() => setPage("register")}>Đăng ký</button>
        </div>

        <div>
          <h4>Liên hệ</h4>
          <p>Email: support@skillhub.vn</p>
          <p>Điện thoại: 0900 123 456</p>
        </div>
      </div>

      <div className="footer-bottom">© 2026 SkillHub - Digital Skill Marketplace</div>
    </footer>
  );
}

export default Footer;
