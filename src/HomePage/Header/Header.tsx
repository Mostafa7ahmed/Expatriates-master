import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/image.png";
import api from "../../Services/api";
import { useTranslation } from "react-i18next";
import { Search as SearchIcon } from "lucide-react";

const Header = (props) => {
  const { i18n, t } = useTranslation();
  const location = useLocation();

  const savedLang = JSON.parse(
    localStorage.getItem("lang") || '{"code": "en", "id": 2}'
  );
  const [langActive, setLangActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [language, setLanguage] = useState(savedLang.code);
  const inputRef = useRef(null);

  const ARstyle = { fontFamily: "var(--MNF_Body_AR)", fontSize: "14px" };
  const ENstyle = { fontFamily: "var(--MNF_Body_EN)" };
  const closeStyle =
    savedLang.code === "ar" ? { right: "170px" } : { left: "170px" };

  const languages = [
    {
      code: "ar",
      name: t("header.Arabic"),
      id: 1,
      flag: "eg",
    },
    {
      code: "en",
      name: t("header.English"),
      id: 2,
      flag: "us",
    },
    {
      code: "as",
      name: t("header.Spanish"),
      id: 3,
      flag: "es",
    },
  ];

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

  const getAllNews = (lang) => {
    api
      .get(`/news?LanguageId=${lang.id}`)
      .then((res) => props.setFilteredNews(res.data.result))
      .catch((err) => console.error("Error fetching News:", err));
  };

  const { id } = useParams();

  const getNewsById = (lang) => {
    if (!id) return;
    api
      .get(`news/${id}/${lang.id}`)
      .then((res) => props.setCurrentNews(res.data.result))
      .catch((err) => console.error("Error fetching News:", err));
  };

  const handleSearch = () => {
    getAllNews(savedLang);
  };

  const changeLanguage = (lang) => {
    setLanguage(lang.code);
    localStorage.setItem("lang", JSON.stringify(lang));
    getAllNews(lang);
      getNewsById(lang);

    changeAllLanguage(lang.code);
  };

  const toggleLangDropdown = () => setLangActive((prev) => !prev);
  const toggleMenu = () => setMenuActive((prev) => !prev);

  useEffect(() => {
    changeAllLanguage(savedLang.code);
    getAllNews(savedLang);
      getNewsById(savedLang);

  }, []);

  return (
    <header className="nav-container">
      <a href="/" className="nav-logo">
        <img src={logo} alt="International Students Affairs office Logo" />
      </a>

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
            <li key={index} className={props.index === index ? "active" : ""}>
              <a
                href={link.link}
                style={savedLang.code === "ar" ? ARstyle : ENstyle}>
                {link.name}
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <div className="nav-icons">
        <div className="search-container">
          <input type="search" className="search-input" ref={inputRef} />
          <i
            className="fa-solid fa-magnifying-glass"
            onClick={handleSearch}></i>
        </div>

        <div className="nav-lang-container" onClick={toggleLangDropdown}>
          <i className="fa-solid fa-globe"></i>
          <span>{language.toUpperCase()}</span>
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
                <img src={`/flags/${lang.flag}.webp`} alt="Egypt Flag" width="20" height="20"/>
                <span> {lang.name}</span>
              </div>
            ))}
          </div>
        </div>

        <i className="fa-solid fa-bars menu" onClick={toggleMenu}></i>
      </div>
    </header>
  );
};

export default Header;
