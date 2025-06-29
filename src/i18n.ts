import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// English (EN) imports
import enHome from './Local/EN/Home.json';
import enCollege from "./Local/EN/College.json";
import enContact from "./Local/EN/Contact.json";
import enPrograms from "./Local/EN/Programs.json";
import enNews from "./Local/EN/News.json";
import enNewsDetails from "./Local/EN/NewsDetails.json";
import enLogin from "./Local/EN/Login.json";

// Arabic (AR) imports
import arHome from './Local/AR/Home.json';
import arCollege from "./Local/AR/College.json";
import arContact from "./Local/AR/Contact.json";
import arPrograms from "./Local/AR/Programs.json";
import arNews from "./Local/AR/News.json";
import arNewsDetails from "./Local/AR/NewsDetails.json";
import arLogin from "./Local/AR/Login.json";

// Asian (AS) imports
import asHome from './Local/AS/Home.json';
import asCollege from "./Local/AS/College.json";
import asContact from "./Local/AS/Contact.json";
import asPrograms from "./Local/AS/Programs.json";
import asNews from "./Local/AS/News.json";
import asNewsDetails from "./Local/AS/NewsDetails.json";
import asLogin from "./Local/AS/Login.json";

// French (FR) imports
import frHome from './Local/FR/Home.json';
import frCollege from "./Local/FR/College.json";
import frContact from "./Local/FR/Contact.json";
import frPrograms from "./Local/FR/Programs.json";
import frNews from "./Local/FR/News.json";
import frNewsDetails from "./Local/FR/NewsDetails.json";
import frLogin from "./Local/FR/Login.json";

// German (DE) imports
import deHome from './Local/DE/Home.json';
import deCollege from "./Local/DE/College.json";
import deContact from "./Local/DE/Contact.json";
import dePrograms from "./Local/DE/Programs.json";
import deNews from "./Local/DE/News.json";
import deNewsDetails from "./Local/DE/NewsDetails.json";
import deLogin from "./Local/DE/Login.json";

// Italian (IT) imports
import itHome from './Local/IT/Home.json';
import itCollege from "./Local/IT/College.json";
import itContact from "./Local/IT/Contact.json";
import itPrograms from "./Local/IT/Programs.json";
import itNews from "./Local/IT/News.json";
import itNewsDetails from "./Local/IT/NewsDetails.json";
import itLogin from "./Local/IT/Login.json";

// Japanese (JA) imports
import jaHome from './Local/JA/Home.json';
import jaCollege from "./Local/JA/College.json";
import jaContact from "./Local/JA/Contact.json";
import jaPrograms from "./Local/JA/Programs.json";
import jaNews from "./Local/JA/News.json";
import jaNewsDetails from "./Local/JA/NewsDetails.json";
import jaLogin from "./Local/JA/Login.json";

// Russian (RU) imports
import ruHome from './Local/RU/Home.json';
import ruCollege from "./Local/RU/College.json";
import ruContact from "./Local/RU/Contact.json";
import ruPrograms from "./Local/RU/Programs.json";
import ruNews from "./Local/RU/News.json";
import ruNewsDetails from "./Local/RU/NewsDetails.json";
import ruLogin from "./Local/RU/Login.json";

// Persian/Farsi (FA) imports
import faHome from './Local/FA/Home.json';
import faCollege from "./Local/FA/College.json";
import faContact from "./Local/FA/Contact.json";
import faPrograms from "./Local/FA/Programs.json";
import faNews from "./Local/FA/News.json";
import faNewsDetails from "./Local/FA/NewsDetails.json";
import faLogin from "./Local/FA/Login.json";

// Turkish (TR) imports
import trHome from './Local/TR/Home.json';
import trCollege from "./Local/TR/College.json";
import trContact from "./Local/TR/Contact.json";
import trPrograms from "./Local/TR/Programs.json";
import trNews from "./Local/TR/News.json";
import trNewsDetails from "./Local/TR/NewsDetails.json";
import trLogin from "./Local/TR/Login.json";

// Chinese (ZH) imports
import zhHome from './Local/ZH/Home.json';
import zhCollege from "./Local/ZH/College.json";
import zhContact from "./Local/ZH/Contact.json";
import zhPrograms from "./Local/ZH/Programs.json";
import zhNews from "./Local/ZH/News.json";
import zhNewsDetails from "./Local/ZH/NewsDetails.json";
import zhLogin from "./Local/ZH/Login.json";

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: enHome,
        Contact: enContact,
        College: enCollege,
        Programs: enPrograms,
        News: enNews,
        NewsDetails: enNewsDetails,
        Login: enLogin
      },
      ar: {
        translation: arHome,
        Contact: arContact,
        College: arCollege,
        Programs: arPrograms,
        News: arNews,
        NewsDetails: arNewsDetails,
        Login: arLogin
      },
      as: {
        translation: asHome,
        Contact: asContact,
        College: asCollege,
        Programs: asPrograms,
        News: asNews,
        NewsDetails: asNewsDetails,
        Login: asLogin
      },
      fr: {
        translation: frHome,
        Contact: frContact,
        College: frCollege,
        Programs: frPrograms,
        News: frNews,
        NewsDetails: frNewsDetails,
        Login: frLogin
      },
      de: {
        translation: deHome,
        Contact: deContact,
        College: deCollege,
        Programs: dePrograms,
        News: deNews,
        NewsDetails: deNewsDetails,
        Login: deLogin
      },
      it: {
        translation: itHome,
        Contact: itContact,
        College: itCollege,
        Programs: itPrograms,
        News: itNews,
        NewsDetails: itNewsDetails,
        Login: itLogin
      },
      ja: {
        translation: jaHome,
        Contact: jaContact,
        College: jaCollege,
        Programs: jaPrograms,
        News: jaNews,
        NewsDetails: jaNewsDetails,
        Login: jaLogin
      },
      ru: {
        translation: ruHome,
        Contact: ruContact,
        College: ruCollege,
        Programs: ruPrograms,
        News: ruNews,
        NewsDetails: ruNewsDetails,
        Login: ruLogin
      },
      fa: {
        translation: faHome,
        Contact: faContact,
        College: faCollege,
        Programs: faPrograms,
        News: faNews,
        NewsDetails: faNewsDetails,
        Login: faLogin
      },
      tr: {
        translation: trHome,
        Contact: trContact,
        College: trCollege,
        Programs: trPrograms,
        News: trNews,
        NewsDetails: trNewsDetails,
        Login: trLogin
      },
      ch: {
        translation: zhHome,
        Contact: zhContact,
        College: zhCollege,
        Programs: zhPrograms,
        News: zhNews,
        NewsDetails: zhNewsDetails,
        Login: zhLogin
      }
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;