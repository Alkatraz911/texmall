"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { homePageAPI, categoryAPI, type Collection } from "../services/api";
import "./styles.css";
import { Navigation } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";

interface Advantage {
  title: string;
  description: string;
  icon: string;
}

interface HomePageData {
  heroTitle: string;
  heroSubtitle: string;
  heroVideo: string;
  advantages: Advantage[];
  popularCollections: number[];
}

const HomePage: React.FC = () => {
  const [data, setData] = useState<HomePageData | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await homePageAPI.getPage();
        setData(pageData);

        const response = await categoryAPI.getAll();
        const popular = response.data.filter((col: Collection) =>
          pageData.popularCollections.includes(col.id)
        );
        setCollections(popular);
      } catch (error) {
        console.error("Ошибка загрузки данных:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <div className="loading">Загрузка...</div>;
  if (!data) return <div className="loading">Данные главной страницы не найдены</div>;

  return (
    <div className="hero-page-container">
      <div className="home-page">
        <section className="hero">
          <div className="hero-overlay">
            <div className="hero-content">
              <h1 className="hero-title">{data.heroTitle}</h1>
              {data.heroSubtitle && (
                <p className="hero-subtitle">{data.heroSubtitle}</p>
              )}
              <div className="hero-btn">
                <Link to="/catalog" className="btn-luxury">
                  Смотреть каталог &rarr;
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section id="catalog" className="categories">
          {collections.length > 0 && (
            <Swiper
              modules={[Navigation]}
              spaceBetween={20}
              slidesPerView={2}
              navigation={true}
              autoHeight={true}
              breakpoints={{
                320: { slidesPerView: 1, spaceBetween: 20 },
                640: { slidesPerView: 2, spaceBetween: 30 },
                1280: { slidesPerView: 3, spaceBetween: 40 },
                2000: { slidesPerView: 4, spaceBetween: 50 },
              }}
              loop={true}
            >
              {collections.map((category) => (
                <SwiperSlide key={category.id}>
                  <Link to={`/category/${category.id}`} className="category-card">
                    <div className="category-overlay">
                      <div className="category-content">
                        <h3>{category.name}</h3>
                        <span className="btn btn-outline">Смотреть</span>
                      </div>
                    </div>
                  </Link>
                </SwiperSlide>
              ))}
            </Swiper>
          )}
        </section>
      </div>
    </div>
  );
};

export default HomePage;
