import React from 'react';
import en from '../translations/en.json';
import vi from '../translations/vi.json';

const languages = {
  en,
  vi
};

let currentLanguage = localStorage.getItem('language') || 'en';
let listeners = [];
const getCurrentLanguage = () => {
  return currentLanguage;
};

const setLanguage = (lang) => {
  if (lang !== currentLanguage) {
    currentLanguage = lang;
    localStorage.setItem('language', lang);
    document.documentElement.lang = lang;
    
    listeners.forEach(listener => listener(currentLanguage));
  }
};

const onLanguageChange = (callback) => {
  listeners.push(callback);
  return () => {
    listeners = listeners.filter(l => l !== callback);
  };
};

const translate = (key) => {
  const translations = languages[currentLanguage];
  
  const keys = key.split('.');
  
  let result = translations;
  for (const k of keys) {
    if (result && result[k]) {
      result = result[k];
    } else {
      return key;
    }
  }
  
  return result;
};

const useTranslation = () => {
  const [, setUpdate] = React.useState(0);
  
  React.useEffect(() => {
    const unsubscribe = onLanguageChange(() => {
      setUpdate(prev => prev + 1);
    });
    
    return unsubscribe;
  }, []);
  
  return { t: translate, language: currentLanguage, setLanguage };
};

const t = translate;

export { getCurrentLanguage, setLanguage, translate, t, onLanguageChange, useTranslation }; 