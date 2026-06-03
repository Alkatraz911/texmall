"use client";
/* eslint-disable @typescript-eslint/no-unused-vars -- хендлеры относятся к временно отключённым (закомментированным) блокам редактора */

import React, { useEffect, useState } from "react";
import { homePageAPI, categoryAPI } from "../../services/api";
import { toast } from "react-toastify";
import "./AdminHomePage.css";

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

const AdminHomePage: React.FC = () => {
  const [data, setData] = useState<HomePageData | null>(null);
  const [collections, setCollections] = useState<{ id: number; name: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploadingHero, setUploadingHero] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const pageData = await homePageAPI.getPage();
        const collectionsData = await categoryAPI.getAll();
        setData(pageData);
        setCollections(collectionsData.data);
      } catch (error) {
        console.error("Ошибка загрузки:", error);
        toast.error("Ошибка загрузки данных");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroChange = (field: keyof HomePageData, value: string) => {
    if (data) setData({ ...data, [field]: value });
  };

  const handleAdvantageChange = (index: number, field: keyof Advantage, value: string) => {
    if (!data) return;
    const updated = [...data.advantages];
    updated[index] = { ...updated[index], [field]: value };
    setData({ ...data, advantages: updated });
  };

  const handleAddAdvantage = () => {
    if (!data) return;
    setData({
      ...data,
      advantages: [...data.advantages, { title: "", description: "", icon: "" }],
    });
  };

  const handleRemoveAdvantage = (index: number) => {
    if (!data) return;
    setData({ ...data, advantages: data.advantages.filter((_, i) => i !== index) });
  };

  const handleCollectionsChange = (id: number) => {
    if (!data) return;
    const updated = data.popularCollections.includes(id)
      ? data.popularCollections.filter((c) => c !== id)
      : [...data.popularCollections, id];
    setData({ ...data, popularCollections: updated });
  };

  const handleHeroVideoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !data) return;
    setUploadingHero(true);
    try {
      const url = await homePageAPI.uploadVideo(file);
      setData({ ...data, heroVideo: url });
      toast.success("Видео Hero загружено!");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка загрузки видео");
    } finally {
      setUploadingHero(false);
    }
  };

    const handleDeleteHeroVideo = async () => {
      if (!data?.heroVideo) return;
      try {
        // Здесь нужно реализовать на сервере удаление видео по URL
        await homePageAPI.deleteHeroVideo();
        setData({ ...data, heroVideo: "" });
        toast.success("Видео удалено");
      } catch (error) {
        console.error(error);
        toast.error("Ошибка удаления видео");
      }
    };

  const handleSave = async () => {
    if (!data) return;
    setSaving(true);
    try {
      await homePageAPI.updateHeroAndAdvantages({
        heroTitle: data.heroTitle,
        heroSubtitle: data.heroSubtitle,
        heroVideo: data.heroVideo,
        advantages: data.advantages,
      });
      await homePageAPI.updateCollections(data.popularCollections);
      toast.success("Изменения сохранены!");
    } catch (error) {
      console.error(error);
      toast.error("Ошибка сохранения изменений");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <p className="admin-home-loading">Загрузка...</p>;

  return (
    <div className="admin-home-container">
      <div className="admin-home-header">
        <h2>Настройка Главной страницы</h2>
      </div>

      {/* HERO */}
      <section className="admin-home-section">
        <h3>Заголовок возле кнопки</h3>
        <input
          className="admin-home-input"
          type="text"
          value={data?.heroTitle || ""}
          onChange={(e) => handleHeroChange("heroTitle", e.target.value)}
          placeholder="Заголовок"
        />
        {/* <input
          className="admin-home-input"
          type="text"
          value={data?.heroSubtitle || ""}
          onChange={(e) => handleHeroChange("heroSubtitle", e.target.value)}
          placeholder="Подзаголовок"
        /> */}
        {/* <div className="admin-home-upload">
          <label>Видео Hero:</label>
          <input
            type="file"
            accept="video/*"
            onChange={handleHeroVideoUpload}
          />
          {uploadingHero && <p>Загрузка видео...</p>}
        </div> */}

        {/* Превью видео и кнопка удаления */}
        {/* {data?.heroVideo && (
          <div className="admin-home-video-preview">
            <video src={data.heroVideo} controls className="admin-home-video" />
            <button onClick={handleDeleteHeroVideo} className="admin-home-btn">
              Удалить видео
            </button>
          </div>
        )} */}
      </section>

      {/* ADVANTAGES */}
      {/* <section className="admin-home-advantages">
        <h3>Преимущества</h3>
        {data?.advantages.map((adv, index) => (
          <div key={index} className="admin-home-section">
            <input
              className="admin-home-input"
              type="text"
              value={adv.title}
              onChange={(e) =>
                handleAdvantageChange(index, "title", e.target.value)
              }
              placeholder="Заголовок"
            />
            <input
              className="admin-home-input"
              type="text"
              value={adv.description}
              onChange={(e) =>
                handleAdvantageChange(index, "description", e.target.value)
              }
              placeholder="Описание"
            />
            <button
              className="admin-home-btn"
              onClick={() => handleRemoveAdvantage(index)}
            >
              Удалить
            </button>
          </div>
        ))}
        <button className="admin-home-btn" onClick={handleAddAdvantage}>
          Добавить преимущество
        </button>
      </section> */}

      {/* POPULAR COLLECTIONS */}
      <section className="admin-home-section admin-home-checkbox">
        <h3>Коллекции в слайдере</h3>
        {collections.map((col) => (
          <label key={col.id}>
            <input
              type="checkbox"
              checked={data?.popularCollections.includes(col.id) || false}
              onChange={() => handleCollectionsChange(col.id)}
            />
            {col.name}
          </label>
        ))}
      </section>

      <button className="admin-home-btn" onClick={handleSave} disabled={saving}>
        {saving ? "Сохранение..." : "Сохранить изменения"}
      </button>
    </div>
  );
};

export default AdminHomePage;
