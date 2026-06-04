"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homePageAPI, categoryAPI, type Collection } from "../services/api";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import heroImg from "../assets/mmain.jpg";
import placeholder from "../assets/placeholder-image.png";
import "./styles.css";

const API = process.env.REACT_APP_API_URL || "";
const FALLBACK_TITLE = "Ткань как предмет желания";

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
  const [heroTitle, setHeroTitle] = useState<string>(FALLBACK_TITLE);
  const [loading, setLoading] = useState(true);
  const [swiper, setSwiper] = useState<any>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let popularIds: number[] = [];
        try {
          const pageData = await homePageAPI.getPage();
          popularIds = pageData?.popularCollections ?? [];
          if (pageData?.heroTitle?.trim()) setHeroTitle(pageData.heroTitle);
        } catch {
          /* настройки главной не критичны */
        }

        const response = await categoryAPI.getAll();
        const all: Collection[] = response.data;
        const popular = all.filter((c) => popularIds.includes(c.id));
        setCollections(popular.length ? popular : all.slice(0, 8));
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;

  return (
    <div className="cin-page">
      {/* ---------- Кинематографичный hero ---------- */}
      <section className="cin-hero">
        <img className="cin-bg" src={heroImg} alt="" />
        <div className="cin-veil" />

        <div className="cin-hero__content">
          <span className="cin-eyebrow">Текс Молл · мебельные ткани</span>
          <h1 className="cin-title">{heroTitle}</h1>
          <Link to="/catalog" className="cin-cta">
            Открыть каталог <i aria-hidden>→</i>
          </Link>
        </div>

        <span className="cin-scroll">Листайте ↓</span>
      </section>

      {/* ---------- Слайдер коллекций ---------- */}
      {collections.length > 0 && (
        <section className="cin-collections">
          <div className="cin-collections__head">
            <h2 className="cin-h2">Коллекции</h2>
            <div className="cin-nav">
              <button onClick={() => swiper?.slidePrev()} aria-label="Назад">
                ‹
              </button>
              <button onClick={() => swiper?.slideNext()} aria-label="Вперёд">
                ›
              </button>
            </div>
          </div>
          <Swiper
            className="cin-swiper"
            onSwiper={setSwiper}
            spaceBetween={24}
            slidesPerView={1}
            breakpoints={{
              560: { slidesPerView: 2 },
              900: { slidesPerView: 3 },
              1200: { slidesPerView: 4 },
            }}
          >
            {collections.map((c, i) => (
              <SwiperSlide key={c.id}>
                <Link to={`/category/${c.id}`} className="cat-card">
                  <div className="cat-card__media">
                    <img
                      src={collectionImage(c)}
                      alt={c.name}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = placeholder)}
                    />
                  </div>
                  <div className="cat-card__overlay">
                    <span className="cat-card__index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="cat-card__row">
                      <h3>{c.name}</h3>
                      <span className="cat-card__cta">Смотреть →</span>
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </section>
      )}
    </div>
  );
};

export default HomePage;
