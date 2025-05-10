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

  const formatDate = (rawDate: string) => {
    const date = new Date(rawDate);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year} - ${month} - ${day}`;
  };

  const GetNewsById = () => {
    api
    .get(`News/${id}/${langId}`)
      .then((response) => {
        setCurrentNews(response.data.result);
        console.log(currentNews)
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  };

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

  useEffect(() => {
    if (savedLang) {
      setLangId(savedLang.id);
    }

    GetNewsById();

    api
    .get(`news?LanguageId=${langId}&PageIndex=1&PageSize=50`)
      .then((response) => {
        setFilteredNews(response.data.result);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  }, []);

  return (
    <div>
      <Header
        index={4}
        setFilteredNews={setFilteredNews}
        setCurrentNews={setCurrentNews}
      />

      <main className="main">
        <div className="container">
          <div className="content-wrapper">
           <div className="event-text-content">
              <h2
                className="event-title"
                style={savedLang?.code === `ar` ? headerArStyle : headerEnStyle}
              >
                {currentNews?.newsDetails.head}
              </h2>

              <div
                className="image carousel"
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
              >
                <div
                  className="carousel-track"
                  style={{
                    transform: `translateX(-${currentIndex * 100}%)`,
                  }}
                >
                  {images.map((image, index) => (
                    <div key={index} className="carousel-slide">
                      <img
                        src={image.url}
                        alt={`University slide ${index + 1}`}
                        className="carousel-image"
                      />
                    </div>
                  ))}
                </div>

                <div className="carousel-dots">
                  {images.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => setCurrentIndex(index)}
                      className={`carousel-dot ${currentIndex === index ? "active" : ""
                        }`}
                      aria-label={`Go to slide ${index + 1}`}
                    />
                  ))}
                </div>
              </div>

              <p
                className="event-description"
                style={savedLang?.code === `ar` ? pArStyle : pEnStyle}
              >
                {currentNews?.newsDetails.body}
              </p>

              <p
                className="event-date"
                style={savedLang?.code === `ar` ? pArStyle : pEnStyle}
              >
                {currentNews?.date && formatDate(currentNews.date)}
              </p>
            </div> 

   
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default Details;
