import laptrinh from "../assets/laptrinh.jpg";
import services from "../data/services";
import ServiceCard from "../components/ServiceCard";

// Trang chủ
function Home({ setPage, setSelectedService }) {
  const categories = [
    [laptrinh, "Lập trình"],
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
            <button className="text-btn" onClick={() => setPage("services")}>
              Xem tất cả →
            </button>
          </div>

          <div className="category-grid">
            {categories.map(([icon, name]) => (
              <button
                key={name}
                className="category-card"
                onClick={() => setPage("services")}
              >
                {typeof icon === "string" ? (
                  <span className="category-icon">{icon}</span>
                ) : (
                  <img src={icon} alt={name} className="category-image" />
                )}
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
            <button className="text-btn" onClick={() => setPage("services")}>
              Xem tất cả →
            </button>
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

export default Home;
