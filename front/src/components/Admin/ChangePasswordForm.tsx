import React, { useState } from "react";
import { adminAPI } from "../../services/api";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ChangePasswordForm: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!password || !confirmPassword) {
      toast.error("Все поля обязательны для заполнения.");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("Пароли не совпадают.");
      return;
    }

    if (password.length < 8) {
      toast.error("Пароль должен быть не менее 8 символов.");
      return;
    }

    try {
      setLoading(true);
      await adminAPI.changePassword({ password });
      toast.success("Пароль успешно изменен!");
      setPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err.message || "Ошибка при смене пароля");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-container">
      <h2>Смена пароля</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="password">Новый пароль:</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Подтвердите пароль:</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-outline">
          {loading ? "Сохраняем..." : "Изменить пароль"}
        </button>
      </form>

      {/* Контейнер для toast */}
      <ToastContainer 
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
        draggable
      />
    </div>
  );
};

export default ChangePasswordForm;
