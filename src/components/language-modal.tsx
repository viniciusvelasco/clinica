'use client';

import React, { useState } from 'react';
import { useLanguage } from '@/contexts/language-context';
import { useTranslate } from '@/hooks/use-translate';
import { Button } from '@/components/ui/button';
import 'flag-icons/css/flag-icons.min.css';

type Language = 'pt-BR' | 'en-US' | 'es-ES';

interface LanguageModalProps {
  isOpen: boolean;
  onClose: (language: Language) => void;
}

export function LanguageModal({ isOpen, onClose }: LanguageModalProps) {
  const { language: currentLanguage, setLanguage } = useLanguage();
  const { t } = useTranslate();
  const [selectedLanguage, setSelectedLanguage] = useState<Language>(currentLanguage);

  if (!isOpen) return null;

  const handleConfirm = () => {
    setLanguage(selectedLanguage);
    onClose(selectedLanguage);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-4 p-6 animate-in fade-in zoom-in duration-300">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">{t('language_modal.title')}</h2>
        <p className="text-gray-600 mb-6">{t('language_modal.subtitle')}</p>
        
        <div className="grid grid-cols-1 gap-4 mb-6">
          <button
            className={`flex items-center p-4 border rounded-lg ${
              selectedLanguage === 'pt-BR' ? 'bg-blue-50 border-primary' : 'border-gray-200'
            }`}
            onClick={() => setSelectedLanguage('pt-BR')}
          >
            <span className="fi fi-br w-8 h-6 mr-4" />
            <div className="flex flex-col">
              <span className="font-medium">Português (Brasil)</span>
              <span className="text-sm text-gray-500">Português Brasileiro</span>
            </div>
          </button>
          
          <button
            className={`flex items-center p-4 border rounded-lg ${
              selectedLanguage === 'en-US' ? 'bg-blue-50 border-primary' : 'border-gray-200'
            }`}
            onClick={() => setSelectedLanguage('en-US')}
          >
            <span className="fi fi-us w-8 h-6 mr-4" />
            <div className="flex flex-col">
              <span className="font-medium">English (US)</span>
              <span className="text-sm text-gray-500">American English</span>
            </div>
          </button>
          
          <button
            className={`flex items-center p-4 border rounded-lg ${
              selectedLanguage === 'es-ES' ? 'bg-blue-50 border-primary' : 'border-gray-200'
            }`}
            onClick={() => setSelectedLanguage('es-ES')}
          >
            <span className="fi fi-es w-8 h-6 mr-4" />
            <div className="flex flex-col">
              <span className="font-medium">Español (España)</span>
              <span className="text-sm text-gray-500">Español de España</span>
            </div>
          </button>
        </div>
        
        <Button
          onClick={handleConfirm}
          className="w-full bg-primary hover:bg-primary/90 text-white"
        >
          {t('language_modal.confirm')}
        </Button>
      </div>
    </div>
  );
} 