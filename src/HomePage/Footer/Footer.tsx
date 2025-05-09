import React from "react";
import { ExternalLink } from "lucide-react";
import "./Footer.css";
import logo1 from "../../assets/MNF_logo.png";
import logo2 from "../../assets/image.png";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const date = new Date().getFullYear();
  const savedLang = JSON.parse(localStorage.getItem("lang"));
  const { i18n, t } = useTranslation();

  const ArStyle = {
    fontFamily: "var(--MNF_Body_AR)",
    lineHeight: "1.5",
  }

  const EnStyle = {
    fontFamily: "var(--MNF_Body_EN)",
  }

  return (
    <div>
      <div className="footer-container" style={savedLang?.code === `ar` ? ArStyle : EnStyle}>
        <div className="footer-sector">
          <h3 className={savedLang?.code === `ar` ? "footer-title footer-titleAr" : "footer-title"}>{t("footer.keyInformation")}</h3>
          <div className="ul-container">
            <ul>
              <li>
                {" "}
                <a target="blank" href="https://www.menofia.edu.eg/View/39378/ar">{t("footer.latestDecisions")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/AllFacResults/ar">{t("footer.conditionsTransfers")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://www.menofia.edu.eg/View/172590/ar">{t("footer.administrativeDirectives")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/News/ar">{t("footer.financialTransferControls")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/View/13755/ar">{t("footer.quarterlyExamResults")}</a>{" "}
              </li>
            </ul>
            <ul>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/View/13753/ar">{t("footer.generalGuidelines")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://www.menofia.edu.eg/View/135683/ar">{t("footer.paperServices")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://www.menofia.edu.eg/View/39381/ar">{t("footer.stoppingRegistration")}</a>{" "}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-sector">
          <h3 className={savedLang?.code === `ar` ? "footer-title footer-titleAr" : "footer-title"}>{t("footer.importantLinks")}</h3>
          <div className="ul-container">
            <ul>
              <li>
                {" "}
                <a target="blank" href="https://scu.eg/eksc_units/%d8%b4%d8%a8%d9%83%d8%a9-%d8%a7%d9%84%d8%ac%d8%a7%d9%85%d8%b9%d8%a7%d8%aa-%d8%a7%d9%84%d9%85%d8%b5%d8%b1%d9%8a%d9%87/">{t("footer.importantLatestDecisions")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://nelc.gov.sa/">{t("footer.importantConditionsTransfers")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://digital.gov.eg/">{t("footer.importantAdministrativeDirectives")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="http://www.monofeya.gov.eg/Default.aspx">{t("footer.importantFinancialTransferControls")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://stdf.eg/">{t("footer.importantQuarterlyExamResults")}</a>{" "}
              </li>
            </ul>
            <ul>
              <li>
                {" "}
                <a target="blank" href="http://srv4.eulc.edu.eg/eulc_v5/libraries/start.aspx">{t("footer.importantGeneralGuidelines")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://www.aaru.edu.jo/home.aspx">{t("footer.importantPaperServices")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://scu.eg/">{t("footer.importantStoppingRegistration")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://mohesr.gov.eg/ar-eg/Pages/Home.aspx">{t("footer.MinistryofHigherEducation")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://naqaae.eg/">{t("footer.NationalAuthorityforQualityAssuranceandAccreditation")}</a>{" "}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-sector">
          <h3 className={savedLang?.code === `ar` ? "footer-title footer-titleAr" : "footer-title"}>{t("footer.serviceGuide")}</h3>
          <div className="ul-container">
            <ul>
              <li>
                {" "}
                <a target="blank" href="https://www.menofia.edu.eg/View/39388/ar">{t("footer.serviceGuideLatestDecisions")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://www.menofia.edu.eg/View/39378/ar">{t("footer.serviceGuideConditionsTransfers")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://www.menofia.edu.eg/View/39393/ar">{t("footer.serviceGuideAdministrativeDirectives")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://www.topuniversitiesegypt.com/ar/%D8%AC%D8%A7%D9%85%D8%B9%D8%A9-%D8%A7%D9%84%D9%85%D9%86%D9%88%D9%81%D9%8A%D8%A9/%D8%AC%D9%87%D8%A7%D8%AA_%D8%A7%D9%84%D8%A7%D8%AA%D8%B5%D8%A7%D9%84">{t("footer.serviceGuideFinancialTransferControls")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://admission.study-in-egypt.gov.eg/">{t("footer.serviceGuideGeneralGuidelines")}</a>{" "}
              </li>
            </ul>
            <ul>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/educ/View/63355/ar">{t("footer.serviceGuidePaperServices")}</a>{""}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/MUIS/View/140688/ar">{t("footer.serviceGuideStoppingRegistration")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/educ/View/61892/ar">{t("footer.serviceReview")}</a>{" "}
              </li>
              <li>
                {" "}
                <a target="blank" href="https://mu.menofia.edu.eg/educ/View/61891/ar">{t("footer.EntertainmentCorner")}</a>{" "}
              </li>
            </ul>
          </div>
        </div>

        <div className="footer-sector">
          <h3 className={savedLang?.code === `ar` ? "footer-title footer-titleAr" : "footer-title"}>
            {t("footer.Evaluationcomplaintsandsuggestions")}
          </h3>
          <div className="ul-container">
            <ul>
              <li>
                {" "}
                <a href="/contactUs">{t("footer.performanceEvaluation")}</a>{" "}
              </li>
              <li>
                {" "}
                <a href="/contactUs">{t("footer.generalComplaints")}</a>{" "}
              </li>
              <li>
                {" "}
                <a href="/contactUs">{t("footer.sendSuggestions")}</a>{" "}
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div className="bottom-footer-container">
        <div className="footer-logos">
          <img src={logo2} alt="Expatriate_logo" />
          <img src={logo1} alt="MNF_logo" />
        </div>

        <div className="social-copyRights" style={savedLang?.code === `ar` ? ArStyle : EnStyle}>
          <p>{t("footer.copyrights")} {date}. ©</p>

          <div className="social">
            <a target="blank" href="https://www.facebook.com/menofia.edu.eg?locale=ar_AR"><div className="social-facebook">
              <i className="fa-brands fa-facebook"></i>
            </div></a>

            <a target="blank" href="https://x.com/mediamenoufiaun?t=ZwQujlS2aAqMHCSmbJNk7A&s=09"><div className="social-x">
              <i className="fa-brands fa-x-twitter"></i>
            </div></a>

            <a target="blank" href="https://youtube.com/@menoufiauniversitychannel9727"><div className="social-youtube">
              <i className="fa-brands fa-youtube"></i>
            </div></a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Footer;
