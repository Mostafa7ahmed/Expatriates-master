import React, { useState, useEffect } from "react";
import Hero from "./Hero/Hero";
import About from "./About/About";
import Carousel from "./Carousel/Carousel";
import api from "../Services/api" ;
import { useTranslation } from 'react-i18next';


function Home() {
  const savedLang = JSON.parse(localStorage.getItem("lang") || '{"code":"en","id":"2"}');
  const [filteredNews, setFilteredNews] = useState([]);
  const [langId, setLangId] = useState(savedLang?.id || "2")
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
      <Hero News={filteredNews}/>
      <About />
      <Carousel News={filteredNews}/>
    </div>
  );
}

export default Home;