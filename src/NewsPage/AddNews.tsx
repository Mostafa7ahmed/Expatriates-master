import React, { useState, useEffect, useRef } from "react";
import api from "../Services/api";
import "./AddNews.css";
import { useNavigate } from "react-router-dom";

interface Language {
  id: number;
  code: string;
  name: string;
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
  const [languages, setLanguages] = useState<Language[]>([]);

  const [newsImgFile, setNewsImgFile] = useState<File | null>(null);
  const [newsImgPreview, setNewsImgPreview] = useState<string>("");
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
      alert("At least one translation is required");
      return;
    }
    setTranslations(prev => prev.filter((_, i) => i !== index));
  };

  const fileToBase64 = (file: File) => new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });

  const handleFileChange = (file: File | null) => {
    setNewsImgFile(file);
    if (file) {
      const url = URL.createObjectURL(file);
      setNewsImgPreview(url);
    } else {
      setNewsImgPreview("");
    }
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
      let newsImg = "";
      if(newsImgFile){
        newsImg = await fileToBase64(newsImgFile);
      }

      const ownerId = localStorage.getItem("userId") || "00000000-0000-0000-0000-000000000000";
      const payload = {
        ownerId,
        newsImg,
        published,
        isFeatured,
        translations: translations.filter(t => t.langId !== ""),
      };

      const token = localStorage.getItem("token");
      await api.post("/news", payload, {
        headers: {
          Authorization: token ? `Bearer ${token}` : undefined,
        },
      });
      alert("News created successfully");
      navigate("/news");
    } catch(err){
      console.error(err);
      alert("Failed to create news");
    }
  };

  return (
    <div className="add-news-container">
      <h2>Add New News</h2>

      {/* Main Info */}
      <section className="main-info">
        <h3>Main Information</h3>
        <div className="field">
          <label>News Image:</label>
          <div
            className="file-drop"
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          >
            {newsImgPreview ? (
              <img src={newsImgPreview} alt="preview" className="preview-img" />
            ) : (
              <span>Click or drop an image here</span>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={(e) => handleFileChange(e.target.files ? e.target.files[0] : null)}
            />
          </div>
        </div>
        <div className="field">
          <label>
            <input type="checkbox" checked={isFeatured} onChange={e => setIsFeatured(e.target.checked)} /> Feature
          </label>
          <label style={{marginInlineStart: '20px'}}>
            <input type="checkbox" checked={published} onChange={e => setPublished(e.target.checked)} /> Publish
          </label>
        </div>
      </section>

      {/* Translations */}
      <section className="translations">
        <h3>News Translations</h3>
        {translations.map((t, idx) => (
          <details key={idx} className="translation-card" open>
            <summary>
              <span>Translation {idx + 1}</span>
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
                <label>Language:</label>
                <select
                  value={t.langId}
                  onChange={(e) =>
                    handleTranslationChange(
                      idx,
                      "langId",
                      e.target.value === "" ? "" : Number(e.target.value)
                    )
                  }
                >
                  <option value="">Select language</option>
                  {languages.map((l) => (
                    <option key={l.id} value={l.id}>
                      {l.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>News Header:</label>
                <input
                  type="text"
                  value={t.newsHead}
                  onChange={(e) =>
                    handleTranslationChange(idx, "newsHead", e.target.value)
                  }
                />
              </div>
              <div className="field">
                <label>News Abbr:</label>
                <input
                  type="text"
                  value={t.newsAbbr}
                  onChange={(e) =>
                    handleTranslationChange(idx, "newsAbbr", e.target.value)
                  }
                />
              </div>
              <div className="field">
                <label>News Source:</label>
                <input
                  type="text"
                  value={t.newsSource}
                  onChange={(e) =>
                    handleTranslationChange(idx, "newsSource", e.target.value)
                  }
                />
              </div>
              <div className="field">
                <label>News Body:</label>
                <textarea
                  rows={6}
                  value={t.newsBody}
                  onChange={(e) =>
                    handleTranslationChange(idx, "newsBody", e.target.value)
                  }
                />
              </div>
              <div className="field">
                <label>Image Alt Text:</label>
                <input
                  type="text"
                  value={t.imgAlt}
                  onChange={(e) =>
                    handleTranslationChange(idx, "imgAlt", e.target.value)
                  }
                />
              </div>
            </div>
          </details>
        ))}
        <button className="add-translation-btn" onClick={addTranslation}>
          + Add Translation
        </button>
      </section>

      <button className="save-news-btn" onClick={handleSubmit} style={{ marginTop: "20px" }}>
        Save News
      </button>
    </div>
  );
};

export default AddNews; 