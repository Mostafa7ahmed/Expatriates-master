import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./Carousel.css";
import { useTranslation } from "react-i18next";
import defaultImg from "../../assets/raes.jpg";
import ReactTooltip from "react-tooltip";

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

export default function NewsCarousel(props) {
  const scrollRef = useRef(null);
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const { t } = useTranslation();

  const ArStyle = { fontFamily: "var(--MNF_Body_AR)" };
  const EnStyle = { fontFamily: "var(--MNF_Body_EN)" };

  return (
    <div className="news-carousel">
      <div className="news-carousel-container">
        <div ref={scrollRef} className="news-carousel-scroll custom-scrollbar">
          <div className="news-carousel-content">
            {props.News?.slice(0, 10).map((news, index) => (
              <div key={index} className="news-card">
                <div className="news-card-inner">
                  <div className="news-card-content">
                    <div
                      className={
                        index % 2 === 0
                          ? "news-card-text"
                          : "news-card-text news-card-text-right"
                      }>
                      <h3
                        className="news-card-title"
                        style={savedLang?.code === "ar" ? ArStyle : EnStyle}>
                        {news.newsDetails.head.length > 75
                          ? news.newsDetails.head.slice(0, 75) + "..."
                          : news.newsDetails.head}{" "}
                      </h3>
                      <Link
                        to={`/details/${news.id}`}
                        className="arrowlinks"
                        data-tip={t("tooltip.details")}
                        onClick={() => window.scrollTo(0, 0)}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          height="24px"
                          viewBox="0 -960 960 960"
                          width="24px"
                          fill="#1f1f1f">
                          <path d="m242-246-42-42 412-412H234v-60h480v480h-60v-378L242-246Z" />
                        </svg>
                      </Link>
                      <ReactTooltip
                        place="top"
                        className="custom-tooltip"
                        type="dark"
                        effect="solid"
                      />
                    </div>

                    <div
                      className={
                        index % 2 !== 0
                          ? "news-card-image-container"
                          : "news-card-image-container news-card-image-container-right"
                      }>
                      <svg width="0" height="0">
                        <clipPath id="img-container">
                          <path
                            d="M3.99997 20C3.99997 8.95433 12.9543 0 24 0H170C181.046 0 190 8.95431 190 20V187.088C190 201.067 176.026 210.733 162.946 205.803L16.9462 150.774C9.15647 147.838 3.99997 140.384 3.99997 132.059V20Z"
                            fill="#D9D9D9"
                            className="svg-path"
                          />
                        </clipPath>
                      </svg>

                      <SmartImage
                        src={news.newsImg}
                        alt="news"
                        className={
                          index % 2 !== 0
                            ? "news-card-image"
                            : "news-card-image news-card-image-right"
                        }
                        style={{}}
                        clipPath="url(#img-container)"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="btn">
        <a href="/news" className="link">
          {t("header.More News")}
        </a>
      </div>
    </div>
  );
}
