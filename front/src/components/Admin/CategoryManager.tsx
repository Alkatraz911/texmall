"use client";

import React, { useState, useEffect } from "react";
import { categoryAPI, type Collection } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./CategoryManager.css";

const CategoryManager: React.FC = () => {
  const [categories, setCategories] = useState<Collection[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCollection, setEditingCollection] = useState<Collection | null>(
    null
  );
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    featuredProductId: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await categoryAPI.getAll();
      setCategories(response.data);
    } catch (error) {
      console.error("Ошибка загрузки коллекций:", error);
      toast.error("❌ Ошибка загрузки коллекций");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFeaturedProductChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFormData((prev) => ({
      ...prev,
      featuredProductId: Number(e.target.value) || 0,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.warning("⚠️ Название коллекции обязательно");
      return;
    }
    try {
      if (editingCollection) {
        await categoryAPI.update(editingCollection.id, formData);
        toast.success("✅ Коллекция обновлена");
      } else {
        await categoryAPI.create(formData);
        toast.success("✅ Коллекция добавлена");
      }
      await fetchCategories();
      resetForm();
    } catch (error) {
      console.error("Ошибка сохранения коллекции:", error);
      toast.error("❌ Ошибка при сохранении коллекции");
    }
  };

  const handleEdit = (category: Collection) => {
    setEditingCollection(category);
    setFormData({
      name: category.name,
      description: category.description || "",
      featuredProductId: category.featuredProductId || 0,
    });
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (window.confirm("Вы уверены, что хотите удалить эту коллекцию?")) {
      try {
        await categoryAPI.delete(id);
        toast.success("✅ Коллекция удалена");
        await fetchCategories();
      } catch (error) {
        console.error("Ошибка удаления коллекции:", error);
        toast.error("❌ Ошибка при удалении");
      }
    }
  };

  const resetForm = () => {
    setFormData({ name: "", description: "", featuredProductId: 0 });
    setEditingCollection(null);
    setShowForm(false);
  };

  if (loading)
    return (
      <div className="loading-state cm-loading-state">
        Загрузка коллекций...
      </div>
    );

  return (
    <div className="cm-container">
      <div className="cm-header">
        <h2>Управление коллекциями</h2>
        <button className="cm-btn-primary" onClick={() => setShowForm(true)}>
          Добавить коллекцию
        </button>
      </div>

      {showForm && (
        <div className="cm-modal">
          <div className="cm-modal-content">
            <div className="cm-modal-header">
              <h3>
                {editingCollection
                  ? "Редактировать коллекцию"
                  : "Добавить коллекцию"}
              </h3>
              <button className="cm-close-btn" onClick={resetForm}>
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="cm-form-group">
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

              <div className="cm-form-group">
                <label htmlFor="description">Описание</label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                />
              </div>

              {editingCollection && (
                <div className="cm-form-group">
                  <label htmlFor="featuredProductId">
                    Выбрать ткань для карточки коллекции
                  </label>
                  <select
                    id="featuredProductId"
                    name="featuredProductId"
                    value={formData.featuredProductId || ""}
                    onChange={handleFeaturedProductChange}
                  >
                    <option value="">-- выберите ткань --</option>
                    {editingCollection.products.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.id})
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="cm-form-actions">
                <button
                  type="button"
                  className="cm-btn-outline"
                  onClick={resetForm}
                >
                  Отмена
                </button>
                <button type="submit" className="cm-btn-primary">
                  {editingCollection ? "Обновить" : "Создать"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="cm-categories-list">
        {categories.length === 0 ? (
          <div className="cm-empty-state">Коллекции не найдены</div>
        ) : (
          <div className="cm-fabrics-grid">
            {categories.map((category) => (
              <div key={category.id} className="cm-category-item">
                <div className="cm-fabric-image">
                  {category.products && category.products.length > 0 ? (
                    <video
                      src={
                        process.env.REACT_APP_API_URL +
                          category.products.find(
                            (p) => p.id === category.featuredProductId
                          )?.videos[0] || ""
                      }
                    />
                  ) : (
                    <div className="cm-no-image">Нет тканей в коллекции</div>
                  )}
                </div>
                <div className="cm-category-info">
                  <h4>{category.name}</h4>
                  <p>{category.description || "Без описания"}</p>
                </div>
                <div className="cm-category-actions">
                  <button
                    className="cm-btn-icon"
                    onClick={() => handleEdit(category)}
                    title="Редактировать"
                  >
                    ✏️
                  </button>
                  <button
                    className="cm-btn-icon"
                    onClick={() => handleDelete(category.id)}
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

      <ToastContainer position="top-right" autoClose={3000} />
    </div>
  );
};

export default CategoryManager;
