// Trang quản lý đơn hàng
function Orders({ setPage }) {
  const orders = [
    ["#DH001", "Lập trình website ReactJS", "800.000đ", "Đang thực hiện"],
    ["#DH002", "Thiết kế logo chuyên nghiệp", "300.000đ", "Hoàn thành"],
  ];

  return (
    <main className="page">
      <div className="container">
        <div className="page-title">
          <p className="eyebrow">QUẢN LÝ</p>
          <h1>Đơn hàng của tôi</h1>
          <p>Theo dõi tiến độ các dịch vụ đã thuê.</p>
        </div>

        <div className="order-list">
          {orders.map(([id, name, price, status]) => (
            <div className="order-row" key={id}>
              <div className="order-icon">📦</div>

              <div className="order-main">
                <span>{id}</span>
                <h3>{name}</h3>
                <p>Freelancer: Nguyễn Minh Duy</p>
              </div>

              <div className="order-price">{price}</div>

              <span className={status === "Hoàn thành" ? "status done" : "status pending"}>
                {status}
              </span>
            </div>
          ))}
        </div>

        <button className="primary-btn" onClick={() => setPage("services")}>
          Khám phá thêm dịch vụ
        </button>
      </div>
    </main>
  );
}

export default Orders;
