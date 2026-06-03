"use client";

import React, { useEffect, useState } from "react";
import { contactAPI } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./AdminContactPage.css";

interface ContactPageData {
  city1: string
  address1: string;
  phone1: string | string[];
  email1: string;
  city2: string
  address2: string;
  phone2: string | string[];
  email2: string;
}

const fieldLabels: Record<keyof ContactPageData, string> = {
  address1: "Адрес",
  phone1: "Телефон",
  email1: "Электронная почта",
  city1: "Город",
    address2: "Адрес",
  phone2: "Телефон",
  email2: "Электронная почта",
  city2: "Город"
};

const textAreaFields: (keyof ContactPageData)[] = [
  "address1", "address2"
];

const AdminContactPage: React.FC = () => {
  const [data, setData] = useState<ContactPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    contactAPI
      .getPage()
      .then((res) => {
        const { id, ...rest } = res;
        setData(rest);
      })
      .catch(() => {
        toast.error("Ошибка загрузки данных страницы");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof ContactPageData
  ) => {
    setData((prev) => (prev ? { ...prev, [field]: e.target.value } : prev));
  };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await contactAPI.updatePage(data);
      toast.success("✅ Страница успешно сохранена!");
    } catch (e) {
      console.error(e);
      toast.error("❌ Ошибка при сохранении страницы");
    } finally {
      setSaving(false);
    }
  };

  if (loading)
    return <div className="admin-contact-loading">Загрузка данных...</div>;

  if (!data)
    return (
      <div className="admin-contact-empty">Не удалось загрузить данные</div>
    );

  return (
    <div className="admin-contact-container">
      <div className="admin-contact-header">
        <h2>Редактирование страницы «Контакты»</h2>
        <button
          className="admin-contact-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>

      <div className="admin-contact-form">
        {(Object.keys(data) as (keyof ContactPageData)[]).map((key) => {
          const label = fieldLabels[key];
          const value = data[key];

          return (
            <div className="admin-contact-form-group" key={key}>
              <label>{label}</label>
              {textAreaFields.includes(key) ? (
                <textarea
                  className="admin-contact-textarea"
                  value={value}
                  onChange={(e) => handleChange(e, key)}
                  rows={3}
                />
              ) : (
                <input
                  type="text"
                  className="admin-contact-input"
                  value={value}
                  onChange={(e) => handleChange(e, key)}
                />
              )}
            </div>
          );
        })}
      </div>

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default AdminContactPage;
