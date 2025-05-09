import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import enHome from './Local/EN/Home.json';
import enCollege from "./Local/EN/College.json"
import enContact from "./Local/EN/Contact.json"
import enPrograms from "./Local/EN/Programs.json"

import arHome from './Local/AR/Home.json';
import arCollege from "./Local/AR/College.json"
import arContact from "./Local/AR/Contact.json"
import arPrograms from "./Local/AR/Programs.json"

import asHome from './Local/AS/Home.json';
import asCollege from "./Local/AS/College.json"
import asContact from "./Local/AS/Contact.json"
import asPrograms from "./Local/AS/Programs.json"


i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      ar: {
        translation: arHome,
        Contact: arContact,
        College: arCollege,
        Programs: arPrograms,
      },
      en: {
        translation: enHome,
        Contact: enContact,
        College: enCollege,
        Programs: enPrograms,
      },
      as: {
        translation: asHome,
        Contact: asContact,
        College: asCollege,
        Programs: asPrograms,
      },
    },
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false
    }
  });
 
export default i18n;