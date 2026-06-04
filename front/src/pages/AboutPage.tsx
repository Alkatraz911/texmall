"use client";

import type React from "react";
import { Link } from "react-router-dom";
import "./AboutPageStyle.css";
import aboutImg from "../assets/about.jpg";
import qr from "../assets/qr.png";

const values = [
  { title: "Проверенные материалы", text: "Только лучшие ткани от надёжных поставщиков." },
  { title: "Контроль качества", text: "Каждая партия проходит строгий контроль." },
  { title: "Современное производство", text: "Используем передовые технологии." },
  { title: "Актуальный дизайн", text: "Следим за интерьерными трендами." },
];

const AboutPage: React.FC = () => {
  return (
    <div className="about2">
      {/* Hero */}
      <section className="about2-hero">
        <div className="about2-hero__text">
          <span className="about2-kicker">О компании</span>
          <h1 className="about2-title">
            Технологичность на службе <span>комфорта и красоты</span>
          </h1>
          <p className="about2-lead">
            Наша продукция — это ткани, в которых современные разработки
            обеспечивают максимальное удобство и позволяют наслаждаться жизнью
            в гармоничном и уютном пространстве.
          </p>
          <div className="about2-actions">
            <Link to="/catalog" className="btn-gold">
              Смотреть каталог
            </Link>
            <Link to="/contact" className="btn-ghost">
              Связаться с нами
            </Link>
          </div>
        </div>
        <div className="about2-hero__media">
          <img src={aboutImg} alt="Ткань в интерьере" />
        </div>
      </section>

      {/* Ценности */}
      <section className="about2-values">
        {values.map((v, i) => (
          <article className="about2-value" key={v.title}>
            <span className="about2-value__n">
              {String(i + 1).padStart(2, "0")}
            </span>
            <h3>{v.title}</h3>
            <p>{v.text}</p>
          </article>
        ))}
      </section>

      {/* CTA-полоса */}
      <section className="about2-cta">
        <div className="about2-cta__text">
          <h2>Готовы начать работу с нами?</h2>
          <p>Оставьте заявку — подберём ткань под вашу задачу и пришлём образцы.</p>
          <Link to="/contact" className="btn-gold">
            Оставить заявку
          </Link>
        </div>
        <div className="about2-qr">
          <img src={qr} alt="QR-код WhatsApp" />
          <span>Свяжитесь с нами в WhatsApp</span>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;
