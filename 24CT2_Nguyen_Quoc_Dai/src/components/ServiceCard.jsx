// Component hiển thị một dịch vụ
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

export default ServiceCard;
