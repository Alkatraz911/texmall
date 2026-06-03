"use client";

import type React from "react";
import { Link } from "react-router-dom";
import "./AboutPageStyle.css";
import qr from "../assets/qr1.png";

const advantages = [
  { title: "Проверенные материалы", text: "Только лучшие ткани от надежных поставщиков" },
  { title: "Контроль качества", text: "Каждая партия проходит строгий контроль" },
  { title: "Современное производство", text: "Используем передовые технологии" },
  { title: "Актуальный дизайн", text: "Следим за интерьерными трендами" },
];

const AboutPage: React.FC = () => {
  return (
    <div className="aboutPage">
      <div className="aboutPageLeftPart">
        <h1>
          НАША ПРОДУКЦИЯ — ЭТО ТКАНИ, В КОТОРЫХ ТЕХНОЛОГИЧНОСТЬ СЛУЖИТ КОМФОРТУ И КРАСОТЕ.
        </h1>
        <p>
          Благодаря последним разработкам, наши ткани обеспечивают максимальное
          удобство и позволяют Вам наслаждаться жизнью в гармоничном и уютном
          пространстве.
        </p>
        <h2 id="coloredH2">ГОТОВЫ НАЧАТЬ РАБОТУ С НАМИ?</h2>
        <p>Оставьте заявку прямо сейчас!</p>
        <div className="aboutPageLeftPartButtonsContainer">
          <Link id="coloredBtn" to="/contact" className="btn btn-outline">
            Связаться с нами
          </Link>
          <Link to="/catalog" className="btn btn-outline">
            Посмотреть каталог
          </Link>
          <img src={qr} alt="QR-код для связи в WhatsApp" />
        </div>
      </div>

      <div className="aboutPageRightPart">
        {advantages.map((item) => (
          <div className="advantage" key={item.title}>
            <h2>{item.title}</h2>
            <p>{item.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AboutPage;
