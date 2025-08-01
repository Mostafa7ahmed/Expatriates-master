import React, { useState, useEffect, useCallback } from "react";
import "./Details.css";
import { Link, useLocation, useParams } from "react-router-dom";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import api from "../Services/api";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import defaultImg from "../assets/raes.jpg";
import { Edit, Trash2 } from "lucide-react";
import { toast } from "react-toastify";
import { useAuth } from "../hooks/useAuth";
import DeleteConfirmModal from "../components/DeleteConfirmModal";

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
  const { i18n, t } = useTranslation("News");
  const { t: tDetails } = useTranslation("NewsDetails");
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  
  // Modal state for delete confirmation
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    newsId: null,
    newsTitle: "",
    isLoading: false
  });

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


useEffect(() => {
  if (id && langId) {
    api
      .get(`News/${id}/${langId}`)
      .then((response) => {
        if (
          response.data.statusCode === 400 
        ) {
          navigate("/news");
        } else {
          setCurrentNews(response.data.result);
        }
      })
      .catch((error) => {
        if (
          error.response ||
          error.response.status === 400 
        ) {
          navigate("/news");
        } else {
          console.error("Error fetching News:", error);
        }
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

  const handleDeleteClick = () => {
    setDeleteModal({
      isOpen: true,
      newsId: currentNews?.id,
      newsTitle: currentNews?.newsDetails?.head || "",
      isLoading: false
    });
  };

  const handleEditClick = () => {
    window.open(`/news/edit/${currentNews?.id}`, '_blank');
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      const token = localStorage.getItem('token');
      
      await api.get(`news/delete/${deleteModal.newsId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        }
      });

      setDeleteModal({
        isOpen: false,
        newsId: null,
        newsTitle: "",
        isLoading: false
      });

      // Show success toast
      toast.success(t("delete.messages.success"), {
        position: "top-right",
        autoClose: 2000,
      });

      // Navigate back to news list
      navigate("/news");
      
    } catch (error) {
      console.error("Error deleting news:", error);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
      
      // Show error toast
      toast.error(t("delete.messages.error"), {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({
      isOpen: false,
      newsId: null,
      newsTitle: "",
      isLoading: false
    });
  };

  return (
    <div>

      <main className="main">
        <div className="containerr">
          <div className="content-wrapper">
            <div className="event-text-content">
              <div className="headertext">
                <div className="title-section">
                  <h2
                    className="event-title"
                    style={
                      savedLang?.code === `ar` ? headerArStyle : headerEnStyle
                    }>
                    {currentNews?.newsDetails.head}
                  </h2>
                  
                  {isLoggedIn && currentNews && (
                    <div className="admin-actions-details">
                      <button
                        className="admin-btn edit-btn"
                        onClick={handleEditClick}
                        title="Edit news"
                      >
                        <Edit size={20} />
                      </button>
                      <button
                        className="admin-btn delete-btn"
                        onClick={handleDeleteClick}
                        title="Delete news"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  )}
                </div>
                
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
                    {/* <img
                      src={currentNews?.newsImg || defaultImg}
                      alt={`${currentNews?.newsDetails.head}`}
                      className="carousel-image"
                      onError={(e) => {
                        e.target.onerror = null;
                        e.target.src = defaultImg;
                    }}
                    /> */}

                    <SmartImage
                        src={currentNews?.newsImg }
                        alt={`${currentNews?.newsDetails.head}`}
                        className="carousel-image"
                        style={{}}
                        clipPath=""
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
                {tDetails("relatedNews")}
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
                        src={news.newsImg || defaultImg}
                        alt={`News ${index}`}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = defaultImg;
                        }}
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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        newsTitle={deleteModal.newsTitle}
        isLoading={deleteModal.isLoading}
      />
    </div>
  );
}

export default Details;
