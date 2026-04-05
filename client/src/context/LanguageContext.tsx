import { createContext, useContext, useState, type ReactNode } from "react";
import { type Language, translations } from "../i18n/translations";

interface Ctx { language: Language; setLanguage: (l: Language) => void; t: typeof translations.en }
const LangCtx = createContext<Ctx | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLang] = useState<Language>(() =>
    (localStorage.getItem("language") as Language) ?? "en"
  );
  function setLanguage(l: Language) { setLang(l); localStorage.setItem("language", l); }
  return <LangCtx.Provider value={{ language, setLanguage, t: translations[language] }}>{children}</LangCtx.Provider>;
}

export function useLanguage(): Ctx {
  const ctx = useContext(LangCtx);
  if (!ctx) throw new Error("useLanguage must be inside LanguageProvider");
  return ctx;
}
