import { useEffect, useState } from "react";

//import laptrinh from "../assets/laptrinh.jpg";

import ServiceCard from "../components/ServiceCard";

// ========================================
// Trang chủ SkillHub
// ========================================

function Home({ setPage, setSelectedService }) {

  // ========================================
  // Danh mục
  // ========================================

  const categories = [
    {
      image: "💻",
      name: "Lập trình",
    },
    {
      icon: "🎨",
      name: "Thiết kế",
    },
    {
      icon: "🎬",
      name: "Video",
    },
    {
      icon: "✍️",
      name: "Nội dung",
    },
    {
      icon: "📣",
      name: "Marketing",
    },
    {
      icon: "📱",
      name: "Mạng xã hội",
    },
  ];

  // ========================================
  // State dịch vụ
  // ========================================

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  // ========================================
  // Lấy dịch vụ từ Backend Render
  // ========================================

  useEffect(() => {

    async function loadServices() {

      try {

        const response = await fetch(
          "https://nguyen-quoc-dai-24ct2.onrender.com/api/services"
        );

        const data = await response.json();

        if (!response.ok) {

          console.error(
            "Lỗi lấy dịch vụ:",
            data.message
          );

          return;
        }

        setServices(
          Array.isArray(data) ? data : []
        );

      } catch (error) {

        console.error(
          "Không thể kết nối backend:",
          error
        );

      } finally {

        setLoading(false);

      }
    }

    loadServices();

  }, []);

  // ========================================
  // Chuyển dữ liệu API sang ServiceCard
  // ========================================

  function convertService(service) {

    return {

      id: service.MaDichVu,

      title: service.TenDichVu,

      description:
        service.MoTa ||
        "Chưa có mô tả.",

      category:
        service.DanhMuc ||
        "Dịch vụ",

      price:
        `${Number(
          service.Gia
        ).toLocaleString("vi-VN")}đ`,

      rating: "5.0",

      icon: "💼",

      freelancer:
        service.TenFreelancer ||
        "Freelancer",

      MaNguoiDung:
        service.MaNguoiDung,

    };
  }

  // ========================================
  // Lấy tối đa 3 dịch vụ nổi bật
  // ========================================

  const featuredServices = services
    .map(convertService)
    .slice(0, 3);

  // ========================================
  // Giao diện
  // ========================================

  return (
    <>

      {/* ========================================
          HERO
      ======================================== */}

      <section className="hero">

        <div className="container hero-grid">

          <div className="hero-content">

            <div className="tag">
              🚀 Tìm kỹ năng phù hợp với bạn
            </div>

            <h1>
              Kết nối với{" "}
              <span>người giỏi</span>{" "}
              cho mọi công việc số.
            </h1>

            <p>
              Tìm freelancer, thuê dịch vụ và
              hoàn thành công việc nhanh chóng
              trên SkillHub.
            </p>

            {/* Search */}

            <div className="search-box">

              <input
                placeholder="Bạn cần tìm dịch vụ gì?"
                onKeyDown={(e) => {

                  if (e.key === "Enter") {
                    setPage("services");
                  }

                }}
              />

              <button
                onClick={() =>
                  setPage("services")
                }
              >
                Tìm kiếm
              </button>

            </div>

            <div className="hero-note">

              <span>
                ✓ Dịch vụ đa dạng
              </span>

              <span>
                ✓ Freelancer uy tín
              </span>

              <span>
                ✓ Đặt dịch vụ dễ dàng
              </span>

            </div>

          </div>

          {/* =========================
              HERO CARD
          ========================= */}

          <div className="hero-card">

            <div className="hero-card-icon">
              💡
            </div>

            <h3>
              Digital Skill Marketplace
            </h3>

            <p>
              Từ ý tưởng đến kết quả — tìm đúng
              người, đúng kỹ năng.
            </p>

            <div className="mini-stats">

              <div>

                <strong>
                  {services.length > 0
                    ? `${services.length}+`
                    : "0"}
                </strong>

                <span>
                  Dịch vụ
                </span>

              </div>

              <div>

                <strong>
                  200+
                </strong>

                <span>
                  Freelancer
                </span>

              </div>

              <div>

                <strong>
                  1K+
                </strong>

                <span>
                  Đơn hàng
                </span>

              </div>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          DANH MỤC
      ======================================== */}

      <section className="section">

        <div className="container">

          <div className="section-head">

            <div>

              <p className="eyebrow">
                DANH MỤC
              </p>

              <h2>
                Khám phá dịch vụ
              </h2>

            </div>

            <button
              className="text-btn"
              onClick={() =>
                setPage("services")
              }
            >
              Xem tất cả →
            </button>

          </div>


          <div className="category-grid">

            {categories.map((category) => (

              <button
                key={category.name}
                className="category-card"
                onClick={() =>
                  setPage("services")
                }
              >

                {/* =========================
                    ẢNH HOẶC ICON
                ========================= */}

                {category.image ? (

                  <img
                    src={category.image}
                    alt={category.name}
                    className="category-image"
                  />

                ) : (

                  <span className="category-icon">
                    {category.icon}
                  </span>

                )}

                <strong>
                  {category.name}
                </strong>

                <span>
                  Khám phá ngay
                </span>

              </button>

            ))}

          </div>

        </div>

      </section>


      {/* ========================================
          DỊCH VỤ NỔI BẬT
      ======================================== */}

      <section className="section gray-section">

        <div className="container">

          <div className="section-head">

            <div>

              <p className="eyebrow">
                NỔI BẬT
              </p>

              <h2>
                Dịch vụ được yêu thích
              </h2>

            </div>

            <button
              className="text-btn"
              onClick={() =>
                setPage("services")
              }
            >
              Xem tất cả →
            </button>

          </div>


          {/* Đang tải */}

          {loading && (

            <div className="empty-services">

              <div>
                ⏳
              </div>

              <h3>
                Đang tải dịch vụ...
              </h3>

              <p>
                Vui lòng chờ một chút.
              </p>

            </div>

          )}


          {/* Không có dịch vụ */}

          {!loading &&
            featuredServices.length === 0 && (

            <div className="empty-services">

              <div>
                📦
              </div>

              <h3>
                Chưa có dịch vụ
              </h3>

              <p>
                Freelancer chưa đăng dịch vụ nào.
              </p>

            </div>

          )}


          {/* Dịch vụ */}

          {!loading &&
            featuredServices.length > 0 && (

            <div className="service-grid">

              {featuredServices.map(
                (service) => (

                <ServiceCard
                  key={service.id}
                  service={service}
                  onClick={() => {

                    setSelectedService(
                      service
                    );

                    setPage("detail");

                  }}
                />

              ))}

            </div>

          )}

        </div>

      </section>


      {/* ========================================
          THỐNG KÊ
      ======================================== */}

      <section className="section">

        <div className="container">

          <div className="section-head">

            <div>

              <p className="eyebrow">
                SKILLHUB
              </p>

              <h2>
                Nền tảng kết nối kỹ năng số
              </h2>

            </div>

          </div>


          <div className="mini-stats">

            <div>

              <strong>
                {services.length}
              </strong>

              <span>
                Dịch vụ hiện có
              </span>

            </div>

            <div>

              <strong>
                200+
              </strong>

              <span>
                Freelancer
              </span>

            </div>

            <div>

              <strong>
                1K+
              </strong>

              <span>
                Đơn hàng
              </span>

            </div>

          </div>

        </div>

      </section>


      {/* ========================================
          CTA FREELANCER
      ======================================== */}

      <section className="cta">

        <div className="container cta-box">

          <div>

            <p className="eyebrow">
              DÀNH CHO FREELANCER
            </p>

            <h2>
              Bạn có kỹ năng?
              Hãy bắt đầu kiếm thêm
              thu nhập.
            </h2>

            <p>
              Đăng dịch vụ, tiếp cận khách hàng
              và xây dựng hồ sơ chuyên nghiệp.
            </p>

          </div>

          <button
            onClick={() =>
              setPage("register")
            }
          >
            Bắt đầu ngay →
          </button>

        </div>

      </section>

    </>
  );
}

export default Home;