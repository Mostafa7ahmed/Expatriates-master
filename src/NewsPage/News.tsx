import React, { useState, useEffect } from "react";
import SectionOne from "./SectionOne/SectionOne";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import "./News.css";
import "./SectionTow/SectionTow.css";
import api from "../Services/api";
import { useTranslation } from "react-i18next";

const ITEMS_PER_PAGE = 10;

function News() {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const { t } = useTranslation();

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredNews, setFilteredNews] = useState([]);
  const [langId, setLangId] = useState(savedLang?.id || 2);
  const [totalPages, setTotalPages] = useState(0);
  const [moveNext, setMoveNext] = useState(false);
  const [movePrevious, setMovePrevious] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const isArabic = savedLang?.code === "ar";

  const pStyle = { fontFamily: isArabic ? "var(--MNF_Body_AR)" : "var(--MNF_Body_EN)" };
  const headStyle = { fontFamily: isArabic ? "var(--MNF_Heading_AR)" : "var(--MNF_Heading_EN)" };

  const fetchNews = (page = 1, term = "") => {
    const query = `news?LanguageId=${langId}&PageIndex=${page}&PageSize=${ITEMS_PER_PAGE}${
      term ? `&Search=${term}` : ""
    }`;

    api
      .get(query)
      .then((response) => {
        setFilteredNews(response.data.result);
        setTotalPages(response.data.totalPages);
        setMoveNext(response.data.moveNext);
        setMovePrevious(response.data.movePrevious);
        setCurrentPage(page);
      })
      .catch((error) => {
        console.error("Error fetching news:", error);
      });
  };

  useEffect(() => {
    fetchNews(currentPage, searchTerm);
  }, [langId, currentPage]);

  const handleSearch = () => {
    fetchNews(1, searchTerm);
  };

  const handleNextPage = () => {
    if (moveNext) fetchNews(currentPage + 1, searchTerm);
  };

  const handlePreviousPage = () => {
    if (movePrevious) fetchNews(currentPage - 1, searchTerm);
  };

  return (
    <div>
      <Header index={4} setFilteredNews={setFilteredNews} display={true} />

      <div
        className="hero-container"
        style={{
          backgroundImage: "url(https://portaltest.menofia.edu.eg/images/AboutUniversity.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}>
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>
        <div className="text" style={headStyle}>
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
            />
          </div>
          <div onClick={handleSearch} className="btnSearch" style={pStyle}>
            <button>
              <i className="fa fa-search" aria-hidden="true"></i>{" "}
              {t("details.search")}
            </button>
          </div>
        </div>
      </div>

      <div className="news-page">
        {filteredNews.length === 0 ? (
          <div className="card-not-found">
            <h2>{t("details.noResultsFound")}</h2>
          </div>
        ) : (
          <SectionOne row="row" News={filteredNews} />
        )}
      </div>

      <div className="pagination-controls">
        <button
          onClick={handlePreviousPage}
          disabled={!movePrevious}
          className="pagination-btn">
          <i className={`fa-solid ${isArabic ? "fa-chevron-right" : "fa-chevron-left"}`}></i>
        </button>

        <span>
          {t("details.page")} {currentPage} {t("details.of")} {totalPages}
        </span>

        <button
          onClick={handleNextPage}
          disabled={!moveNext}
          className="pagination-btn">
          <i className={`fa-solid ${isArabic ? "fa-chevron-left" : "fa-chevron-right"}`}></i>
        </button>
      </div>

      <Footer />
    </div>
  );
}

export default News;
