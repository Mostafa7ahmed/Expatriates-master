import React, { useState, useEffect, useRef } from "react";
import api from "../Services/api";
import "./AddNews.css";
import { useNavigate, useParams } from "react-router-dom";
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
            <span>Select language</span>
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
            <span>Select language</span>
          </div>
          {availableLanguages.length === 0 ? (
            <div className="language-option disabled">
              <span className="warning-icon">⚠️</span>
              <span>All languages already selected</span>
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
  id?: number;
  newsHead: string;
  newsAbbr: string;
  newsBody: string;
  newsSource: string;
  langId: number | "";
  imgAlt: string;
}

const EditNews: React.FC = () => {
  const { t } = useTranslation("News");
  const { id } = useParams<{ id: string }>();
  const [languages, setLanguages] = useState<Language[]>([]);
  const [loading, setLoading] = useState(true);
  const [newsId, setNewsId] = useState<number>(0);
  const [ownerId, setOwnerId] = useState<string>("");
  const [newsImgFile, setNewsImgFile] = useState<File | null>(null);
  const [newsImgPreview, setNewsImgPreview] = useState<string>("");
  const [currentNewsImg, setCurrentNewsImg] = useState<string>("");
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
    imgAlt: "",
  }]);

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch languages
  useEffect(() => {
    api.get("/languages").then(res => {
      if(res?.data?.success){
        setLanguages(res.data.result);
      }
    }).catch(err => console.error(err));
  }, []);

  // Fetch existing news data
  useEffect(() => {
    if (id) {
      fetchNewsData();
    }
  }, [id]);

  const fetchNewsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await api.get(`news/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'accept': 'text/plain'
        }
      });

      if (response.data.success) {
        const newsData = response.data.result;
        setNewsId(newsData.id);
        setOwnerId(newsData.ownerId);
        setPublished(newsData.published);
        setIsFeatured(newsData.isFeatured);
        setCurrentNewsImg(newsData.newsImg);
        setNewsImgPreview(`https://stage.menofia.edu.eg/images/${newsData.newsImg}`);
        
        // Map translations to our interface
        const mappedTranslations = newsData.translations.map((trans: any) => ({
          id: trans.id,
          newsHead: trans.head,
          newsAbbr: trans.abbr,
          newsBody: trans.body,
          newsSource: trans.source,
          langId: trans.languageId,
          imgAlt: trans.imgAlt,
        }));
        
        setTranslations(mappedTranslations.length > 0 ? mappedTranslations : [{
          newsHead: "",
          newsAbbr: "",
          newsBody: "",
          newsSource: "",
          langId: "",
          imgAlt: "",
        }]);
      }
    } catch (error) {
      console.error("Error loading news:", error);
      toast.error(t("editNews.messages.loadError"), {
        position: "top-right",
        autoClose: 4000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTranslationChange = (index: number, field: keyof Translation, value: any) => {
    setTranslations(prev => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const addTranslation = () => {
    // Check if all languages are already selected
    const selectedLanguageIds = translations.map(t => t.langId).filter(id => id !== "");
    const availableLanguagesCount = languages.filter(lang => !selectedLanguageIds.includes(lang.id)).length;
    
    if (availableLanguagesCount === 0) {
      toast.warning(t("addNews.form.translations.warningMessages.allLanguagesUsed"), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    
    setTranslations(prev => [...prev, {
      newsHead: "",
      newsAbbr: "",
      newsBody: "",
      newsSource: "",
      langId: "",
      imgAlt: "",
    }]);
  };

  const removeTranslation = (index: number) => {
    if (translations.length === 1) {
      toast.warning(t("addNews.form.translations.warningMessages.minimumTranslations"), {
        position: "top-right",
        autoClose: 3000,
      });
      return;
    }
    setTranslations(prev => prev.filter((_, i) => i !== index));
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
      // Reset to current image if file is removed
      setNewsImgPreview(currentNewsImg ? `https://stage.menofia.edu.eg/images/${currentNewsImg}` : "");
      setNewsImgFileName("");
    }
  };

  const removeCurrentImage = () => {
    setNewsImgFile(null);
    setNewsImgPreview("");
    setCurrentNewsImg("");
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

      let newsImg = currentNewsImg;
      
      // Handle image changes
      if (newsImgFile && newsImgFileName) {
        // New image uploaded - use fileName
        newsImg = newsImgFileName;
      } else if (!currentNewsImg) {
        // Image was removed
        newsImg = "";
      }
      // Otherwise keep current image (newsImg = currentNewsImg)

      const payload = {
        id: newsId,
        ownerId,
        newsImg,
        published,
        isFeatured,
        translations: translations.filter(t => t.langId !== ""),
      };

      const token = localStorage.getItem("token");
      console.log('Update payload:', payload);
      
      // Note: The URL in your curl seems to have duplicate path, using clean URL
      const response = await api.post(`news/update`, payload, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'accept': 'text/plain'
        },
      });
      
      console.log("News updated successfully:", response.data);
      
      toast.success(t("editNews.messages.success"), {
        position: "top-right",
        autoClose: 2000,
      });
      
      navigate("/news");
    } catch(err){
      console.error("Error updating news:", err);
      toast.error(t("editNews.messages.error"), {
        position: "top-right",
        autoClose: 4000,
      });
    }
  };

  if (loading) {
    return (
      <div className="add-news-container">
        <h2>{t("editNews.loading")}</h2>
      </div>
    );
  }

  return (
    <div className="add-news-container">
      <h2>{t("editNews.title")}</h2>

      {/* Main Info */}
      <section className="main-info">
        <h3>{t("addNews.sections.mainInfo")}</h3>
        <div className="field">
          <label>{t("addNews.form.imageUpload.title")}:</label>
          
          {/* Current Image Preview */}
          {newsImgPreview && (
            <div className="image-preview-container" style={{ marginBottom: "15px" }}>
              <div className="image-preview-wrapper" style={{ position: "relative", display: "inline-block" }}>
                <img 
                  src={newsImgPreview} 
                  alt="Current news image" 
                  className="preview-img" 
                  style={{ objectFit: "cover", borderRadius: "8px", border: "1px solid #ddd" }}
                />
                <div style={{ marginTop: "8px", fontSize: "12px", color: "#666" }}>
                  {newsImgFile ? t("addNews.form.imageUpload.newImageSelected") : t("addNews.form.imageUpload.currentImage")}
                </div>
                <button
                  type="button"
                  onClick={removeCurrentImage}
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
                    className="floating-label-textarea"
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
                    className="floating-label-textarea"
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
                    className="floating-label-textarea"
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
                    className="floating-label-textarea"
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
            languages.filter(lang => !translations.map(t => t.langId).filter(id => id !== "").includes(lang.id)).length === 0 
              ? 'disabled' 
              : ''
          }`} 
          onClick={addTranslation}
          disabled={languages.filter(lang => !translations.map(t => t.langId).filter(id => id !== "").includes(lang.id)).length === 0}
        >
          {languages.filter(lang => !translations.map(t => t.langId).filter(id => id !== "").includes(lang.id)).length === 0 
            ? t("addNews.form.translations.allLanguagesAdded")
            : t("addNews.form.translations.addTranslation")
          }
        </button>
      </section>

      <button className="save-news-btn" onClick={handleSubmit} style={{ marginTop: "20px" }}>
        {t("editNews.form.buttons.submit")}
      </button>
    </div>
  );
};

export default EditNews; 