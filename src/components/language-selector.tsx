'use client';

import React from 'react';
import { useLanguage } from '@/contexts/language-context';
import 'flag-icons/css/flag-icons.min.css';

export function LanguageSelector() {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex justify-center gap-3 mt-2">
      <button
        className={`flex items-center justify-center w-8 h-6 rounded-sm overflow-hidden transition-all duration-200 ${
          language === 'pt-BR' ? 'ring-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'
        }`}
        onClick={() => setLanguage('pt-BR')}
        aria-label="Português"
      >
        <span className="fi fi-br w-8 h-6" />
      </button>
      
      <button
        className={`flex items-center justify-center w-8 h-6 rounded-sm overflow-hidden transition-all duration-200 ${
          language === 'en-US' ? 'ring-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'
        }`}
        onClick={() => setLanguage('en-US')}
        aria-label="English"
      >
        <span className="fi fi-us w-8 h-6" />
      </button>
      
      <button
        className={`flex items-center justify-center w-8 h-6 rounded-sm overflow-hidden transition-all duration-200 ${
          language === 'es-ES' ? 'ring-2 ring-primary scale-110' : 'opacity-70 hover:opacity-100'
        }`}
        onClick={() => setLanguage('es-ES')}
        aria-label="Español"
      >
        <span className="fi fi-es w-8 h-6" />
      </button>
    </div>
  );
} 