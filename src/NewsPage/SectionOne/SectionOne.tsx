import React from "react";
import "./SectionOne.css";
import { Link } from "react-router-dom";

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
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return date.toLocaleDateString('en-US', options); };
  return (
    <div className="news-section" style={{ flexDirection: row }}>
      {News[0] && (
        <Link
          to={`/details`}
          state={{ news: News[0] }}
          className="news-left-section"
        >
          <img src={News[0].newsImg} alt="" />

          <div
            className="about-news"
            style={savedLang?.code === "ar" ? arrowAr : arrowEn}
          >
            <i className="fa-solid fa-arrow-up"></i>
          </div>

          <div className="card-overlay"></div>
          <div
            className="content"
            style={savedLang?.code === "ar" ? ArStyle : EnStyle}
          >
            <h4>{News[0]?.newsDetails.head.slice(0, 100)}...</h4>
              <div className="date-more">
                <span>{formatDate(News[0].date)}</span>
              </div>
          </div>
        </Link>
      )}

      <div className="news-right-section">
        {News.slice(1, 5).map((news, index) => (
          <Link to={`/details`} state={{ news }} className="card" key={index}>
            <img src={news.newsImg} alt="" />

            <div
              className="about-news"
              style={savedLang?.code === "ar" ? arrowAr : arrowEn}
            >
              <i className="fa-solid fa-arrow-up"></i>
            </div>
            <div className="card-overlay"></div>

            <div
              className="content"
              style={savedLang?.code === "ar" ? ArStyle : EnStyle}
            >
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
