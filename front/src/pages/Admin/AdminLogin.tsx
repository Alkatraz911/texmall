"use client";

import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { adminAPI } from "../../services/api";
import "./AdminLogin.css";

const AdminLogin: React.FC = () => {
  const [credentials, setCredentials] = useState({ login: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const response = await adminAPI.login(credentials);
      localStorage.setItem("adminToken", response.data.token);
      localStorage.setItem(
        "adminUser",
        JSON.stringify(response.data.user.login)
      );
      navigate("/admin");
    } catch (err: any) {
      setError(err.response?.data?.message || "Ошибка входа");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="al-container">
      <div className="al-login-wrapper">
        <div className="al-login-card">
          <div className="al-login-header">
            <h1>Админ-панель</h1>
            <p>Вход в систему управления</p>
          </div>

          <form className="al-login-form" onSubmit={handleSubmit}>
            <div className="al-form-group">
              <label htmlFor="username">Имя пользователя</label>
              <input
                type="text"
                id="username"
                name="login"
                value={credentials.login}
                onChange={handleInputChange}
                required
                placeholder="Введите имя пользователя"
              />
            </div>

            <div className="al-form-group">
              <label htmlFor="password">Пароль</label>
              <input
                type="password"
                id="password"
                name="password"
                value={credentials.password}
                onChange={handleInputChange}
                required
                placeholder="Введите пароль"
              />
            </div>

            {error && <div className="al-error-message">{error}</div>}

            <button
              type="submit"
              className="al-btn-primary al-login-btn"
              disabled={isLoading}
            >
              {isLoading ? "Вход..." : "Войти"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
