import "./Hero.css";
import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import defaultImg from "../../assets/raes.jpg";

// ✅ SmartImage component
const SmartImage = ({ src, alt = "", className, style, clipPath }) => {
  const [imageSrc, setImageSrc] = useState(defaultImg);

  useEffect(() => {
    if (!src) return;

    const img = new Image();
    img.src = src;

    img.onload = () => {
      setImageSrc(src);
    };
    // لو فشل التحميل تظل الافتراضية
  }, [src]);
  return (
    <img
      src={imageSrc}
      alt={alt}
      className={className}
      style={{ ...style, clipPath }}
    />
  );
};

function Hero(props) {
const isFeaturedimages = useMemo(() => {
  return (props.News
    .some(news => news.isFeatured) ? props.News.filter(news => news.isFeatured) : props.News)
   .flatMap(news => {
     const head = news.newsDetails?.head || "";
     if (news.newsImg) {
        return [{
          url: news.newsImg,
          head: head
        }];
      } else {
       return [];
      }
    });
}, [props.News]);

  const ARstyle: React.CSSProperties = {
    direction: "rtl" as "rtl",
    fontFamily: "var(--MNF_Heading_AR)",
  };
  const ENstyle: React.CSSProperties = {
    direction: "ltr" as "ltr",
    fontFamily: "var(--MNF_Heading_EN)",
  };
  const carouselArStyle = {
    justifyContent: "flex-end",
  };
  const carouselEnStyle = {
    justifyContent: "flex-start",
  };

  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
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
        style={savedLang?.code === `ar` ? carouselArStyle : carouselEnStyle}
        className="carousel"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}>
        <div
          className="carousel-track"
          style={{
            transform: `translateX(-${currentIndex * 100}%)`,
          }}>
          {isFeaturedimages?.map((item, index) => (
            <div key={index} className="carousel-slide">
              {/* <img
                src={item.url || defaultImg}
                alt={`University slide ${index + 1}`}
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = defaultImg;
                }}
                className="carousel-image"
              /> */}

              <SmartImage
                        src={item.url}
                         alt={`University slide ${index + 1}`}
                        className="carousel-image"
                        style={{}}
                        clipPath=""
                />
              
              <div className="carousel-overlay" />
              <section
                className="cardSection"
                style={savedLang?.code === `ar` ? ARstyle : ENstyle}
              >
                <h1 className="carousel-heading">{item?.head?.slice(0,150) ?? item?.head}</h1>
              </section>
            </div>
          ))}
        </div>

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
