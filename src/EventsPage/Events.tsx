import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import SectionOne from "../NewsPage/SectionOne/SectionOne";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import "../NewsPage/News.css";
import "../NewsPage/SectionTow/SectionTow.css";
import api from "../Services/api";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";

const ITEMS_PER_PAGE = 10;

interface EventItem {
  id: number;
  [key: string]: any;
}

function Events() {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const { t } = useTranslation();
  const [inputPage, setInputPage] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const [filteredEvents, setFilteredEvents] = useState<any[]>([]);
  const [langId, setLangId] = useState(savedLang?.id || 2);
  const [totalPages, setTotalPages] = useState(0);
  const [moveNext, setMoveNext] = useState(false);
  const [movePrevious, setMovePrevious] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const isLoggedIn = Boolean(localStorage.getItem("token"));

  const isArabic = savedLang?.code === "ar";
  const pStyle = {
    fontFamily: isArabic ? "var(--MNF_Body_AR)" : "var(--MNF_Body_EN)",
  };
  const headStyle = {
    fontFamily: isArabic ? "var(--MNF_Heading_AR)" : "var(--MNF_Heading_EN)",
  };

  const fetchEvents = (page = 1, term = "") => {
    const query = `news?isEvent=true&LanguageId=${langId}&PageIndex=${page}&PageSize=${ITEMS_PER_PAGE}${
      term ? `&Search=${term}` : ""
    }`;
    setIsLoading(true);

    api
      .get(query)
      .then((response) => {
        setFilteredEvents(response.data.result);
        setTotalPages(response.data.totalPages);
        setMoveNext(response.data.moveNext);
        setMovePrevious(response.data.movePrevious);
      })
      .catch((error) => {
        console.error("Error fetching events:", error);
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  useEffect(() => {
    fetchEvents(currentPage, searchTerm);
  }, [langId, currentPage]);

  const handleSearch = () => {
    setCurrentPage(1);
    fetchEvents(1, searchTerm);
  };

  const handlePageChange = (page: any) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setCurrentPage(page);
    }
  };

  const handleNextPage = () => {
    if (moveNext) setCurrentPage((prev) => prev + 1);
  };

  const handlePreviousPage = () => {
    if (movePrevious) setCurrentPage((prev) => prev - 1);
  };

  const handleEventDeleted = (deletedEventId: any) => {
    // Remove deleted event from current list
    setFilteredEvents(prev => prev.filter(event => event?.id !== deletedEventId));
    
    // If current page becomes empty and it's not the first page, go to previous page
    if (filteredEvents.length === 1 && currentPage > 1) {
      setCurrentPage(prev => prev - 1);
    } else {
      // Refresh the current page to get updated data
      setTimeout(() => {
        fetchEvents(currentPage, searchTerm);
      }, 100);
    }
  };

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const maxPagesToShow = 5; // Number of page buttons to show
    const pages = [];
    let startPage = Math.max(1, currentPage - Math.floor(maxPagesToShow / 2));
    let endPage = Math.min(totalPages, startPage + maxPagesToShow - 1);

    if (endPage - startPage + 1 < maxPagesToShow) {
      startPage = Math.max(1, endPage - maxPagesToShow + 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div>
      <div
        className="heroSlider"
        style={{
          backgroundImage:
            "url(https://portaltest.menofia.edu.eg/images/AboutUniversity.jpg)",
          backgroundPosition: "top",
          backgroundSize: "cover",
        }}>
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>

        <div className="searchCard">
          {isLoggedIn && (
            <button
              className="add-news-btn"
              onClick={() => navigate("/events/add")}
            >
              Add New Event
            </button>
          )}
          <div className="inputSerch">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                if (e.target.value.trim() === '') {
                  fetchEvents(1, '');
                }
              }}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
              placeholder={t("details.searchPlaceholder")}
            />
          </div>
          <div onClick={handleSearch} className="btnSearch" style={pStyle}>
            <button>
              <i className="fa fa-search" aria-hidden="true"></i>
              <span className="Btntext">{t("details.search")}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="news-page">
        {filteredEvents.length === 0 ? (
          <div className="card-not-found">
            <h2>{t("details.noResultsFound")}</h2>
          </div>
        ) : (
          <SectionOne row="row" News={filteredEvents} onNewsDeleted={handleEventDeleted} />
        )}
      </div>
      <div className="pagainationDown">
        <div
          className="pagination-controls"
          style={{ direction: isArabic ? "rtl" : "ltr" }}>
          <button
            onClick={handlePreviousPage}
            disabled={isLoading || !movePrevious}
            className="pagination-btn">
            <i
              className={`fa-solid ${
                isArabic ? "fa-chevron-right" : "fa-chevron-left"
              }`}></i>
          </button>

          <div className="page-numbers">
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`pagination-btn ${
                  page === currentPage ? "active" : ""
                }`}
                disabled={isLoading}>
                {page}
              </button>
            ))}
          </div>

          <button
            onClick={handleNextPage}
            disabled={isLoading || !moveNext}
            className="pagination-btn">
            <i
              className={`fa-solid ${
                isArabic ? "fa-chevron-left" : "fa-chevron-right"
              }`}></i>
          </button>
        </div>

        <div className="pageSearch">
           <p className="pages">{t("details.page")} : <span>{totalPages}</span></p>
          <input
            type="number"
            className="inputPage"
            value={inputPage}
            onChange={(e) => setInputPage(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                const page = parseInt(inputPage);
                if (page >= 1 && page <= totalPages) {
                  setCurrentPage(page);
                }
              }
            }}
          />
          <button
            data-tip="Search By Page"
            className="btnPage"
            onClick={() => {
              const page = parseInt(inputPage);
              if (page >= 1 && page <= totalPages) {
                setCurrentPage(page);
              }
            }}>
            <i className="fa-solid fa-magnifying-glass-arrow-right"></i>
          </button>
          <ReactTooltip
            place="top"
            className="custom-tooltip"
            type="dark"
            effect="solid"
          />
        </div>
      </div>
    </div>
  );
}

export default Events; 