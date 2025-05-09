import "./Hero.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";

function Hero(props) {
  const isFeaturedimages = useMemo(() => {
    return props.News
      .filter(news => news.isFeatured === true)
      .map(news => news.image);
  }, [props.News]);

  const ARstyle = {
    direction: "rtl",
    fontFamily: "var(--MNF_Heading_AR)",
    
  };
  const ENstyle = {
    direction: "ltr",
    fontFamily: "var(--MNF_Heading_EN)",
  };
  const carouselArStyle = {
    justifyContent: "flex-end",
  };
  const carouselEnStyle = {
    justifyContent: "flex-start",
  };

  const savedLang = JSON.parse(localStorage.getItem("lang"));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const { i18n, t } = useTranslation();

  const startAutoSlide = useCallback(() => {
    return setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % isFeaturedimages.length);
    }, 3500);
  }, [isFeaturedimages.length]);

  useEffect(() => {
    if (!isPaused) {
      const interval = startAutoSlide();
      return () => clearInterval(interval);
    }
  }, [isPaused, startAutoSlide]);

  return (
    <div className="carousel-container">
      <div
        style={savedLang?.code === `ar`? carouselArStyle : carouselEnStyle}
        className="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}
        >
          {isFeaturedimages.map((image, index) => (
            <div key={index} className="carousel-slide">
              <img
                src={image}
                alt={`University slide ${index + 1}`}
                className="carousel-image"
              />
              <div className="carousel-overlay" />
            </div>
          ))}
        </div>

        <h1 className="carousel-heading" style={savedLang?.code === `ar`? ARstyle : ENstyle}>{t("hero.title")}</h1>

        <div className="carousel-dots">
          {isFeaturedimages.map((_, index) => (
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
    </div>
  );
}

export default Hero;
