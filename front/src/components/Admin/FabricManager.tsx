"use client";

import React, { useState, useEffect } from "react";
import {
  fabricAPI,
  categoryAPI,
  type Product,
  type Collection,
} from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./FabricManager.css";

type FabricPayload = {
  id?: number;
  name: string;
  description?: string;
  collection: number;
  type: string;
  density: string;
  width: string;
  resistance: string;
  images?: string[];
  videos?: string[];
};

const API_URL = process.env.REACT_APP_API_URL || "";

const toSrc = (path: string) =>
  !path ? "" : /^https?:\/\//i.test(path) ? path : `${API_URL}${path}`;

const FabricManager: React.FC = () => {
  const [fabrics, setFabrics] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingFabric, setEditingFabric] = useState<Product | null>(null);

  const [searchQuery, setSearchQuery] = useState(""); // состояние для поиска

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    images: [] as string[],
    videos: [] as string[],
    collection: 0,
    type: "",
    resistance: "",
    density: "",
    width: "",
  });

  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [videoFiles, setVideoFiles] = useState<File[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [fabricsRes, categoriesRes] = await Promise.all([
        fabricAPI.getAll(),
        categoryAPI.getAll(),
      ]);
      setFabrics(fabricsRes.data);
      setCategories(categoriesRes.data);
    } catch (err) {
      console.error(err);
      toast.error("❌ Ошибка загрузки данных");
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // фильтруем ткани по названию и сортируем по возрастанию
const filteredFabrics = fabrics
  .filter(f =>
    f.name.toLowerCase().includes(searchQuery.toLowerCase())
  )
  .sort((a, b) => {
    const numA = parseInt(a.name.match(/\d+/)?.[0] || "0", 10);
    const numB = parseInt(b.name.match(/\d+/)?.[0] || "0", 10);
    return numA - numB;
  });



  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: ["collection"].includes(name) ? parseInt(value) || 0 : value,
    }));
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: "images" | "videos"
  ) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    if (type === "images") setImageFiles((prev) => [...prev, ...files]);
    else setVideoFiles((prev) => [...prev, ...files]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return toast.warning("⚠️ Название ткани обязательно");
    if (!formData.collection) return toast.warning("⚠️ Выберите коллекцию");

    try {
      const payload: FabricPayload = {
        name: formData.name,
        description: formData.description,
        collection: formData.collection,
        type: formData.type,
        images: formData.images,
        videos: formData.videos,
        resistance: formData.resistance,
        width: formData.width,
        density: formData.density,
      };

      let product: Product;

      if (editingFabric) {
        payload.id = editingFabric.id;
        product = (await fabricAPI.update(editingFabric.id, payload)).data;
        toast.success("✅ Ткань обновлена");
      } else {
        product = (await fabricAPI.create(payload)).data;
        toast.success("✅ Ткань создана");
      }

      if (imageFiles.length > 0) await fabricAPI.uploadImages(product.id, imageFiles);
      if (videoFiles.length > 0) await fabricAPI.uploadVideos(product.id, videoFiles);

      await fetchData();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("❌ Ошибка при сохранении ткани");
    }
  };

  const handleEdit = (fabric: Product) => {
    setEditingFabric(fabric);
    setFormData({
      name: fabric.name,
      description: fabric.description || "",
      images: fabric.images || [],
      videos: fabric.videos || [],
      collection: fabric.collection.id,
      density: fabric.density || "",
      type: fabric.type || "",
      width: fabric.width || "",
      resistance: fabric.resistance || "",
    });
    setImageFiles([]);
    setVideoFiles([]);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Вы уверены, что хотите удалить эту ткань?")) return;
    try {
      await fabricAPI.delete(id);
      toast.success("✅ Ткань удалена");
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Ошибка при удалении ткани");
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      images: [],
      videos: [],
      collection: 0,
      type: "",
      width: "",
      density: "",
      resistance: "",
    });
    setImageFiles([]);
    setVideoFiles([]);
    setEditingFabric(null);
    setShowForm(false);
  };
  // ===== Удаление уже загруженных файлов (сервер) =====
  const handleRemoveExistingImage = async (index: number) => {
    if (!editingFabric) return;
    const filename = formData.images[index];
    if (!window.confirm("Удалить это изображение?")) return;

    try {
      await fabricAPI.deleteImage(editingFabric.id, filename);
      toast.success("✅ Изображение удалено");
      setFormData((prev) => ({
        ...prev,
        images: prev.images.filter((_, i) => i !== index),
      }));
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Ошибка при удалении изображения");
    }
  };
    const handleRemoveExistingVideo = async (index: number) => {
    if (!editingFabric) return;
    const filename = formData.videos[index];
    if (!window.confirm("Удалить это видео?")) return;

    try {
      await fabricAPI.deleteVideo(editingFabric.id, filename);
      toast.success("✅ Видео удалено");
      setFormData((prev) => ({
        ...prev,
        videos: prev.videos.filter((_, i) => i !== index),
      }));
      await fetchData();
    } catch (err) {
      console.error(err);
      toast.error("❌ Ошибка при удалении видео");
    }
  };

  
  const removeImageFile = (index: number) =>
    setImageFiles((prev) => prev.filter((_, i) => i !== index));
  const removeVideoFile = (index: number) =>
    setVideoFiles((prev) => prev.filter((_, i) => i !== index));

  if (loading) return <div className="fm-loading">Загрузка тканей...</div>;

  return (
    <div className="fm-container">
      <ToastContainer position="top-right" autoClose={3000} />

      <div className="fm-header">
        <h2>Управление тканями</h2>
        <button className="fm-btn-primary" onClick={() => setShowForm(true)}>
          Добавить ткань
        </button>
      </div>

      {/* Фильтр по названию */}
      <div className="fm-search-bar">
        <input
          type="text"
          placeholder="Введите название ткани..."
          value={searchQuery}
          onChange={handleSearchChange}
        />
      </div>

      {/* Форма */}
      {showForm && (
        <div className="fm-modal">
          <div className="fm-modal-content">
            <div className="fm-modal-header">
              <h3>
                {editingFabric ? "Редактировать ткань" : "Добавить ткань"}
              </h3>
              <button className="fm-close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="fm-form-group">
                <label htmlFor="name">Название *</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="fm-form-group">
                <label htmlFor="collection">Коллекция *</label>
                <select
                  id="collection"
                  name="collection"
                  value={formData.collection}
                  onChange={handleInputChange}
                  required
                >
                  <option value={0}>Выберите коллекцию</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="fm-form-group">
                <label htmlFor="description">Описание</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              <div className="fm-form-group">
                <label htmlFor="type">Тип ткани</label>
                <input
                  type="text"
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <p><strong>Следующие три поля вносить только числовые значения</strong></p>
              <div className="fm-form-group">
                <label htmlFor="resistance">Устойчивость к истиранию</label>
                <input
                  type="text"
                  id="resistance"
                  name="resistance"
                  value={formData.resistance}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="fm-form-group">
                <label htmlFor="density">Плотность</label>
                <input
                  type="text"
                  id="density"
                  name="density"
                  value={formData.density}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="fm-form-group">
                <label htmlFor="width">Ширина</label>
                <input
                  type="text"
                  id="width"
                  name="width"
                  value={formData.width}
                  onChange={handleInputChange}
                  required
                />

              </div>


              {/* === Загрузка изображений === */}
              <div className="fm-file-group">
                <label className="fm-file-label" htmlFor="images">
                  Изображения
                </label>
                <div className="fm-file-input-wrapper">
                  <input
                    type="file"
                    id="images"
                    className="fm-file-input"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "images")}
                  />
                  <label htmlFor="images" className="fm-file-btn">
                    Выбрать файлы
                  </label>
                </div>

                {/* Превью новых изображений */}
                <div className="fm-images-preview">
                  {imageFiles.map((file, i) => (
                    <div key={i} className="fm-image-item">
                      <img src={URL.createObjectURL(file)} alt={file.name} />
                      <button
                        className="fm-remove-btn"
                        type="button"
                        onClick={() => removeImageFile(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Существующие изображения */}
                <div className="fm-images-preview">
                  {editingFabric &&
                    formData.images.map((url, i) => (
                      <div key={`existing-img-${i}`} className="fm-image-item">
                        <img src={toSrc(url)} alt={`Изображение ${i + 1}`} />
                        <button
                          className="fm-remove-btn"
                          type="button"
                          onClick={() => handleRemoveExistingImage(i)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              {/* === Загрузка видео === */}
              <div className="fm-file-group">
                <label className="fm-file-label" htmlFor="videos">
                  Видео
                </label>
                <div className="fm-file-input-wrapper">
                  <input
                    type="file"
                    id="videos"
                    className="fm-file-input"
                    accept="video/*"
                    multiple
                    onChange={(e) => handleFileChange(e, "videos")}
                  />
                  <label htmlFor="videos" className="fm-file-btn">
                    Выбрать файлы
                  </label>
                </div>

                {/* Превью новых видео */}
                <div className="fm-videos-preview">
                  {videoFiles.map((file, i) => (
                    <div key={i} className="fm-video-item">
                      <video src={URL.createObjectURL(file)} controls />
                      <button
                        className="fm-remove-btn"
                        type="button"
                        onClick={() => removeVideoFile(i)}
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>

                {/* Существующие видео */}
                <div className="fm-videos-preview">
                  {editingFabric &&
                    formData.videos.map((url, i) => (
                      <div key={`existing-vid-${i}`} className="fm-video-item">
                        <video src={toSrc(url)} controls />
                        <button
                          className="fm-remove-btn"
                          type="button"
                          onClick={() => handleRemoveExistingVideo(i)}
                        >
                          ×
                        </button>
                      </div>
                    ))}
                </div>
              </div>

              <div className="fm-form-actions">
                <button
                  type="button"
                  className="fm-btn-outline"
                  onClick={resetForm}
                >
                  Отмена
                </button>
                <button type="submit" className="fm-btn-primary">
                  {editingFabric ? "Обновить" : "Создать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Список тканей */}
      <div className="fm-fabrics-list">
        {filteredFabrics.length === 0 ? (
          <div className="fm-empty-state">Ткани не найдены</div>
        ) : (
          <div className="fm-fabrics-grid">
            {filteredFabrics.map((f) => (
              <div key={f.id} className="fm-fabric-item">
                <div className="fm-fabric-image">
                  {f.videos && f.videos.length > 0 ? (
                    <video src={toSrc(f.videos[0])} controls />
                  ) : (
                    <div className="fm-no-image">Нет видео</div>
                  )}
                </div>
                <div className="fm-fabric-info">
                  <h4>{f.name}</h4>
                  <p className="fm-fabric-category">{f.collection?.name}</p>
                  <p className="fm-fabric-description">
                    {f.description || "Без описания"}
                  </p>
                </div>
                <div className="fm-fabric-actions">
                  <button
                    className="fm-btn-icon"
                    onClick={() => handleEdit(f)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="fm-btn-icon"
                    onClick={() => handleDelete(f.id)}
                    title="Удалить"
                  >
                    🗑️
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default FabricManager;
