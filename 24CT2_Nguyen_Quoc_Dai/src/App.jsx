import { useState } from "react";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import Services from "./pages/Services";
import ServiceDetail from "./pages/ServiceDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Freelancer from "./pages/Freelancer";
import Orders from "./pages/Orders";
import services from "./data/services";
import "./App.css";

// App quản lý trang hiện tại và kết nối các phần của website.
function App() {
  const [page, setPage] = useState("home");
  const [selectedService, setSelectedService] = useState(services[0]);

  const renderPage = () => {
    switch (page) {
      case "services":
        return (
          <Services
            setPage={setPage}
            setSelectedService={setSelectedService}
          />
        );

      case "detail":
        return (
          <ServiceDetail
            service={selectedService}
            setPage={setPage}
          />
        );

      case "login":
        return <Login setPage={setPage} />;

      case "register":
        return <Register setPage={setPage} />;

      case "freelancer":
        return <Freelancer setPage={setPage} />;

      case "orders":
        return <Orders setPage={setPage} />;

      default:
        return (
          <Home
            setPage={setPage}
            setSelectedService={setSelectedService}
          />
        );
    }
  };

  const authPage = page === "login" || page === "register";

  return (
    <div className="app">
      {!authPage && <Header page={page} setPage={setPage} />}
      {renderPage()}
      {!authPage && <Footer setPage={setPage} />}
    </div>
  );
}

export default App;
