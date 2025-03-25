'use client';

import { useLanguage } from "@/contexts/language-context";
import { translations } from "@/contexts/translations";

export function useTranslate() {
  const { language } = useLanguage();

  const t = (key: keyof typeof translations) => {
    return translations[key][language];
  };

  return { t, language };
} 