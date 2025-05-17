import React, { useState } from "react";
import "./Programs.css";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import { useTranslation } from "react-i18next";
import { FaGraduationCap, FaArrowRight, FaSearch } from "react-icons/fa";

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
      <Header index={3} />

      <div className={`programs-container-inner ${lang}`}>
        {/* Header */}
        <div className="program-hero">
          <h2 className="hero-title">{t("note.expatriate_activities")}</h2>
          <div className="search-bar">
            <FaSearch className="search-icon" />
            <input
              type="text"
              placeholder={t("search_placeholder")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredColleges.length === 0 ? (
          <div className="no-results">
            <img
              src="/images/no-results.png"
              alt="No results"
              className="no-results-img"
            />
            <h3>{t("no_colleges_found")}</h3>
            <p>{t("no_colleges_desc")}</p>
            <button className="clear-search-btn" onClick={clearSearch}>
              {t("clear_search")}
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
                  <p className="programs-subtitle">{t("programs")}</p>
                  <ul className="programs-list">
                    {college.programs.slice(0, 3).map((prog, i) => (
                      <li key={i}>
                        <FaGraduationCap /> {prog}
                      </li>
                    ))}
                  </ul>
                  <p className="show-all">
                    {t("show_all", { count: college.programs.length })}
                  </p>
                  <button className="learn-more-btn">
                    {t("learn_more")} <FaArrowRight />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Programs;
