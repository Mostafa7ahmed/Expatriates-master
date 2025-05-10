import React from "react";
import "./SectionTow.css";
import { Link } from "react-router-dom";

function SectionTow({ News }) {
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
    <div className="news-bottom-section">
      {News.map((news, index) => (
        <div className="card" key={index}>
          <img src={news.image} alt="" />
          <Link
            to={`/details`}
            state={{ news }}
            className="about-news"
            style={savedLang?.code === "ar" ? arrowAr : arrowEn}>
            <i className="fa-solid fa-arrow-up"></i>
          </Link>

          <div className="card-overlay">
            <div className="content">
              <h4 style={savedLang?.code === "ar" ? ArStyle : EnStyle}>
                {news.header[0].slice(0, 100)}...
              </h4>
              <div className="date-more">
    
                <span>{formatDate(news.date)}</span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default SectionTow;
