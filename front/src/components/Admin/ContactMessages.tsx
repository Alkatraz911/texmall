"use client"

import type React from "react"
import { useState, useLayoutEffect } from "react"
import { contactAPI } from "../../services/api"
import "./ContactMessages.css"
import ContactEmailSettings from "./ContactEmailSettings"
import { ToastContainer, toast } from "react-toastify"
import "react-toastify/dist/ReactToastify.css"

interface ContactMessage {
  id: number
  name: string
  email: string
  phone?: string
  message: string
  isRead: boolean
  isSent: boolean
  createdAt: string
}

const ContactMessages: React.FC = () => {
  const [messages, setMessages] = useState<ContactMessage[]>([])
  const [loading, setLoading] = useState(true)

  useLayoutEffect(() => {
    fetchMessages()
  }, [])

  const fetchMessages = async () => {
    try {
      const messages = await contactAPI.getAll()
      setMessages(messages)
      setLoading(false)
    } catch (error) {
      console.error("Ошибка загрузки сообщений:", error)
      toast.error("Ошибка загрузки сообщений")
      setLoading(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString("ru-RU")
  }

  const handleResend = async (id: number) => {
    try {
      const response = await contactAPI.resend(id)
      toast.success(response.data.message)
      fetchMessages() // обновляем список
    } catch (error: any) {
      console.error("Ошибка повторной отправки:", error)
      toast.error(error?.response?.data?.message || "Ошибка повторной отправки")
    }
  }

  const handleDelete = async (id: number) => {
    try {
      await contactAPI.delete(id)
      toast.success("Сообщение удалено")
      fetchMessages()
    } catch (error: any) {
      console.error("Ошибка удаления:", error)
      toast.error(error?.response?.data?.message || "Ошибка удаления сообщения")
    }
  }

  if (loading) {
    return <div className="loading-state">Загрузка сообщений...</div>
  }

  return (
    <div className="contact-messages">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
      
      <div className="manager-header">
        <div>
          <ContactEmailSettings />
        </div>
        <h2>Сообщения с формы обратной связи</h2>
        <div className="messages-stats">
          <span className="stat">
            Всего: {messages.length} | Непрочитанных: {messages.filter((msg) => !msg.isRead).length}
          </span>
        </div>
      </div>

      {messages.length === 0 ? (
        <div className="empty-state">
          <p>Сообщения не найдены</p>
        </div>
      ) : (
        <div className="messages-list">
          {messages.map((message) => (
            <div key={message.id} className={`message-item ${!message.isRead ? "unread" : ""}`}>
              <div className="message-header">
                <div className="message-info">
                  <p>Имя:</p><h4>{message.name}</h4>
                  <p>Email:</p><p className="message-email">{message.email}</p>
                  {message.phone && <><p>Телефон:</p><p className="message-phone">{message.phone}</p></>}
                </div>
                <div className="message-meta">
                  <span className="message-date">{formatDate(message.createdAt)}</span>
                  {!message.isSent && <span className="unread-badge">Не перенаправлено</span>}
                </div>
              </div>

              <div className="message-content">
                <p>{message.message}</p>
              </div>

              <div className="message-actions">
                {!message.isSent && (
                  <button className="btn btn-outline" onClick={() => handleResend(message.id)}>
                    Отправить вручную
                  </button>
                )}
                <button className="btn btn-outline" onClick={() => handleDelete(message.id)}>
                  Удалить
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default ContactMessages
