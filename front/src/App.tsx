// App.tsx
import type { ReactNode } from "react";
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from "react-router-dom";
import Header from "./components/Layout/Header";
import Footer from "./components/Layout/Footer";
import HomePage from "./pages/HomePage";
import CatalogPage from "./pages/CatalogPage";
import CategoryPage from "./pages/CategoryPage";
import AboutPage from "./pages/AboutPage";
import ContactPage from "./pages/ContactPage";
import AdminLogin from "./pages/Admin/AdminLogin";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import { ToastContainer } from "react-toastify";
import BackgroundWrapper from "./components/ui/BackgroundWrapper";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import mainbkgnd from "./assets/mmain.jpg";
import aboutbkgnd from "./assets/about.jpg";
import contactbkgnd from "./assets/contacts1.jpg";

// Сопоставление маршрута с фоновым изображением. Каталог и категории
// намеренно остаются на нейтральной подложке, чтобы фактуры тканей
// (карточки) читались без визуального шума.
function backgroundForPath(pathname: string): string | null {
  if (pathname === "/") return mainbkgnd;
  if (pathname.startsWith("/about")) return aboutbkgnd;
  if (pathname.startsWith("/contact")) return contactbkgnd;
  return null;
}

function BackgroundLayout({ children }: { children: ReactNode }) {
  const location = useLocation();
  return (
    <BackgroundWrapper image={backgroundForPath(location.pathname)}>
      {children}
    </BackgroundWrapper>
  );
}

function NotFound() {
  return (
    <div className="not-found">
      <h1>404</h1>
      <p>Страница не найдена</p>
      <Link to="/" className="btn-luxury">
        На главную
      </Link>
    </div>
  );
}

function App() {
  return (
    <Router>
      <BackgroundLayout>
        <div className="App">
          <Header />
          <main className="main-content">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/catalog" element={<CatalogPage />} />
              <Route path="/category/:id" element={<CategoryPage />} />
              <Route path="/about" element={<AboutPage />} />
              <Route path="/contact" element={<ContactPage />} />
              <Route path="/admin/login" element={<AdminLogin />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
          <Footer />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
        </div>
      </BackgroundLayout>
    </Router>
  );
}

export default App;
