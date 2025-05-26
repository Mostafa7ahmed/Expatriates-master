import React, { useState, useEffect } from "react";
import "./Collages.css";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

const Sector = () => {
  const savedLang = JSON.parse(localStorage.getItem("lang"));
  const { i18n, t } = useTranslation("College");

  const defaultSectors = [
    {
      id: "academic",
      title: t("academic-sector"),
      icon: "academic",
      description: t("academic-sector-desc"),
      detailText: t("academic-sector-about"),
      Colleges: [
        { name: t("art"), link: "https://www.menofia.edu.eg/ENG/Home/ar" }, { name: t("science"), link: "https://www.menofia.edu.eg/FEE/Home/ar" }, { name: t("education"), link: "https://www.menofia.edu.eg/fci/Home/ar" }, { name: t("business"), link: "https://mu.menofia.edu.eg/ai/Home/ar" }],
    },
    {
      id: "research",
      title: t("Research Sector"),
      icon: "research",
      description: t(
        "Scientific research and technological development centers"
      ),
      detailText: t("Research Description"),
      Colleges: [
        { name: t("Graduate Studies"), link: "https://www.menofia.edu.eg/SCI/Home/ar" },
        { name: t("Scientific Research"), link: "https://www.menofia.edu.eg/AGR/Home/ar" },
      ],
    },
    {
      id: "medical",
      title: t("medical sector"),
      icon: "medical",
      description: t("Medical colleges and teaching hospitals"),
      detailText: t("Medical Description"),
      Colleges: [{ name: t("Medicine"), link: "https://www.menofia.edu.eg/MED/Home/ar" }, { name: t("Dentistry"), link: "https://mu.menofia.edu.eg/dent/Home/ar" }, { name: t("Pharmacy"), link: "http://mu.menofia.edu.eg/pharm/Home/ar" }, { name: t("Nursing"), link: "https://www.menofia.edu.eg/NUR/Home/ar" }, { name: t("Bitary"), link: "https://mu.menofia.edu.eg/vmed/Home/ar" }, { name: t("MahadTamrid"), link: "https://mu.menofia.edu.eg/NCI/SectorsHome/ar" }],
    },
    {
      id: "technical",
      title: t("Technical sector"),
      icon: "technical",
      description: t("Computer and e-learning laboratories"),
      detailText: t("Technical Description"),
      Colleges: [
        { name: t("Computer Science"), link: "https://www.menofia.edu.eg/EDU/Home/ar" },
        { name: t("Engineering"), link: "https://www.menofia.edu.eg/EDV/Home/ar" },
        { name: t("Information Technology"), link: "https://mu.menofia.edu.eg/fpe/Home/ar" },
        { name: t("Applied Sciences"), link: "http://mu.menofia.edu.eg/media/Home/ar" },
        { name: t("Tigara"), link: "https://www.menofia.edu.eg/COM/Home/ar" },
        { name: t("Ealam"), link: "https://www.menofia.edu.eg/ART/Home/ar" },
        { name: t("Hoqoq"), link: "https://www.menofia.edu.eg/LAW/Home/ar" },
      ],
    },
  ];

  const pArStyle = {
    fontFamily: "var(--MNF_Body_AR)",
  }

  const pEnStyle = {
    fontFamily: "var(--MNF_Body_EN)",
  }

  const headArStyle = {
    fontFamily: "var(--MNF_Heading_AR)",
  }

  const headEnStyle = {
    fontFamily: "var(--MNF_Heading_EN)",
  }


  const [mounted, setMounted] = useState(false);
  const [expandedSector, setExpandedSector] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const toggleSector = (sectorId: string) => {
    if (expandedSector === sectorId) {
      setExpandedSector(null);
    } else {
      setExpandedSector(sectorId);
    }
  };

  return (
    <div className="page-container">
-      <div
        className="heroSlider"
        style={{
          backgroundImage: "url(https://portaltest.menofia.edu.eg/images/AboutUniversity.jpg)",
          backgroundPosition: "top",
          backgroundSize: "cover",
        }}
      >
        <div className="hero-image"></div>
        <div className="hero-overlay"></div>
              <div className="imageCard">
                  <h2 className="classification-title" style={savedLang?.code === `ar` ? headArStyle : headEnStyle}>{t("classification")}</h2>
            <p className="classification-text" style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>{t("classification-desc")}</p>

          
        </div>

      </div>

      <div className="title-container">
        <div className="title-header">
          <h1 className="title-text" style={savedLang?.code === `ar` ? headArStyle : headEnStyle}>{t("20")}</h1>
          <div className="title-count" style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>
            {t("college-number")}
          </div>
        </div>

        <p className="title-description" style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>
          {t("college-number-desc")}
        </p>
      </div>

      <section className="sectors-container" style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>
        <div className="sectors-list">
          {defaultSectors.map((sector, index) => (
            <div
              key={sector.id}
              className={`sector-item ${mounted ? "visible" : ""}`}
              style={{ transitionDelay: `${(index + 2) * 100}ms` }}
            >
              <div className="sector-panel">
                <div
                  className={`sector-header ${expandedSector === sector.id ? "expanded" : ""
                    }`}
                  onClick={() => toggleSector(sector.id)}
                >
                  <div className="sector-content">
                    <h3 className="sector-title">{sector.title}</h3>
                    <p className="sector-description">{sector.description}</p>
                    <div
                      className={`sector-chevron ${expandedSector === sector.id ? "expanded" : ""
                        }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <polyline points="6 9 12 15 18 9"></polyline>
                      </svg>
                    </div>
                  </div>
                </div>

                <div
                  className={`sector-expandable ${expandedSector === sector.id ? "expanded" : ""
                    }`}
                >
                  <div
                    className={`sector-expandable-content ${expandedSector === sector.id ? "expanded" : ""
                      }`}
                  >
                    <div className="about-sector">
                      <h2>{t("sector-about")}</h2>
                      <p className="sector-detail-text">{sector.detailText}</p>
                    </div>

                    <div className="all-collages">
                      <h2>{t("college")}</h2>
                      <div>
                        {sector.Colleges.map((college, index) => (
                          <a href={college.link} key={index}>
                            {college.name}
                          </a>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
};

export default Sector;
