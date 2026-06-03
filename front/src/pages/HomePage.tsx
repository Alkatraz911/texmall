"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homePageAPI, categoryAPI, type Collection } from "../services/api";
import heroImg from "../assets/mmain.jpg";
import placeholder from "../assets/placeholder-image.png";
import "./styles.css";

const API = process.env.REACT_APP_API_URL || "";

// Первое доступное изображение коллекции (featured-продукт → любой продукт).
function collectionImage(col: Collection): string {
  const featured = col.products?.find((p) => p.id === col.featuredProductId);
  const withImage =
    (featured?.images?.length ? featured : null) ||
    col.products?.find((p) => p.images?.length);
  const img = withImage?.images?.[0];
  return img ? `${API}${img}` : placeholder;
}

const HomePage: React.FC = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let popularIds: number[] = [];
        try {
          const pageData = await homePageAPI.getPage();
          popularIds = pageData?.popularCollections ?? [];
        } catch {
          /* настройки главной не критичны — покажем первые коллекции */
        }

        const response = await categoryAPI.getAll();
        const all: Collection[] = response.data;
        const popular = all.filter((c) => popularIds.includes(c.id));
        setCollections(popular.length ? popular : all.slice(0, 6));
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;

  const indexItems = collections.slice(0, 4);

  return (
    <div className="cin-page">
      {/* ---------- Кинематографичный hero ---------- */}
      <section className="cin-hero">
        <img className="cin-bg" src={heroImg} alt="" />
        <div className="cin-veil" />

        <div className="cin-top">
          <span className="cin-eyebrow">Текс Молл · мебельные ткани</span>
        </div>

        <div className="cin-main">
          <h1 className="cin-title">
            <span>Ткань как</span>
            <span className="cin-title__accent">предмет желания</span>
          </h1>
          <Link to="/catalog" className="cin-cta">
            Открыть каталог <i aria-hidden>→</i>
          </Link>
        </div>

        {indexItems.length > 0 && (
          <aside className="cin-index">
            <span className="cin-index__head">Коллекции</span>
            {indexItems.map((c, i) => (
              <Link
                to={`/category/${c.id}`}
                className="cin-index__row"
                key={c.id}
              >
                <span className="cin-index__n">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className="cin-index__name">{c.name}</span>
                <span className="cin-index__t">
                  {c.products?.[0]?.type || "ткань"}
                </span>
              </Link>
            ))}
          </aside>
        )}

        <span className="cin-scroll">Листайте ↓</span>
      </section>

      {/* ---------- Витрина коллекций ---------- */}
      {collections.length > 0 && (
        <section className="cin-collections">
          <h2 className="cin-h2">Коллекции</h2>
          <div className="cin-grid">
            {collections.map((c) => (
              <Link to={`/category/${c.id}`} className="cin-card" key={c.id}>
                <div className="cin-card__media">
                  <img
                    src={collectionImage(c)}
                    alt={c.name}
                    loading="lazy"
                    onError={(e) => (e.currentTarget.src = placeholder)}
                  />
                </div>
                <div className="cin-card__body">
                  <h3>{c.name}</h3>
                  <span className="cin-card__cta">Смотреть →</span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
};

export default HomePage;
