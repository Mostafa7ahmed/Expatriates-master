import React, { useState, useEffect } from "react";
import SectionOne from "./SectionOne/SectionOne";
import SectionTwo from "./SectionTow/SectionTow";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import "./News.css";
import "./SectionTow/SectionTow.css";
import api from "../Services/api";

const ITEMS_PER_PAGE = 14;

function News() {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const [currentPage, setCurrentPage] = useState(1);
  const [filteredNews, setFilteredNews] = useState([]);
  const [langId, setLangId] = useState(savedLang?.id || 2)

  const totalItems = Math.ceil(filteredNews.length / ITEMS_PER_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;

  const paginatedNews = filteredNews.slice(startIndex, startIndex + ITEMS_PER_PAGE);


  useEffect(() => {
    if (savedLang) {
      setLangId(savedLang.id)
    }

   api
      .get(`/News?id=${langId}`)
      .then((response) => {
        setFilteredNews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  }, []);

  return (
    <div>
      <Header index={4} setFilteredNews={setFilteredNews} display={true}/>
      <div className="news-page">
        <SectionOne row="row" News={paginatedNews.slice(0, 5)} />
        <SectionOne row="row-reverse" News={paginatedNews.slice(5, 10)} />
        <SectionTwo News={paginatedNews.slice(9, 13)} />

        {totalItems > 1 && (
          <div className="pagination">
            <button
              className={savedLang?.code === `ar` ? "page-btn leftar" : "page-btn left"}
              onClick={() => {setCurrentPage((prev) => Math.max(prev - 1, 1)); window.scrollTo(0, 0);}}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {[...Array(totalItems)].map((_, i) => (
              <button
                key={i + 1}
                className={`page-btn number ${
                  currentPage === i + 1 ? "active" : ""
                }`}
                onClick={() => {setCurrentPage(i + 1); window.scrollTo(0, 0);}}
              >
                {i + 1}
              </button>
            ))}
            <button
              className={savedLang?.code === `ar` ? "page-btn rightar" : "page-btn right"}
              onClick={() =>
                {setCurrentPage((prev) => Math.min(prev + 1, totalItems)); window.scrollTo(0, 0);}
              }
              disabled={currentPage === totalItems}
            >
              Next
            </button>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}

export default News;
