import { SupportedLang, detectLanguage } from "./lang-detector";

export interface IdeaInput {
  description: string;
}

export interface GenerateResults {
  detectedLang: SupportedLang;
  validation: {
    score: number;
    marketAnalysis: string;
    strengths: string[];
    risks: string[];
    recommendation: string;
  };
  plan: {
    phases: Array<{ name: string; duration: string; focus: string; tasks: string[] }>;
    financialProjection: Array<{ item: string; value: string; note?: string }>;
    kpis: Array<{ metric: string; target: string }>;
  };
  pitch: {
    duration: string;
    hook: string;
    problem: string;
    solution: string;
    market: string;
    businessModel: string;
    traction: string;
    team: string;
    close: string;
    fullScript: string;
  };
  landing: {
    headline: string;
    subheadline: string;
    primaryCta: string;
    secondaryCta: string;
    features: Array<{ title: string; description: string }>;
    socialProof: Array<{ quote: string; author: string; role: string }>;
    faq: Array<{ question: string; answer: string }>;
  };
}

const INDUSTRIES: Record<string, string[]> = {
  saas: ["saas","software","platform","app","web app","subscription","cloud","api","automation","サービス","ソフトウェア","プラットフォーム","aplikasi","perangkat lunak"],
  ecommerce: ["ecommerce","shop","store","marketplace","sell","product","retail","dropship","buy","オンラインショップ","販売","toko","jual"],
  fintech: ["fintech","finance","payment","wallet","crypto","invest","lending","budget","money","金融","支払い","keuangan","pembayaran"],
  health: ["health","fitness","wellness","medical","healthcare","therapy","mental","gym","diet","健康","フィットネス","kesehatan","kebugaran"],
  education: ["education","course","learning","student","tutorial","academy","teach","school","train","教育","学習","pelatihan","kursus"],
  content: ["content","blog","newsletter","youtube","podcast","creator","media","influencer","video","コンテンツ","動画","konten"],
  service: ["service","agency","consulting","freelance","coaching","mentor","b2b","client","サービス","コンサル","jasa","konsultan"],
  social: ["social","community","network","dating","connect","friend","forum","chat","ソーシャル","コミュニティ","sosial","komunitas"],
  food: ["food","restaurant","catering","recipe","meal","delivery","cook","eat","食べ物","レストラン","makanan","restoran"],
};

const TEMPLATES: Record<string, Record<string, any>> = {
  id: {
    saas: {
      strengths: ["Model recurring revenue yang scalable","Margin tinggi (80%+)","Akses global sejak hari pertama","Mudah iterate berdasarkan data","Low distribution cost"],
      risks: ["CAC tinggi di pasar competitive","Churn rate critical","Butuh maintenance konsisten","Kompetitor well-funded bisa replicate"],
      plan: {
        phases: [
          { name: "Validasi & MVP", duration: "Hari 1-30", focus: "Validasi masalah dan bangun MVP core", tasks: ["Interview 20 potential users","Bangun landing page waitlist","Develop core feature (1-2 fitur)","Setup analytics dan feedback loop"] },
          { name: "Early Adoption", duration: "Hari 31-60", focus: "Dapatkan 100 early users", tasks: ["Launch di Product Hunt","Onboard beta users manual","Fix critical bugs","Implement feedback dari power users"] },
          { name: "Growth & Monetize", duration: "Hari 61-90", focus: "Launch paid plan", tasks: ["Setup Stripe billing","Launch freemium → paid","Content marketing / SEO","Partnership dengan platform lain"] }
        ],
        financials: [
          { item: "Development Cost", value: "Rp 0 - 50 juta", note: "Bootstrapped" },
          { item: "Monthly Burn", value: "Rp 5 - 15 juta", note: "Server, tools, marketing" },
          { item: "Target MRR (B3)", value: "Rp 10 - 30 juta", note: "50-100 paid users" },
          { item: "Break-even", value: "Bulan 6-9", note: "Growth 15% MoM" }
        ],
        kpis: [
          { metric: "Waitlist Signups", target: "500 (B1)" },
          { metric: "Active Beta Users", target: "100 (B2)" },
          { metric: "Paid Conversions", target: "5-10% (B3)" },
          { metric: "Churn Rate", target: "< 5%/bulan" }
        ]
      }
    },
    general: {
      strengths: ["Fleksibilitas tinggi solo founder","Low overhead cost","Direct customer access","Keputusan cepat tanpa approval"],
      risks: ["Resource constraint","Sulit scale tanpa team","Risiko burnout","Validasi bias tanpa outside perspective"],
      plan: {
        phases: [
          { name: "Discovery & Validate", duration: "Hari 1-30", focus: "Validasi masalah dan MVP", tasks: ["Talk to 20 customers","Build simple landing page","Create MVP (no-code/code)","Document learnings"] },
          { name: "Launch & Learn", duration: "Hari 31-60", focus: "50 users pertama", tasks: ["Launch di komunitas","Get early feedback","Fix top 3 complaints","Setup analytics"] },
          { name: "Grow & Earn", duration: "Hari 61-90", focus: "Monetize dan scale", tasks: ["Introduce pricing","Double down best channel","Build referral loop","Plan first hire/automation"] }
        ],
        financials: [
          { item: "Initial Investment", value: "$0 - $3,000", note: "Bootstrapped" },
          { item: "Monthly Expenses", value: "$100 - $500", note: "Tools, hosting, ads" },
          { item: "Target MRR (M3)", value: "$500 - $2,000", note: "First paying customers" },
          { item: "Break-even", value: "Month 4-6", note: "Sustainable solo" }
        ],
        kpis: [
          { metric: "Landing Visitors", target: "1,000 (M1)" },
          { metric: "Signups", target: "200 (M1)" },
          { metric: "Active Users", target: "50 (M2)" },
          { metric: "Paying Customers", target: "10 (M3)" }
        ]
      }
    }
  },
  en: {
    saas: {
      strengths: ["Scalable recurring revenue","High margins (80%+)","Global access from day one","Easy to iterate with data","Low distribution cost"],
      risks: ["High CAC in competitive markets","Churn rate is critical","Requires consistent maintenance","Well-funded competitors can replicate"],
      plan: {
        phases: [
          { name: "Validation & MVP", duration: "Day 1-30", focus: "Validate and build core MVP", tasks: ["Interview 20 users","Build landing page","Develop 1-2 core features","Setup analytics"] },
          { name: "Early Adoption", duration: "Day 31-60", focus: "Get 100 early users", tasks: ["Launch on Product Hunt","Manual beta onboarding","Fix critical bugs","Implement power user feedback"] },
          { name: "Growth & Monetize", duration: "Day 61-90", focus: "Launch paid plan", tasks: ["Setup Stripe","Freemium → paid tier","Content marketing / SEO","Strategic partnerships"] }
        ],
        financials: [
          { item: "Development Cost", value: "$0 - $3,000", note: "Bootstrapped" },
          { item: "Monthly Burn", value: "$300 - $1,000", note: "Server, tools, marketing" },
          { item: "Target MRR (M3)", value: "$500 - $2,000", note: "50-100 paid users" },
          { item: "Break-even", value: "Month 6-9", note: "15% MoM growth" }
        ],
        kpis: [
          { metric: "Waitlist Signups", target: "500 (M1)" },
          { metric: "Active Beta Users", target: "100 (M2)" },
          { metric: "Paid Conversions", target: "5-10% (M3)" },
          { metric: "Churn Rate", target: "< 5%/month" }
        ]
      }
    },
    general: {
      strengths: ["High flexibility as solo founder","Low overhead initially","Direct customer access","Fast decisions without layers"],
      risks: ["Resource constraints","Hard to scale without team","Burnout risk","Validation bias without outside view"],
      plan: {
        phases: [
          { name: "Discovery & Validate", duration: "Day 1-30", focus: "Validate problem, build MVP", tasks: ["Talk to 20 customers","Build landing page","Create MVP","Document learnings"] },
          { name: "Launch & Learn", duration: "Day 31-60", focus: "First 50 users", tasks: ["Launch in communities","Get early feedback","Fix top 3 issues","Setup analytics"] },
          { name: "Grow & Earn", duration: "Day 61-90", focus: "Monetize and find growth", tasks: ["Introduce pricing","Double down best channel","Build referral loop","Plan hire/automation"] }
        ],
        financials: [
          { item: "Initial Investment", value: "$0 - $3,000", note: "Bootstrapped" },
          { item: "Monthly Expenses", value: "$100 - $500", note: "Tools, hosting, ads" },
          { item: "Target MRR (M3)", value: "$500 - $2,000", note: "First paying customers" },
          { item: "Break-even", value: "Month 4-6", note: "Sustainable solo" }
        ],
        kpis: [
          { metric: "Landing Visitors", target: "1,000 (M1)" },
          { metric: "Signups", target: "200 (M1)" },
          { metric: "Active Users", target: "50 (M2)" },
          { metric: "Paying Customers", target: "10 (M3)" }
        ]
      }
    }
  },
  ja: {
    general: {
      strengths: ["ソロファウンダーの柔軟性","初期コストが低い","顧客への直接アクセス","迅速な意思決定"],
      risks: ["リソース制約","チームなしでのスケール困難","バーンアウトリスク","外部視点なしのバイアス"],
      plan: {
        phases: [
          { name: "発見と検証", duration: "1-30日", focus: "問題の検証とMVP構築", tasks: ["20人の顧客にインタビュー","ランディングページ作成","MVP作成","学びの記録"] },
          { name: "ローンチと学習", duration: "31-60日", focus: "最初の50ユーザー", tasks: ["コミュニティでローンチ","早期フィードバック取得","上位3つの問題修正","アナリティクス設定"] },
          { name: "成長と収益化", duration: "61-90日", focus: "収益化と拡大", tasks: ["価格設定導入","最良チャネル集中","紹介プログラム構築","採用/自動化計画"] }
        ],
        financials: [
          { item: "初期投資", value: "¥0 - ¥30万", note: "ブートストラップ" },
          { item: "月間経費", value: "¥1万 - ¥5万", note: "ツール、サーバー、広告" },
          { item: "目標MRR（3ヶ月）", value: "¥5万 - ¥20万", note: "最初の有料顧客" },
          { item: "損益分岐点", value: "4-6ヶ月", note: "持続可能なソロ運営" }
        ],
        kpis: [
          { metric: "ランディング訪問者", target: "1,000（1ヶ月目）" },
          { metric: "登録数", target: "200（1ヶ月目）" },
          { metric: "アクティブユーザー", target: "50（2ヶ月目）" },
          { metric: "有料顧客", target: "10（3ヶ月目）" }
        ]
      }
    }
  },
  es: {
    general: {
      strengths: ["Alta flexibilidad como fundador solo","Bajos costos iniciales","Acceso directo al cliente","Decisiones rápidas"],
      risks: ["Restricciones de recursos","Difícil escalar sin equipo","Riesgo de agotamiento","Sesgo de validación"],
      plan: {
        phases: [
          { name: "Descubrimiento y Validación", duration: "Día 1-30", focus: "Validar problema y construir MVP", tasks: ["Entrevistar 20 clientes","Crear landing page","Crear MVP","Documentar aprendizajes"] },
          { name: "Lanzamiento y Aprendizaje", duration: "Día 31-60", focus: "Primeros 50 usuarios", tasks: ["Lanzar en comunidades","Obtener feedback","Corregir 3 problemas","Configurar analytics"] },
          { name: "Crecimiento y Monetización", duration: "Día 61-90", focus: "Monetizar y escalar", tasks: ["Introducir precios","Doblar canal ganador","Crear referral","Planear contratación"] }
        ],
        financials: [
          { item: "Inversión Inicial", value: "$0 - $3,000", note: "Bootstrapped" },
          { item: "Gastos Mensuales", value: "$100 - $500", note: "Herramientas, hosting, ads" },
          { item: "MRR Objetivo (M3)", value: "$500 - $2,000", note: "Primeros clientes pagos" },
          { item: "Punto de Equilibrio", value: "Mes 4-6", note: "Operación sostenible" }
        ],
        kpis: [
          { metric: "Visitantes Landing", target: "1,000 (M1)" },
          { metric: "Registros", target: "200 (M1)" },
          { metric: "Usuarios Activos", target: "50 (M2)" },
          { metric: "Clientes Pagos", target: "10 (M3)" }
        ]
      }
    }
  }
};

function getTemplates(industry: string, lang: SupportedLang) {
  const langData = (TEMPLATES as any)[lang] || TEMPLATES.en;
  return langData[industry] || langData.general;
}

function classifyIndustry(description: string): string {
  const lower = description.toLowerCase();
  let bestMatch = "general";
  let maxMatches = 0;
  for (const [industry, keywords] of Object.entries(INDUSTRIES)) {
    const matches = keywords.filter((k) => lower.includes(k)).length;
    if (matches > maxMatches) { maxMatches = matches; bestMatch = industry; }
  }
  return bestMatch;
}

function extractCoreIdea(description: string): string {
  const sentences = description.split(/[.!?。！？]/);
  const first = sentences[0].trim();
  return first.length > 5 ? first : description.slice(0, 80).trim();
}

export async function generateLocally(input: IdeaInput): Promise<GenerateResults> {
  const detectedLang = detectLanguage(input.description);
  const industry = classifyIndustry(input.description);
  const coreIdea = extractCoreIdea(input.description);
  const templates = getTemplates(industry, detectedLang);

  const isId = detectedLang === "id";
  const isJa = detectedLang === "ja";
  const isZh = detectedLang === "zh";
  const isKo = detectedLang === "ko";
  const isAr = detectedLang === "ar";
  const isEs = detectedLang === "es";

  const t = (id: string, en: string, ja?: string, zh?: string, ko?: string, ar?: string, es?: string) => {
    if (isAr && ar) return ar;
    if (isKo && ko) return ko;
    if (isZh && zh) return zh;
    if (isJa && ja) return ja;
    if (isEs && es) return es;
    if (isId) return id;
    return en;
  };

  const validation = {
    score: Math.floor(Math.random() * 2) + 7,
    marketAnalysis: t(
      `Berdasarkan analisis untuk "${coreIdea}", pasar menunjukkan opportunity signifikan. Adopsi digital meningkat dan target audience jelas.`,
      `Analysis for "${coreIdea}" shows significant opportunity. Digital adoption is growing with clear target audience.`,
      `「${coreIdea}」の分析により、大きな機会が示されています。デジタル導入が進み、ターゲットオーディエンスが明確です。`,
      `对"${coreIdea}"的分析显示出重大机会。数字化应用正在增长，目标受众明确。`,
      `"${coreIdea}"에 대한 분석은 상당한 기회를 보여줍니다. 디지털 도입이 증가하고 명확한 타겟 오디언스가 있습니다.`,
      `بناءً على تحليل "${coreIdea}"، يظهر السوق فرصة كبيرة. تزايد التبني الرقمي والجمهور المستهدف واضح.`,
      `El análisis para "${coreIdea}" muestra una oportunidad significativa. La adopción digital está creciendo con una audiencia objetivo clara.`
    ),
    strengths: templates.strengths,
    risks: templates.risks,
    recommendation: t(
      "Fokus validasi cepat dengan 20 interview user. Jangan over-engineer MVP — ship dalam 2 minggu. Ingat: 70-85% zone adalah tempat founder menyerah. Jangan jadi salah satunya.",
      "Focus on rapid validation with 20 user interviews. Don't over-engineer MVP — ship within 2 weeks. Remember: the 70-85% zone is where founders quit. Don't be one of them.",
      "20人のユーザーインタビューで迅速な検証に集中。MVPを過度に設計しないでください — 2週間以内に出荷。覚えてください：70-85%ゾーンは創業者が諦める場所です。",
      "通过20次用户访谈专注快速验证。不要过度设计MVP — 在2周内发布。记住：70-85%区域是创始人放弃的地方。",
      "20명의 사용자 인터뷰로 신속한 검증에 집중. MVP를 과도하게 설계하지 마세요 — 2주 이내 출시. 기억하세요: 70-85% 구역은 창업자가 포기하는 곳입니다.",
      "ركز على التحقق السريع مع 20 مقابلة مستخدم. لا تبالغ في تصميم MVP — انشر في غضون أسبوعين. تذكر: منطقة 70-85% هي حيث يستسلم المؤسسون.",
      "Enfócate en la validación rápida con 20 entrevistas de usuario. No sobre-ingeniería el MVP — lánzalo en 2 semanas. Recuerda: la zona del 70-85% es donde los fundadores abandonan."
    )
  };

  const plan = {
    phases: templates.plan.phases,
    financialProjection: templates.plan.financials,
    kpis: templates.plan.kpis
  };

  const pitch = {
    duration: t("2 menit", "2 minutes", "2分", "2分钟", "2분", "دقيقتان", "2 minutos"),
    hook: t(
      `Bayangkan jika ${coreIdea} bisa diselesaikan dalam 10 menit, bukan 10 jam.`,
      `Imagine if ${coreIdea} could be solved in 10 minutes, not 10 hours.`,
      `もし${coreIdea}が10時間ではなく10分で解決できたら想像してみてください。`,
      `想象一下，如果${coreIdea}可以在10分钟内解决，而不是10小时。`,
      `${coreIdea}가 10시간이 아닌 10분에 해결될 수 있다고 상상해보세요.`,
      `تخيل لو كان ${coreIdea} يمكن حله في 10 دقائق، وليس 10 ساعات.`,
      `Imagina si ${coreIdea} se pudiera resolver en 10 minutos, no en 10 horas.`
    ),
    problem: t(
      "Saat ini, orang menghabiskan terlalu banyak waktu dan uang untuk masalah ini tanpa solusi efektif.",
      "Currently, people waste too much time and money on this problem without an effective solution.",
      "現在、人々は効果的な解決策なしにこの問題に多くの時間とお金を浪費しています。",
      "目前，人们在这个问题上浪费了太多时间和金钱，却没有有效的解决方案。",
      "현재 사람들은 효과적인 해결책 없이 이 문제에 너무 많은 시간과 돈을 낭비하고 있습니다.",
      "حاليًا، يهدر الناس الكثير من الوقت والمال في هذه المشكلة دون حل فعال.",
      "Actualmente, la gente pierde demasiado tiempo y dinero en este problema sin una solución efectiva."
    ),
    solution: `${coreIdea} — ${input.description.slice(0, 100)}`,
    market: t(
      "Pasar global bernilai miliaran dan tumbuh 15% per tahun.",
      "The global market is worth billions and growing 15% annually.",
      "グローバル市場は数億ドル規模で、年間15%成長しています。",
      "全球市场价值数十亿，每年增长15%。",
      "글로벌 시장은 수십억 달러 규모이며 연간 15% 성장하고 있습니다.",
      "السوق العالمي يبلغ قيمته مليارات الدولارات وينمو بنسبة 15% سنويًا.",
      "El mercado global vale miles de millones y crece un 15% anualmente."
    ),
    businessModel: t(
      "Freemium dengan tier premium untuk power users.",
      "Freemium with premium tier for power users.",
      "パワーユーザー向けのプレミアムティアを備えたフリーミアム。",
      "为高级用户提供高级层的免费增值模式。",
      "파워 유저를 위한 프리미엄 티어가 있는 프리미엄.",
      "نموذج مجاني مع طبقة مميزة للمستخدمين المتقدمين.",
      "Freemium con nivel premium para usuarios avanzados."
    ),
    traction: t(
      "50 beta users onboarded dengan 40% weekly retention.",
      "50 beta users onboarded with 40% weekly retention.",
      "週次リテンション40%で50人のベータユーザーをオンボード。",
      "50名测试用户入驻，周留存率40%。",
      "주간 유지율 40%로 50명의 베타 사용자를 온보딩했습니다.",
      "50 مستخدم تجريبي مع معدل استبقاء أسبوعي 40%.",
      "50 usuarios beta incorporados con retención semanal del 40%."
    ),
    team: t(
      "Solo founder dengan domain expertise dan execution focus. Anti-perfectionism. Pro-shipping.",
      "Solo founder with domain expertise and execution focus. Anti-perfectionism. Pro-shipping.",
      "ドメイン専門知識と実行力に焦点を当てたソロファウンダー。完璧主義反対。出荷推進。",
      "具有领域专业知识和执行专注的独立创始人。反完美主义。支持发布。",
      "도메인 전문성과 실행에 집중하는 솔로 창업자. 완벽주의 반대. 출시 지향.",
      "مؤسس فردي بخبرة مجالية وتركيز على التنفيذ. ضد الكمالية. مؤيد للإطلاق.",
      "Fundador solo con experiencia de dominio y enfoque en ejecución. Anti-perfeccionismo. Pro-shipping."
    ),
    close: t(
      "Kami mencari $50K untuk scale acquisition dan reach product-market fit dalam 6 bulan.",
      "We're raising $50K to scale acquisition and reach product-market fit within 6 months.",
      "6ヶ月以内に獲得をスケールし、プロダクトマーケットフィットに到達するために5万ドルを調達しています。",
      "我们正在筹集5万美元，以扩大用户获取并在6个月内达到产品市场契合度。",
      "6개월 내에 고객 확보를 확장하고 제품-시장 적합성에 도달하기 위해 $50K를 모금하고 있습니다.",
      "نجمع 50 ألف دولار لتوسيع الاستحواذ والوصول إلى تناسب المنتج والسوق في غضون 6 أشهر.",
      "Estamos recaudando $50K para escalar la adquisición y alcanzar el product-market fit en 6 meses."
    ),
    fullScript: ",
  };

  pitch.fullScript = `${pitch.hook}

${pitch.problem}

${t("Solusi kami:", "Our solution:", "私たちの解決策:", "我们的解决方案:", "우리의 솔루션:", "حلنا:", "Nuestra solución:")} ${pitch.solution}

${t("Pasar:", "Market:", "市場:", "市场:", "시장:", "السوق:", "Mercado:")} ${pitch.market}

${t("Model Bisnis:", "Business Model:", "ビジネスモデル:", "商业模式:", "비즈니스 모델:", "نموذج العمل:", "Modelo de Negocio:")} ${pitch.businessModel}

${t("Traction:", "Traction:", "トラクション:", "牵引力:", "견인력:", "الزخم:", "Tracción:")} ${pitch.traction}

${t("Tim:", "Team:", "チーム:", "团队:", "팀:", "الفريق:", "Equipo:")} ${pitch.team}

${pitch.close}

${t("Terima kasih.", "Thank you.", "ありがとうございます。", "谢谢。", "감사합니다.", "شكراً لك.", "Gracias.")}`;

  const landing = {
    headline: t(
      `Selesaikan ${coreIdea} dengan Lebih Cepat`,
      `Solve ${coreIdea} Faster`,
      `${coreIdea}をより速く解決`,
      `更快解决${coreIdea}`,
      `${coreIdea}를 더 빠르게 해결`,
      `حل ${coreIdea} بشكل أسرع`,
      `Resuelve ${coreIdea} Más Rápido`
    ),
    subheadline: t(
      "Platform yang membantu kamu menghemat waktu, uang, dan energi. Bergabung dengan 500+ early adopters.",
      "The platform that helps you save time, money, and energy. Join 500+ early adopters.",
      "時間、お金、エネルギーを節約するプラットフォーム。500人以上の早期導入者に参加。",
      "帮助您节省时间、金钱和精力的平台。加入500多名早期采用者。",
      "시간, 돈, 에너지를 절약하는 플랫폼. 500명 이상의 초기 도입자와 함께하세요.",
      "المنصة التي تساعدك في توفير الوقت والمال والطاقة. انضم إلى 500+ من المتبنين الأوائل.",
      "La plataforma que te ayuda a ahorrar tiempo, dinero y energía. Únete a 500+ early adopters."
    ),
    primaryCta: t("Daftar Early Access", "Get Early Access", "早期アクセス登録", "获取早期访问", "얼리 액세스 받기", "الحصول على الوصول المبكر", "Obtener Acceso Temprano"),
    secondaryCta: t("Lihat Demo", "Watch Demo", "デモを見る", "观看演示", "데모 보기", "مشاهدة العرض التوضيحي", "Ver Demo"),
    features: [
      { title: t("Cepat & Efisien", "Fast & Efficient", "高速＆効率的", "快速高效", "빠르고 효율적", "سريع وفعال", "Rápido y Eficiente"), description: t("Selesaikan dalam menit, bukan jam.", "Get it done in minutes, not hours.", "数時間ではなく数分で完了。", "在几分钟内完成，而不是几小时。", "시간이 아닌 분 안에 완료.", "أنجز في دقائق، وليس ساعات.", "Hazlo en minutos, no en horas.") },
      { title: t("Hemat Biaya", "Cost Effective", "コスト効率", "成本效益", "비용 효율적", "فعال من حيث التكلفة", "Rentable"), description: t("Hemat 80% dibanding solusi tradisional.", "Save 80% compared to traditional solutions.", "従来のソリューションと比較して80%節約。", "比传统解决方案节省80%。", "기존 솔루션 대비 80% 절약.", "وفر 80% مقارنة بالحلول التقليدية.", "Ahorra 80% en comparación con soluciones tradicionales.") },
      { title: t("Mudah Digunakan", "Easy to Use", "使いやすい", "易于使用", "사용하기 쉬움", "سهل الاستخدام", "Fácil de Usar"), description: t("No learning curve. Langsung produktif.", "No learning curve. Start productive immediately.", "学習曲線なし。すぐに生産的に開始。", "没有学习曲线。立即开始高效工作。", "학습 곡선 없음. 즉시 생산적으로 시작.", "لا منحنى تعليمي. ابدأ بإنتاجية فورية.", "Sin curva de aprendizaje. Comienza productivo inmediatamente.") }
    ],
    socialProof: [
      { quote: t("Ini exactly yang saya butuhkan. Hemat 5 jam per minggu!", "This is exactly what I needed. Saves me 5 hours per week!", "これはまさに私が必要としていたもの。週5時間節約！", "这正是我所需要的。每周节省5小时！", "이것은 내가 정확히 필요했던 것. 주당 5시간 절약!", "هذا بالضبط ما كنت بحاجة إليه. يوفر لي 5 ساعات أسبوعيًا!", "Esto es exactamente lo que necesitaba. ¡Me ahorra 5 horas por semana!"), author: "Sarah K.", role: t("Founder di TechStart", "Founder at TechStart", "TechStart創業者", "TechStart创始人", "TechStart 창업자", "مؤسس TechStart", "Fundador en TechStart") },
      { quote: t("Game changer untuk solo founder seperti saya.", "Game changer for solo founders like me.", "私のようなソロファウンダーのゲームチェンジャー。", "对我这样的独立创始人来说是游戏规则改变者。", "나 같은 솔로 창업자를 위한 게임체인저.", "غيّر قواعد اللعبة للمؤسسين الفرديين مثلي.", "Cambia las reglas del juego para fundadores solitarios como yo."), author: "David M.", role: "Indie Hacker" }
    ],
    faq: [
      { question: t("Kapan produk ini launch?", "When is the product launching?", "いつローンチしますか？", "产品何时发布？", "언제 출시하나요?", "متى يتم إطلاق المنتج؟", "¿Cuándo se lanza el producto?"), answer: t("Kami dalam tahap beta private. Daftar untuk early access.", "We're in private beta. Sign up for early access.", "プライベートベータ中です。早期アクセスに登録してください。", "我们处于私人测试阶段。注册获取早期访问权限。", "프라이빗 베타 중입니다. 얼리 액세스에 등록하세요.", "نحن في مرحلة البيتا الخاصة. سجل للحصول على وصول مبكر.", "Estamos en beta privada. Regístrate para acceso temprano.") },
      { question: t("Berapa harganya?", "How much does it cost?", "いくらですか？", "价格是多少？", "가격은 얼마인가요?", "كم تكلفته؟", "¿Cuánto cuesta?"), answer: t("Freemium — gratis untuk start, premium mulai $9/bulan.", "Freemium — free to start, premium from $9/month.", "フリーミアム — 無料で開始、プレミアムは月$9から。", "免费增值 — 免费开始，高级版每月9美元起。", "프리미엄 — 무료로 시작, 프리미엄 월 $9부터.", "نموذج مجاني — مجاني للبدء، مميز من 9 دولارات/شهر.", "Freemium — gratis para empezar, premium desde $9/mes.") },
      { question: t("Bisa digunakan di mobile?", "Is it available on mobile?", "モバイルで使えますか？", "有移动版吗？", "모바일에서 사용할 수 있나요?", "هل هو متاح على الجوال؟", "¿Está disponible en móvil?"), answer: t("Ya, fully responsive dan ada native app dalam roadmap.", "Yes, fully responsive with native app in roadmap.", "はい、完全レスポンシブで、ロードマップにネイティブアプリがあります。", "是的，完全响应式，路线图中有原生应用。", "예, 완전 반응형이며 로드맵에 네이티브 앱이 있습니다.", "نعم، متجاوب بالكامل مع تطبيق أصلي في خارطة الطريق.", "Sí, totalmente responsive con app nativa en roadmap.") }
    ]
  };

  return { detectedLang, validation, plan, pitch, landing };
}
