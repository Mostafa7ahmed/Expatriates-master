import React, { useState, useEffect } from "react";
import { Phone, Mail, MapPin, Star } from "lucide-react";
import "./ContactUs.css";
import Header from "../HomePage/Header/Header";
import Footer from "../HomePage/Footer/Footer";
import { useTranslation } from "react-i18next";
import axios from "axios";

function ContactUs(props) {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const { i18n, t } = useTranslation("Contact");

  const [email, setEmail] = useState("");
  const [description, setDescription] = useState("");
  const [rate, SetRate] = useState(0);
  const [status, setStatus] = useState("");
  const [emailError, setEmailError] = useState(""); 

  const [activeTab, setActiveTab] = useState(props.currentTap || "suggestions");
  const [formData, setFormData] = useState({
    email: "",
    orderNumber: "",
    rating: 0,
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const pArStyle = {
    fontFamily: "var(--MNF_Body_AR)",
    fontSize: "14px",
  };

  const pEnStyle = {
    fontFamily: "var(--MNF_Body_EN)",
  };

  const tabs = [
    { id: "suggestions", label: t("suggestions") },
    { id: "complaints", label: t("complaints") },
    { id: "ratings", label: t("ratings") },
  ];

  const validateEmail = (email) => {
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailPattern.test(email);
  };

  const handleEmailChange = (e) => {
    const emailValue = e.target.value;
    setEmail(emailValue);

    if (!validateEmail(emailValue)) {
      setEmailError(t("invalid-email"));
    } else {
      setEmailError("");
    }
  };

  const handleMessageChange = (e) => {
    setDescription(e.target.value);
  };

  const handleRatingChange = (rating) => {
    setFormData((prev) => ({ ...prev, rating }));
    SetRate(rating);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateEmail(email)) {
      setEmailError(t("invalid-email"));
      return;
    }

    setIsSubmitting(true);

    const subject =
      activeTab === "suggestions"
        ? "Suggestion"
        : activeTab === "complaints"
        ? "Complaint"
        : "Rating";
    const body = description;

    const messageData = {
      email,
      subject,
      body,
      ratingValue: activeTab === "ratings" ? rate : 0,
      type:
        activeTab === "complaints" ? 0 : activeTab === "suggestions" ? 1 : 2,
    };

    try {
      const response = await axios.post(
        "https://stage.menofia.edu.eg/api/v1/mail/send",
        messageData,
        {
          headers: {
            "Content-Type": "application/json",
            accept: "*/*",
          },
        }
      );
      setStatus("Message sent successfully!");
      setEmail("");
      setDescription("");
      SetRate(0); 
      setFormData({ email: "", orderNumber: "", rating: 0, message: "" });

      setSubmitted(true);
    } catch (error) {
      console.error("Error sending message:", error);
      setStatus("Failed to send message.");
    }

    setIsSubmitting(false);
    setTimeout(() => setSubmitted(false), 3000);
  };

  const renderForm = () => {
    if (submitted) {
      return (
        <div className="success-message">
          {activeTab === "suggestions" && t("suggestions-done")}
          {activeTab === "complaints" && t("complaints-done")}
          {activeTab === "ratings" && t("ratings-done")}
        </div>
      );
    }

    return (
      <form onSubmit={handleSubmit} className="contact-form">
        <div className="form-group">
          <label>
            {t("email")} <span className="required">*</span>
          </label>
          <input
            type="email"
            name="email"
            value={email}
            onChange={handleEmailChange}
            required
            placeholder={t("email-placeholder")}
          />
          {emailError && <p className="error-message">{emailError}</p>}
        </div>

        {activeTab === "ratings" && (
          <div className="form-group">
            <label>{t("rating")}</label>
            <div className="rating-stars">
              {[5, 4, 3, 2, 1].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => {
                    handleRatingChange(star);
                  }}
                  className="star-button">
                  <Star
                    fill={formData.rating >= star ? "currentColor" : "none"}
                    className={
                      formData.rating >= star ? "star-filled" : "star-empty"
                    }
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="form-group">
          <label>
            {t("message")} <span className="required">*</span>
          </label>
          <textarea
            name="message"
            value={description}
            onChange={handleMessageChange}
            required
            rows={5}
            placeholder={
              activeTab === "suggestions"
                ? t("message-placeholder-suggestions")
                : activeTab === "complaints"
                ? t("message-placeholder-complaints")
                : t("message-placeholder-ratings")
            }
          />
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className={`submit-button`}>
          {isSubmitting ? (
            <div className="loading-wrapper">
              <div className="loading-spinner" />
              <span>{t("sending")}</span>
            </div>
          ) : (
            t("submit")
          )}
        </button>
      </form>
    );
  };

  return (
    <div>
      <div
        className="contact-page"
        style={savedLang?.code === `ar` ? pArStyle : pEnStyle}>
        <div className="container">
          <div className="contact-wrapper">
            <div className="contact-info">
              <div className="info-header">
                <h2>{t("contact-us")}</h2>
                <p>{t("contact-desc")}</p>
              </div>

              <div className="info-items">
                <div className="info-item">
                  <div className="icon-wrapper">
                    <Phone size={20} className="contact-info-icon" />
                  </div>
                  <div className="info-content">
                    <p className="info-label">{t("phone")}</p>
                    <p className="info-value">0482222170</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="icon-wrapper">
                    <Mail size={20} className="contact-info-icon" />
                  </div>
                  <div className="info-content">
                    <p className="info-label">{t("email")}</p>
                    <p className="info-value">info@menofia.edu.eg</p>
                  </div>
                </div>

                <div className="info-item">
                  <div className="icon-wrapper">
                    <MapPin size={20} className="contact-info-icon" />
                  </div>
                  <div className="info-content">
                    <p className="info-label">{t("address")}</p>
                    <p className="info-value">
                      <a
                        target="blank"
                        href="https://maps.app.goo.gl/mQuJdCCYEvuoZkQDA">
                        Menoufia Governorate , Egypt
                      </a>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Main Content */}
            <div className="main-content">
              {/* Tabs */}
              <div className="tabs">
                <nav>
                  {tabs.map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`tab-button ${
                        activeTab === tab.id ? "active" : ""
                      }`}>
                      {tab.label}
                    </button>
                  ))}
                </nav>
              </div>

              {/* Form Content */}
              <div className="form-container">
                <div className="form-header">
                  <h3>
                    {activeTab === "suggestions" && t("suggestions")}
                    {activeTab === "complaints" && t("complaints")}
                    {activeTab === "ratings" && t("ratings")}
                  </h3>
                  <p>
                    {activeTab === "suggestions" && t("suggestions-desc")}
                    {activeTab === "complaints" && t("complaints-desc")}
                    {activeTab === "ratings" && t("ratings-desc")}
                  </p>
                </div>
                {renderForm()}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default ContactUs;
