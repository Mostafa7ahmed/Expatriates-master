import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/image.png";
import api from "../../Services/api";
import { useTranslation } from "react-i18next";
import { Search as SearchIcon } from "lucide-react";


const Header = (props) => {
  const { i18n, t } = useTranslation();
  const location = useLocation();
  const navigate = useNavigate();

  const savedLang = JSON.parse(
    localStorage.getItem("lang") || '{"code": "en", "id": 2}'
  );
  const [langActive, setLangActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [language, setLanguage] = useState(savedLang.code);
  const inputRef = useRef(null);

  const [showInput, setShowInput] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [results, setResults] = useState([4, 4]);
  const [isLoggedIn, setIsLoggedIn] = useState(
    Boolean(localStorage.getItem("token"))
  );
  const [userMenuActive, setUserMenuActive] = useState(false);

  const ARstyle = { fontFamily: "var(--MNF_Body_AR)", fontSize: "14px" };
  const ENstyle = { fontFamily: "var(--MNF_Body_EN)" };
  const closeStyle =
    savedLang.code === "ar" ? { right: "170px" } : { left: "170px" };

  interface Language {
    id: number;
    code: string;
    name: string;
    flag: string;
  }

  const [languages, setLanguages] = useState<Language[]>([]);

  const navLinks = [
    { name: t("header.home"), link: "/" },
    { name: t("header.MNF Uni"), link: "https://www.menofia.edu.eg/Home/ar" },
    { name: t("header.Colleges"), link: "/collage" },
    { name: t("header.Programs"), link: "/programs" },
    { name: t("header.News"), link: "/news" },
    { name: t("header.contact US"), link: "/contactUs" },
  ];

  const changeAllLanguage = (lng) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  const changeLanguage = (lang) => {
    setLanguage(lang.code);
    localStorage.setItem("lang", JSON.stringify(lang));
    changeAllLanguage(lang.code);
    window.location.reload(); 
  };

  const toggleLangDropdown = () => setLangActive((prev) => !prev);
  const toggleMenu = () => setMenuActive((prev) => !prev);
  const toggleUserMenu = () => setUserMenuActive((prev) => !prev);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setUserMenuActive(false);
    navigate("/");
  };

  useEffect(() => {
    const langObj = languages.find((l) => l.code === language);
    if (langObj) {
      changeAllLanguage(langObj.code);
    }
  }, [language]);

  const fetchLanguages = async () => {
    try {
      const response = await api.get("/languages");
      if (response?.data?.success) {
        setLanguages(response.data.result as Language[]);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };

  useEffect(() => {
    fetchLanguages();
  }, []);

  useEffect(() => {
    changeAllLanguage(savedLang.code);
  }, []);

  useEffect(() => {
    const handleStorage = () => {
      setIsLoggedIn(Boolean(localStorage.getItem("token")));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  return (
    <header className="nav-container">
       <Link
                to='/'
                className="nav-logo">
        <img src={logo} alt="International Students Affairs office Logo" />
              </Link>

      <nav
        className={`${menuActive ? "nav-links nav-active" : "nav-links"} ${
          savedLang.code === "ar" ? "nav-linksar" : "nav-linksen"
        }`}>
        <i
          className="fa-solid fa-times close"
          onClick={toggleMenu}
          style={closeStyle}></i>
        <ul>
          {navLinks.map((link, index) => (
            <li key={index} className={location.pathname === link.link ? "active" : ""}>
              <Link
                to={link.link}
                style={savedLang.code === "ar" ? ARstyle : ENstyle}>
                {link.name}
              </Link>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-icons">
        <div className="nav-lang-container" onClick={toggleLangDropdown}>
          <i className="fa-solid fa-globe"></i>
          <span>{language}</span>
          <div
            className={
              langActive ? "lang-dropdown lang-active" : "lang-dropdown"
            }>
            {languages.map((lang) => (
              <div
                key={lang.code}
                className="flagStyle"
                style={savedLang.code === lang.code ? ARstyle : ENstyle}
                onClick={() => changeLanguage(lang)}>
                <img
                    src={lang.flag}
                    alt="Flag"
                  width="20"
                  height="20"
                />
                <span className="textLang"> {lang.name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="nav-auth-container">
          {!isLoggedIn ? (
            <button
              className="login-btn"
              onClick={() => navigate("/login")}
            >
              {t("header.login", "Login")}
            </button>
          ) : (
            <div className="user-wrapper" onClick={toggleUserMenu}>
              <i className="fa-solid fa-user"></i>
              <div
                className={
                  userMenuActive
                    ? "user-dropdown user-active"
                    : "user-dropdown"
                }>
      
                <span onClick={handleLogout}>{t("header.logout", "Logout")}</span>
              </div>
            </div>
          )}
        </div>

        <i className="fa-solid fa-bars menu" onClick={toggleMenu}></i>
      </div>
    </header>
  );
};

export default Header;
