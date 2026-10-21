import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';

export const LanguageSelector = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex items-center gap-2 bg-slate-900 border border-slate-800 rounded-lg px-2.5 py-1.5 shadow-sm text-sm">
      <Globe className="w-4 h-4 text-slate-400" />
      <button
        onClick={() => toggleLanguage('es')}
        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
          i18n.language.startsWith('es')
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        ES
      </button>
      <span className="text-slate-600">|</span>
      <button
        onClick={() => toggleLanguage('en')}
        className={`px-2 py-0.5 rounded text-xs font-semibold transition-colors ${
          i18n.language.startsWith('en')
            ? 'bg-blue-600 text-white'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        EN
      </button>
    </div>
  );
};