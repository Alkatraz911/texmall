"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import CategoryManager from "../../components/Admin/CategoryManager"
import FabricManager from "../../components/Admin/FabricManager"
import ContactMessages from "../../components/Admin/ContactMessages"
import "./AdminDashboard.css"
import AdminContactPage from "../../components/Admin/AdminContactPage"
import AdminHomePage from "../../components/Admin/AdminHomePage"
import ChangePasswordForm from "../../components/Admin/ChangePasswordForm"

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState("main")
  const [adminUser, setAdminUser] = useState<any>(null)
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("adminToken")
    const user = localStorage.getItem("adminUser")

    if (!token || !user) {
      navigate("/admin/login")
      return
    }

    setAdminUser(JSON.parse(user))
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem("adminToken")
    localStorage.removeItem("adminUser")
    navigate("/admin/login")
  }

  if (!adminUser) {
    return (
      <div className="admin-dashboard">
        <div className="loading-state">Загрузка...</div>
      </div>
    )
  }

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <div className="container">
          <div className="admin-header-content">
            <div className="admin-title">
              <h1>Админ-панель</h1>
              <p>Добро пожаловать, {adminUser.username}</p>
            </div>
            <button className="btn btn-outline logout-btn" onClick={handleLogout}>
              Выйти
            </button>
          </div>
        </div>
      </div>

      <div className="admin-content">
        <div className="container">
          <div className="admin-tabs">
            <button
              className={`tab-btn ${activeTab === "main" ? "active" : ""}`}
              onClick={() => setActiveTab("main")}
            >
              Главная
            </button>
            <button
              className={`tab-btn ${activeTab === "categories" ? "active" : ""}`}
              onClick={() => setActiveTab("categories")}
            >
              Коллекции
            </button>
            <button
              className={`tab-btn ${activeTab === "fabrics" ? "active" : ""}`}
              onClick={() => setActiveTab("fabrics")}
            >
              Ткани
            </button>
            <button
              className={`tab-btn ${activeTab === "contact" ? "active" : ""}`}
              onClick={() => setActiveTab("contact")}
            >
              Контакты
            </button>
            <button
              className={`tab-btn ${activeTab === "messages" ? "active" : ""}`}
              onClick={() => setActiveTab("messages")}
            >
              Сообщения и пересылка
            </button>
                        <button
              className={`tab-btn ${activeTab === "password" ? "active" : ""}`}
              onClick={() => setActiveTab("password")}
            >
              Пароль
            </button>
          </div>

          <div className="admin-tab-content">
            {activeTab === "main" && <AdminHomePage />}
            {activeTab === "categories" && <CategoryManager />}
            {activeTab === "fabrics" && <FabricManager />}
            {activeTab === "messages" && <ContactMessages />}
            {activeTab === "contact" && <AdminContactPage />}
            {activeTab === "password" && <ChangePasswordForm />}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminDashboard
