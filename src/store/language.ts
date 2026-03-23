import { create } from 'zustand';

interface LanguageState {
  lang: 'en' | 'ar';
  toggleLang: () => void;
}

export const useLanguageStore = create<LanguageState>((set) => ({
  lang: 'en',
  toggleLang: () => set((state) => {
    const newLang = state.lang === 'en' ? 'ar' : 'en';
    document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
    document.documentElement.lang = newLang;
    return { lang: newLang };
  }),
}));
