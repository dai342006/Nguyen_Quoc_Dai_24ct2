import { useState } from "react";
import avatar from "./assets/avatar1.jpg";
import "./App.css";

const services = [
  {
    id: 1,
    title: "Thiết kế logo chuyên nghiệp",
    category: "Thiết kế",
    price: "300.000đ",
    rating: "4.9",
    seller: "Minh Design",
    icon: "🎨",
  },
  {
    id: 2,
    title: "Lập trình website ReactJS",
    category: "Lập trình",
    price: "800.000đ",
    rating: "4.8",
    seller: "Duy Tech",
    icon: "💻",
  },
  {
    id: 3,
    title: "Chỉnh sửa video TikTok",
    category: "Video",
    price: "250.000đ",
    rating: "5.0",
    seller: "Media Pro",
    icon: "🎬",
  },
  {
    id: 4,
    title: "Viết nội dung Facebook",
    category: "Nội dung",
    price: "200.000đ",
    rating: "4.7",
    seller: "Content Hub",
    icon: "✍️",
  },
  {
    id: 5,
    title: "Thiết kế banner quảng cáo",
    category: "Thiết kế",
    price: "250.000đ",
    rating: "4.9",
    seller: "Lan Creative",
    icon: "🖼️",
  },
  {
    id: 6,
    title: "Lập trình landing page",
    category: "Lập trình",
    price: "600.000đ",
    rating: "4.8",
    seller: "Code Master",
    icon: "🚀",
  },
];

function Header({ page, setPage }) {
  return (
    <header className="header">
      <div className="container header-inner">
        <button className="logo" onClick={() => setPage("home")}>
          Skill<span>Hub</span>
        </button>

        <nav className="nav">
          <button className={page === "home" ? "active" : ""} onClick={() => setPage("home")}>
            Trang chủ
          </button>
          <button className={page === "services" ? "active" : ""} onClick={() => setPage("services")}>
            Dịch vụ
          </button>
          <button className={page === "freelancer" ? "active" : ""} onClick={() => setPage("freelancer")}>
            Freelancer
          </button>
          <button className={page === "orders" ? "active" : ""} onClick={() => setPage("orders")}>
            Đơn hàng
          </button>
        </nav>

        <div className="header-actions">
          <button className="login-btn" onClick={() => setPage("login")}>Đăng nhập</button>
          <button className="register-btn" onClick={() => setPage("register")}>Đăng ký</button>
        </div>
      </div>
    </header>
  );
}

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

function Home({ setPage, setSelectedService }) {
  const categories = [
    ["💻", "Lập trình"],
    ["🎨", "Thiết kế"],
    ["🎬", "Video"],
    ["✍️", "Nội dung"],
    ["📣", "Marketing"],
    ["📱", "Mạng xã hội"],
  ];

  return (
    <>
      <section className="hero">
        <div className="container hero-grid">
          <div className="hero-content">
            <div className="tag">🚀 Tìm kỹ năng phù hợp với bạn</div>
            <h1>Kết nối với <span>người giỏi</span> cho mọi công việc số.</h1>
            <p>
              Tìm freelancer, thuê dịch vụ và hoàn thành công việc nhanh chóng
              trên SkillHub.
            </p>
            <div className="search-box">
              <input placeholder="Bạn cần tìm dịch vụ gì?" />
              <button onClick={() => setPage("services")}>Tìm kiếm</button>
            </div>
            <div className="hero-note">
              <span>✓ Hàng trăm dịch vụ</span>
              <span>✓ Freelancer uy tín</span>
              <span>✓ Đặt dịch vụ dễ dàng</span>
            </div>
          </div>
          <div className="hero-card">
            <div className="hero-card-icon">💡</div>
            <h3>Digital Skill Marketplace</h3>
            <p>Từ ý tưởng đến kết quả — tìm đúng người, đúng kỹ năng.</p>
            <div className="mini-stats">
              <div><strong>500+</strong><span>Dịch vụ</span></div>
              <div><strong>200+</strong><span>Freelancer</span></div>
              <div><strong>1K+</strong><span>Đơn hàng</span></div>
            </div>
          </div>
        </div>
      </section>

      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">DANH MỤC</p>
              <h2>Khám phá dịch vụ</h2>
            </div>
            <button className="text-btn" onClick={() => setPage("services")}>Xem tất cả →</button>
          </div>
          <div className="category-grid">
            {categories.map(([icon, name]) => (
              <button key={name} className="category-card" onClick={() => setPage("services")}>
                <span className="category-icon">{icon}</span>
                <strong>{name}</strong>
                <span>Khám phá ngay</span>
              </button>
            ))}
          </div>
        </div>
      </section>

      <section className="section gray-section">
        <div className="container">
          <div className="section-head">
            <div>
              <p className="eyebrow">NỔI BẬT</p>
              <h2>Dịch vụ được yêu thích</h2>
            </div>
            <button className="text-btn" onClick={() => setPage("services")}>Xem tất cả →</button>
          </div>
          <div className="service-grid">
            {services.slice(0, 3).map((service) => (
              <ServiceCard
                key={service.id}
                service={service}
                onClick={() => {
                  setSelectedService(service);
                  setPage("detail");
                }}
              />
            ))}
          </div>
        </div>
      </section>

      <section className="cta">
        <div className="container cta-box">
          <div>
            <p className="eyebrow">DÀNH CHO FREELANCER</p>
            <h2>Bạn có kỹ năng? Hãy bắt đầu kiếm thêm thu nhập.</h2>
            <p>Đăng dịch vụ, tiếp cận khách hàng và xây dựng hồ sơ chuyên nghiệp.</p>
          </div>
          <button onClick={() => setPage("register")}>Bắt đầu ngay →</button>
        </div>
      </section>
    </>
  );
}

function ServiceCard({ service, onClick }) {
  return (
    <button className="service-card" onClick={onClick}>
      <div className="service-cover">{service.icon}</div>
      <div className="service-info">
        <div className="service-category">{service.category}</div>
        <h3>{service.title}</h3>
        <p className="seller">Bởi {service.seller}</p>
        <div className="service-bottom">
          <span>⭐ {service.rating}</span>
          <strong>Từ {service.price}</strong>
        </div>
      </div>
    </button>
  );
}

function Services({ setPage, setSelectedService }) {
  const [search, setSearch] = useState("");
  const filtered = services.filter(
    (s) =>
      s.title.toLowerCase().includes(search.toLowerCase()) ||
      s.category.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="page">
      <div className="container">
        <div className="page-title">
          <p className="eyebrow">MARKETPLACE</p>
          <h1>Tất cả dịch vụ</h1>
          <p>Tìm dịch vụ phù hợp cho công việc của bạn.</p>
        </div>

        <div className="filter-bar">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tìm kiếm dịch vụ..."
          />
          <select>
            <option>Tất cả danh mục</option>
            <option>Lập trình</option>
            <option>Thiết kế</option>
            <option>Video</option>
            <option>Nội dung</option>
          </select>
          <select>
            <option>Sắp xếp: Phổ biến</option>
            <option>Giá thấp → cao</option>
            <option>Đánh giá cao</option>
          </select>
        </div>

        <div className="service-grid">
          {filtered.map((service) => (
            <ServiceCard
              key={service.id}
              service={service}
              onClick={() => {
                setSelectedService(service);
                setPage("detail");
              }}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

function ServiceDetail({ service, setPage }) {
  return (
    <main className="page">
      <div className="container">
        <button className="back-btn" onClick={() => setPage("services")}>← Quay lại</button>
        <div className="detail-grid">
          <div className="detail-left">
            <div className="detail-cover">{service.icon}</div>
            <div className="detail-section">
              <p className="eyebrow">MÔ TẢ</p>
              <h2>{service.title}</h2>
              <p>
                Dịch vụ được cung cấp bởi freelancer chuyên nghiệp, phù hợp cho
                cá nhân, sinh viên và doanh nghiệp nhỏ.
              </p>
              <p>
                Người mua có thể trao đổi yêu cầu, nhận sản phẩm và đánh giá
                sau khi hoàn thành.
              </p>
            </div>
          </div>

          <aside className="price-box">
            <div className="service-category">{service.category}</div>
            <h2>{service.title}</h2>
            <div className="rating-big">⭐ {service.rating} <span>• 50+ đánh giá</span></div>
            <div className="big-price">{service.price}</div>
            <button className="primary-btn" onClick={() => setPage("orders")}>Thuê dịch vụ</button>
            <button className="secondary-btn" onClick={() => setPage("login")}>Liên hệ freelancer</button>
            <div className="seller-box">
              <div className="avatar">👨‍💻</div>
              <div>
                <strong>{service.seller}</strong>
                <span>Freelancer chuyên nghiệp</span>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

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
        <button className="primary-btn full" onClick={() => setPage("home")}>Đăng nhập</button>
        <p className="auth-switch">Chưa có tài khoản? <button className="link-btn" onClick={() => setPage("register")}>Đăng ký ngay</button></p>
      </div>
    </main>
  );
}

function Register({ setPage }) {
  return (
    <main className="auth-page">
      <div className="auth-card">
        <div className="auth-brand">Skill<span>Hub</span></div>
        <h1>Tạo tài khoản</h1>
        <p>Tham gia SkillHub và bắt đầu ngay hôm nay.</p>
        <label>Họ và tên</label>
        <input placeholder="Nguyễn Văn A" />
        <label>Email</label>
        <input type="email" placeholder="you@example.com" />
        <label>Mật khẩu</label>
        <input type="password" placeholder="Tối thiểu 6 ký tự" />
        <label className="checkbox terms"><input type="checkbox" /> Tôi đồng ý với điều khoản sử dụng.</label>
        <button className="primary-btn full" onClick={() => setPage("home")}>Tạo tài khoản</button>
        <p className="auth-switch">Đã có tài khoản? <button className="link-btn" onClick={() => setPage("login")}>Đăng nhập</button></p>
      </div>
    </main>
  );
}

function Freelancer({ setPage }) {
  return (
    <main className="page">
      <div className="container">

        <div className="page-title">
          <p className="eyebrow">FREELANCER</p>
          <h1>Hồ sơ Freelancer</h1>
        </div>

        <div className="profile-layout">

          <section className="profile-card">

            <div className="profile-top">

              <div className="profile-avatar">
                <img src={avatar} alt="Nguyễn Quốc Đại" />
              </div>

              <div>
                <h2>Nguyễn Quốc Đại</h2>
                <p>Lập trình viên & Web Developer</p>

                <div className="rating-big">
                  ⭐ 4.9 <span>• Đà Nẵng</span>
                </div>
              </div>

            </div>

            <div className="profile-stats">
              <div>
                <strong>98%</strong>
                <span>Hoàn thành</span>
              </div>

              <div>
                <strong>120+</strong>
                <span>Đơn hàng</span>
              </div>

              <div>
                <strong>3 năm</strong>
                <span>Kinh nghiệm</span>
              </div>
            </div>

            <p>
              Xin chào! Mình chuyên xây dựng website bằng ReactJS,
              thiết kế giao diện và tối ưu trải nghiệm người dùng.
            </p>

            <div className="skills">
              {["ReactJS", "JavaScript", "HTML/CSS", "UI/UX"].map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <button className="primary-btn" onClick={() => setPage("services")}>Xem dịch vụ</button>
          </section>

          <aside className="side-card">
            <h3>Dịch vụ nổi bật</h3>
            {services.slice(1, 4).map((service) => (
              <div className="mini-service" key={service.id}>
                <span>{service.icon}</span>
                <div>
                  <strong>{service.title}</strong>
                  <small>⭐ {service.rating} • {service.price}</small>
                </div>
              </div>
            ))}
          </aside>
        </div>
      </div>
    </main>
  );
}

function Orders({ setPage }) {
  return (
    <main className="page">
      <div className="container">
        <div className="page-title">
          <p className="eyebrow">QUẢN LÝ</p>
          <h1>Đơn hàng của tôi</h1>
          <p>Theo dõi tiến độ các dịch vụ đã thuê.</p>
        </div>

        <div className="order-list">
          {[
            ["#DH001", "Lập trình website ReactJS", "800.000đ", "Đang thực hiện"],
            ["#DH002", "Thiết kế logo chuyên nghiệp", "300.000đ", "Hoàn thành"],
          ].map(([id, name, price, status]) => (
            <div className="order-row" key={id}>
              <div className="order-icon">📦</div>
              <div className="order-main">
                <span>{id}</span>
                <h3>{name}</h3>
                <p>Freelancer: Nguyễn Minh Duy</p>
              </div>
              <div className="order-price">{price}</div>
              <span className={status === "Hoàn thành" ? "status done" : "status pending"}>{status}</span>
            </div>
          ))}
        </div>

        <button className="primary-btn" onClick={() => setPage("services")}>Khám phá thêm dịch vụ</button>
      </div>
    </main>
  );
}

export default function App() {
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState(services[0]);

  const renderPage = () => {
    switch (page) {
      case "services":
        return <Services setPage={setPage} setSelectedService={setSelectedService} />;
      case "detail":
        return <ServiceDetail service={selectedService} setPage={setPage} />;
      case "login":
        return <Login setPage={setPage} />;
      case "register":
        return <Register setPage={setPage} />;
      case "freelancer":
        return <Freelancer setPage={setPage} />;
      case "orders":
        return <Orders setPage={setPage} />;
      default:
        return <Home setPage={setPage} setSelectedService={setSelectedService} />;
    }
  };

  const authPage = page === "login" || page === "register";

  return (
    <div className="app">
      {!authPage && <Header page={page} setPage={setPage} />}
      {renderPage()}
      {!authPage && <Footer setPage={setPage} />}
    </div>
  );
}
