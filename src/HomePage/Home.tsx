import React, { useState, useEffect } from "react";
import Header from "./Header/Header";
import Hero from "./Hero/Hero";
import About from "./About/About";
import Carousel from "./Carousel/Carousel";
import Footer from "./Footer/Footer";
import api from "../Services/api" ;
import i18n from "../i18n";
import { useTranslation } from 'react-i18next';


function Home() {
  const savedLang = JSON.parse(localStorage.getItem("lang") || "{}");
  const [filteredNews, setFilteredNews] = useState([]);
  const [langId, setLangId] = useState(savedLang?.id || 2)
useEffect(() => {
  if (savedLang) {
    setLangId(savedLang.id);
  }

  api
    .get(`news?LanguageId=${langId}&PageIndex=1&PageSize=50`)
    .then((response) => {
      setFilteredNews(response.data.result);
    })
    .catch((error) => {
      console.error("Error fetching News:", error);
    });
}, [langId]);

  return (
    <div>
      <Header index={0}  setFilteredNews={setFilteredNews} />
      <Hero News={filteredNews}/>
      <About />
      <Carousel News={filteredNews}/>
      <Footer />
    </div>
  );
}

export default Home;