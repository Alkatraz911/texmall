"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryAPI, type Collection } from "../services/api";
import placeholder from "../assets/placeholder-image.png";
import "./CatalogPage.css";

const API = process.env.REACT_APP_API_URL || "";

const CatalogPage: React.FC = () => {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryAPI.getAll();
        setCategories(response.data);
        setLoading(false);
      } catch (err) {
        setError("Ошибка загрузки категорий");
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  if (loading) {
    return (
      <div className="catalog-page">
        <div className="loading-state">Загрузка каталога...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-page">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="catalog-page">
      <header className="catalog-head">
        <span className="catalog-kicker">Текс Молл · каталог</span>
        <h1 className="catalog-title">Коллекции тканей</h1>
        <p className="catalog-subtitle">
          Велюр, шенилл, рогожка и жаккард — выберите коллекцию, чтобы
          рассмотреть цвета и характеристики.
        </p>
      </header>

      <section className="catalog-content">
        {categories.length === 0 ? (
          <div className="empty-state">
            <h3>Каталог пуст</h3>
            <p>В данный момент коллекции не добавлены</p>
          </div>
        ) : (
          <div className="catalog-grid">
            {categories.map((category, i) => {
              const featured = category.products?.find(
                (p) => p.id === category.featuredProductId
              );
              const imgUrl =
                featured?.images?.[0] ||
                category.products?.find((p) => p.images?.length)?.images?.[0];
              const poster = imgUrl ? API + imgUrl : placeholder;

              return (
                <Link
                  to={`/category/${category.id}`}
                  key={category.id}
                  className="cat-card"
                >
                  <div className="cat-card__media">
                    <img
                      src={poster}
                      alt={category.name}
                      loading="lazy"
                      onError={(e) => (e.currentTarget.src = placeholder)}
                    />
                  </div>
                  <div className="cat-card__overlay">
                    <span className="cat-card__index">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="cat-card__row">
                      <h3>{category.name}</h3>
                      <span className="cat-card__cta">Смотреть →</span>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
};

export default CatalogPage;
