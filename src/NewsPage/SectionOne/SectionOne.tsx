import React from "react";
import "./SectionOne.css";
import { Link } from "react-router-dom";
import defaultImg from "../../assets/raes.jpg";
import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import ReactTooltip from "react-tooltip";
import { Edit, Trash2 } from "lucide-react";
import { useAuth } from "../../hooks/useAuth";
import DeleteConfirmModal from "../../components/DeleteConfirmModal";
import api from "../../Services/api";

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

function SectionOne({ News, row, onNewsDeleted }) {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const { t } = useTranslation();
  const { isLoggedIn } = useAuth();
  
  // Modal state
  const [deleteModal, setDeleteModal] = useState({
    isOpen: false,
    newsId: null,
    newsTitle: "",
    isLoading: false
  });

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
      year: "numeric" as const,
      month: "short" as const,
      day: "numeric" as const,
    };
    return date.toLocaleDateString("en-US", options);
  };

  const handleDeleteClick = (e, news) => {
    e.preventDefault();
    e.stopPropagation();
    setDeleteModal({
      isOpen: true,
      newsId: news.id,
      newsTitle: news.newsDetails.head,
      isLoading: false
    });
  };

  const handleEditClick = (e, news) => {
    e.preventDefault();
    e.stopPropagation();
    console.log("Edit news:", news.id);
  };

  const handleDeleteConfirm = async () => {
    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      const token = localStorage.getItem('token');
      
      await api.delete(`news/${deleteModal.newsId}`, {
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

      // Notify parent component to refresh news list
      if (onNewsDeleted) {
        onNewsDeleted(deleteModal.newsId);
      }

      // Show success message (you can implement a toast notification)
      console.log("News deleted successfully");
      
    } catch (error) {
      console.error("Error deleting news:", error);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
      // Show error message (you can implement error handling)
      alert("Failed to delete news. Please try again.");
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
    <>
      <div className="news-section" style={{ flexDirection: row }}>
        <div className="news-right-section">
          {News.map((news, index) => (
            <Link
              to={`/details/${news.id}`}
              state={{ news }}
              className="card"
              key={index}>

              <SmartImage 
                src={news?.newsImg}
                alt=""
                className=""
                style={{}}
                clipPath=""
              />

              {isLoggedIn && (
                <div className="admin-actions">
                  <button
                    className="admin-btn edit-btn"
                    onClick={(e) => handleEditClick(e, news)}
                    data-tip="Edit news"
                  >
                    <Edit size={16} />
                  </button>
                  <button
                    className="admin-btn delete-btn"
                    onClick={(e) => handleDeleteClick(e, news)}
                    data-tip="Delete news"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              )}

              <div
                className="about-news"
                data-tip={t("tooltip.details")}
                style={savedLang?.code === "ar" ? arrowAr : arrowEn}>
                <i className="fa-solid fa-arrow-up"></i>
              </div>
              <ReactTooltip place="top" className="custom-tooltip" type="dark" effect="solid" />

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

      <DeleteConfirmModal
        isOpen={deleteModal.isOpen}
        onClose={handleDeleteCancel}
        onConfirm={handleDeleteConfirm}
        newsTitle={deleteModal.newsTitle}
        isLoading={deleteModal.isLoading}
      />
    </>
  );
}

export default SectionOne;
