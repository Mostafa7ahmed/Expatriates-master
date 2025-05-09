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
  const savedLang = JSON.parse(localStorage.getItem("lang"));
  const [filteredNews, setFilteredNews] = useState([]);
  const [langId, setLangId] = useState(savedLang?.id || 2)

  useEffect(() => {
    if (savedLang) {
      setLangId(savedLang.id)
    }

    api
      .get(`/News?id=${langId}`)
      .then((response) => {
        setFilteredNews(response.data);
      })
      .catch((error) => {
        console.error("Error fetching News:", error);
      });
  }, []);

  return (
    <div>
      <Header index={0} setFilteredNews={setFilteredNews}/>
      <Hero News={filteredNews}/>
      <About />
      <Carousel News={filteredNews}/>
      <Footer />
    </div>
  );
}

export default Home;