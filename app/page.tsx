"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, Map, Target, Rocket, Loader2, Download, Globe,
  CheckCircle, AlertCircle, TrendingUp, Users, DollarSign,
  Calendar, Lightbulb, ChevronRight, Sparkles, FileText,
  Sun, Moon, Ship, AlertTriangle, Timer
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { useTheme } from "next-themes";
import { SupportedLang, getLangName, getLangFlag } from "@/lib/lang-detector";

interface Results {
  detectedLang: SupportedLang;
  validation: {
    score: number;
    marketAnalysis: string;
    strengths: string[];
    risks: string[];
    recommendation: string;
  };
  plan: {
    phases: Array<{
      name: string;
      duration: string;
      focus: string;
      tasks: string[];
    }>;
    financialProjection: Array<{
      item: string;
      value: string;
      note?: string;
    }>;
    kpis: Array<{
      metric: string;
      target: string;
    }>;
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
    features: Array<{
      title: string;
      description: string;
    }>;
    socialProof: Array<{
      quote: string;
      author: string;
      role: string;
    }>;
    faq: Array<{
      question: string;
      answer: string;
    }>;
  };
}

const UI_TEXT: Record<string, Record<string, string>> = {
  id: {
    title: "Foundertion",
    subtitle: "AI Co-Founder untuk Solo Founder",
    description: "Tulis ide bisnismu dalam bahasa apa pun. AI akan auto-detect bahasa dan generate validasi, business plan, pitch script, dan landing page copy.",
    placeholder: "Contoh: Aplikasi SaaS yang membantu UMKM mengatur inventory dengan AI...",
    generate: "⚡ Generate All 4 Tools",
    generating: "Sedang generate...",
    validator: "⚡ Idea Validator",
    plan: "🗺️ Business Plan",
    pitch: "🎯 Pitch Script",
    landing: "🚀 Landing Page Copy",
    score: "Skor Validasi",
    marketAnalysis: "Analisis Pasar",
    strengths: "Kekuatan",
    risks: "Risiko",
    recommendation: "Rekomendasi",
    roadmap: "Roadmap 90 Hari",
    financials: "Proyeksi Finansial",
    kpis: "KPI Utama",
    script: "Script Lengkap",
    headline: "Headline",
    subheadline: "Subheadline",
    cta: "Call-to-Action",
    features: "Fitur",
    testimonials: "Testimonial",
    faq: "FAQ",
    export: "Export PDF",
    newIdea: "Ide Baru",
    footer: "Foundertion — Built for Solo Founders Worldwide",
    detected: "Bahasa terdeteksi",
    rescue: "🚨 Rescue Mode: Jangan berhenti di 70-85%!",
    shipIt: "🚢 Ship It — Jangan tunggu sempurna!"
  },
  en: {
    title: "Foundertion",
    subtitle: "AI Co-Founder for Solo Founders",
    description: "Write your business idea in any language. AI auto-detects language and generates validation, business plan, pitch script, and landing page copy.",
    placeholder: "E.g., A SaaS app that helps SMBs manage inventory with AI...",
    generate: "⚡ Generate All 4 Tools",
    generating: "Generating...",
    validator: "⚡ Idea Validator",
    plan: "🗺️ Business Plan",
    pitch: "🎯 Pitch Script",
    landing: "🚀 Landing Page Copy",
    score: "Validation Score",
    marketAnalysis: "Market Analysis",
    strengths: "Strengths",
    risks: "Risks",
    recommendation: "Recommendation",
    roadmap: "90-Day Roadmap",
    financials: "Financial Projection",
    kpis: "Key Metrics",
    script: "Full Script",
    headline: "Headline",
    subheadline: "Subheadline",
    cta: "Call-to-Action",
    features: "Features",
    testimonials: "Testimonials",
    faq: "FAQ",
    export: "Export PDF",
    newIdea: "New Idea",
    footer: "Foundertion — Built for Solo Founders Worldwide",
    detected: "Detected language",
    rescue: "🚨 Rescue Mode: Don't quit at 70-85%!",
    shipIt: "🚢 Ship It — Don't wait for perfect!"
  },
  ja: {
    title: "Foundertion",
    subtitle: "ソロファウンダーのためのAI共同創業者",
    description: "どの言語でもビジネスアイデアを書いてください。AIが言語を自動検出し、検証、事業計画、ピッチ、ランディングページを生成します。",
    placeholder: "例：AIで在庫管理を支援するSaaSアプリ...",
    generate: "⚡ 4つのツールを生成",
    generating: "生成中...",
    validator: "⚡ アイデア検証",
    plan: "🗺️ 事業計画",
    pitch: "🎯 ピッチスクリプト",
    landing: "🚀 ランディングページ",
    score: "検証スコア",
    marketAnalysis: "市場分析",
    strengths: "強み",
    risks: "リスク",
    recommendation: "推奨事項",
    roadmap: "90日ロードマップ",
    financials: "財務予測",
    kpis: "主要指標",
    script: "完全スクリプト",
    headline: "ヘッドライン",
    subheadline: "サブヘッドライン",
    cta: "CTA",
    features: "機能",
    testimonials: "推薦",
    faq: "FAQ",
    export: "PDFエクスポート",
    newIdea: "新しいアイデア",
    footer: "Foundertion — 世界中のソロファウンダーのために構築",
    detected: "検出された言語",
    rescue: "🚨 レスキューモード：70-85%で諦めないで！",
    shipIt: "🚢 出荷 — 完璧を待たないで！"
  },
  zh: {
    title: "Foundertion",
    subtitle: "独立创始人的AI联合创始人",
    description: "用任何语言写下你的商业想法。AI自动检测语言并生成验证、商业计划、演讲稿和着陆页文案。",
    placeholder: "例如：帮助中小企业用AI管理库存的SaaS应用...",
    generate: "⚡ 生成4个工具",
    generating: "生成中...",
    validator: "⚡ 想法验证",
    plan: "🗺️ 商业计划",
    pitch: "🎯 演讲稿",
    landing: "🚀 着陆页文案",
    score: "验证分数",
    marketAnalysis: "市场分析",
    strengths: "优势",
    risks: "风险",
    recommendation: "建议",
    roadmap: "90天路线图",
    financials: "财务预测",
    kpis: "关键指标",
    script: "完整脚本",
    headline: "标题",
    subheadline: "副标题",
    cta: "行动号召",
    features: "功能",
    testimonials: "推荐",
    faq: "常见问题",
    export: "导出PDF",
    newIdea: "新想法",
    footer: "Foundertion — 为全球独立创始人而建",
    detected: "检测到的语言",
    rescue: "🚨 救援模式：不要在70-85%时放弃！",
    shipIt: "🚢 发布 — 不要等待完美！"
  },
  ko: {
    title: "Foundertion",
    subtitle: "솔로 창업자를 위한 AI 공동창업자",
    description: "어떤 언어로든 비즈니스 아이디어를 작성하세요. AI가 언어를 자동 감지하고 검증, 사업 계획, 피치, 랜딩 페이지를 생성합니다.",
    placeholder: "예: AI로 재고 관리를 돕는 SaaS 앱...",
    generate: "⚡ 4가지 도구 생성",
    generating: "생성 중...",
    validator: "⚡ 아이디어 검증",
    plan: "🗺️ 사업 계획",
    pitch: "🎯 피치 스크립트",
    landing: "🚀 랜딩 페이지",
    score: "검증 점수",
    marketAnalysis: "시장 분석",
    strengths: "강점",
    risks: "위험",
    recommendation: "권장사항",
    roadmap: "90일 로드맵",
    financials: "재무 예측",
    kpis: "핵심 지표",
    script: "전체 스크립트",
    headline: "헤드라인",
    subheadline: "서브헤드라인",
    cta: "CTA",
    features: "기능",
    testimonials: "추천",
    faq: "FAQ",
    export: "PDF보내기",
    newIdea: "새 아이디어",
    footer: "Foundertion — 전 세계 솔로 창업자를 위해 구축",
    detected: "감지된 언어",
    rescue: "🚨 구조 모드: 70-85%에서 포기하지 마세요!",
    shipIt: "🚢 출시 — 완벽을 기다리지 마세요!"
  },
  es: {
    title: "Foundertion",
    subtitle: "AI Co-Founder para Fundadores Solo",
    description: "Escribe tu idea de negocio en cualquier idioma. La IA detecta automáticamente el idioma y genera validación, plan de negocios, pitch y copy de landing page.",
    placeholder: "Ej: Una app SaaS que ayuda a pymes a gestionar inventario con IA...",
    generate: "⚡ Generar 4 Herramientas",
    generating: "Generando...",
    validator: "⚡ Validador de Ideas",
    plan: "🗺️ Plan de Negocios",
    pitch: "🎯 Pitch Script",
    landing: "🚀 Copy de Landing",
    score: "Puntuación",
    marketAnalysis: "Análisis de Mercado",
    strengths: "Fortalezas",
    risks: "Riesgos",
    recommendation: "Recomendación",
    roadmap: "Roadmap 90 Días",
    financials: "Proyección Financiera",
    kpis: "KPIs Clave",
    script: "Script Completo",
    headline: "Headline",
    subheadline: "Subheadline",
    cta: "CTA",
    features: "Características",
    testimonials: "Testimonios",
    faq: "FAQ",
    export: "Exportar PDF",
    newIdea: "Nueva Idea",
    footer: "Foundertion — Construido para Fundadores Solo",
    detected: "Idioma detectado",
    rescue: "🚨 Modo Rescate: ¡No te rindas al 70-85%!",
    shipIt: "🚢 Lánzalo — ¡No esperes a que sea perfecto!"
  }
};

function getUIText(lang: SupportedLang): Record<string, string> {
  return UI_TEXT[lang] || UI_TEXT.en;
}

function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  if (!mounted) return null;
  return (
    <button onClick={() => setTheme(theme === "dark" ? "light" : "dark")} className="p-2 rounded-md hover:bg-primary/10 transition-colors text-primary">
      {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
    </button>
  );
}

export default function Home() {
  const [idea, setIdea] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<Results | null>(null);
  const [activeTab, setActiveTab] = useState<"validator" | "plan" | "pitch" | "landing">("validator");
  const resultRef = useRef<HTMLDivElement>(null);

  const detectedLang = results?.detectedLang || "en";
  const t = getUIText(detectedLang);

  const handleGenerate = async () => {
    if (!idea.trim() || idea.trim().length < 10) {
      alert("Idea too short (min 10 chars) / Ide terlalu singkat");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ description: idea })
      });

      if (!res.ok) throw new Error("Failed to generate");

      const data = await res.json();
      setResults(data);
      setActiveTab("validator");
    } catch (err) {
      console.error(err);
      alert("Failed to generate. Try again. / Gagal generate. Coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  const exportPDF = async () => {
    if (!resultRef.current) return;
    const [{ default: html2canvas }, { default: jsPDF }] = await Promise.all([
      import("html2canvas"),
      import("jspdf")
    ]);
    const canvas = await html2canvas(resultRef.current, { scale: 2, backgroundColor: null });
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save(`foundertion-${idea.slice(0, 20).replace(/\s+/g, "-")}.pdf`);
  };

  const tabs = [
    { id: "validator" as const, label: t.validator, icon: Zap },
    { id: "plan" as const, label: t.plan, icon: Map },
    { id: "pitch" as const, label: t.pitch, icon: Target },
    { id: "landing" as const, label: t.landing, icon: Rocket },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-50">
        <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-lg bg-primary/20 flex items-center justify-center">
              <Ship className="h-5 w-5 text-primary" />
            </div>
            <div>
              <span className="font-bold text-xl tracking-tight">Foundertion</span>
              <span className="hidden sm:inline text-xs text-muted-foreground ml-2">YOUR AI CO-FOUNDER</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-12">
        {!results && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm mb-6 border border-primary/20">
              <Globe className="h-4 w-4" />
              <span>Auto-detects 20+ languages</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              {t.title}
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground mb-2">{t.subtitle}</p>
            <p className="text-muted-foreground max-w-2xl mx-auto">{t.description}</p>
          </motion.div>
        )}

        <motion.div layout className="max-w-3xl mx-auto mb-12">
          <Card className="border-2 border-primary/20 shadow-xl shadow-primary/5">
            <CardContent className="pt-6">
              <textarea
                value={idea}
                onChange={(e) => setIdea(e.target.value)}
                placeholder={t.placeholder}
                className="w-full min-h-[140px] p-4 rounded-lg border border-input bg-background/50 resize-none focus:outline-none focus:ring-2 focus:ring-primary text-lg transition-all"
                disabled={loading}
              />
              <div className="mt-4 flex gap-3 justify-end">
                {results && (
                  <Button variant="outline" onClick={() => { setResults(null); setIdea(""); }}>
                    {t.newIdea}
                  </Button>
                )}
                <Button
                  onClick={handleGenerate}
                  isLoading={loading}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg shadow-primary/20"
                  size="lg"
                >
                  {loading ? t.generating : t.generate}
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <AnimatePresence>
          {results && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
            >
              <div className="flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm w-fit border border-primary/20">
                <Globe className="h-4 w-4" />
                <span>{t.detected}: {getLangFlag(results.detectedLang)} {getLangName(results.detectedLang)}</span>
              </div>

              <div className="mb-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-start gap-3">
                <AlertTriangle className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold text-amber-600 dark:text-amber-400">{t.rescue}</p>
                  <p className="text-sm text-muted-foreground mt-1">{t.shipIt}</p>
                </div>
              </div>

              <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {tabs.map((tab) => (
                  <Button
                    key={tab.id}
                    variant={activeTab === tab.id ? "default" : "outline"}
                    onClick={() => setActiveTab(tab.id)}
                    className="flex items-center gap-2 whitespace-nowrap"
                  >
                    <tab.icon className="h-4 w-4" />
                    {tab.label}
                  </Button>
                ))}
                <Button variant="outline" onClick={exportPDF} className="ml-auto flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  {t.export}
                </Button>
              </div>

              <div ref={resultRef} className="space-y-6">
                {activeTab === "validator" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="h-5 w-5 text-primary" />
                          {t.validator}
                        </CardTitle>
                        <CardDescription>{t.score}: {results.validation.score}/10</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="relative w-28 h-28 shrink-0">
                            <svg className="w-28 h-28 transform -rotate-90">
                              <circle cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-muted/30" />
                              <circle
                                cx="56" cy="56" r="48" stroke="currentColor" strokeWidth="8" fill="transparent"
                                strokeDasharray={301.59}
                                strokeDashoffset={301.59 - (301.59 * results.validation.score) / 10}
                                className={results.validation.score >= 8 ? "text-primary" : results.validation.score >= 6 ? "text-amber-500" : "text-red-500"}
                              />
                            </svg>
                            <span className="absolute inset-0 flex items-center justify-center text-3xl font-bold">
                              {results.validation.score}
                            </span>
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold mb-1">{t.marketAnalysis}</h4>
                            <p className="text-sm text-muted-foreground leading-relaxed">{results.validation.marketAnalysis}</p>
                          </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-primary">
                              <CheckCircle className="h-4 w-4" />
                              {t.strengths}
                            </h4>
                            <ul className="space-y-2">
                              {results.validation.strengths.map((s, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <ChevronRight className="h-3 w-3 mt-1 shrink-0 text-primary" />
                                  {s}
                                </li>
                              ))}
                            </ul>
                          </div>
                          <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20">
                            <h4 className="font-semibold mb-3 flex items-center gap-2 text-red-400">
                              <AlertCircle className="h-4 w-4" />
                              {t.risks}
                            </h4>
                            <ul className="space-y-2">
                              {results.validation.risks.map((r, i) => (
                                <li key={i} className="text-sm flex items-start gap-2">
                                  <ChevronRight className="h-3 w-3 mt-1 shrink-0 text-red-400" />
                                  {r}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </div>

                        <div className="p-4 rounded-lg bg-amber-500/5 border border-amber-500/20">
                          <h4 className="font-semibold mb-1 flex items-center gap-2 text-amber-500">
                            <Lightbulb className="h-4 w-4" />
                            {t.recommendation}
                          </h4>
                          <p className="text-sm leading-relaxed">{results.validation.recommendation}</p>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "plan" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Map className="h-5 w-5 text-primary" />
                          {t.plan}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="space-y-4">
                          <h4 className="font-semibold flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-primary" />
                            {t.roadmap}
                          </h4>
                          {results.plan.phases.map((phase, i) => (
                            <div key={i} className="p-4 rounded-lg border border-border/50 hover:border-primary/50 transition-colors bg-card/50">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-semibold text-lg">{phase.name}</h5>
                                <span className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full">
                                  {phase.duration}
                                </span>
                              </div>
                              <p className="text-sm text-muted-foreground mb-3">{phase.focus}</p>
                              <ul className="space-y-2">
                                {phase.tasks.map((task, j) => (
                                  <li key={j} className="text-sm flex items-start gap-2">
                                    <div className="h-1.5 w-1.5 rounded-full bg-primary mt-2 shrink-0" />
                                    {task}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          ))}
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-primary" />
                              {t.financials}
                            </h4>
                            <div className="space-y-2">
                              {results.plan.financialProjection.map((f, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border border-border/30">
                                  <div>
                                    <p className="text-sm font-medium">{f.item}</p>
                                    {f.note && <p className="text-xs text-muted-foreground">{f.note}</p>}
                                  </div>
                                  <span className="font-semibold text-primary">{f.value}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                          <div>
                            <h4 className="font-semibold mb-3 flex items-center gap-2">
                              <TrendingUp className="h-4 w-4 text-primary" />
                              {t.kpis}
                            </h4>
                            <div className="space-y-2">
                              {results.plan.kpis.map((k, i) => (
                                <div key={i} className="flex justify-between items-center p-3 rounded-lg bg-secondary/30 border border-border/30">
                                  <span className="text-sm">{k.metric}</span>
                                  <span className="font-semibold text-primary">{k.target}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "pitch" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          {t.pitch}
                        </CardTitle>
                        <CardDescription>{results.pitch.duration}</CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="grid gap-4">
                          {[
                            { label: "Hook", value: results.pitch.hook, icon: Zap },
                            { label: "Problem", value: results.pitch.problem, icon: AlertCircle },
                            { label: "Solution", value: results.pitch.solution, icon: CheckCircle },
                            { label: "Market", value: results.pitch.market, icon: Users },
                            { label: "Business Model", value: results.pitch.businessModel, icon: DollarSign },
                            { label: "Traction", value: results.pitch.traction, icon: TrendingUp },
                            { label: "Team", value: results.pitch.team, icon: Users },
                            { label: "Close / Ask", value: results.pitch.close, icon: Target },
                          ].map((item, i) => (
                            <div key={i} className="p-4 rounded-lg border border-border/50 bg-card/50">
                              <h5 className="font-semibold mb-1 flex items-center gap-2 text-xs uppercase tracking-wider text-muted-foreground">
                                <item.icon className="h-4 w-4 text-primary" />
                                {item.label}
                              </h5>
                              <p className="text-lg leading-relaxed">{item.value}</p>
                            </div>
                          ))}
                        </div>

                        <div className="p-6 rounded-lg bg-secondary/20 border border-border/50">
                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                            <FileText className="h-4 w-4 text-primary" />
                            {t.script}
                          </h4>
                          <div className="whitespace-pre-wrap text-sm leading-relaxed font-mono bg-background/50 p-4 rounded-md border border-border/30">
                            {results.pitch.fullScript}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}

                {activeTab === "landing" && (
                  <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Rocket className="h-5 w-5 text-primary" />
                          {t.landing}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-6">
                        <div className="p-8 rounded-xl bg-gradient-to-br from-primary/10 to-emerald-500/5 text-center space-y-4 border border-primary/20">
                          <h2 className="text-3xl md:text-4xl font-bold">{results.landing.headline}</h2>
                          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{results.landing.subheadline}</p>
                          <div className="flex gap-4 justify-center pt-4">
                            <Button size="lg" className="bg-primary text-primary-foreground shadow-lg shadow-primary/20">
                              {results.landing.primaryCta}
                            </Button>
                            <Button variant="outline" size="lg">
                              {results.landing.secondaryCta}
                            </Button>
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">{t.features}</h4>
                          <div className="grid md:grid-cols-3 gap-4">
                            {results.landing.features.map((f, i) => (
                              <div key={i} className="p-4 rounded-lg border border-border/50 bg-card/50 hover:border-primary/50 transition-colors">
                                <h5 className="font-semibold mb-1 text-primary">{f.title}</h5>
                                <p className="text-sm text-muted-foreground">{f.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">{t.testimonials}</h4>
                          <div className="grid md:grid-cols-2 gap-4">
                            {results.landing.socialProof.map((t, i) => (
                              <div key={i} className="p-4 rounded-lg bg-secondary/20 border border-border/30">
                                <p className="text-sm italic mb-3 text-muted-foreground">"{t.quote}"</p>
                                <div className="flex items-center gap-2">
                                  <div className="h-8 w-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">
                                    {t.author.charAt(0)}
                                  </div>
                                  <div>
                                    <p className="text-sm font-medium">{t.author}</p>
                                    <p className="text-xs text-muted-foreground">{t.role}</p>
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className="font-semibold mb-3">{t.faq}</h4>
                          <div className="space-y-3">
                            {results.landing.faq.map((f, i) => (
                              <div key={i} className="p-4 rounded-lg border border-border/50 bg-card/50">
                                <h5 className="font-semibold mb-1">{f.question}</h5>
                                <p className="text-sm text-muted-foreground">{f.answer}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      <footer className="border-t border-border/30 mt-12 py-6 text-center text-sm text-muted-foreground">
        {t.footer}
      </footer>
    </div>
  );
}