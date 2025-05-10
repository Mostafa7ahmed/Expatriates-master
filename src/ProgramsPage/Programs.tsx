import React from "react";
import "./Programs.css";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import { useTranslation } from "react-i18next";

const Programs = () => {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const { i18n, t } = useTranslation("Programs");

  const pArStyle = {
    fontFamily: "var(--MNF_Body_AR)",
  };

  const pEnStyle = {
    fontFamily: "var(--MNF_Body_EN)",
  };

  const headArStyle = {
    fontFamily: "var(--MNF_Heading_AR)",
  };

  const headEnStyle = {
    fontFamily: "var(--MNF_Heading_EN)",
  };

  const allPrograms = [
    {
      id: 1,
      program: t("program.general_admin"),
      link: "https://mu.menofia.edu.eg/infor/infoHome/ar",
    },
    {
      id: 2,
      program: t("program.commerce_special"),
      link: "https://www.menofia.edu.eg/View/12737/ar",
    },
    {
      id: 3,
      program: t("program.legal_open"),
      link: "https://www.menofia.edu.eg/View/12738/ar",
    },
    {
      id: 4,
      program: t("program.blended_arts"),
      link: "https://www.menofia.edu.eg/View/12739/ar",
    },
    {
      id: 5,
      program: t("program.medicine_credit"),
      link: "https://www.menofia.edu.eg/View/69836/ar",
    },
    {
      id: 6,
      program: t("program.university_housing"),
      link: "http://alzahraa.mans.edu.eg/studentApplications",
    },
    {
      id: 7,
      program: t("program.student_inquiry"),
      link: "https://www.menofia.edu.eg/Students/ar",
    },
    {
      id: 8,
      program: t("program.ece_program"),
      link: "https://www.menofia.edu.eg/View/12740/ar",
    },
    {
      id: 9,
      program: t("program.centers_excellence"),
      link: "https://www.menofia.edu.eg/View/63344/ar",
    },
    {
      id: 10,
      program: t("program.eval_center"),
      link: "http://mu.menofia.edu.eg/CenEv/",
    },
    {
      id: 11,
      program: t("program.iso_training"),
      link: "https://www.menofia.edu.eg/View/126087/ar",
    },
    {
      id: 12,
      program: t("program.engineering_library"),
      link: "https://www.menofia.edu.eg/View/129655/ar",
    },
  ];

  return (
    <div
      className="programs-container"
      style={savedLang?.code === `ar` ? headArStyle : headEnStyle}
    >
      <Header index={3}></Header>

      <div
        className="program-hero-container"
        style={{
          backgroundImage: "url(https://portaltest.menofia.edu.eg/images/AboutUniversity.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
        }}
      >
        <div className="program-hero-overlay"></div>
        <div
          className={
            savedLang?.code === `ar`
              ? "program-box ar-program-box"
              : "program-box en-program-box"
          }
        >
          <h2
            className="programs-text"
            style={savedLang?.code === `ar` ? pArStyle : pEnStyle}
          >
            {t("note.expatriate_activities")}
          </h2>
        </div>
      </div>

      <div className="program-cards">
        {allPrograms.map((program) => (
          <div className="program-item" key={program.id}>
            <h4>{program.program}</h4>
            <a href={program.link} target="_blank">
              {t("button.learn_more")}
            </a>
          </div>
        ))}
      </div>

      <Footer></Footer>
    </div>
  );
};

export default Programs;
