export type SupportedLang = "id" | "en" | "ja" | "es" | "fr" | "de" | "pt" | "ru" | "ar" | "zh" | "ko" | "hi" | "nl" | "it" | "tr" | "pl" | "vi" | "th" | "ms" | "tl";

export function detectLanguage(text: string): SupportedLang {
  if (!text || text.trim().length < 3) return "en";
  const t = text.toLowerCase().trim();

  // Script-based detection first (most reliable)
  if (/[\u3040-\u309F\u30A0-\u30FF]/.test(text)) return "ja";
  if (/[\u4E00-\u9FFF]/.test(text)) return "zh";
  if (/[\uAC00-\uD7AF]/.test(text)) return "ko";
  if (/[\u0600-\u06FF]/.test(text)) return "ar";
  if (/[\u0900-\u097F]/.test(text)) return "hi";
  if (/[\u0400-\u04FF]/.test(text)) return "ru";
  if (/[\u0E00-\u0E7F]/.test(text)) return "th";

  const scores: Record<string, number> = {};

  const profiles: Array<{ code: SupportedLang; words: string[]; boost?: number }> = [
    { code: "en", boost: 2, words: ["the","and","with","for","from","this","that","help","business","app","platform","solution","startup","founder","want","build","create","make","need","idea","product","user","market","problem","solve","i","my","we","is","are","have","can","will"] },
    { code: "id", boost: 1.5, words: ["yang","dan","dengan","untuk","dari","ini","itu","saya","aku","kamu","bisnis","aplikasi","platform","bantu","membantu","membuat","ingin","mau","buat","startup","pendiri","masalah","solusi","pengguna","akan","adalah","ada"] },
    { code: "ms", words: ["dan","dengan","untuk","perniagaan","aplikasi","platform","penyelesaian","pengasas","kami","mereka","adalah","akan","tak","tak"] },
    { code: "fr", words: ["je","tu","nous","vous","avec","pour","entreprise","application","plateforme","fondateur","créer","vouloir","besoin","problème","une","mon","notre"] },
    { code: "es", words: ["yo","el","los","con","para","negocio","aplicación","plataforma","emprendedor","crear","quiero","necesito","problema","solución","una","mi","nuestro"] },
    { code: "de", words: ["ich","der","das","und","mit","für","geschäft","anwendung","plattform","gründer","erstellen","möchte","brauche","problem","lösung","eine","mein","unser"] },
    { code: "pt", words: ["eu","você","nós","com","para","negócio","aplicativo","plataforma","fundador","criar","quero","preciso","problema","solução","uma","meu","nosso"] },
    { code: "it", words: ["io","noi","con","per","business","applicazione","piattaforma","fondatore","creare","voglio","bisogno","problema","soluzione","una","mio","nostro"] },
    { code: "nl", words: ["ik","wij","het","met","voor","bedrijf","applicatie","platform","oprichter","maken","wil","nodig","probleem","oplossing","een","mijn","ons"] },
    { code: "tr", words: ["ben","biz","ve","ile","için","iş","uygulama","platform","kurucu","oluşturmak","istiyorum","ihtiyaç","sorun","çözüm","bir","benim","bizim"] },
    { code: "pl", words: ["ja","my","i","w","z","dla","biznes","aplikacja","platforma","założyciel","tworzyć","chcę","potrzebuję","problem","rozwiązanie","jeden","mój","nasz"] },
    { code: "vi", words: ["tôi","chúng","và","với","cho","kinh doanh","ứng dụng","nền tảng","nhà sáng lập","tạo","muốn","cần","vấn đề","giải pháp"] },
    { code: "tl", words: ["ako","kami","at","sa","para","negosyo","app","platform","tagapagtatag","gumawa","gusto","kailangan","problema","solusyon"] },
  ];

  for (const p of profiles) {
    let score = 0;
    for (const word of p.words) {
      const regex = new RegExp(`\\b${word}\\b`, 'i');
      if (regex.test(t)) score += (p.boost || 1);
    }
    scores[p.code] = score;
  }

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] === 0) return "en";
  if (best[1] <= scores["en"] && best[0] !== "en") return "en";

  return best[0] as SupportedLang;
}

export function getLangName(code: SupportedLang): string {
  const names: Record<SupportedLang, string> = {
    en:"English", id:"Indonesia", ja:"日本語", es:"Español", fr:"Français",
    de:"Deutsch", pt:"Português", ru:"Русский", ar:"العربية", zh:"中文",
    ko:"한국어", hi:"हिन्दी", nl:"Nederlands", it:"Italiano", tr:"Türkçe",
    pl:"Polski", vi:"Tiếng Việt", th:"ไทย", ms:"Melayu", tl:"Filipino"
  };
  return names[code] || "English";
}

export function getLangFlag(code: SupportedLang): string {
  const flags: Record<SupportedLang, string> = {
    en:"🇬🇧", id:"🇮🇩", ja:"🇯🇵", es:"🇪🇸", fr:"🇫🇷",
    de:"🇩🇪", pt:"🇧🇷", ru:"🇷🇺", ar:"🇸🇦", zh:"🇨🇳",
    ko:"🇰🇷", hi:"🇮🇳", nl:"🇳🇱", it:"🇮🇹", tr:"🇹🇷",
    pl:"🇵🇱", vi:"🇻🇳", th:"🇹🇭", ms:"🇲🇾", tl:"🇵🇭"
  };
  return flags[code] || "🇬🇧";
}
