"use client";

import React, { useEffect, useState } from "react";
import { contactAPI } from "../services/api";
import "./ContactPageStyle.css";
import qr from "../assets/qr.png";
import { Smartphone, Mail, MapPin } from "lucide-react";
import InputMask from "react-input-mask";

interface ContactPageData {
  phone1: string;
  email1: string;
  address1: string;
  city1: string;
  phone2: string;
  email2: string;
  address2: string;
  city2: string;
}

const ContactPage: React.FC = () => {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [errors, setErrors] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<"success" | "error" | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const page = await contactAPI.getPage();
        setData(page);
      } catch (error) {
        console.error("Ошибка загрузки данных контактов:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setErrors(prev => ({ ...prev, [name]: "" })); // сброс ошибки при вводе
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Валидация
    const newErrors = {
      name: !formData.name.trim() ? "Поле Имя обязательно" : "",
      email: !formData.email.trim() ? "Поле Email обязательно" : "",
      phone: !formData.phone.trim() ? "Поле Телефон обязательно" : "",
      message: !formData.message.trim() ? "Поле 'Что Вас интересует?' обязательно" : "",
    };

    setErrors(newErrors);

    // Если есть ошибки, не отправляем
    if (Object.values(newErrors).some(err => err !== "")) return;

    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      await contactAPI.send(formData);
      setSubmitStatus("success");
      setFormData({ name: "", email: "", phone: "", message: "" });
    } catch (error) {
      console.error(error);
      setSubmitStatus("error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <div className="loading-state">Загрузка...</div>;
  if (!data) return <div className="empty-state">Данные контактов не найдены</div>;

  return (
    <div className="contact2">
      <header className="contact2-head">
        <span className="contact2-kicker">Контакты</span>
        <h1 className="contact2-title">Свяжитесь с нами</h1>
        <p className="contact2-sub">
          Подберём ткань под вашу задачу и пришлём образцы. Заполните форму или
          напишите нам напрямую.
        </p>
      </header>

      <div className="contact-page">
        <div className="contactsWrapper">
        <div className="contacts-section">
          <h4>{data.city1}</h4>
          <div className="contacts">
            <div className="footer-paragraph">
              <strong className="phoneIcon"><Smartphone /></strong>
              <p style={{ whiteSpace: "pre-line" }}>{data.phone1.split(",").join("\n")}</p>
            </div>
            <div className="footer-paragraph">
              <strong><Mail /></strong>
              <p>{data.email1}</p>
            </div>
            <div className="footer-paragraph">
              <strong><MapPin /></strong>
              <p>{data.address1}</p>
            </div>
          </div>
        </div>

        <div className="contacts-section">
          <h4>{data.city2}</h4>
          <div className="contacts">
            <div className="footer-paragraph">
              <strong className="phoneIcon"><Smartphone /></strong>
              <p style={{ whiteSpace: "pre-line" }}>{data.phone2.split(",").join("\n")}</p>
            </div>
            <div className="footer-paragraph">
              <strong><Mail /></strong>
              <p>{data.email2}</p>
            </div>
            <div className="footer-paragraph">
              <strong><MapPin /></strong>
              <p>{data.address2}</p>
            </div>
          </div>
        </div>

        <div id="qr-section" className="contacts-section">
          <p>или свяжитесь с нами в WhatsApp</p>
          <img src={qr} alt="qr" />
        </div>
      </div>

      <div className="contactsFormWrapper">
        <div className="contact-form-section">
          <form className="contact-form" onSubmit={handleSubmit}>
            <p>Оставьте сообщение, и мы свяжемся с вами в ближайшее время</p>
            <span>Обязательно заполните все поля формы чтобы мы могли связаться с вами</span>

            <div className="form-group">
              <label htmlFor="name">Имя*</label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Ваше имя"
                className={errors.name ? "input-error" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="email">Email*</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="your@email.com"
                className={errors.email ? "input-error" : ""}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Телефон*</label>
              <InputMask
                mask="+7 (999) 999-99-99"
                value={formData.phone}
                onChange={handleInputChange}
              >
                {(inputProps: any) => (
                  <input
                    {...inputProps}
                    type="tel"
                    id="phone"
                    name="phone"
                    placeholder="+7 (___) ___-__-__"
                    className={errors.phone ? "input-error" : ""}
                  />
                )}
              </InputMask>
            </div>

            <div className="form-group">
              <label htmlFor="message">Что Вас интересует?*</label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                rows={5}
                placeholder="Расскажите о ваших потребностях в тканях..."
                className={errors.message ? "input-error" : ""}
              />
            </div>

            {submitStatus === "success" && (
              <div className="form-message success">
                Сообщение отправлено!
              </div>
            )}
            {submitStatus === "error" && (
              <div className="form-message error">
                Ошибка отправки сообщения.
              </div>
            )}

            <button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Отправка..." : "Отправить \u2192"}
            </button>
          </form>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ContactPage;
