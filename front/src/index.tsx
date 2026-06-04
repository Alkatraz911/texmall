import React from "react"
import ReactDOM from "react-dom/client"
import App from "./App"

// Тема до первого рендера, чтобы не было вспышки светлого фона
document.documentElement.dataset.theme = localStorage.getItem("theme") || "dark"

const root = ReactDOM.createRoot(document.getElementById("root") as HTMLElement)
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
