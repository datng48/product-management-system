import React, { useState, useEffect } from 'react';
import { getCurrentLanguage, setLanguage, onLanguageChange } from '../utils/i18n';

const LanguageSwitcher = () => {
  const [language, setLang] = useState(getCurrentLanguage());
  
  useEffect(() => {
    const unsubscribe = onLanguageChange((newLang) => {
      setLang(newLang);
    });
    return unsubscribe;
  }, []);
  
  const handleLanguageChange = (lang) => {
    setLanguage(lang);
  };
  
  return (
    <div className="flex items-center ml-auto mr-4">
      <div className="flex overflow-hidden rounded-lg border border-gray-200">
        <button 
          className={`flex items-center justify-center px-3 py-1.5 text-sm transition-colors ${
            language === 'en' 
              ? 'bg-blue-50 font-medium' 
              : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => handleLanguageChange('en')}
        >
          <span className="text-base mr-1.5">🇺🇸</span> 
          <span className="sm:inline">EN</span>
        </button>
        
        <button 
          className={`flex items-center justify-center px-3 py-1.5 text-sm transition-colors ${
            language === 'vi' 
              ? 'bg-blue-50 font-medium' 
              : 'bg-white hover:bg-gray-50'
          }`}
          onClick={() => handleLanguageChange('vi')}
        >
          <span className="text-base mr-1.5">🇻🇳</span> 
          <span className="sm:inline">VI</span>
        </button>
      </div>
    </div>
  );
};

export default LanguageSwitcher; 