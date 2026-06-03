"use client";

import React, { useState, useEffect } from "react";
import "./Slider.css"; // стили для слайдера
import { Collection } from "../../services/api";

interface SliderProps {
  collections: Collection[];
}

export const Slider: React.FC<SliderProps> = ({ collections }) => {
  const [current, setCurrent] = useState(0);
  const length = collections.length;

  // Автопрокрутка
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % length);
    }, 4000);
    return () => clearInterval(interval);
  }, [length]);

  const nextSlide = () => setCurrent((current + 1) % length);
  const prevSlide = () => setCurrent((current - 1 + length) % length);

  return (
    <div className="slider">
      <button className="arrow left" onClick={prevSlide}>
        &#10094;
      </button>
      <button className="arrow right" onClick={nextSlide}>
        &#10095;
      </button>

      <div className="slides-wrapper">
        <div
          className="slides"
          style={{ transform: `translateX(-${current * 100}%)` }}
        >
          {collections.map((category) => (
            <div key={category.id} className="slide">
              <video
                className="category-video"
                src={(
                  process.env.REACT_APP_API_URL +
                  category.products.find(
                    (p) => p.id === category.featuredProductId
                  )?.videos?.[0]
                ).replaceAll("\\", "/")}
                autoPlay
                muted
                loop
                playsInline
              />
              <div className="category-content">
                <h3>{category.name}</h3>
                <p>{category.description}</p>
                <a
                  href={`/category/${category.id}`}
                  className="btn btn-outline"
                >
                  Смотреть
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
