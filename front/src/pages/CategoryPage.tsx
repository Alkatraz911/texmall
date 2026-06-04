"use client";
import type React from "react";
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { categoryAPI, type Collection, type Product } from "../services/api";
import "./CategoryPage.css";

import { VideoPlayer } from "../components/ui/VideoPlayer";
import placeholderImage from "../assets/placeholder-image.png";
import hammerimage from "../assets/hammer.png"
import uvimage from "../assets/uv.png"
import nottoxicimage from "../assets/nottoxic.png"
import windimg from "../assets/wind.png"
import { Play } from "lucide-react";

const CategoryPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Collection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [selectedFabric, setSelectedFabric] = useState<Product | null>(null);
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;
      try {
        const categoryResponse = await categoryAPI.getById(Number.parseInt(id));
        const data: Collection = categoryResponse.data;
        setCategory(data);

        // Находим "featured" продукт
        const featuredFabric = data.products.find(
          (fabric) => fabric.id === data.featuredProductId
        );

        if (featuredFabric) {
          setSelectedFabric(featuredFabric);
          if (featuredFabric.videos.length > 0) {
            setSelectedVideo(process.env.REACT_APP_API_URL + featuredFabric.videos[0]);
          }
        }

        setLoading(false);
      } catch {
        setError("Ошибка загрузки данных");
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  function sortProductsByNameNumber(products) {
    return products.sort((a, b) => {
      const numA = parseInt(a.name.replace(/\D+/g, ""), 10);
      const numB = parseInt(b.name.replace(/\D+/g, ""), 10);
      return numA - numB;
    });
  }

  if (loading) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="loading-state">Загрузка...</div>
        </div>
      </div>
    );
  }

  if (error || !category) {
    return (
      <div className="category-page">
        <div className="container">
          <div className="error-state">{error || "Категория не найдена"}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="category-page">
      {/* Hero */}
      <section className="category-hero">
        <div>
          <nav className="breadcrumb">
            <Link to="/catalog">Каталог</Link>
            <span className="breadcrumb-separator">&rarr;</span>
            <span>{category.name}</span>
            <span className="breadcrumb-separator">&rarr;</span>
            <span>{selectedFabric?.name || ''}</span>
          </nav>
        </div>
      </section>

      {/* Main Content */}
      <div className="category-page--split">
        {/* Left: Видео или Изображение */}
        <div className="category-page__left">
          <div className="main-image-wrapper">
            {selectedImage ? (
              <img
                className="category-page__main-image"
                src={selectedImage}
                alt="Выбранная ткань"
                onError={(e) => (e.currentTarget.src = placeholderImage)}
              />
            ) : selectedVideo ? (
              <VideoPlayer
                src={selectedVideo}
                poster={
                  selectedFabric?.images?.[0]
                    ? process.env.REACT_APP_API_URL + selectedFabric.images[0]
                    : undefined
                }
              />
            ) : (
              <div className="nocontent">Цвета коллекции пока не загружены</div>
            )}
          </div>

          {/* Превью изображений выбранной ткани */}
          {selectedFabric && selectedFabric.images.length > 0 && (
            <div className="fabrics-preview-grid">
              {selectedFabric.images.map((img, idx) => {
                const imgUrl = process.env.REACT_APP_API_URL + img;
                return (
                  <div
                    key={`${selectedFabric.id}-img-${idx}`}
                    className={`fabric-preview-card${selectedImage === imgUrl ? " selected" : ""
                      }`}
                    onClick={() => {
                      setSelectedImage(imgUrl);
                      setSelectedVideo(null);
                    }}
                    title={`${selectedFabric.name} — изображение ${idx + 1}`}
                  >
                    <img
                      src={imgUrl}
                      alt={selectedFabric.name}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => (e.currentTarget.src = placeholderImage)}
                    />
                    <span className="fabric-preview-number"></span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right: превью + информация */}
        <div className="category-page__right">
          <div>
            <h1 className="category-title">{category.name}</h1>
            <p className="category-subtitle">Цвета коллекции</p>
          </div>

          {/* Сетка превью видео всех тканей */}
          <div className="catalog-preview-grid">
            {sortProductsByNameNumber(category.products).map((fabric) =>
              fabric.videos.map((video, idx) => {
                const videoUrl = process.env.REACT_APP_API_URL + video;
                const previewImg =
                  fabric.images.length > 0
                    ? process.env.REACT_APP_API_URL + fabric.images[0]
                    : placeholderImage;

                return (
                  <div
                    key={`${fabric.id}-video-${idx}`}
                    className={`fabric-preview-card${selectedVideo === videoUrl ? " selected" : ""
                      }`}
                    onClick={() => {
                      setSelectedFabric(fabric);
                      setSelectedVideo(videoUrl);
                      setSelectedImage(null);
                    }}
                    title={`${fabric.name} — видео`}
                  >
                    <img
                      src={previewImg}
                      alt={`${fabric.name} видео превью`}
                      loading="lazy"
                      decoding="async"
                      onError={(e) => (e.currentTarget.src = placeholderImage)}
                    />
                    <Play className="fabric-preview-videoicon" />
                    <span className="fabric-preview-video">
                      {parseInt(fabric.name.replace(/\D+/g, ""), 10)}
                    </span>
                  </div>
                );
              })
            )}
          </div>

          {/* Информация о ткани */}

          <div className="category-page__tech">
            <h4>Технические данные</h4>
            <div className="tech-wrapper">
              <div className="tech-content">
                {selectedFabric ? (
                  <>
                    <div>
                      <p>Тип ткани:
                      </p>
                      <p>{selectedFabric.type}
                      </p>
                    </div>
                    <div>
                      <p>
                        Устойчивость к истиранию:
                      </p>
                      <p>
                        {selectedFabric.resistance} циклов
                      </p>
                    </div>
                    <div>
                      <p>Плотность:
                      </p>
                      <p>{selectedFabric.density} г/м2
                      </p>
                    </div>
                    <div>
                      <p>Ширина:
                      </p>
                      <p>{selectedFabric.width} +/-2см
                      </p>
                    </div>
                  </>
                ) : (
                  <div>Выберите ткань, чтобы увидеть детали</div>
                )}
              </div>
              <div className="techIcons">
                <img src={hammerimage} alt="износоустойчивость" />
                <img src={uvimage} alt="цветоустойчивость" />
                <img src={nottoxicimage} alt="не токсично" />
                <img src={windimg} alt="дышащая ткань" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CategoryPage;
