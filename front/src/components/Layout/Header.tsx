"use client"

import type React from "react"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import "./Header.css"
import logo from "../../assets/logoblack.png"

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const location = useLocation()

  const isActive = (path: string) => (location.pathname === path ? "active" : "")

  const handleLinkClick = () => setIsMenuOpen(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  return (
    <header className={`header${scrolled ? " scrolled" : ""}`}>
      <div className="header-content">
        <Link to="/" className="logo" onClick={handleLinkClick}>
          <img src={logo} alt="Текс Молл" className="logo-img" />
        </Link>

        <nav
          id="primary-nav"
          className={`nav ${isMenuOpen ? "nav-open" : ""}`}
        >
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
    </header>
  )
}

export default Header
