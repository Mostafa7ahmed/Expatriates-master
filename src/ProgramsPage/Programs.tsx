import React, { useState } from "react";
import "./Programs.css";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import { useTranslation } from "react-i18next";
import { FaGraduationCap, FaArrowRight, FaSearch } from "react-icons/fa";
import { Link } from "react-router-dom";
import ReactTooltip from "react-tooltip";

const Programs = () => {
  const { t, i18n } = useTranslation("Programs");
  const lang = i18n.language || "ar";
  const colleges = t("colleges", { returnObjects: true });

  const [searchTerm, setSearchTerm] = useState("");

  const filteredColleges = colleges.filter((college) =>
    college.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    college.programs.some((prog) =>
      prog.toLowerCase().includes(searchTerm.toLowerCase())
    )
  );

  const clearSearch = () => setSearchTerm("");

  return (
    <div className="programs-container">      
      <div
        className="heroSliderpor"
        style={{
          backgroundImage: "url(https://portaltest.menofia.edu.eg/images/AboutUniversity.jpg)",
          backgroundPosition: "top",
          backgroundSize: "cover",
        }}
      >
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>

        <div className="searchCard">
          <div className="inputSerch">
        <input
              type="text"
                placeholder={t("note.searchPlaceholder")}
               value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
        </div>
      </div>

      <div className={`programs-container-inner ${lang}`}>
 

        {filteredColleges.length === 0 ? (
          <div className="no-results">
         <i className="fas fa-search fs-1 text-5xl text-gray-300 mb-4"></i>
            <h3>{t("note.No colleges found")}</h3>
            <button className="clear-search-btn" onClick={clearSearch}>
              {t("note.Clear Search")}
            </button>
          </div>
        ) : (
          <div className="program-grid">
            {filteredColleges.map((college, index) => (
              <div className="program-card" key={index}>
                <img
                  src={college.image}
                  alt={college.name}
                  className="card-img"
                />
                <div className="card-content">
                  <h3 className="college-title">{college.name}</h3>
                  <p className="programs-subtitle">{t("note.programs")}</p>
                 <ul className="programs-list scrollable-programs">
            {college.programs.map((prog, i) => (
              <li key={i}>
                <FaGraduationCap /> {prog}
              </li>
            ))}
            
          </ul>
            <div className="linkArrow">
                  <Link
                    to={college.link}
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
                  <ReactTooltip place="top"   className="custom-tooltip"  type="dark" effect="solid" />

                </div>
                    
             
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};

export default Programs;
