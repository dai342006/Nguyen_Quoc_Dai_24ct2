import { useEffect, useState } from "react";
import ServiceCard from "../components/ServiceCard";

// Trang danh sách dịch vụ
function Services({ setPage, setSelectedService }) {
  const [services, setServices] = useState([]);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả danh mục");
  const [sort, setSort] = useState("Sắp xếp: Phổ biến");

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // ========================================
  // Lấy dịch vụ từ SQL Server
  // ========================================
  useEffect(() => {
    async function loadServices() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "http://localhost:5000/api/services"
        );

        const data = await response.json();

        if (!response.ok) {
          setError(
            data.message ||
              "Không thể tải danh sách dịch vụ."
          );
          return;
        }

        setServices(
          Array.isArray(data) ? data : []
        );
      } catch (err) {
        console.error(
          "Lỗi tải dịch vụ:",
          err
        );

        setError(
          "Không thể kết nối đến máy chủ."
        );
      } finally {
        setLoading(false);
      }
    }

    loadServices();
  }, []);

  // ========================================
  // Chuyển dữ liệu SQL sang format ServiceCard
  // ========================================
  function convertService(service) {
    return {
      id: service.MaDichVu,
      title: service.TenDichVu,
      description: service.MoTa || "Chưa có mô tả.",
      category: service.DanhMuc,
      price: `${Number(
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
  // Lọc và sắp xếp
  // ========================================
  const filtered = services
    .map(convertService)
    .filter((service) => {
      const keyword =
        search.trim().toLowerCase();

      const matchSearch =
        service.title
          .toLowerCase()
          .includes(keyword) ||
        service.category
          .toLowerCase()
          .includes(keyword) ||
        service.description
          .toLowerCase()
          .includes(keyword);

      const matchCategory =
        category === "Tất cả danh mục" ||
        service.category === category;

      return (
        matchSearch &&
        matchCategory
      );
    })
    .sort((a, b) => {
      const priceA = Number(
        a.price.replace(/[^\d]/g, "")
      );

      const priceB = Number(
        b.price.replace(/[^\d]/g, "")
      );

      if (sort === "Giá thấp → cao") {
        return priceA - priceB;
      }

      if (sort === "Giá cao → thấp") {
        return priceB - priceA;
      }

      return 0;
    });

  return (
    <main className="page">
      <div className="container">

        {/* ========================================
            TIÊU ĐỀ
        ======================================== */}
        <div className="page-title">
          <p className="eyebrow">
            MARKETPLACE
          </p>

          <h1>
            Tất cả dịch vụ
          </h1>

          <p>
            Tìm dịch vụ phù hợp cho công việc
            của bạn.
          </p>
        </div>

        {/* ========================================
            BỘ LỌC
        ======================================== */}
        <div className="filter-bar">

          {/* Tìm kiếm */}
          <input
            value={search}
            onChange={(e) =>
              setSearch(e.target.value)
            }
            placeholder="Tìm kiếm dịch vụ..."
          />

          {/* Danh mục */}
          <select
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
          >
            <option>
              Tất cả danh mục
            </option>

            <option value="Lập trình">
              Lập trình
            </option>

            <option value="Thiết kế">
              Thiết kế
            </option>

            <option value="Marketing">
              Marketing
            </option>

            <option value="Viết nội dung">
              Viết nội dung
            </option>

            <option value="Dịch vụ khác">
              Dịch vụ khác
            </option>
          </select>

          {/* Sắp xếp */}
          <select
            value={sort}
            onChange={(e) =>
              setSort(e.target.value)
            }
          >
            <option>
              Sắp xếp: Phổ biến
            </option>

            <option value="Giá thấp → cao">
              Giá thấp → cao
            </option>

            <option value="Giá cao → thấp">
              Giá cao → thấp
            </option>
          </select>

        </div>

        {/* ========================================
            ĐANG TẢI
        ======================================== */}
        {loading && (
          <div className="empty-services">
            <div>⏳</div>

            <h3>
              Đang tải dịch vụ...
            </h3>

            <p>
              Vui lòng chờ một chút.
            </p>
          </div>
        )}

        {/* ========================================
            LỖI
        ======================================== */}
        {!loading && error && (
          <div className="empty-services">

            <div>⚠️</div>

            <h3>
              Không thể tải dịch vụ
            </h3>

            <p>
              {error}
            </p>

          </div>
        )}

        {/* ========================================
            KHÔNG CÓ DỊCH VỤ
        ======================================== */}
        {!loading &&
          !error &&
          filtered.length === 0 && (
            <div className="empty-services">

              <div>📦</div>

              <h3>
                Không tìm thấy dịch vụ
              </h3>

              <p>
                Thử thay đổi từ khóa hoặc danh mục.
              </p>

            </div>
          )}

        {/* ========================================
            DANH SÁCH DỊCH VỤ
        ======================================== */}
        {!loading &&
          !error &&
          filtered.length > 0 && (
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
          )}

      </div>
    </main>
  );
}

export default Services;