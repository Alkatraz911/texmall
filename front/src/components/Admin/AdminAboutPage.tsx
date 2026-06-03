"use client";

import React, { useEffect, useState } from "react";
import { AboutPageData } from "../../services/types";
import { aboutAPI } from "../../services/api";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./AdminAboutPage.css";

const AdminAboutPage: React.FC = () => {
  const [pageData, setPageData] = useState<AboutPageData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    aboutAPI
      .getPage()
      .then((response) => {
        const data = response.data;
        setPageData({
          ...data,
          qualityItems: data.qualityItems || [],
          deliveryOptions: data.deliveryOptions || [],
        });
      })
      .catch(() => toast.error("Ошибка загрузки страницы About"))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="admin-about-loading">Загрузка...</div>;
  if (!pageData)
    return <div className="admin-about-empty">Не удалось загрузить данные</div>;

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    field: keyof AboutPageData
  ) => {
    const value = e.target.value;
    setPageData((prev) => (prev ? { ...prev, [field]: value } : prev));
  };

  const handleArrayChange = (
    index: number,
    key: string,
    value: string,
    arrayName: "qualityItems" | "deliveryOptions"
  ) => {
    setPageData((prev) => {
      if (!prev) return prev;
      const arrayCopy = [...(prev[arrayName] || [])];
      arrayCopy[index] = { ...arrayCopy[index], [key]: value };
      return { ...prev, [arrayName]: arrayCopy };
    });
  };

  const addArrayItem = (arrayName: "qualityItems" | "deliveryOptions") => {
    setPageData((prev) => {
      if (!prev) return prev;
      const newItem =
        arrayName === "qualityItems"
          ? { title: "", text: "", icon: "" }
          : { title: "", text: "" };
      return { ...prev, [arrayName]: [...(prev[arrayName] || []), newItem] };
    });
  };

  const removeArrayItem = (
    index: number,
    arrayName: "qualityItems" | "deliveryOptions"
  ) => {
    setPageData((prev) => {
      if (!prev) return prev;
      const arrayCopy = [...(prev[arrayName] || [])];
      arrayCopy.splice(index, 1);
      return { ...prev, [arrayName]: arrayCopy };
    });
  };

  const handleSave = async () => {
    if (!pageData) return;
    setSaving(true);
    try {
      await aboutAPI.updatePage(pageData);
      toast.success("✅ Страница успешно обновлена!");
    } catch (e) {
      console.error(e);
      toast.error("❌ Ошибка при сохранении");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="admin-about-container">
      <div className="admin-about-header">
        <h2>Редактирование страницы About</h2>
        <button
          className="admin-about-save-btn"
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Сохраняем..." : "Сохранить"}
        </button>
      </div>

      <div className="admin-about-form">
        <div className="admin-about-form-group">
          <label>Заголовок</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.title}
            onChange={(e) => handleChange(e, "title")}
          />
        </div>

        <div className="admin-about-form-group">
          <label>Подзаголовок</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.subtitle}
            onChange={(e) => handleChange(e, "subtitle")}
          />
        </div>

        {/* История */}
        <div className="admin-about-form-group">
          <label>Заголовок истории</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.historyTitle}
            onChange={(e) => handleChange(e, "historyTitle")}
          />
        </div>

        <div className="admin-about-form-group">
          <label>Текст 1</label>
          <textarea
            className="admin-about-textarea"
            value={pageData.historyText1}
            onChange={(e) => handleChange(e, "historyText1")}
          />
        </div>

        <div className="admin-about-form-group">
          <label>Текст 2</label>
          <textarea
            className="admin-about-textarea"
            value={pageData.historyText2}
            onChange={(e) => handleChange(e, "historyText2")}
          />
        </div>

        {/* Блок качества */}
        <div className="admin-about-section">
          <h3>Элементы качества</h3>
          {(pageData.qualityItems || []).map((item, i) => (
            <div key={i} className="admin-about-item">
              <div className="admin-about-form-group">
                <label>Заголовок</label>
                <input
                  type="text"
                  className="admin-about-input"
                  value={item.title}
                  onChange={(e) =>
                    handleArrayChange(
                      i,
                      "title",
                      e.target.value,
                      "qualityItems"
                    )
                  }
                />
              </div>
              <div className="admin-about-form-group">
                <label>Текст</label>
                <textarea
                  className="admin-about-textarea"
                  value={item.text}
                  onChange={(e) =>
                    handleArrayChange(i, "text", e.target.value, "qualityItems")
                  }
                />
              </div>
              <button
                type="button"
                className="admin-about-remove-btn"
                onClick={() => removeArrayItem(i, "qualityItems")}
              >
                Удалить
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-about-add-btn"
            onClick={() => addArrayItem("qualityItems")}
          >
            Добавить элемент
          </button>
        </div>

        {/* Доставка */}
        <div className="admin-about-form-group">
          <label>Заголовок доставки</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.deliveryTitle}
            onChange={(e) => handleChange(e, "deliveryTitle")}
          />
        </div>

        <div className="admin-about-form-group">
          <label>Описание доставки</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.deliveryText}
            onChange={(e) => handleChange(e, "deliveryText")}
          />
        </div>

        <div className="admin-about-section">
          <h3>Опции доставки</h3>
          {(pageData.deliveryOptions || []).map((opt, i) => (
            <div key={i} className="admin-about-item">
              <div className="admin-about-form-group">
                <label>Название</label>
                <input
                  type="text"
                  className="admin-about-input"
                  value={opt.title}
                  onChange={(e) =>
                    handleArrayChange(
                      i,
                      "title",
                      e.target.value,
                      "deliveryOptions"
                    )
                  }
                />
              </div>
              <div className="admin-about-form-group">
                <label>Описание</label>
                <textarea
                  className="admin-about-textarea"
                  value={opt.text}
                  onChange={(e) =>
                    handleArrayChange(
                      i,
                      "text",
                      e.target.value,
                      "deliveryOptions"
                    )
                  }
                />
              </div>
              <button
                type="button"
                className="admin-about-remove-btn"
                onClick={() => removeArrayItem(i, "deliveryOptions")}
              >
                Удалить
              </button>
            </div>
          ))}
          <button
            type="button"
            className="admin-about-add-btn"
            onClick={() => addArrayItem("deliveryOptions")}
          >
            Добавить опцию
          </button>
        </div>

        {/* Дополнительные поля */}
        <div className="admin-about-form-group">
          <label>Описание доставки в фоне</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.deliveryNote}
            onChange={(e) => handleChange(e, "deliveryNote")}
          />
        </div>

        <div className="admin-about-form-group">
          <label>Заголовок перед кнопками</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.ctaTitle}
            onChange={(e) => handleChange(e, "ctaTitle")}
          />
        </div>

        <div className="admin-about-form-group">
          <label>Подзаголовок перед кнопками</label>
          <input
            type="text"
            className="admin-about-input"
            value={pageData.ctaSubtitle}
            onChange={(e) => handleChange(e, "ctaSubtitle")}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminAboutPage;
