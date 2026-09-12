import { useState } from "react";

// ======================================================
// TRANG QUẢN TRỊ ADMIN
// ======================================================

function Admin({ currentUser }) {

  // Tab hiện tại
  const [activeTab, setActiveTab] =
    useState("users");

  // ====================================================
  // DỮ LIỆU MẪU
  // Sau này sẽ lấy từ Backend
  // ====================================================

  const users = [
    {
      id: 1,
      name: "Nguyễn Quốc Đại",
      email: "dai@gmail.com",
      role: "KhachHang",
    },
    {
      id: 2,
      name: "Nguyễn Minh Duy",
      email: "duy@gmail.com",
      role: "Freelancer",
    },
    {
      id: 3,
      name: "Admin SkillHub",
      email: "admin@gmail.com",
      role: "Admin",
    },
  ];

  const services = [
    {
      id: 1,
      name: "Lập trình website ReactJS",
      category: "Lập trình",
      price: 800000,
      status: "Đã duyệt",
    },
    {
      id: 2,
      name: "Thiết kế logo chuyên nghiệp",
      category: "Thiết kế",
      price: 300000,
      status: "Chờ duyệt",
    },
    {
      id: 3,
      name: "Chỉnh sửa video TikTok",
      category: "Video",
      price: 200000,
      status: "Đã duyệt",
    },
  ];

  const orders = [
    {
      id: 1,
      customer: "Nguyễn Quốc Đại",
      freelancer: "Nguyễn Minh Duy",
      service: "Lập trình website ReactJS",
      price: 800000,
      status: "Đang thực hiện",
    },
    {
      id: 2,
      customer: "Trần Văn A",
      freelancer: "Nguyễn Minh Duy",
      service: "Thiết kế logo",
      price: 300000,
      status: "Hoàn thành",
    },
  ];

  // ====================================================
  // ĐỔI TÊN VAI TRÒ
  // ====================================================

  function getRoleText(role) {

    switch (role) {

      case "KhachHang":
        return "Khách hàng";

      case "Freelancer":
        return "Freelancer";

      case "Admin":
        return "Admin";

      default:
        return role;
    }
  }

  // ====================================================
  // GIAO DIỆN
  // ====================================================

  return (
    <main className="admin-page">

      <div className="container">

        {/* =========================
            HEADER ADMIN
        ========================= */}

        <div className="admin-heading">

          <div>
            <p className="eyebrow">
              QUẢN TRỊ HỆ THỐNG
            </p>

            <h1>
              Admin Dashboard
            </h1>

            <p>
              Xin chào {currentUser?.name || "Admin"}.
              Quản lý toàn bộ hoạt động của SkillHub.
            </p>
          </div>

          <div className="admin-badge">
            🛡️ Quản trị viên
          </div>

        </div>


        {/* =========================
            THỐNG KÊ
        ========================= */}

        <div className="admin-stats">

          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              👥
            </div>

            <div>
              <span>
                Người dùng
              </span>

              <strong>
                128
              </strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              💼
            </div>

            <div>
              <span>
                Dịch vụ
              </span>

              <strong>
                64
              </strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              📦
            </div>

            <div>
              <span>
                Đơn hàng
              </span>

              <strong>
                156
              </strong>
            </div>

          </div>


          <div className="admin-stat-card">

            <div className="admin-stat-icon">
              ⭐
            </div>

            <div>
              <span>
                Đánh giá
              </span>

              <strong>
                94
              </strong>
            </div>

          </div>

        </div>


        {/* =========================
            MENU QUẢN TRỊ
        ========================= */}

        <div className="admin-tabs">

          <button
            className={
              activeTab === "users"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("users")
            }
          >
            👥 Quản lý người dùng
          </button>


          <button
            className={
              activeTab === "services"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("services")
            }
          >
            💼 Quản lý dịch vụ
          </button>


          <button
            className={
              activeTab === "orders"
                ? "active"
                : ""
            }
            onClick={() =>
              setActiveTab("orders")
            }
          >
            📦 Quản lý đơn hàng
          </button>

        </div>


        {/* ==================================================
            QUẢN LÝ NGƯỜI DÙNG
        ================================================== */}

        {activeTab === "users" && (

          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <h2>
                  Danh sách người dùng
                </h2>

                <p>
                  Xem và quản lý các tài khoản trên hệ thống.
                </p>
              </div>

              <button className="primary-btn">
                + Thêm người dùng
              </button>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Họ tên</th>
                    <th>Email</th>
                    <th>Vai trò</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>

                <tbody>

                  {users.map((user) => (

                    <tr key={user.id}>

                      <td>
                        #{user.id}
                      </td>

                      <td>
                        <strong>
                          {user.name}
                        </strong>
                      </td>

                      <td>
                        {user.email}
                      </td>

                      <td>

                        <span
                          className={
                            user.role ===
                            "Admin"
                              ? "admin-role admin"
                              : user.role ===
                                "Freelancer"
                              ? "admin-role freelancer"
                              : "admin-role customer"
                          }
                        >
                          {getRoleText(
                            user.role
                          )}
                        </span>

                      </td>

                      <td>

                        <div className="admin-actions">

                          <button className="edit-btn">
                            Sửa
                          </button>

                          <button className="delete-btn">
                            Xóa
                          </button>

                        </div>

                      </td>

                    </tr>

                  ))}

                </tbody>

              </table>

            </div>

          </section>

        )}


        {/* ==================================================
            QUẢN LÝ DỊCH VỤ
        ================================================== */}

        {activeTab === "services" && (

          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <h2>
                  Danh sách dịch vụ
                </h2>

                <p>
                  Duyệt, sửa và xóa dịch vụ của Freelancer.
                </p>
              </div>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>ID</th>
                    <th>Tên dịch vụ</th>
                    <th>Danh mục</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>

                </thead>

                <tbody>

                  {services.map(
                    (service) => (

                      <tr
                        key={service.id}
                      >

                        <td>
                          #{service.id}
                        </td>

                        <td>
                          <strong>
                            {service.name}
                          </strong>
                        </td>

                        <td>
                          {service.category}
                        </td>

                        <td>
                          {Number(
                            service.price
                          ).toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </td>

                        <td>

                          <span
                            className={
                              service.status ===
                              "Đã duyệt"
                                ? "admin-status approved"
                                : "admin-status waiting"
                            }
                          >
                            {service.status}
                          </span>

                        </td>

                        <td>

                          <div className="admin-actions">

                            {service.status ===
                              "Chờ duyệt" && (

                              <button className="approve-btn">
                                Duyệt
                              </button>

                            )}

                            <button className="edit-btn">
                              Sửa
                            </button>

                            <button className="delete-btn">
                              Xóa
                            </button>

                          </div>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}


        {/* ==================================================
            QUẢN LÝ ĐƠN HÀNG
        ================================================== */}

        {activeTab === "orders" && (

          <section className="admin-card">

            <div className="admin-card-header">

              <div>
                <h2>
                  Danh sách đơn hàng
                </h2>

                <p>
                  Theo dõi và cập nhật trạng thái đơn hàng.
                </p>
              </div>

            </div>


            <div className="admin-table-wrapper">

              <table className="admin-table">

                <thead>

                  <tr>
                    <th>Mã đơn</th>
                    <th>Khách hàng</th>
                    <th>Freelancer</th>
                    <th>Dịch vụ</th>
                    <th>Giá</th>
                    <th>Trạng thái</th>
                    <th>Thao tác</th>
                  </tr>

                </thead>

                <tbody>

                  {orders.map(
                    (order) => (

                      <tr
                        key={order.id}
                      >

                        <td>
                          #DH
                          {String(
                            order.id
                          ).padStart(3, "0")}
                        </td>

                        <td>
                          {order.customer}
                        </td>

                        <td>
                          {order.freelancer}
                        </td>

                        <td>
                          {order.service}
                        </td>

                        <td>
                          {Number(
                            order.price
                          ).toLocaleString(
                            "vi-VN"
                          )}
                          đ
                        </td>

                        <td>

                          <span
                            className={
                              order.status ===
                              "Hoàn thành"
                                ? "admin-status approved"
                                : "admin-status waiting"
                            }
                          >
                            {order.status}
                          </span>

                        </td>

                        <td>

                          <select className="admin-select">

                            <option>
                              {order.status}
                            </option>

                            <option>
                              Chờ xác nhận
                            </option>

                            <option>
                              Đang thực hiện
                            </option>

                            <option>
                              Hoàn thành
                            </option>

                            <option>
                              Đã hủy
                            </option>

                          </select>

                        </td>

                      </tr>

                    )
                  )}

                </tbody>

              </table>

            </div>

          </section>

        )}

      </div>

    </main>
  );
}

export default Admin;