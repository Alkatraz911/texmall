"use client";

import { useEffect, useState } from "react";
import { contactAPI } from "../../services/api";
import "./ContactEmailSettings.css";


const ContactEmailSettings = () => {
  const [email, setEmail] = useState<string | null>(null);
  const [newEmail, setNewEmail] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchEmail();
  }, []);

  const fetchEmail = async () => {
    try {
      const response = await contactAPI.getEmail();
      setEmail(response.data.contact_email);
    } catch (error) {
      console.error("Ошибка загрузки email:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await contactAPI.updateEmail(newEmail);
      setEmail(newEmail);
      setNewEmail("");
    } catch (error) {
      console.error("Ошибка обновления email:", error);
    }
  };

  const handleDeleteEmail = async () => {
    try {
      await contactAPI.deleteEmail();
      setEmail(null);
    } catch (error) {
      console.error("Ошибка удаления email:", error);
    }
  };

  if (loading) return <div>Загрузка...</div>;

  return (
    <div className="email-settings">
      <h2>Настройки Email для пересылки</h2>
      {email ? (
        <div style={{display: "flex", gap: "20px" }}>
          <p>Текущий email: <strong>{email}</strong></p>
          <button className="btn btn-outline" onClick={handleDeleteEmail}>Удалить</button>
        </div>
      ) : (
        <p>Email не установлен</p>
      )}
      <div className="update-email">
        <input
          type="email"
          placeholder="Введите новый email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
        />
        <button className="btn btn-outline" onClick={handleUpdateEmail}>Сохранить</button>
      </div>
    </div>
  );
};

export default ContactEmailSettings;
