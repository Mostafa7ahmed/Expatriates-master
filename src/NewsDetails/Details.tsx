import React, { useState, useEffect, useCallback } from "react";
import "./Details.css";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import api from "../Services/api";
import { useTranslation } from "react-i18next";

function Details(props) {
  const headerArStyle = {
    fontFamily: "var(--MNF_Heading_AR)",
  };

  const headerEnStyle = {
    fontFamily: "var(--MNF_Heading_EN)",
  };

  const pArStyle = {
    fontFamily: "var(--MNF_Heading_AR)",
  };

  const pEnStyle = {
    fontFamily: "var(--MNF_Heading_EN)",
  };

  const savedLang = JSON.parse(localStorage.getItem("lang"));
  const location = useLocation();
  const { id } = useParams();
  const [filteredNews, setFilteredNews] = useState([]);
  const [currentNews, setCurrentNews] = useState();
  const [langId, setLangId] = useState(savedLang?.id || 2);
  const { i18n, t } = useTranslation();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const images = [
    currentNews?.images?.[0],
    currentNews?.images?.[1],
    currentNews?.images?.[2],
  ].filter(Boolean);

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };

  // ✅ Load news by ID and langId
  useEffect(() => {
    if (id && langId) {
      api
        .get(`News/${id}/${langId}`)
        .then((response) => {
          setCurrentNews(response.data.result);
        })
        .catch((error) => {
          console.error("Error fetching News:", error);
        });
    }
  }, [id, langId]);

  // ✅ Load related news only once
  useEffect(() => {
    if (savedLang) {
      setLangId(savedLang.id);
    }

    api
      .get(`news?LanguageId=${langId}&PageIndex=1&PageSize=50`)
      .then((response) => {
        setFilteredNews(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  }, []);

  const startAutoSlide = useCallback(() => {
    return setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3500);
  }, [images.length]);

  useEffect(() => {
    if (!isPaused) {
      const interval = startAutoSlide();
      return () => clearInterval(interval);
    }
  }, [isPaused, startAutoSlide]);

  const handleLanguageClick = (selectedLangId) => {
    api
      .get(`News/${id}/${selectedLangId}`)
      .then((response) => {
        setCurrentNews(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  };

  return (
    <div>
      <Header
        index={4}
        setFilteredNews={setFilteredNews}
        setCurrentNews={setCurrentNews}
      />

      <main className="main">
        <div className="containerr">
          <div className="content-wrapper">
            <div className="event-text-content">
              <div className="headertext">
                <h2
                  className="event-title"
                  style={
                    savedLang?.code === `ar` ? headerArStyle : headerEnStyle
                  }>
                  {currentNews?.newsDetails.head}
                </h2>
                <div className="p-5 slider">
                  <div className="languages-container">
                    {currentNews?.languages.map((language) => (
                      <div
                        key={language.id}
                        className="language-card"
                        onClick={() => handleLanguageClick(language.id)}
                        style={{ cursor: "pointer" }}>
                        <img
                          src={language.flag}
                          alt={language.name}
                          className="flag"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="image carousel">
                <div className="carousel-track">
                  <div className="carousel-slide">
                    <img
                      src={currentNews?.newsImg}
                      alt={`${currentNews?.newsDetails.head}`}
                      className="carousel-image"
                    />
                  </div>
                </div>

                <div className="carousel-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`carousel-dot ${
                        currentIndex === index ? "active" : ""
                      }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <p
                className="event-description"
                style={savedLang?.code === "ar" ? pArStyle : pEnStyle}
                dangerouslySetInnerHTML={{
                  __html: currentNews?.newsDetails.body || "",
                }}></p>
              <p
                className="event-date"
                style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>
                {currentNews?.date && formatDate(currentNews.date)}
              </p>
            </div>

            <div className="related-news">
              <h3
                className="related-news-title"
                style={
                  savedLang?.code === `ar` ? headerArStyle : headerEnStyle
                }>
                {t("details.latest")}
              </h3>

              <div className="news-grid">
                {filteredNews.slice(0, 10).map((news, index) => (
                  <Link
                    to={`/details/${news.id}`}
                    onClick={() => window.scrollTo(0, 0)}
                    className="about-news"
                    key={index}>
                    <div className="news-details-card">
                      <img
                        src={news.newsImg}
                        alt={`News ${index}`}
                        className={
                          savedLang?.code === `ar`
                            ? "news-imagear"
                            : "news-image"
                        }
                      />
                      <div className="news-content">
                        <h4
                          style={
                            savedLang?.code === `ar` ? pArStyle : pEnStyle
                          }>
                          {news.newsDetails.head.slice(0, 100)}...
                        </h4>
                        <p
                          style={
                            savedLang?.code === `ar` ? pArStyle : pEnStyle
                          }>
                          {news.date && formatDate(news.date)}
                        </p>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Details;
