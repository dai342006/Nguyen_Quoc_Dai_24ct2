// Trang chi tiết dịch vụ
function ServiceDetail({ service, setPage }) {
  return (
    <main className="page">
      <div className="container">
        <button className="back-btn" onClick={() => setPage("services")}>
          ← Quay lại
        </button>

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

            <div className="rating-big">
              ⭐ {service.rating} <span>• 50+ đánh giá</span>
            </div>

            <div className="big-price">{service.price}</div>

            <button className="primary-btn" onClick={() => setPage("orders")}>
              Thuê dịch vụ
            </button>

            <button className="secondary-btn" onClick={() => setPage("login")}>
              Liên hệ freelancer
            </button>

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

export default ServiceDetail;
