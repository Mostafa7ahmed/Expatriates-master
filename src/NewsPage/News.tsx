import React, { useState, useEffect } from "react";
import SectionOne from "./SectionOne/SectionOne";
import SectionTwo from "./SectionTow/SectionTow";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import "./News.css";
import "./SectionTow/SectionTow.css";
import api from "../Services/api";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 5;

function News() {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const isArabic = savedLang?.code === "ar";
  const { i18n, t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredNews, setFilteredNews] = useState([]);
  const [langId, setLangId] = useState(savedLang?.id || 2);
  const [totalPages, setTotalPages] = useState(0);
  const [moveNext, setMoveNext] = useState(true);
  const [movePrevious, setMovePrevious] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    if (savedLang) {
      setLangId(savedLang.id);
    }

    api
      .get(`news?LanguageId=${langId}&PageIndex=${currentPage}&PageSize=10`)
      // 'http://193.227.24.31:5050/api/v1/news?LanguageId=1&PageIndex=1&PageSize=50&Search=%20'
      .then((response) => {
        setFilteredNews(response.data.result);
        setTotalPages(response.data.totalPages);
        setMoveNext(response.data.moveNext);
        setMovePrevious(response.data.movePrevious);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  }, [langId, currentPage]);
  const handleSearch = () => {
    api
      .get(
        `news?LanguageId=${langId}&PageIndex=1&PageSize=10&Search=${searchTerm}`
      )
      .then((response) => {
        setFilteredNews(response.data.result);
        setTotalPages(response.data.totalPages);
        setMoveNext(response.data.moveNext);
        setMovePrevious(response.data.movePrevious);
        setCurrentPage(1); // ترجع لأول صفحة بعد البحث
      })
      .catch((error) => {
        console.error("Error fetching searched news:", error);
      });
  };
  const handleNextPage = () => {
    if (moveNext) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePreviousPage = () => {
    if (movePrevious) {
      setCurrentPage(currentPage - 1);
    }
  };

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNews = filteredNews.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE
  );
  const pArStyle = {
    fontFamily: "var(--MNF_Body_AR)",
  };

  const pEnStyle = {
    fontFamily: "var(--MNF_Body_EN)",
  };

  const headArStyle = {
    fontFamily: "var(--MNF_Heading_AR)",
  };

  const headEnStyle = {
    fontFamily: "var(--MNF_Heading_EN)",
  };

  return (
    <div>
      <Header index={4} setFilteredNews={setFilteredNews} display={true} />
      <div
        className="hero-container"
        style={{
          backgroundImage:
            "url(https://portaltest.menofia.edu.eg/images/AboutUniversity.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}>
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>
        <div
          className="text"
          style={savedLang?.code === `ar` ? headArStyle : headEnStyle}>
          {t("details.searchPlaceholder")}
        </div>
        <div className="searchCard">
          <div className="inputSerch">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("details.searchPlaceholder")}
            />{" "}
          </div>
          <div
            onClick={handleSearch}
            className="btnSearch"
            style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>
            <button>
              {" "}
              <i className="fa fa-search " aria-hidden="true"></i> {t("details.search")}{" "}
            </button>
          </div>
        </div>
      </div>
      <div className="news-page">
        <SectionOne row="row" News={paginatedNews} />
        <SectionOne row="row-reverse" News={paginatedNews} />
      </div>

      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={currentPage === 1}
          className="pagination-btn">
          <i
            className={`fa-solid ${
              isArabic ? "fa-chevron-right" : "fa-chevron-left"
            }`}></i>
        </button>
        <span>
          {t("details.page")} {currentPage} {t("details.of")} {totalPages}
        </span>
        <button
          onClick={handleNextPage}
          disabled={currentPage === totalPages}
          className="pagination-btn">
          <i
            className={`fa-solid ${
              isArabic ? "fa-chevron-left" : "fa-chevron-right"
            }`}></i>
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default News;
