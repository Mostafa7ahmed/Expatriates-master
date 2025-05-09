import React from "react";
import logo from "../../assets/image2.png";
import line from "../../assets/CurveLine.svg";
import "./About.css";
import { useTranslation } from "react-i18next";

const lineArStyle = {
  left: "-38px",
  transform: 'rotateY(180deg)'
}

const lineEnStyle = {
  right: "-38px"
}

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

function About() {
  const savedLang = JSON.parse(localStorage.getItem("lang"));
  const { i18n, t } = useTranslation();

  return (
    <div className="about-container">
      <div className="content">
        <img src={logo} alt="MNF-logo" />
        <p style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>{t("about.subtitle")}</p>
      </div>

      <h1 style={savedLang?.code === `ar` ? headArStyle : headEnStyle} >{t("about.title")}</h1>

      <img src={line} alt="Curve line" className={savedLang?.code === `ar` ? "curveLine curveLinear" : "curveLine"} style={savedLang?.code === `ar` ? lineArStyle : lineEnStyle} />
    </div>
  );
}

export default About;
