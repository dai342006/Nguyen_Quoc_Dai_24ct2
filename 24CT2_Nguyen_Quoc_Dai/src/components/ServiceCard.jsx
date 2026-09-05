function ServiceCard({ service, onClick }) {
  return (
    <article className="service-card">

      {/* Phần nội dung */}
      <div className="service-card-content">

        {/* Icon */}
        <div className="service-icon">
          {service.icon || "💼"}
        </div>

        {/* Danh mục */}
        <span className="service-category">
          {service.category || "Dịch vụ"}
        </span>

        {/* Tên dịch vụ */}
        <h3>
          {service.title}
        </h3>

        {/* Mô tả */}
        <p>
          {service.description || "Chưa có mô tả."}
        </p>

        {/* Freelancer */}
        <div className="service-freelancer">
          <span>👤</span>
          <span>
            {service.freelancer || "Freelancer"}
          </span>
        </div>

      </div>

      {/* Phần dưới */}
      <div className="service-card-bottom">

        <div>
          <small>Đánh giá</small>

          <strong>
            ⭐ {service.rating || "5.0"}
          </strong>
        </div>

        <div className="service-price">
          {service.price}
        </div>

      </div>

      {/* Nút xem chi tiết */}
      <button
        className="service-view-btn"
        onClick={onClick}
      >
        Xem chi tiết
      </button>

    </article>
  );
}

export default ServiceCard;