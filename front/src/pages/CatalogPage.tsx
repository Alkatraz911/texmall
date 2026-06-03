"use client";

import type React from "react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { categoryAPI, type Collection } from "../services/api";
import { VideoPlayer } from "../components/ui/VideoPlayer";
import "./CatalogPage.css";

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
        <div className="container">
          <div className="loading-state">Загрузка каталога...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="catalog-page">
        <div className="container">
          <div className="error-state">{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div
      className="catalog-page"
    >
      {/* <div className="catalog-hero">
        <div className="container">
          <h1 className="catalog-title">Каталог тканей</h1>
          <p className="catalog-subtitle">Выберите категорию тканей для просмотра доступных вариантов</p>
        </div>
      </div> */}

      <section className="catalog-content">
        
          {categories.length === 0 ? (
            <div className="empty-state">
              <h3>Каталог пуст</h3>
              <p>В данный момент категории тканей не добавлены</p>
            </div>
          ) : (
            <div className="catalog-grid">
              {categories.map((category) => {
                let url = category.products.find(
                  (product) => product.id === category.featuredProductId
                )?.videos[0];

                return (
                  <div key={category.id} className="category-card">
                    <div className="category-overlayer">
                      <VideoPlayer
                        className="category-video"
                        src={process.env.REACT_APP_API_URL + url}
                      />
                      <div className="category-content">
                        <h3>{category.name}</h3>
                        <Link
                          to={`/category/${category.id}`}
                          className="btn btn-outline"
                        >
                          Смотреть
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
      </section>
    </div>
  );
};

export default CatalogPage;
