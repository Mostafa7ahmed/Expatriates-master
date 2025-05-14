import React from "react";
import "./SectionOne.css";
import { Link } from "react-router-dom";
import defaultImg from "../../assets/AboutUniversity.jpg";

function SectionOne({ News, row }) {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");

  const ArStyle = {
    fontFamily: "var(--MNF_Heading_AR)",
  };

  const EnStyle = {
    fontFamily: "var(--MNF_Heading_EN)",
  };

  const arrowAr = {
    left: "15px",
  };

  const arrowEn = {
    right: "15px",
  };

  const formatDate = (rawDate) => {
    const date = new Date(rawDate);
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
    };
    return date.toLocaleDateString("en-US", options);
  };
  return (
    <div className="news-section" style={{ flexDirection: row }}>
      <div className="news-right-section">
        {News.map((news, index) => (
          <Link
            to={`/details/${news.id}`}
            state={{ news }}
            className="card"
            key={index}>
            <img
            src={news.newsImg ? news.newsImg : defaultImg}
              alt=""
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = defaultImg;
              }}
            />

            <div
              className="about-news"
              style={savedLang?.code === "ar" ? arrowAr : arrowEn}>
              <i className="fa-solid fa-arrow-up"></i>
            </div>
            <div className="card-overlay"></div>

            <div
              className="content"
              style={savedLang?.code === "ar" ? ArStyle : EnStyle}>
              <h4>{news?.newsDetails.head.slice(0, 100)}...</h4>
              <div className="date-more">
                <span>{formatDate(news.date)}</span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default SectionOne;
