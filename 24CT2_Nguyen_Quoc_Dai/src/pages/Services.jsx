import { useState } from "react";
import services from "../data/services";
import ServiceCard from "../components/ServiceCard";

// Trang danh sách dịch vụ
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

export default Services;
