import avatar from "../assets/avatar1.jpg";
import services from "../data/services";

// Trang hồ sơ Freelancer
function Freelancer({ setPage, currentUser }) {
  return (
    <main className="page">
      <div className="container">

        {/* Tiêu đề */}
        <div className="page-title">
          <p className="eyebrow">FREELANCER</p>
          <h1>Hồ sơ Freelancer</h1>
        </div>

        <div className="profile-layout">

          {/* =========================
              HỒ SƠ FREELANCER
          ========================= */}
          <section className="profile-card">

            <div className="profile-top">

              {/* Avatar */}
              <div className="profile-avatar">
                <img
                  src={avatar}
                  alt={currentUser?.name || "Freelancer"}
                />
              </div>

              {/* Thông tin */}
              <div>
                <h2>
                  {currentUser?.name || "Freelancer"}
                </h2>

                <p>
                  Lập trình viên & Web Developer
                </p>

                <div className="rating-big">
                  ⭐ 4.9 <span>• Đà Nẵng</span>
                </div>
              </div>

            </div>

            {/* Thống kê */}
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

            {/* Giới thiệu */}
            <p>
              Xin chào! Mình chuyên xây dựng website bằng
              ReactJS, thiết kế giao diện và tối ưu trải nghiệm
              người dùng.
            </p>

            {/* Kỹ năng */}
            <div className="skills">
              {[
                "ReactJS",
                "JavaScript",
                "HTML/CSS",
                "UI/UX",
              ].map((skill) => (
                <span key={skill}>
                  {skill}
                </span>
              ))}
            </div>

            {/* Xem dịch vụ */}
            <button
              className="primary-btn"
              onClick={() => setPage("services")}
            >
              Xem dịch vụ
            </button>

          </section>

          {/* =========================
              DỊCH VỤ NỔI BẬT
          ========================= */}
          <aside className="side-card">

            <h3>Dịch vụ nổi bật</h3>

            {services.slice(1, 4).map((service) => (

              <div
                className="mini-service"
                key={service.id}
              >

                <span>
                  {service.icon}
                </span>

                <div>
                  <strong>
                    {service.title}
                  </strong>

                  <small>
                    ⭐ {service.rating} • {service.price}
                  </small>
                </div>

              </div>

            ))}

          </aside>

        </div>
      </div>
    </main>
  );
}

export default Freelancer;