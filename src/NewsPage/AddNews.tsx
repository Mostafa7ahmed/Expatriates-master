import React, { useState, useEffect, useRef } from "react";
import api from "../Services/api";
import "./AddNews.css";
import { useNavigate } from "react-router-dom";
import { RichTextEditor } from '@mantine/rte';
import { useTranslation } from "react-i18next";
import { toast } from 'react-toastify';

// Custom Language Select Component with Flags
interface CustomLanguageSelectProps {
  languages: Language[];
  selectedLangId: number | "";
  onLanguageChange: (langId: number | "") => void;
  excludeLanguageIds?: (number | "")[];
}

const CustomLanguageSelect: React.FC<CustomLanguageSelectProps> = ({ 
  languages, 
  selectedLangId, 
  onLanguageChange,
  excludeLanguageIds = []
}) => {
  const { t } = useTranslation("News");
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const selectedLanguage = languages.find(l => l.id === selectedLangId);
  
  // Filter out already selected languages (excluding current selection)
  const availableLanguages = languages.filter(lang => 
    !excludeLanguageIds.includes(lang.id) || lang.id === selectedLangId
  );

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="custom-language-select" ref={dropdownRef}>
      {/* Selected Option Display */}
      <div 
        className="language-select-display"
        onClick={() => setIsOpen(!isOpen)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            setIsOpen(!isOpen);
          }
          if (e.key === 'Escape') {
            setIsOpen(false);
          }
        }}
        tabIndex={0}
        role="combobox"
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        {selectedLanguage ? (
          <div className="selected-language-item">
            <img 
              src={selectedLanguage.flag} 
              alt={`${selectedLanguage.name} flag`}
              className="language-flag"
            />
            <span className="language-name">{selectedLanguage.name}</span>
          </div>
        ) : (
          <div className="placeholder-language">
            <span className="globe-icon">🌐</span>
            <span>{t("addNews.form.translations.fields.selectLanguage")}</span>
          </div>
        )}
        <span className={`dropdown-arrow ${isOpen ? 'open' : ''}`}>▼</span>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <div className="language-dropdown-options" role="listbox">
          <div 
            className="language-option placeholder"
            onClick={() => {
              onLanguageChange("");
              setIsOpen(false);
            }}
          >
            <span className="globe-icon">🌐</span>
            <span>{t("addNews.form.translations.fields.selectLanguage")}</span>
          </div>
          {availableLanguages.length === 0 ? (
            <div className="language-option disabled">
              <span className="warning-icon">⚠️</span>
              <span>{t("addNews.form.translations.fields.allLanguagesSelectedWarning")}</span>
            </div>
          ) : (
            availableLanguages.map((language) => (
              <div
                key={language.id}
                className={`language-option ${selectedLangId === language.id ? 'selected' : ''}`}
                onClick={() => {
                  onLanguageChange(language.id);
                  setIsOpen(false);
                }}
              >
                <img 
                  src={language.flag} 
                  alt={`${language.name} flag`}
                  className="language-flag"
                />
                <span className="language-name">{language.name}</span>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

interface Language {
  id: number;
  code: string;
  name: string;
  flag: string;
}

interface Translation {
  newsHead: string;
  newsAbbr: string;
  newsBody: string;
  newsSource: string;
  langId: number | "";
  imgAlt: string;
}

const AddNews: React.FC = () => {
  const { t } = useTranslation("News");
  const [languages, setLanguages] = useState<Language[]>([]);

  const [newsImgFile, setNewsImgFile] = useState<File | null>(null);
  const [newsImgPreview, setNewsImgPreview] = useState<string>("");
  const [newsImgFileName, setNewsImgFileName] = useState<string>("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [published, setPublished] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [translations, setTranslations] = useState<Translation[]>([{
    newsHead: "",
    newsAbbr: "",
    newsBody: "",
    newsSource: "",
    langId: "",
    imgAlt: "Image Not Found",
  }]);

  const navigate = useNavigate();

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    api.get("/languages").then(res => {
      if(res?.data?.success){
        setLanguages(res.data.result);
      }
    }).catch(err => console.error(err));
  }, []);

  const handleTranslationChange = (index: number, field: keyof Translation, value: any) => {
    setTranslations(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addTranslation = () => {
    // Check if all languages are already selected
    const availableLanguages = languages.filter(lang => 
      !translations.map(translation => translation.langId).filter(id => id !== "").includes(lang.id)
    );
    
    if (availableLanguages.length === 0) {
      toast.warning(t("addNews.form.translations.allLanguagesSelected"), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }

    setTranslations([...translations, {
      newsHead: "",
      newsAbbr: "",
      newsBody: "",
      newsSource: "",
      langId: "",
      imgAlt: "Image Not Found"
    }]);
  };

  const removeTranslation = (index: number) => {
    if (translations.length <= 1) {
      toast.warning(t("addNews.form.translations.atLeastOneRequired"), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setTranslations(translations.filter((_, i) => i !== index));
  };

  const uploadImageToServer = async (file: File): Promise<{path: string, fileName: string}> => {
    const formData = new FormData();
    formData.append('file', file);

    const token = localStorage.getItem('token');
    const response = await api.post('/stream', formData, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'multipart/form-data',
        'accept': '*/*'
      }
    });

    if (response.data.success) {
      return {
        path: response.data.result.path,
        fileName: response.data.result.fileName
      };
    } else {
      throw new Error('Failed to upload image');
    }
  };

  const handleFileChange = async (file: File | null) => {
    setNewsImgFile(file);
    if (file) {
      setUploadingImage(true);
      try {
        const uploadResult = await uploadImageToServer(file);
        setNewsImgPreview(uploadResult.path);
        setNewsImgFileName(uploadResult.fileName);
        
        toast.success("Image uploaded successfully!", {
          position: "top-right",
          autoClose: 2000,
        });
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.", {
          position: "top-right",
          autoClose: 4000,
        });
        // Fallback to local preview if upload fails
        const url = URL.createObjectURL(file);
        setNewsImgPreview(url);
        setNewsImgFileName("");
      } finally {
        setUploadingImage(false);
      }
    } else {
      setNewsImgPreview("");
      setNewsImgFileName("");
    }
  };

  const removeImage = () => {
    setNewsImgFile(null);
    setNewsImgPreview("");
    setNewsImgFileName("");
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  // Compute if save button should be disabled
  const isSaveDisabled = uploadingImage || translations.some(t => !t.newsHead.trim() || t.langId === "");

  const handleSubmit = async () => {
    try {
      // Validate that image is uploaded if file was selected
      if (newsImgFile && !newsImgFileName) {
        toast.error("Please wait for image upload to complete", {
          position: "top-right",
          autoClose: 4000,
        });
        return;
      }

      const ownerId = localStorage.getItem("userId");
      const payload = {
        ownerId,
        newsImg: newsImgFileName, // Use uploaded fileName instead of base64
        published,
        isFeatured,
        translations: translations.filter(t => t.langId !== ""),
      };

      const token = localStorage.getItem("token");
      console.log(payload)
      const response = await api.post("/news", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });

      toast.success(t("addNews.messages.success"), {
        position: "top-right",
        autoClose: 2000,
      });
      
      navigate("/news");
    } catch(err){
      console.error(err);
      toast.error(t("addNews.messages.error"), {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  return (
    <div className="add-news-container">
      <h2>{t("addNews.title")}</h2>

      {/* Main Info */}
      <section className="main-info">
        <h3>{t("addNews.sections.mainInfo")}</h3>
        <div className="field">
          <label>{t("addNews.form.imageUpload.title")}:</label>
          
          {/* Image Preview */}
          {newsImgPreview && (
            <div className="image-preview-container" style={{ marginBottom: "15px" }}>
              <div className="image-preview-wrapper" style={{ position: "relative", display: "inline-block" }}>
                <img 
                  src={newsImgPreview} 
                  alt="Selected image" 
                  className="preview-img" 
                  style={{ objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
                />
          
                <button
                  type="button"
                  onClick={removeImage}
                  style={{
                    position: "absolute",
                    top: "-8px",
                    right: "-8px",
                    background: "#dc2626",
                    color: "white",
                    border: "none",
                    borderRadius: "50%",
                    width: "24px",
                    height: "24px",
                    cursor: "pointer",
                    fontSize: "12px",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center"
                  }}
                  title={t("addNews.form.imageUpload.removeImage")}
                >
                  ✕
                </button>
              </div>
            </div>
          )}
          
          {/* Upload Area */}
          <div
            className="file-drop"
            onClick={() => !uploadingImage && fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
            style={{ 
              minHeight: newsImgPreview ? "60px" : "120px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              opacity: uploadingImage ? 0.6 : 1,
              cursor: uploadingImage ? "not-allowed" : "pointer"
            }}
          >
            <span>
              {uploadingImage ? (
                <>
                  <i className="fa fa-spinner fa-spin" style={{ marginRight: "8px" }}></i>
                  Uploading image...
                </>
              ) : (
                newsImgPreview ? t("addNews.form.imageUpload.clickToSelect") : t("addNews.form.imageUpload.dragDrop")
              )}
            </span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              disabled={uploadingImage}
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            />
          </div>
        </div>
        <div className="field">
          <label>
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} /> {t("addNews.form.featured")}
          </label>
          <label style={{marginInlineStart: '20px'}}>
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> {t("addNews.form.published")}
          </label>
        </div>
      </section>

      {/* Translations */}
      <section className="translations">
        <h3>{t("addNews.form.translations.title")}</h3>
        {translations.map((translation, idx) => (
          <details key={idx} className="translation-card" open>
            <summary>
              <span>{t("addNews.form.translations.translationNumber", { number: idx + 1 })}</span>
              {translations.length > 1 && (
                <i
                  className="fa-solid fa-trash delete-icon"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeTranslation(idx);
                  }}
                />
              )}
            </summary>
            <div className="translation-body">
              <div className="field">
                <label style={{marginBottom: 6, display: 'block', color: '#F66B15', fontWeight: 500}}>
                  {t("addNews.form.translations.fields.language")}
                </label>
                <CustomLanguageSelect
                  languages={languages}
                  selectedLangId={translation.langId}
                  onLanguageChange={(langId) => handleTranslationChange(idx, "langId", langId)}
                  excludeLanguageIds={translations.map((trans, i) => i !== idx ? trans.langId : "").filter(id => id !== "")}
                />
              </div>
              <div className="field">
                <div className="floating-group">
                  <textarea
                    className="floating-label-input"
                    id={`newsHead-${idx}`}
                    value={translation.newsHead}
                    placeholder=" "
                    onChange={(e) => handleTranslationChange(idx, "newsHead", e.target.value)}
                    required
                    rows={2}
                    style={{resize: 'vertical'}}
                  />
                  <label htmlFor={`newsHead-${idx}`} className="floating-label">
                    {t("addNews.form.translations.fields.title")}
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="floating-group">
                  <textarea
                    className="floating-label-input"
                    id={`newsAbbr-${idx}`}
                    value={translation.newsAbbr}
                    placeholder=" "
                    onChange={(e) => handleTranslationChange(idx, "newsAbbr", e.target.value)}
                    required
                    rows={2}
                    style={{resize: 'vertical'}}
                  />
                  <label htmlFor={`newsAbbr-${idx}`} className="floating-label">
                    {t("addNews.form.translations.fields.summary")}
                  </label>
                </div>
              </div>
              <div className="field">
                <div className="floating-group">
                  <textarea
                    className="floating-label-input"
                    id={`newsSource-${idx}`}
                    value={translation.newsSource}
                    placeholder=" "
                    onChange={(e) => handleTranslationChange(idx, "newsSource", e.target.value)}
                    rows={2}
                    style={{resize: 'vertical'}}
                  />
                  <label htmlFor={`newsSource-${idx}`} className="floating-label">
                    {t("addNews.form.translations.fields.source")}
                  </label>
                </div>
              </div>
                 <div className="field">
                <div className="floating-group">
                  <textarea
                    className="floating-label-input"
                    id={`imgAlt-${idx}`}
                    value={translation.imgAlt}
                    placeholder=" "
                    onChange={(e) => handleTranslationChange(idx, "imgAlt", e.target.value)}
                    rows={2}
                    style={{resize: 'vertical'}}
                  />
                  <label htmlFor={`imgAlt-${idx}`} className="floating-label">
                    {t("addNews.form.translations.fields.imageAlt")}
                  </label>
                </div>
              </div>
              <div className="field">
                <label>{t("addNews.form.translations.fields.content")}:</label>
                <div className="news-body-editor">
                  <RichTextEditor
                    value={translation.newsBody}
                    onChange={(value) => handleTranslationChange(idx, "newsBody", value)}
                    style={{ background: "#fff", borderRadius: 8, minHeight: 180 }}
                  />
                </div>
              </div>
            
            </div>
          </details>
        ))}
        <button 
          className={`add-translation-btn ${
            languages.filter(lang => !translations.map(translation => translation.langId).filter(id => id !== "").includes(lang.id)).length === 0 
              ? 'disabled' 
              : ''
          }`} 
          onClick={addTranslation}
          disabled={languages.filter(lang => !translations.map(translation => translation.langId).filter(id => id !== "").includes(lang.id)).length === 0}
        >
          {languages.filter(lang => !translations.map(translation => translation.langId).filter(id => id !== "").includes(lang.id)).length === 0 
            ? t("addNews.form.translations.allLanguagesAdded")
            : t("addNews.form.translations.addTranslation")
          }
        </button>
      </section>

      <button className="save-news-btn" onClick={handleSubmit} style={{ marginTop: "20px" }} disabled={isSaveDisabled}>
        {t("addNews.form.buttons.submit")}
      </button>
    </div>
  );
};

export default AddNews;