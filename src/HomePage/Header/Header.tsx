import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./Header.css";
import logo from "../../assets/image.png";
import api from "../../Services/api";
import { useTranslation } from "react-i18next";
import { Search } from "lucide-react";

const Header = (props) => {
  const [displaySearch, setDisplaySearch] = useState(props.display || false);

  const ARstyle = {
    fontFamily: "var(--MNF_Body_AR)",
    fontSize: "14px"
  };
  const ENstyle = {
    fontFamily: "var(--MNF_Body_EN)",
  };
  const closeStyleAr = {
    right: "170px",
  };
  const closeStyleEn = {
    left: "170px",
  };

  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");

  const { i18n, t } = useTranslation();

  const [langActive, setlangActive] = useState(false);
  const [menuActive, setMenuActive] = useState(false);
  const [language, setLanguage] = useState("EN");
  const [searchValue, setSearchValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  const location = useLocation();

  const languages = [
    { code: "ar", name: t("header.Arabic"), id: 1 },
    { code: "en", name: t("header.English"), id: 2 },
    { code: "as", name: t("header.Spanish"), id: 3 },

  ];

  const navLinks = [
    { name: t("header.home"), link: "/" },
    { name: t("header.MNF Uni"), link: "https://www.menofia.edu.eg/Home/ar" },
    { name: t("header.Colleges"), link: "/collage" },
    { name: t("header.Programs"), link: "/programs" },
    { name: t("header.News"), link: "/news" },
    { name: t("header.contact US"), link: "/contactUs" },
  ];

  const changeAllLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    document.documentElement.dir = lng === "ar" ? "rtl" : "ltr";
  };

  useEffect(() => {
    if (savedLang) {
      setLanguage(savedLang.code);
      changeAllLanguage(savedLang.code);
    }
  }, []);

  const GetAllNews = (lang) => {
    api
      .get(`/News?id=${lang?.id}&search=${inputRef.current?.value || ""}`)
      .then((response) => {
        props.setFilteredNews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  };

  const Search = () => {
    GetAllNews(savedLang);
  };

  const GetNewsById = (lang) => {
    api
      .get(`News/Id?newsId=${location.state?.news.newsId}&langId=${lang.id}`)
      .then((response) => {
        props.setCurrentNews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  };

  const changeLanguage = (lang) => {
    setLanguage(lang.code);
    localStorage.setItem("lang", JSON.stringify(lang));
    GetAllNews(lang);

    if (location.pathname === `/details`) {
      GetNewsById(lang);
    }
  };

  const dropdownLang = () => {
    setlangActive(!langActive);
  };

  const navBarMenu = () => {
    setMenuActive(!menuActive);
  };

  return (
    <header className="nav-container">
      <a href="\" className="nav-logo">
        <img src={logo} alt="International Students Affairs office Logo" />
      </a>

      <nav
        className={`${menuActive ? "nav-links nav-active" : "nav-links"} ${
          savedLang?.code === `ar` ? "nav-linksar" : "nav-linksen"
        }`}
      >
        <i
          className="fa-solid fa-times close"
          onClick={navBarMenu}
          style={savedLang?.code === `ar` ? closeStyleAr : closeStyleEn}
        ></i>

        <ul>
          {navLinks.map((link, index) => {
            return (
              <li key={index} className={props.index === index ? "active" : ""}>
                <a
                  href={link.link}
                  style={savedLang?.code === `ar` ? ARstyle : ENstyle}
                >
                  {t(`${link.name}`)}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="nav-icons">
        <div className="search-container" style={displaySearch? {display: "flex"} : {display: "none"}}>
          <input type="search" className="search-input" ref={inputRef}></input>
          <i className="fa-solid fa-magnifying-glass" onClick={Search}></i>
        </div>
        <div className="nav-lang-container" onClick={dropdownLang}>
          <i className="fa-solid fa-globe"></i>
          <span>{language.toUpperCase()}</span>

          <div
            className={
              langActive ? "lang-dropdown lang-active" : "lang-dropdown"
            }
          >
            {languages.map((lang) => {
              return (
                <div
                  style={savedLang?.code === `ar` ? ARstyle : ENstyle}
                  key={lang.code}
                  onClick={() => {
                    changeLanguage(lang);
                    changeAllLanguage(lang.code);
                  }}
                >
                  {lang.name}
                </div>
              );
            })}
          </div>
        </div>
        <i className="fa-solid fa-bars menu" onClick={navBarMenu}></i>
      </div>
    </header>
  );
};

export default Header;
