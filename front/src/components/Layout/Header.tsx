"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { Sun, Moon } from "lucide-react"
import "./Header.css"
import logoDark from "../../assets/logoblack.png"
import logoLight from "../../assets/logo.png"
import type { Theme } from "../../App"

interface HeaderProps {
  theme: Theme
  onToggleTheme: () => void
}

const Header: React.FC<HeaderProps> = ({ theme, onToggleTheme }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const isHome = location.pathname === "/"
  const overHero = isHome && !scrolled
  // Логотип следует теме: над hero в тёмной теме фон тёмный, в светлой — светлый.
  const logo = theme === "dark" ? logoLight : logoDark

  const isActive = (path: string) => (location.pathname === path ? "active" : "")
  const handleLinkClick = () => setIsMenuOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header
      className={`header${scrolled ? " scrolled" : ""}${
        overHero ? " header--over-hero" : ""
      }`}
    >
      <div className="header-content">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <img src={logo} alt="Текс Молл" className="logo-img" />
        </Link>

        <nav id="primary-nav" className={`nav ${isMenuOpen ? "nav-open" : ""}`}>
          <Link to="/" className={`nav-link ${isActive("/")}`} onClick={handleLinkClick}>
            Главная
          </Link>
          <Link to="/catalog" className={`nav-link ${isActive("/catalog")}`} onClick={handleLinkClick}>
            Каталог
          </Link>
          <Link to="/about" className={`nav-link ${isActive("/about")}`} onClick={handleLinkClick}>
            О нас
          </Link>
          <Link to="/contact" className={`nav-link ${isActive("/contact")}`} onClick={handleLinkClick}>
            Контакты
          </Link>
        </nav>

        <div className="header-actions">
          <button
            className="theme-toggle"
            onClick={onToggleTheme}
            aria-label={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
            title={theme === "dark" ? "Светлая тема" : "Тёмная тема"}
          >
            {theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}
          </button>

          <button
            className={`menu-toggle${isMenuOpen ? " is-open" : ""}`}
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label={isMenuOpen ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={isMenuOpen}
            aria-controls="primary-nav"
          >
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
      </div>
    </header>
  )
}

export default Header
