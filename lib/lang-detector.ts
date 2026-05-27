export type SupportedLang = "id" | "en" | "ja" | "es" | "fr" | "de" | "pt" | "ru" | "ar" | "zh" | "ko" | "hi" | "nl" | "it" | "tr" | "pl" | "vi" | "th" | "ms" | "tl";

interface LangProfile {
  code: SupportedLang;
  name: string;
  flag: string;
  patterns: RegExp[];
  commonWords: string[];
}

const PROFILES: LangProfile[] = [
  { code: "id", name: "Indonesia", flag: "🇮🇩", patterns: [], commonWords: ["yang","dan","dengan","untuk","dari","ini","itu","saya","kamu","bisnis","aplikasi","platform","bantu","membantu"] },
  { code: "en", name: "English", flag: "🇬🇧", patterns: [], commonWords: ["the","and","with","for","from","this","that","help","business","app","platform","solution","startup","founder"] },
  { code: "ja", name: "日本語", flag: "🇯🇵", patterns: [/[぀-ゟ゠-ヿ一-龯]/], commonWords: ["ビジネス","アプリ","プラットフォーム","スタートアップ","創業者","ソリューション","ヘルプ"] },
  { code: "es", name: "Español", flag: "🇪🇸", patterns: [/[À-ÿ]/], commonWords: ["el","la","y","con","para","negocio","aplicación","plataforma","solución","emprendedor"] },
  { code: "fr", name: "Français", flag: "🇫🇷", patterns: [/[À-ÿ]/], commonWords: ["le","la","et","avec","pour","entreprise","application","plateforme","solution","fondateur"] },
  { code: "de", name: "Deutsch", flag: "🇩🇪", patterns: [/[À-ÿ]/], commonWords: ["der","die","und","mit","für","geschäft","anwendung","plattform","lösung","gründer"] },
  { code: "pt", name: "Português", flag: "🇵🇹", patterns: [/[À-ÿ]/], commonWords: ["o","a","e","com","para","negócio","aplicativo","plataforma","solução","fundador"] },
  { code: "ru", name: "Русский", flag: "🇷🇺", patterns: [/[Ѐ-ӿ]/], commonWords: ["бизнес","приложение","платформа","решение","основатель","стартап","помощь"] },
  { code: "ar", name: "العربية", flag: "🇸🇦", patterns: [/[؀-ۿ]/], commonWords: ["عمل","تطبيق","منصة","حل","مؤسس","بدء","مساعدة"] },
  { code: "zh", name: "中文", flag: "🇨🇳", patterns: [/[一-鿿]/], commonWords: ["商业","应用","平台","解决方案","创始人","创业","帮助"] },
  { code: "ko", name: "한국어", flag: "🇰🇷", patterns: [/[가-힯]/], commonWords: ["비즈니스","앱","플랫폼","솔루션","창업자","스타트업","도움"] },
  { code: "hi", name: "हिन्दी", flag: "🇮🇳", patterns: [/[ऀ-ॿ]/], commonWords: ["व्यवसाय","ऐप","प्लेटफॉर्म","समाधान","संस्थापक","स्टार्टअप","मदद"] },
  { code: "nl", name: "Nederlands", flag: "🇳🇱", patterns: [], commonWords: ["het","de","en","met","voor","bedrijf","applicatie","platform","oplossing","oprichter"] },
  { code: "it", name: "Italiano", flag: "🇮🇹", patterns: [/[À-ÿ]/], commonWords: ["il","la","e","con","per","business","applicazione","piattaforma","soluzione","fondatore"] },
  { code: "tr", name: "Türkçe", flag: "🇹🇷", patterns: [/[À-ÿ]/], commonWords: ["ve","ile","için","iş","uygulama","platform","çözüm","kurucu","yardım"] },
  { code: "pl", name: "Polski", flag: "🇵🇱", patterns: [/[À-ÿ]/], commonWords: ["i","z","dla","biznes","aplikacja","platforma","rozwiązanie","założyciel"] },
  { code: "vi", name: "Tiếng Việt", flag: "🇻🇳", patterns: [/[À-ỹ]/], commonWords: ["và","với","cho","kinh doanh","ứng dụng","nền tảng","giải pháp","nhà sáng lập"] },
  { code: "th", name: "ไทย", flag: "🇹🇭", patterns: [/[฀-๿]/], commonWords: ["ธุรกิจ","แอป","แพลตฟอร์ม","โซลูชัน","ผู้ก่อตั้ง","สตาร์ทอัพ","ช่วยเหลือ"] },
  { code: "ms", name: "Melayu", flag: "🇲🇾", patterns: [], commonWords: ["dan","dengan","untuk","perniagaan","aplikasi","platform","penyelesaian","pengasas"] },
  { code: "tl", name: "Filipino", flag: "🇵🇭", patterns: [], commonWords: ["at","sa","para","negosyo","app","platform","solusyon","tagapagtatag"] },
];

export function detectLanguage(text: string): SupportedLang {
  const lower = text.toLowerCase();
  let bestMatch: SupportedLang = "en";
  let maxScore = 0;
  for (const profile of PROFILES) {
    let score = 0;
    for (const pattern of profile.patterns) {
      if (pattern.test(text)) score += 50;
    }
    for (const word of profile.commonWords) {
      if (lower.includes(word.toLowerCase())) score += 10;
    }
    if (profile.code === "id") {
      const idMarkers = ["lah","kah","pun","nya","ku","mu"];
      for (const m of idMarkers) { if (lower.includes(m)) score += 5; }
    }
    if (score > maxScore) { maxScore = score; bestMatch = profile.code; }
  }
  return bestMatch;
}

export function getLangName(code: SupportedLang): string {
  return PROFILES.find(p => p.code === code)?.name || "English";
}

export function getLangFlag(code: SupportedLang): string {
  return PROFILES.find(p => p.code === code)?.flag || "🇬🇧";
}