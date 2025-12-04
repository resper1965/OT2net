import ptBR from "./pt-BR.json";

type TranslationKey = string;
type Translations = typeof ptBR;

const translations: Record<string, Translations> = {
  "pt-BR": ptBR,
  pt: ptBR, // Fallback para "pt"
};

/**
 * Obtém uma tradução usando uma chave aninhada (ex: "nfaturasons.hero.title")
 */
export function t(key: TranslationKey, locale: string = "pt-BR"): string {
  const localeTranslations = translations[locale] || translations["pt-BR"];
  
  const keys = key.split(".");
  let value: any = localeTranslations;
  
  for (const k of keys) {
    if (value && typeof value === "object" && k in value) {
      value = value[k as keyof typeof value];
    } else {
      console.warn(`Translation key not found: ${key} (locale: ${locale})`);
      return key; // Retorna a chave se não encontrar a tradução
    }
  }
  
  return typeof value === "string" ? value : key;
}

/**
 * Hook para usar traduções em componentes React
 */
export function useTranslation(locale: string = "pt-BR") {
  return {
    t: (key: TranslationKey) => t(key, locale),
  };
}

export default translations;



