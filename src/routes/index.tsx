import { createFileRoute } from "@tanstack/react-router";
import { Mail, Phone, MapPin, Linkedin, FileText, Download, ArrowUp, FileSearch, Flame, Moon, Settings2, Volume2, VolumeX, Languages, Lock, Star, ScrollText, X, WifiOff, ChevronDown } from "lucide-react";
import { AnimatePresence, motion, useScroll, useTransform, useSpring, useMotionTemplate, useMotionValueEvent } from "framer-motion";
import React, { useEffect, useMemo, useRef, useState } from "react";
import CelestialGateSVG from "@/components/CelestialGateSVG";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogDescription,
} from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Slider } from "@/components/ui/slider";
import { submitFeedback, getFeedbackAdmin, trackCvDownload, getCvDownloadCount } from "@/lib/feedback.functions";

export const Route = createFileRoute("/")({ component: Index });

/* ───────── i18n (now covers entire page content) ───────── */
const I18N = {
  en: {
    home: "Home", about: "About", skills: "Skills", experience: "Experience", education: "Education", projects: "Projects", contact: "Contact",
    tagline: "Web Developer · Cybersecurity Graduate",
    scroll: "Scroll to open the doors",
    previewCV: "Preview CV", downloadPDF: "Download PDF", contactMe: "Contact Me", viewWork: "View Work",
    heroBlurb: "Building secure full-stack applications at the intersection of software engineering and cyber defence.",
    aboutHeading: "A B O U T",
    aboutBody:
      "Developer with 2+ years of experience in full-stack web development and data engineering. Currently pursuing an MSc in Cyber Security & Resilience at FH St. Pölten. Specialises in C# / .NET, REST APIs, SQL, and hands-on security operations — bridging robust software delivery with practical defensive engineering.",
    statYears: "Years dev exp.", statProjects: "Security projects", statLangs: "Languages", statMsc: "Cyber Security",
    skillsHeading: "S K I L L S",
    skLanguages: "Languages", skInfrastructure: "Data & Automation", skSecurity: "Security Tools", skMethod: "Method", skFrameworks: "Frameworks",
    tools: "Tools of the Trade",
    experienceHeading: "E X P E R I E N C E",
    currentFocusLabel: "Currently focusing on",
    currentFocusText: "Preparing for my Security+ certification by strengthening my network security, threat detection, and core defensive fundamentals.",
    jobBank: "Web Developer / Data Engineer", jobBankCo: "OTP Bank · Tirana, Albania", jobBankPeriod: "Oct 2024 – Jul 2025",
    jobSoft: "Full Stack Developer", jobSoftCo: "Soft Solution · Tirana, Albania", jobSoftPeriod: "Jul 2023 – Mar 2024",
    educationHeading: "E D U C A T I O N   &   C E R T S",
    languagesTitle: "Languages", languagesBody: "Albanian (native) · English (professional) · German (basic)",
    eduOngoing: "ongoing",
    projectsHeading: "C Y B E R S E C U R I T Y   P R O J E C T S",
    projectsHint: "Each project has a report — click",
    viewReport: "View Report",
    filterAll: "All",
    noProjects: "No projects in this category yet.",
    contactHeading: "C O N T A C T",
    contactBlurb: "Open to opportunities in secure software engineering, application security, and SOC roles. Reach out through any of the channels below.",
    email: "Email", phone: "Phone", location: "Location",
    cvSection: "Curriculum Vitae",
    cvCount: (n: number) => `✦ Downloaded ${n} ${n === 1 ? "time" : "times"} from this device`,
    feedbackHeading: "F E E D B A C K",
    feedbackIntro: "Leave a short note about your visit — only the site owner can read submissions.",
    yourName: "Your name", yourEmail: "Email (optional)", yourRating: "Rating", yourMessage: "Message",
    submit: "Send", sending: "Sending…", thanks: "Thank you — your note has been sealed.",
    adminUnlock: "Owner access", adminPrompt: "Enter the admin key", adminUnlockBtn: "Unlock", adminEntries: "entries",
    bullets: {
      bank: [
        "Developed C# / .NET internal apps including a dynamic contract generator auto-populating legal templates with client data.",
        "Built SSIS ETL pipelines for automated data manipulation, email/SMS dispatch, and reporting workflows.",
        "Used Power BI to support banking reports and data visualisation, working with structured business data to prepare and present reporting insights.",
        "Parsed Excel and PDF files into SQL Server; designed and normalised multiple databases for new features.",
        "Designed REST APIs for enterprise integration: LDAP auth and automated JIRA task creation from parsed PDFs.",
        "Containerised and deployed with Docker; managed CI/CD via GitLab.",
        "Optimised complex daily SQL transaction-summary queries, significantly reducing execution time.",
      ],
      soft: [
        "Delivered full-stack web solutions in W-language (WEBDEV) with polished UI and robust backend logic.",
        "Managed large production databases in SSMS ensuring data integrity, performance, and issue resolution.",
        "Designed and optimised SQL queries; integrated XML data sources across multiple formats.",
        "Participated in Agile / SCRUM delivery cycles, contributing to timely, high-quality releases.",
      ],
    },
  },
  de: {
    home: "Start", about: "Über", skills: "Fähigkeiten", experience: "Erfahrung", education: "Ausbildung", projects: "Projekte", contact: "Kontakt",
    tagline: "Webentwickler · Absolvent Cybersicherheit",
    scroll: "Scrollen, um die Tore zu öffnen",
    previewCV: "Lebenslauf ansehen", downloadPDF: "PDF herunterladen", contactMe: "Kontaktieren", viewWork: "Arbeiten ansehen",
    heroBlurb: "Entwicklung sicherer Full-Stack-Anwendungen an der Schnittstelle von Softwaretechnik und Cyberverteidigung.",
    aboutHeading: "Ü B E R   M I C H",
    aboutBody:
      "Entwickler mit über 2 Jahren Erfahrung in Full-Stack-Webentwicklung und Data Engineering. Derzeit MSc-Studium in Cyber Security & Resilience an der FH St. Pölten. Spezialisiert auf C# / .NET, REST-APIs, SQL und praktischen Security Operations — eine Brücke zwischen robuster Softwarelieferung und defensiver Ingenieurspraxis.",
    statYears: "Jahre Dev-Erfahrung", statProjects: "Security-Projekte", statLangs: "Sprachen", statMsc: "Cybersicherheit",
    skillsHeading: "F Ä H I G K E I T E N",
    skLanguages: "Sprachen", skInfrastructure: "Daten & Automatisierung", skSecurity: "Security-Tools", skMethod: "Methode", skFrameworks: "Frameworks",
    tools: "Werkzeuge des Handwerks",
    experienceHeading: "E R F A H R U N G",
    currentFocusLabel: "Aktuell im Fokus",
    currentFocusText: "Ich bereite mich auf meine Security+-Zertifizierung vor und schärfe meine Kenntnisse in Netzwerksicherheit, Bedrohungserkennung und fundamentalen Verteidigungspraktiken.",
    jobBank: "Webentwickler / Data Engineer", jobBankCo: "OTP Bank · Tirana, Albanien", jobBankPeriod: "Okt 2024 – Jul 2025",
    jobSoft: "Full-Stack-Entwickler", jobSoftCo: "Soft Solution · Tirana, Albanien", jobSoftPeriod: "Jul 2023 – Mär 2024",
    educationHeading: "A U S B I L D U N G   &   Z E R T I F I K A T E",
    languagesTitle: "Sprachen", languagesBody: "Albanisch (Muttersprache) · Englisch (Berufsniveau) · Deutsch (Grundkenntnisse)",
    eduOngoing: "laufend",
    projectsHeading: "C Y B E R S E C U R I T Y   P R O J E K T E",
    projectsHint: "Jedes Projekt hat einen Bericht — klicke",
    viewReport: "Bericht ansehen",
    filterAll: "Alle",
    noProjects: "Noch keine Projekte in dieser Kategorie.",
    contactHeading: "K O N T A K T",
    contactBlurb: "Offen für Stellen in sicherer Softwareentwicklung, Anwendungssicherheit und SOC. Erreichbar über die folgenden Kanäle.",
    email: "E-Mail", phone: "Telefon", location: "Standort",
    cvSection: "Lebenslauf",
    cvCount: (n: number) => `✦ ${n} ${n === 1 ? "Mal" : "Mal"} von diesem Gerät heruntergeladen`,
    feedbackHeading: "F E E D B A C K",
    feedbackIntro: "Hinterlasse eine kurze Notiz zu deinem Besuch — nur der Eigentümer kann sie lesen.",
    yourName: "Dein Name", yourEmail: "E-Mail (optional)", yourRating: "Bewertung", yourMessage: "Nachricht",
    submit: "Senden", sending: "Wird gesendet…", thanks: "Danke — deine Notiz wurde versiegelt.",
    adminUnlock: "Eigentümer-Zugang", adminPrompt: "Admin-Schlüssel eingeben", adminUnlockBtn: "Entsperren", adminEntries: "Einträge",
    bullets: {
      bank: [
        "C#/.NET-interne Anwendungen entwickelt, u. a. einen dynamischen Vertragsgenerator, der juristische Vorlagen automatisch mit Kundendaten befüllt.",
        "SSIS-ETL-Pipelines für automatisierte Datenmanipulation, E-Mail-/SMS-Versand und Reporting-Workflows aufgebaut.",
        "Excel- und PDF-Dateien in SQL Server geparst; mehrere Datenbanken für neue Features entworfen und normalisiert.",
        "REST-APIs für Unternehmensintegration entworfen: LDAP-Auth und automatisches Anlegen von JIRA-Tickets aus geparsten PDFs.",
        "Mit Docker containerisiert und deployt; CI/CD über GitLab verwaltet.",
        "Komplexe tägliche SQL-Transaktions-Abfragen optimiert und Laufzeit deutlich reduziert.",
      ],
      soft: [
        "Full-Stack-Weblösungen in W-Sprache (WEBDEV) mit ausgereiftem UI und robuster Backend-Logik geliefert.",
        "Große Produktionsdatenbanken in SSMS verwaltet — Datenintegrität, Performance und Fehlerbehebung gewährleistet.",
        "SQL-Abfragen entworfen und optimiert; XML-Datenquellen in verschiedenen Formaten integriert.",
        "An Agile/SCRUM-Lieferzyklen mitgewirkt, pünktliche Releases hoher Qualität.",
      ],
    },
  },
} as const;
type Lang = keyof typeof I18N;
type T = typeof I18N["en"];

function useI18n() {
  const [lang, setLang] = useState<Lang>(() => {
    if (typeof window === "undefined") return "en";
    const s = localStorage.getItem("lang") as Lang | null;
    return s && I18N[s] ? s : "en";
  });
  useEffect(() => { try { localStorage.setItem("lang", lang); } catch {} }, [lang]);
  return { lang, setLang, t: I18N[lang] as T };
}

function LangToggle({ lang, setLang }: { lang: Lang; setLang: (l: Lang) => void }) {
  const next: Record<Lang, Lang> = { en: "de", de: "en" };
  return (
    <button
      onClick={() => setLang(next[lang])}
      aria-label="Switch language"
      title={`Language: ${lang.toUpperCase()} — click to switch`}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold/50 text-gold hover:bg-gold/15 transition gap-1"
    >
      <Languages size={14} />
      <span className="text-[10px] font-bold tracking-wider">{lang.toUpperCase()}</span>
    </button>
  );
}

/* ───────── Decorative bits ───────── */

function CornerOrnament({ className = "", rotate = 0 }: { className?: string; rotate?: number }) {
  return (
    <svg viewBox="0 0 80 80" className={className} style={{ transform: `rotate(${rotate}deg)` }}>
      <g stroke="var(--gold)" strokeWidth="0.7" fill="none" opacity="0.75">
        <rect x="14" y="14" width="14" height="14" />
        <rect x="18" y="18" width="6" height="6" fill="var(--gold)" opacity="0.5" />
        <line x1="0" y1="21" x2="14" y2="21" />
        <line x1="21" y1="0" x2="21" y2="14" />
        <line x1="28" y1="21" x2="50" y2="21" strokeDasharray="2 3" />
        <line x1="21" y1="28" x2="21" y2="50" strokeDasharray="2 3" />
        <circle cx="50" cy="21" r="1.4" fill="var(--gold)" />
        <circle cx="21" cy="50" r="1.4" fill="var(--gold)" />
        <path d="M40 40 L46 34 L52 40 L46 46 Z" />
      </g>
    </svg>
  );
}

function SectionHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  return (
    <div id={id} className="mt-14 mb-5 scroll-mt-24">
      <h2 className="font-display tracking-[0.35em] text-gold-soft text-sm md:text-base font-semibold flex items-center gap-3">
        <span className="text-gold">◆</span>
        <span>{children}</span>
        <span className="flex-1 h-px bg-gold/40 ml-3" />
      </h2>
    </div>
  );
}

function SkillCol({ title, items }: { title: string; items: string[] }) {
  return (
    <div className="space-y-1.5">
      <h3 className="text-gold-soft font-semibold text-sm">{title}</h3>
      <ul className="text-[13.5px] leading-snug text-ink-soft space-y-1">
        {items.map((it) => <li key={it}>· {it}</li>)}
      </ul>
    </div>
  );
}

function Job({ role, company, period, bullets, dropCap = false }: { role: string; company: string; period: string; bullets: string[]; dropCap?: boolean }) {
  return (
    <article className="mt-5 rounded-lg border border-gold/30 bg-navy/42 backdrop-blur-md p-5 hover:border-gold/60 transition">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h3 className="font-bold text-ink text-[17px]">{role}</h3>
        <span className="italic text-gold text-sm">{period}</span>
      </div>
      <p className="text-gold-soft text-sm font-semibold mt-0.5">▸ {company}</p>
      <ul className="mt-2 space-y-1 text-[14px] text-ink-soft leading-snug">
        {bullets.map((b, i) => (
          <li key={i} className="flex gap-2">
            <span className="text-gold select-none">–</span>
            <span className={dropCap && i === 0 ? "drop-cap-wrap" : undefined}>
              {dropCap && i === 0 ? (
                <>
                  <span className="float-left font-display text-gold leading-none mr-1 select-none"
                    style={{ fontSize: "2.1rem", lineHeight: 0.82, marginTop: "0.04em", textShadow: "0 0 10px rgba(212,175,90,0.65)" }}>
                    {b[0]}
                  </span>
                  {b.slice(1)}
                </>
              ) : b}
            </span>
          </li>
        ))}
      </ul>
    </article>
  );
}

function EduCard({ title, sub, period }: { title: string; sub: string; period?: string }) {
  return (
    <div className="rounded-md border border-gold/25 bg-navy/34 backdrop-blur-sm p-3">
      <h4 className="font-bold text-ink text-[15px]">{title}</h4>
      {sub && <p className="text-sm text-ink-soft">{sub}</p>}
      {period && <p className="italic text-gold text-sm mt-0.5">{period}</p>}
    </div>
  );
}

type ProjectCategory = "Pentest" | "SOC" | "GRC" | "Network" | "Dev";
type ProjectReportLink = { label: string; file: string };
type ProjectT = { slug: string; title: string; stack: string; body: string; category: ProjectCategory; highlights?: string[]; reports?: ProjectReportLink[] };

const CATEGORY_COLORS: Record<ProjectCategory, string> = {
  Pentest: "rgba(255,100,80,0.8)", SOC: "rgba(100,180,255,0.8)",
  GRC: "rgba(212,175,90,0.9)", Network: "rgba(100,230,160,0.8)", Dev: "rgba(180,130,255,0.8)",
};

function ProjectCard({ p, t }: { p: ProjectT; t: T }) {
  const pdf = `/Reports/${p.slug}.pdf`;
  const reportLinks = p.reports && p.reports.length > 0 ? p.reports : [{ label: "Report PDF", file: pdf }];
  const primaryReport = reportLinks[0]?.file ?? pdf;
  const [tab, setTab] = useState<"overview" | "report">("overview");
  const stackBadges = p.stack.split(" · ");
  const catColor = CATEGORY_COLORS[p.category];
  return (
    <div className="rounded-lg border border-gold/25 bg-navy/38 backdrop-blur-md p-4 hover:border-gold/60 hover:bg-navy/52 transition flex flex-col">
      <div className="flex items-start justify-between gap-2 mb-0.5">
        <h3 className="font-bold text-ink text-[15.5px] flex-1">{p.title}</h3>
        <span className="shrink-0 text-[9.5px] uppercase tracking-wider px-2 py-0.5 rounded-full border"
          style={{ color: "rgba(255,255,255,0.90)", borderColor: catColor.replace("0.8","0.50"), background: catColor.replace("0.8","0.18") }}>
          {p.category}
        </span>
      </div>
      <p className="text-[12.5px] text-ink-soft font-mono mt-0.5">{p.stack}</p>
      <p className="text-[14px] text-ink-soft mt-1.5 flex gap-2 flex-1">
        <span className="text-gold">›</span><span>{p.body}</span>
      </p>
      <Dialog onOpenChange={() => setTab("overview")}>
        <DialogTrigger asChild>
          <button
            type="button"
            disabled
            className="mt-3 self-start inline-flex items-center gap-1.5 border border-gold/30 text-gold/60 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-wider rounded opacity-60 cursor-not-allowed"
          >
            <FileSearch size={13} /> {t.viewReport}
          </button>
        </DialogTrigger>
        <DialogContent className="max-w-5xl w-[95vw] h-[88vh] bg-navy-deep border-gold/40 p-0 flex flex-col">
          <DialogHeader className="px-5 pt-4 pb-0 border-b border-gold/20">
            <div className="flex items-start justify-between gap-3 pb-2 pr-10">
              <div>
                <DialogTitle className="text-gold-soft font-display tracking-wider">{p.title}</DialogTitle>
                <DialogDescription className="text-ink-soft text-xs mt-0.5">{p.category} · {p.stack.split(" · ").slice(0,3).join(" · ")}{p.stack.split(" · ").length > 3 ? " …" : ""}</DialogDescription>
              </div>
              <span className="shrink-0 text-[9px] uppercase tracking-widest px-2 py-1 rounded-full border"
                style={{ color: "rgba(255,255,255,0.90)", borderColor: catColor.replace("0.8","0.50"), background: catColor.replace("0.8","0.18") }}>
                {p.category}
              </span>
            </div>
            {/* tab strip */}
            <div className="flex gap-0 -mb-px">
              {(["overview","report"] as const).map((tb) => (
                <button key={tb} onClick={() => setTab(tb)}
                  className={`px-4 py-2 text-[11px] uppercase tracking-wider border-b-2 transition ${
                    tab === tb ? "border-gold text-gold-soft" : "border-transparent text-ink-soft/60 hover:text-ink-soft"
                  }`}>
                  {tb === "overview" ? "Case Study" : "Report PDF"}
                </button>
              ))}
            </div>
          </DialogHeader>

          <div className="flex-1 overflow-hidden">
            {tab === "overview" ? (
              <div className="h-full overflow-y-auto p-6 space-y-5">
                {/* summary */}
                <div className="rounded-lg border border-gold/20 bg-navy/34 p-4">
                  <h4 className="text-gold-soft text-xs uppercase tracking-[0.25em] mb-2">Overview</h4>
                  <p className="text-ink-soft text-sm leading-relaxed">{p.body}</p>
                </div>
                {/* stack badges */}
                <div>
                  <h4 className="text-gold-soft text-xs uppercase tracking-[0.25em] mb-2">Technologies</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {stackBadges.map((s) => (
                      <span key={s} className="px-2.5 py-1 text-[11px] rounded-sm text-ink"
                        style={{ borderTop: "2px solid rgba(212,175,90,0.60)", background: "rgba(212,175,90,0.07)" }}>
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
                {/* highlights if any */}
                {p.highlights && (
                  <div>
                    <h4 className="text-gold-soft text-xs uppercase tracking-[0.25em] mb-2">Key Outcomes</h4>
                    <ul className="space-y-1.5">
                      {p.highlights.map((h, i) => (
                        <li key={i} className="flex gap-2 text-[13.5px] text-ink-soft">
                          <span className="text-gold select-none mt-0.5">◆</span>
                          <span>{h}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
                {/* open report cta */}
                <button onClick={() => setTab("report")}
                  className="inline-flex items-center gap-2 border border-gold/50 text-gold-soft px-4 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 rounded transition">
                  <FileSearch size={13} /> View Full Report
                </button>
              </div>
            ) : (
              <div className="h-full flex flex-col bg-navy/40">
                {reportLinks.length > 1 && (
                  <div className="flex flex-wrap gap-2 border-b border-gold/20 p-4 bg-navy/30">
                    {reportLinks.map((report) => (
                      <a key={report.file} href={report.file} target="_blank" rel="noreferrer"
                        className="inline-flex items-center gap-2 border border-gold/50 text-gold-soft px-3 py-1.5 text-[11px] uppercase tracking-wider hover:bg-gold/10 rounded transition">
                        {report.label}
                      </a>
                    ))}
                  </div>
                )}
                <div className="flex-1">
                  <object data={`${primaryReport}#view=FitH`} type="application/pdf" className="w-full h-full" aria-label={`${p.title} report`}>
                    <div className="p-8 text-center text-ink-soft text-sm">
                      <p className="mb-3">No report uploaded yet.</p>
                      <p className="text-xs">Upload to <code className="text-gold">/public/Reports/{p.slug}.pdf</code> to enable preview.</p>
                    </div>
                  </object>
                </div>
              </div>
            )}
          </div>

          <div className="px-5 py-3 border-t border-gold/20 flex justify-end gap-2">
            <a href={primaryReport} target="_blank" rel="noreferrer"
               className="inline-flex items-center gap-1.5 border border-gold/50 text-gold-soft px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-gold/10 rounded">
              <FileText size={13} /> Open
            </a>
            <a href={primaryReport} download
               className="inline-flex items-center gap-1.5 bg-gold text-navy-deep px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-gold-soft rounded">
              <Download size={13} /> Download
            </a>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

const projects: ProjectT[] = [
  { slug: "pentest-lab", title: "Infrastructure Penetration Testing Lab", stack: "Kali · Nmap · Metasploit · Burp · Hydra · SQLMap · MITRE ATT&CK", body: "Full pentest lifecycle against Linux/Windows labs; exploited SQLi, weak auth, insecure configs, SMB vulns. Mapped to MITRE ATT&CK, scored via CVSS, produced professional reports.", category: "Pentest",
    highlights: ["Completed full kill-chain from recon to post-exploitation on isolated lab environments","Identified and exploited SQLi, broken auth, SMB misconfigurations, and insecure service configs","Mapped all findings to MITRE ATT&CK framework and scored each via CVSS v3","Produced an 18-page professional penetration test report with executive summary and remediation roadmap"] },
  { slug: "webapp-security", title: "Web Application Security Testing", stack: "Burp Suite · JWT · XSS · IDOR · OWASP Top 10", body: "Tested OWASP Top 10 against vulnerable apps; documented findings with severity ratings and mitigations.", category: "Pentest",
    reports: [
      { label: "Security Report", file: "/Reports/webapp-security-report.pdf" },
      { label: "Permission to Attack", file: "/Reports/webapp-security-pta.pdf" },
    ],
    highlights: ["Exploited all 10 OWASP Top 10 categories including JWT signature bypass and stored XSS","Documented each finding with CVSS scores, PoC screenshots, and developer-facing remediation steps"] },
  { slug: "firewall-proxy", title: "Firewall, Proxy & Network Security Lab", stack: "Linux · nftables · Squid · VMware · NAT · TCP/IP", body: "Segmented virtual enterprise networks; stateful firewall, NAT, DoS mitigation, Squid HTTPS proxying.", category: "Network",
    reports: [
      { label: "Firewall Report", file: "/Reports/firewall-proxy.pdf" },
    ],
    highlights: ["Designed a three-tier segmented network (DMZ / internal / management) using VMware","Configured nftables stateful rules for traffic filtering and DoS rate-limiting","Deployed Squid for HTTPS inspection with SSL bumping and content filtering"] },
  { slug: "siem-monitoring", title: "SIEM & Security Monitoring Lab", stack: "Wazuh · ELK · EDR/XDR · SOC Workflows", body: "Built SIEM for log collection, event correlation, alerting; simulated attacks to test detection coverage.", category: "SOC",
    highlights: ["Ingested logs from Windows, Linux, and network appliances into Wazuh + ELK stack","Created custom detection rules for brute-force, privilege escalation, and lateral movement","Simulated attacks and validated alert fidelity; tuned rules to reduce false-positive rate"] },
  { slug: "threat-modelling", title: "Threat Modelling — Mobile Banking App", stack: "STRIDE · DFDs · MITRE ATT&CK", body: "Complete threat model with DFDs, trust boundaries, STRIDE analysis; mitigation documentation.", category: "GRC",
    reports: [
      { label: "Mobile Banking Report", file: "/Reports/mobile-banking-application-report.pdf" },
    ],
    highlights: ["Produced full Level-0 and Level-1 data flow diagrams with trust boundary annotations","Applied STRIDE methodology to enumerate 24 threats across authentication, data storage, and API flows","Cross-referenced with MITRE ATT&CK Mobile to add real-world adversary context"] },
  { slug: "iso27001-audit", title: "ISO 27001 Mock Audit & ISMS Docs", stack: "ISO 27001 · 27002 · 27005 · CIS v8", body: "Mock internal audit; authored ISMS policies: classification, access control, business continuity.", category: "GRC",
    highlights: ["Authored 5 ISMS policy documents covering information classification, access control, and BCP","Conducted gap analysis against ISO 27001 Annex A controls; scored 73% initial compliance","Mapped controls to CIS Controls v8 for practical implementation guidance"] },
  { slug: "soc-incident", title: "Security Operations & Incident Analysis", stack: "SIEM · EDR/XDR · Windows Logs · PowerShell · Kill Chain", body: "Analysed phishing, PowerShell abuse, lateral movement; mapped to Kill Chain stages.", category: "SOC" },
  { slug: "pki-csharp", title: "PKI Implementation in C#", stack: "C# · .NET · OpenSSL · BouncyCastle · X.509 · RSA 4096", body: "PKI with Root CA and server certs (RSA 4096 / SHA-256); validated chains with custom trust stores.", category: "Dev",
    highlights: ["Built a two-tier PKI (Root CA + Issuing CA) using BouncyCastle in C# / .NET","Generated RSA 4096 / SHA-256 signed X.509 v3 certificates with custom extensions","Implemented chain validation against a custom trust store with CRL revocation checking"] },
  { slug: "vuln-assessment", title: "Vulnerability Assessment & Reporting", stack: "OpenVAS · CVSS", body: "Enterprise-like assessments; CVSS-scored findings with prioritised remediation reports.", category: "Pentest" },
  { slug: "linux-hardening", title: "Linux System Administration & Hardening", stack: "Ubuntu · nftables · Virtualisation", body: "Lab systems: routing, firewall, packet filtering; system hardening and secure configuration.", category: "Network",
    reports: [
      { label: "Network Segmentation", file: "/Reports/network-segmentation.pdf" },
    ] },
  { slug: "ccna-labs", title: "Network Security & CCNA Practice Labs", stack: "Cisco · IPv4 · Routing · Switching", body: "IPv4, routing, switching, segmentation labs; foundational networking for SOC operations.", category: "Network" },
  { slug: "digital-forensics", title: "Digital Forensics Investigation Labs", stack: "Volatility · Autopsy · Plaso · YARA · Wireshark · CAINE Linux · Mimikatz · PEFrame · Python · Windows Event Logs", body: "Memory and disk forensic investigations on Windows and Linux systems; reconstructed attack timelines, analysed malware samples, and produced professional forensic reports.", category: "SOC",
    highlights: ["Conducted memory and disk forensic investigations on Windows and Linux systems using industry-standard forensic tools.","Performed RAM analysis with Volatility to identify malicious processes, network connections, injected code, persistence mechanisms, and IOCs.","Investigated malware infections by reconstructing attack timelines from memory images, event logs, browser artifacts, registry hives, and file system metadata.","Analyzed malware samples using static and dynamic analysis techniques, including YARA rule matching, PE analysis, and Python bytecode inspection.","Performed BitLocker key extraction from memory, steganography analysis, and file system investigations using forensic methodologies.","Produced professional forensic reports documenting evidence acquisition, chain of custody, timeline reconstruction, findings, and remediation recommendations."] },
  { slug: "secure-networks", title: "Secure Networks Labs", stack: "Cisco IOS · Catalyst Switches · WLC · 802.1X · EAP-TLS · RADIUS/NPS · Active Directory · PKI · VLANs · ACLs · WLAN", body: "Designed and implemented secure enterprise network infrastructures using Cisco routers, switches, and wireless controllers with 802.1X access control.", category: "Network",
    reports: [
      { label: "Basic LAN & Switch Security", file: "/Reports/secure-networks-basic-lan-switch-sec.pdf" },
      { label: "WLAN 802.1X", file: "/Reports/secure-networks-wlan-802.1x.pdf" },
    ],
    highlights: ["Designed and implemented secure enterprise network infrastructures using Cisco routers, switches, and wireless controllers.","Configured VLANs, trunking, inter-VLAN routing, ACLs, DHCP, NAT, and secure Layer 2 switching.","Implemented IEEE 802.1X network access control using EAP-TLS, Microsoft NPS, Active Directory, and an internal PKI.","Configured machine certificate authentication, dynamic VLAN assignment, and Group Policy deployment for secure LAN access.","Deployed and integrated Cisco Wireless LAN Controllers (WLCs) with lightweight access points and secure wireless networks.","Configured switch security features including Port Security, BPDU Guard, DHCP Snooping, Dynamic ARP Inspection (DAI), and Spanning Tree protections.","Designed, tested, and troubleshot enterprise network connectivity while validating security policies through practical laboratory exercises."] },
];


/* ───────── Doors of Durin — solid 3D gates that swing INWARD ───────── */

// SVG viewBox 680×1040 — door is centered and sized to fill viewport height
const DOOR_DEPTH = 64;

function DoorPanel({ side, rotate, glow }: { side: "left" | "right"; rotate: any; glow: any }) {
  const isLeft = side === "left";
  const transform = useMotionTemplate`rotateY(${rotate}deg)`;

  // Absolute rotation 0→90 drives all lighting effects
  const absRot     = useTransform(rotate, (r: number) => Math.abs(r));
  const faceDim    = useTransform(absRot, [0, 90], [0, 0.56]);
  const edgeDark   = useTransform(absRot, [0, 6, 90], [0, 0.72, 1]);
  const specularOp = useTransform(absRot, [0, 8, 28, 90], [0, 0.9, 0.35, 0]);
  const rimLightOp = useTransform(absRot, [0, 12, 45, 90], [0, 0.55, 0.85, 0.65]);

  const archClip = isLeft
    ? "polygon(27% 97.31%, 27% 38.65%, 30.1% 32.9%, 35.3% 27.5%, 42.9% 22.6%, 62.6% 14.2%, 87% 6.6%, 100% 2.5%, 100% 97.31%)"
    : "polygon(0% 2.5%, 13% 6.6%, 37.4% 14.2%, 57.1% 22.6%, 64.7% 27.5%, 69.9% 32.9%, 73% 38.65%, 73% 97.31%, 0% 97.31%)";

  return (
    // preserve-3d needed for the side-face slab child
    <motion.div
      className="absolute top-0 h-full w-1/2"
      style={{
        [isLeft ? "left" : "right"]: 0,
        transformOrigin: isLeft ? "left center" : "right center",
        transformStyle: "preserve-3d",
        transform,
      } as any}
    >
      {/* SVG face */}
      <div className="absolute inset-0 overflow-hidden" style={{ clipPath: archClip }}>
        <CelestialGateSVG side={isLeft ? "left" : "right"} />
      </div>

      {/* Specular highlight — polished surface catching overhead ambient light, fades as door rotates away */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: specularOp,
          background: isLeft
            ? "linear-gradient(140deg, rgba(255,248,210,0.13) 0%, rgba(255,235,160,0.07) 28%, transparent 58%)"
            : "linear-gradient(220deg, rgba(255,248,210,0.13) 0%, rgba(255,235,160,0.07) 28%, transparent 58%)",
          clipPath: archClip,
        } as any}
      />

      {/* Glow — radial golden halo emanating from the seam side */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          opacity: glow,
          background: isLeft
            ? "radial-gradient(ellipse at 95% 42%, rgba(255,215,80,0.28) 0%, rgba(210,155,40,0.13) 35%, transparent 68%)"
            : "radial-gradient(ellipse at 5% 42%, rgba(255,215,80,0.28) 0%, rgba(210,155,40,0.13) 35%, transparent 68%)",
          clipPath: archClip,
        }}
      />

      {/* Diffuse darkening — face loses light as it tilts away from the viewer */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{ opacity: faceDim, background: "black", clipPath: archClip }}
      />

      {/* Inner-edge shadow — sharp shadow from the center seam inward */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLeft
            ? "linear-gradient(to left,  rgba(0,0,0,1) 0%, rgba(0,1,10,0.80) 5%, rgba(3,6,24,0.45) 16%, rgba(2,4,18,0.18) 30%, transparent 46%)"
            : "linear-gradient(to right, rgba(0,0,0,1) 0%, rgba(0,1,10,0.80) 5%, rgba(3,6,24,0.45) 16%, rgba(2,4,18,0.18) 30%, transparent 46%)",
          opacity: edgeDark,
          clipPath: archClip,
        } as any}
      />

      {/* Rim light — hinge edge catches cool ambient light as door swings open */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: isLeft
            ? "linear-gradient(to right, rgba(160,185,255,0.30) 0%, rgba(110,140,255,0.14) 2.5%, transparent 9%)"
            : "linear-gradient(to left,  rgba(160,185,255,0.30) 0%, rgba(110,140,255,0.14) 2.5%, transparent 9%)",
          opacity: rimLightOp,
          clipPath: archClip,
        } as any}
      />

      {/* SIDE FACE — clipPath breaks preserve-3d stacking context so we use
          top/height to clip to the arch height range instead.
          Pivot at the seam edge; free end extends into the door body. */}
      <div
        className="absolute"
        style={{
          width: `${DOOR_DEPTH}px`,
          top: "2.5%",
          height: "94.81%",
          [isLeft ? "right" : "left"]: 0,
          transformOrigin: isLeft ? "right center" : "left center",
          transform: isLeft ? "rotateY(-90deg)" : "rotateY(90deg)",
          background: isLeft
            ? `linear-gradient(to left,
                rgba(70,82,155,0.22)  0%,
                rgba(48,62,140,0.38)  4%,
                rgba(28,40,118,0.60)  14%,
                rgba(14,22,80,0.84)   36%,
                rgba(5,8,32,1)        72%,
                rgba(2,4,14,1)       100%)`
            : `linear-gradient(to right,
                rgba(70,82,155,0.22)  0%,
                rgba(48,62,140,0.38)  4%,
                rgba(28,40,118,0.60)  14%,
                rgba(14,22,80,0.84)   36%,
                rgba(5,8,32,1)        72%,
                rgba(2,4,14,1)       100%)`,
          boxShadow: isLeft
            ? "inset -6px 0 16px rgba(40,55,160,0.18), inset 6px 0 12px rgba(0,0,0,0.98)"
            : "inset  6px 0 16px rgba(40,55,160,0.18), inset -6px 0 12px rgba(0,0,0,0.98)",
        } as any}
      />
    </motion.div>
  );
}

/* ───────── Gothic Rose Window ───────── */

function StainedGlass({ progress }: { progress: any }) {
  const y = useTransform(progress, [0, 1], [30, 8]);
  const s = useTransform(progress, [0, 0.6, 1], [0.78, 0.96, 0.86]);
  const op = useTransform(progress, [0, 0.15, 1], [0, 0.55, 0.95]);
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2"
      style={{ top: "16%", width: "min(34vmin, 360px)", height: "min(50vmin, 520px)", y, scale: s, opacity: op }}
    >
      <div className="relative w-full h-full">
      <svg viewBox="0 0 200 320" className="w-full h-full" style={{ filter: "drop-shadow(0 0 22px rgba(80,70,200,0.65))" }}>
        <defs>
          <linearGradient id="sgB1" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0" stopColor="#08082e"/><stop offset="1" stopColor="#020212"/>
          </linearGradient>
          <linearGradient id="sgB2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#16082a"/><stop offset="1" stopColor="#07030e"/>
          </linearGradient>
          <linearGradient id="sgB3" x1="0" y1="0" x2="0.5" y2="1">
            <stop offset="0" stopColor="#0c0a26"/><stop offset="1" stopColor="#04030e"/>
          </linearGradient>
        </defs>

        {/* Stone arch — narrow lancet: sides nearly vertical until y≈240, then needle-point */}
        <path d="M10 320 L10 240 Q10 8 100 0 Q190 8 190 240 L190 320 Z"
          fill="#020108" stroke="#48446a" strokeWidth="5"/>
        <path d="M14 320 L14 238 Q14 12 100 6 Q186 12 186 238 L186 320 Z"
          fill="none" stroke="#5c5880" strokeWidth="1.2" opacity="0.28"/>

        {/* Rose outer ring */}
        <circle cx="100" cy="110" r="74" fill="none" stroke="#48446a" strokeWidth="5"/>
        <circle cx="100" cy="110" r="70" fill="none" stroke="#2e2a48" strokeWidth="1.4" opacity="0.4"/>

        {/* 8 petal panels */}
        {Array.from({length:8}).map((_,i) => {
          const a = (i/8)*Math.PI*2 - Math.PI/2;
          const px = 100 + Math.cos(a)*46;
          const py = 110 + Math.sin(a)*46;
          const fills = ["sgB1","sgB2","sgB3","sgB1","sgB2","sgB3","sgB1","sgB2"];
          return <circle key={i} cx={px} cy={py} r="21" fill={`url(#${fills[i]})`} stroke="#48446a" strokeWidth="2"/>;
        })}

        {/* 8 radial spokes (between petals) */}
        {Array.from({length:8}).map((_,i) => {
          const a = (i/8)*Math.PI*2 - Math.PI/2 + Math.PI/8;
          const x1 = 100 + Math.cos(a)*41;
          const y1 = 110 + Math.sin(a)*41;
          const x2 = 100 + Math.cos(a)*68;
          const y2 = 110 + Math.sin(a)*68;
          return <line key={`sp${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="#3c3860" strokeWidth="2.2" fill="none"/>;
        })}

        {/* Inner tracery ring + center void */}
        <circle cx="100" cy="110" r="41" fill="none" stroke="#48446a" strokeWidth="3.5"/>
        <circle cx="100" cy="110" r="38" fill="rgba(2,1,8,0.94)" stroke="#2e2a48" strokeWidth="1.5"/>

        {/* Transom */}
        <line x1="10" y1="192" x2="190" y2="192" stroke="#48446a" strokeWidth="4.5"/>
        <line x1="10" y1="196" x2="190" y2="196" stroke="#2e2a48" strokeWidth="1.2" opacity="0.32"/>

        {/* Center mullion */}
        <rect x="97" y="0" width="6" height="320" fill="#2a2640"/>
        <line x1="97" y1="0" x2="97" y2="320" stroke="#4c4870" strokeWidth="1"/>
        <line x1="103" y1="0" x2="103" y2="320" stroke="#1e1c30" strokeWidth="0.8" opacity="0.45"/>

        {/* Left lancet */}
        <path d="M18 194 L18 314 Q52 324 86 314 L86 194 Q52 183 18 194 Z"
          fill="url(#sgB1)" stroke="#48446a" strokeWidth="2.5"/>
        <path d="M26 202 L26 310 Q52 318 78 310 L78 202 Q52 196 26 202 Z"
          fill="none" stroke="#2e2a48" strokeWidth="1.1" opacity="0.5"/>
        <path d="M26 238 Q52 226 78 238" fill="none" stroke="#3c3860" strokeWidth="1.6"/>
        <path d="M26 272 Q52 260 78 272" fill="none" stroke="#3c3860" strokeWidth="1.3"/>
        {/* left quatrefoil */}
        <circle cx="52" cy="215" r="11" fill="url(#sgB2)" stroke="#3c3860" strokeWidth="1.3"/>
        <circle cx="52" cy="203" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>
        <circle cx="52" cy="227" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>
        <circle cx="40" cy="215" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>
        <circle cx="64" cy="215" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>

        {/* Right lancet */}
        <path d="M114 194 L114 314 Q148 324 182 314 L182 194 Q148 183 114 194 Z"
          fill="url(#sgB2)" stroke="#48446a" strokeWidth="2.5"/>
        <path d="M122 202 L122 310 Q148 318 174 310 L174 202 Q148 196 122 202 Z"
          fill="none" stroke="#2e2a48" strokeWidth="1.1" opacity="0.5"/>
        <path d="M122 238 Q148 226 174 238" fill="none" stroke="#3c3860" strokeWidth="1.6"/>
        <path d="M122 272 Q148 260 174 272" fill="none" stroke="#3c3860" strokeWidth="1.3"/>
        {/* right quatrefoil */}
        <circle cx="148" cy="215" r="11" fill="url(#sgB1)" stroke="#3c3860" strokeWidth="1.3"/>
        <circle cx="148" cy="203" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>
        <circle cx="148" cy="227" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>
        <circle cx="136" cy="215" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>
        <circle cx="160" cy="215" r="7.5" fill="url(#sgB3)" stroke="#3c3860" strokeWidth="1.1"/>
      </svg>
      {/* Eye at rose center: SVG (100,110) in 200×320 → 50% x, 34.375% y */}
      <div
        className="absolute pointer-events-none"
        style={{
          left: "50%",
          top: "34.375%",
          width: "min(14vmin, 148px)",
          height: "min(14vmin, 148px)",
          transform: "translate(-50%, -50%)",
        }}
      >
        <EyeOrnament className="w-full h-full" />
      </div>
      </div>
    </motion.div>
  );
}

function DoorsOfDurin({ settings, onKnock, slamKey }: { settings: GateSettings; onKnock: () => void; slamKey: number }) {
  const { scrollYProgress } = useScroll();
  // Spring for smooth zoom/approach — used for non-rotation animations
  const progress = useSpring(scrollYProgress, { stiffness: 80, damping: 24, mass: 0.4 });
  const doorProgress = useSpring(scrollYProgress, { stiffness: 55, damping: 18, mass: 0.9 });

  const swing = settings.swing;
  const glowMax = settings.glow;
  const beamMax = settings.beam;

  const tunnelScale = useTransform(progress, [0, 0.55, 1], [0.50, 1, 1.0]);
  const tunnelOpacity = useTransform(progress, [0, 0.05, 0.5, 1], [0.85, 1, 1, 1]);
  const zPush = useTransform(progress, [0, 1], [-180, 22]);

  // Inward swing past 90° — back face shows flat against the sides at 165°+.
  // Timing: start at 40% scroll, fully open at 92% so the open position is held longer.
  const leftRotate  = useTransform(doorProgress, [0, 0.92], [0, -swing], { clamp: true });
  const rightRotate = useTransform(doorProgress, [0, 0.92], [0,  swing], { clamp: true });
  const glow = useTransform(progress, [0, 0.15, 1], [0.15, glowMax * 0.55, glowMax]);
  const beamOpacity = useTransform(progress, [0, 0.45, 0.75, 1], [0, 0, beamMax * 0.4, beamMax]);
  const beamScale = useTransform(progress, [0, 1], [0.2, 1.8]);

  const knockedRef = useRef(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => {
    if (v > 0.78 && !knockedRef.current) {
      knockedRef.current = true;
      onKnock();
    } else if (v < 0.4 && knockedRef.current) {
      knockedRef.current = false;
    }
  });

  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden>
      <div className="absolute inset-0" style={{
        background: "radial-gradient(1600px 900px at 50% 50%, rgba(15,25,55,0.55), transparent 70%), radial-gradient(circle at 15% 12%, rgba(212,175,90,0.06), transparent 45%)",
      }} />
      <motion.div
        className="absolute left-1/2 top-1/2 rounded-full"
        style={{
          width: "70vmin", height: "70vmin",
          x: "-50%", y: "-50%",
          opacity: beamOpacity, scale: beamScale,
          background: "radial-gradient(circle, rgba(255,240,180,0.85), rgba(255,180,80,0.35) 35%, transparent 70%)",
          filter: "blur(28px)",
        }}
      />

      {/* PERSPECTIVE CONTAINER */}
      <div className="absolute inset-0" style={{ perspective: "600px", perspectiveOrigin: "50% 50%" }}>
        {/* SCALE + OPACITY WRAPPER (2D, no preserve-3d, no clip-path) */}
        <motion.div
          className="absolute inset-0"
          style={{ scale: tunnelScale, opacity: tunnelOpacity, transformOrigin: "50% 50%" } as any}
        >
          {/* DOOR: centered, maintains SVG 680×1040 aspect ratio, fills viewport height */}
          <div
            className="absolute"
            style={{
              left: "50%",
              top: "50%",
              transform: "translate(-50%, -50%)",
              height: "min(115vh, 1200px)",
              aspectRatio: "680 / 1040",
              perspective: "560px",
              perspectiveOrigin: "50% 42%",
            }}
          >
            {/* Rose window — behind panels, revealed as door swings open */}
            <div className="absolute inset-0">
              <StainedGlass progress={progress} />
            </div>

            {/* Door panels (3D) */}
            <motion.div
              key={slamKey}
              style={{
                position: "absolute", inset: 0,
                transformStyle: "preserve-3d",
                z: zPush as any,
                transformOrigin: "50% 50%",
              } as any}
            >
              <DoorPanel side="left"  rotate={leftRotate}  glow={glow} />
              <DoorPanel side="right" rotate={rightRotate} glow={glow} />
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* ───────── Tech stack icons (display only) ───────── */

const TECH = [
  { slug: "docker", label: "Docker" },
  { slug: "kalilinux", label: "Kali" },
  { slug: "burpsuite", label: "Burp Suite" },
  { slug: "dotnet", label: ".NET" },
  { slug: "csharp", label: "C#" },
  { slug: "python", label: "Python" },
  { slug: "linux", label: "Linux" },
  { slug: "wireshark", label: "Wireshark" },
  { slug: "metasploit", label: "Metasploit" },
  { slug: "gitlab", label: "GitLab" },
  { slug: "owasp", label: "OWASP" },
  { slug: "elastic", label: "ELK" },
];

function TechIconsRow({ t, onHover }: { t: T; onHover?: () => void }) {
  return (
    <div className="border border-gold/25 bg-navy/38 backdrop-blur-md rounded-xl p-5 relative overflow-hidden">
      <div className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent" />
      <h3 className="text-gold-soft text-xs uppercase tracking-[0.3em] mb-4 text-center">{t.tools}</h3>
      <div className="flex flex-wrap items-center justify-center gap-x-7 gap-y-5">
        {TECH.map((tk, i) => (
          <motion.div
            key={tk.slug}
            onMouseEnter={onHover}
            onFocus={onHover}
            tabIndex={0}
            className="group relative flex flex-col items-center gap-1.5 px-1.5 py-1 select-none outline-none cursor-default"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{
              opacity: 1, y: 0,
              filter: ["drop-shadow(0 0 0px var(--gold))", "drop-shadow(0 0 10px var(--gold))", "drop-shadow(0 0 3px var(--gold))"],
            }}
            whileHover={{ scale: 1.12, filter: "drop-shadow(0 0 12px var(--gold))" }}
            viewport={{ once: true, amount: 0.6 }}
            transition={{ delay: i * 0.06, duration: 0.9, ease: "easeOut" }}
          >
            <span aria-hidden className="pointer-events-none absolute inset-0 rounded-full opacity-40 blur-xl"
              style={{ background: "radial-gradient(circle at 50% 40%, var(--gold) 0%, transparent 60%)" }} />
            {tk.slug === "csharp" ? (
              <span aria-label="C#" className="relative z-10 h-8 w-8 flex items-center justify-center font-display font-bold text-[18px] text-gold"
                style={{ textShadow: "0 0 6px var(--gold)" }}>C#</span>
            ) : (
              <img src={`https://cdn.simpleicons.org/${tk.slug}/d4af5a`} alt={tk.label}
                className="h-8 w-8 opacity-90 transition relative z-10" loading="lazy"
                onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
            )}
            <span className="text-[10px] uppercase tracking-wider text-ink-soft relative z-10">{tk.label}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

/* ───────── Theme ───────── */
function useTheme() {
  const [theme, setTheme] = useState<"dark" | "candlelight">(() => {
    if (typeof window === "undefined") return "dark";
    const saved = localStorage.getItem("theme");
    return saved === "candlelight" ? "candlelight" : "dark";
  });
  const [wipeTrigger, setWipeTrigger] = useState(0);
  useEffect(() => {
    if (typeof document === "undefined") return;
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const toggle = () => {
    setTheme((t) => (t === "dark" ? "candlelight" : "dark"));
    setWipeTrigger((v) => v + 1);
  };
  return { theme, toggle, wipeTrigger };
}

function ThemeToggle({ theme, toggle }: { theme: string; toggle: () => void }) {
  const clicksRef = useRef<number[]>([]);
  const [bloodMoon, setBloodMoon] = useState(() =>
    typeof document !== "undefined" && document.documentElement.classList.contains("blood-moon")
  );
  const handleClick = () => {
    toggle();
    const now = Date.now();
    clicksRef.current = [...clicksRef.current.filter(t => now - t < 800), now];
    if (clicksRef.current.length >= 3) {
      clicksRef.current = [];
      const next = !document.documentElement.classList.contains("blood-moon");
      document.documentElement.classList.toggle("blood-moon", next);
      setBloodMoon(next);
    }
  };
  return (
    <button onClick={handleClick} aria-label="Toggle candlelight mode"
      title={bloodMoon ? "Blood moon rises · triple-click to dispel" : theme === "dark" ? "Light a candle · triple-click for blood moon" : "Snuff the candle"}
      className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold/50 text-gold hover:bg-gold/15 transition"
      style={bloodMoon ? { borderColor: "rgba(180,20,20,0.8)", color: "rgb(200,40,40)", boxShadow: "0 0 10px rgba(180,0,0,0.50)" } : {}}>
      {bloodMoon ? <Moon size={16} style={{ color: "rgb(200,40,40)" }} /> : theme === "dark" ? <Flame size={16} /> : <Moon size={16} />}
    </button>
  );
}

/* ───────── Gate settings ───────── */
type GateSettings = { swing: number; glow: number; beam: number };
const DEFAULT_GATE: GateSettings = { swing: 170, glow: 1, beam: 1 };

function useGateSettings() {
  const [s, setS] = useState<GateSettings>(() => {
    if (typeof window === "undefined") return DEFAULT_GATE;
    try {
      const raw = localStorage.getItem("gate_settings_v2");
      if (raw) return { ...DEFAULT_GATE, ...JSON.parse(raw) };
    } catch {}
    return DEFAULT_GATE;
  });
  useEffect(() => { try { localStorage.setItem("gate_settings_v2", JSON.stringify(s)); } catch {} }, [s]);
  return { settings: s, set: setS, reset: () => setS(DEFAULT_GATE) };
}

function GateSettingsPopover({ settings, onChange, onReset }: { settings: GateSettings; onChange: (s: GateSettings) => void; onReset: () => void }) {
  const row = (label: string, key: keyof GateSettings, min: number, max: number, step: number) => (
    <div className="space-y-1.5">
      <div className="flex items-center justify-between text-[11px] uppercase tracking-wider text-ink-soft">
        <span>{label}</span>
        <span className="text-gold-soft">{key === "swing" ? `${Math.round(settings[key])}°` : settings[key].toFixed(2)}</span>
      </div>
      <Slider min={min} max={max} step={step} value={[settings[key]]}
        onValueChange={([v]) => onChange({ ...settings, [key]: v })} />
    </div>
  );
  return (
    <Popover>
      <PopoverTrigger asChild>
        <button aria-label="Gate settings" title="Gate settings"
          className="inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold/50 text-gold hover:bg-gold/15 transition">
          <Settings2 size={16} />
        </button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72 bg-navy-deep/95 backdrop-blur-md border-gold/40 text-ink">
        <div className="space-y-4">
          <div>
            <h4 className="font-display tracking-[0.25em] text-gold-soft text-xs uppercase">Gate Mechanics</h4>
            <p className="text-[11px] text-ink-soft/80 mt-1">Tune how the doors open as you scroll.</p>
          </div>
          {row("Swing", "swing", 60, 175, 1)}
          {row("Carving glow", "glow", 0.3, 1, 0.05)}
          {row("Light beam", "beam", 0.2, 1, 0.05)}
          <button onClick={onReset}
            className="w-full text-[11px] uppercase tracking-wider border border-gold/40 text-gold-soft hover:bg-gold/10 rounded px-3 py-1.5">
            Reset to default
          </button>
        </div>
      </PopoverContent>
    </Popover>
  );
}

/* ───────── Scroll indicator — rune pillar with climbing orb ───────── */
function ScrollTorch() {
  const { scrollYProgress } = useScroll();
  const mounted = useMounted();
  const [tick, setTick] = useState(0);

  const fillNum = useTransform(scrollYProgress, [0, 1], [0, 84]);
  const fillH = useMotionTemplate`${fillNum}px`;
  const orbTop = useTransform(scrollYProgress, [0, 1], [88, 4]);
  const orbTopStr = useMotionTemplate`${orbTop}px`;
  const glowOp = useTransform(scrollYProgress, [0, 0.08, 1], [0.18, 0.55, 1.0]);

  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setTick((t) => (t + 1) % 120), 80);
    return () => clearInterval(id);
  }, [mounted]);

  if (!mounted) return null;

  const p = 0.88 + ((tick * 43) % 30) * 0.004;
  const glow = `drop-shadow(0 0 ${(2.8 * p).toFixed(1)}px rgba(212,175,90,0.90)) drop-shadow(0 0 ${(5 * p).toFixed(1)}px rgba(212,175,90,0.35))`;

  return (
    <motion.div aria-hidden
      className="pointer-events-none fixed right-2 top-1/2 -translate-y-1/2 z-50"
      style={{ opacity: glowOp, filter: glow }}>
      {/* Static SVG structure */}
      <svg width="20" height="116" viewBox="0 0 20 116" fill="none">
        {/* Top crown diamond */}
        <polygon points="10,1 17,8 10,15 3,8" fill="rgba(212,175,90,0.85)" />
        <polygon points="10,3 15,8 10,13 5,8" fill="none" stroke="rgba(255,245,190,0.45)" strokeWidth="0.5" />
        <polygon points="10,5 13,8 10,11 7,8" fill="rgba(255,248,200,0.55)" />
        {/* Top bracket */}
        <rect x="4" y="14" width="12" height="2.5" rx="0.8" fill="rgba(212,175,90,0.50)" />
        {/* Rail track */}
        <rect x="9" y="16" width="2" height="84" rx="1" fill="rgba(212,175,90,0.10)" />
        {/* Section marks */}
        <line x1="5" y1="37" x2="15" y2="37" stroke="rgba(212,175,90,0.28)" strokeWidth="0.7" />
        <line x1="6" y1="58" x2="14" y2="58" stroke="rgba(212,175,90,0.28)" strokeWidth="0.7" />
        <line x1="5" y1="79" x2="15" y2="79" stroke="rgba(212,175,90,0.28)" strokeWidth="0.7" />
        {/* Bottom bracket */}
        <rect x="4" y="100" width="12" height="2.5" rx="0.8" fill="rgba(212,175,90,0.50)" />
        {/* Base */}
        <polygon points="3,103 17,103 15,109 10,115 5,109" fill="rgba(212,175,90,0.60)" />
        <polygon points="10,103 17,103 15,109 10,112" fill="rgba(255,245,180,0.22)" />
      </svg>

      {/* Animated fill — grows from bottom as you scroll */}
      <div className="absolute" style={{ left: 9, top: 16, width: 2, height: 84, overflow: "hidden", borderRadius: 1 }}>
        <motion.div className="absolute bottom-0 left-0 right-0"
          style={{
            height: fillH,
            background: "linear-gradient(to top, rgba(212,175,90,0.92), rgba(255,215,100,0.18))",
          }} />
      </div>

      {/* Climbing diamond orb — moves up as you scroll */}
      <motion.div className="absolute" style={{ left: 4, top: orbTopStr, width: 12, height: 12 }}>
        <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
          <polygon points="6,0 12,6 6,12 0,6" fill="rgba(212,175,90,0.95)" />
          <polygon points="6,0 12,6 6,12 0,6" fill="none" stroke="rgba(255,245,190,0.55)" strokeWidth="0.6" />
          <polygon points="6,2.5 9.5,6 6,9.5 2.5,6" fill="rgba(255,248,200,0.60)" />
        </svg>
      </motion.div>
    </motion.div>
  );
}

/* ───────── CV downloads (server-persisted) ───────── */
function useCvDownloads() {
  const [count, setCount] = useState(0);
  const fetchCount = getCvDownloadCount;
  const trackFn = trackCvDownload;
  useEffect(() => {
    fetchCount().then((r) => setCount(r.count)).catch(() => {});
  }, [fetchCount]);
  const track = async () => {
    setCount((c) => c + 1); // optimistic
    try {
      const r = await trackFn({
        data: {
          userAgent: typeof navigator !== "undefined" ? navigator.userAgent.slice(0, 500) : undefined,
          referrer: typeof document !== "undefined" ? document.referrer.slice(0, 500) : undefined,
        },
      });
      setCount(r.count);
    } catch {}
  };
  return { count, track };
}

/* ───────── Floating particles — client-only (no SSR), brighter, twinkly ───────── */
function useMounted() {
  const [m, setM] = useState(false);
  useEffect(() => setM(true), []);
  return m;
}

function Embers() {
  const mounted = useMounted();
  const particles = useMemo(
    () => Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 100,
      delay: Math.random() * 8,
      duration: 10 + Math.random() * 12,
      size: 3 + Math.random() * 4,
      drift: (Math.random() - 0.5) * 60,
    })),
    [],
  );
  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden style={{ opacity: 1, transition: "opacity 0.35s ease-out", willChange: "opacity" }}>
      {particles.map((p, i) => (
        <motion.span key={i} className="absolute rounded-full"
          style={{
            left: `${p.x}%`, bottom: "-10px",
            width: p.size, height: p.size,
            background: "rgba(255,180,80,1)",
            boxShadow: `0 0 ${p.size * 6}px rgba(255,120,40,0.95), 0 0 ${p.size * 14}px rgba(255,80,20,0.5)`,
          }}
          initial={{ y: 0, opacity: 0 }}
          animate={{ y: ["0vh", "-105vh"], x: [0, p.drift, -p.drift, 0], opacity: [0, 1, 1, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: "linear" }}
        />
      ))}
    </div>
  );
}

function Starfield() {
  const mounted = useMounted();
  const stars = useMemo(
    () => Array.from({ length: 130 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      r: 1 + Math.random() * 2.6,
      delay: Math.random() * 6,
      duration: 2 + Math.random() * 4,
    })),
    [],
  );
  const shooters = useMemo(
    () => Array.from({ length: 4 }).map((_, i) => ({ top: 5 + Math.random() * 55, delay: i * 6 + Math.random() * 4 })),
    [],
  );
  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden style={{ opacity: 1, transition: "opacity 0.35s ease-out", willChange: "opacity" }}>
      {stars.map((s, i) => (
        <motion.span key={i} className="absolute rounded-full"
          style={{
            left: `${s.x}%`, top: `${s.y}%`,
            width: s.r, height: s.r,
            background: "rgba(255,240,200,1)",
            boxShadow: `0 0 ${s.r * 5}px rgba(240,217,138,0.95), 0 0 ${s.r * 12}px rgba(212,175,90,0.5)`,
          }}
          animate={{ opacity: [0.25, 1, 0.25], scale: [0.85, 1.2, 0.85] }}
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: "easeInOut" }}
        />
      ))}
      {shooters.map((sh, i) => (
        <motion.span key={`sh-${i}`} className="absolute h-px"
          style={{
            top: `${sh.top}%`, left: "-20%", width: "22vw",
            background: "linear-gradient(90deg, transparent, rgba(255,245,210,1), transparent)",
            boxShadow: "0 0 12px var(--gold-soft)",
          }}
          animate={{ x: ["0vw", "140vw"], opacity: [0, 1, 0] }}
          transition={{ duration: 1.6, delay: sh.delay, repeat: Infinity, repeatDelay: 12, ease: "easeOut" }}
        />
      ))}
    </div>
  );
}

function AmbientLayer({ theme, doorsOpen }: { theme: "dark" | "candlelight"; doorsOpen: boolean }) {
  return (
    <>
      {theme === "candlelight" ? <Embers /> : <Starfield />}
      <AnimatePresence>
        {!doorsOpen && theme === "dark" && <DarkMystAura key="dark-aura" show />}
        {!doorsOpen && theme === "candlelight" && <CandleMysticGlow key="candle-glow" show />}
      </AnimatePresence>
    </>
  );
}

/* ───────── Moon phase clock ───────── */
function getMoonPhase(): { phase: number; name: string; emoji: string } {
  const now = new Date();
  // Known new moon: Jan 6 2000 18:14 UTC (JD 2451549.26)
  const synodicMonth = 29.53058867;
  const jd = (now.getTime() / 86400000) + 2440587.5;
  const daysSince = jd - 2451549.26;
  const phase = ((daysSince % synodicMonth) + synodicMonth) % synodicMonth;
  const frac = phase / synodicMonth;
  const names = ["New Moon","Waxing Crescent","First Quarter","Waxing Gibbous","Full Moon","Waning Gibbous","Last Quarter","Waning Crescent"];
  const emojis = ["🌑","🌒","🌓","🌔","🌕","🌖","🌗","🌘"];
  const idx = Math.floor(frac * 8) % 8;
  return { phase: frac, name: names[idx], emoji: emojis[idx] };
}

function MoonPhaseClock() {
  const mounted = useMounted();
  const [now, setNow] = useState(() => new Date());
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, [mounted]);
  if (!mounted) return null;
  const { phase, name } = getMoonPhase();
  const illum = Math.sin(phase * Math.PI);
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const dateStr = now.toLocaleDateString([], { month: "short", day: "numeric" });
  // SVG moon: illuminated crescent/full/gibbous using two circles technique
  const wax = phase < 0.5; // waxing = light on right
  const r = 14;
  const cx = 20, cy = 20;
  // Inner shadow oval — controls how much is lit
  const innerRx = Math.abs(Math.cos(phase * Math.PI * 2)) * r;
  const fullOrNew = phase < 0.03 || phase > 0.97;
  return (
    <div className="flex flex-col items-center gap-1 px-3 py-2 rounded-xl border border-gold/20 bg-navy/30 backdrop-blur-sm"
      style={{ minWidth: 72 }}>
      <svg width="40" height="40" viewBox="0 0 40 40">
        <defs>
          <mask id="moonMask">
            <circle cx={cx} cy={cy} r={r} fill="white"/>
            {!fullOrNew && (
              <ellipse cx={wax ? cx - innerRx * 0.15 : cx + innerRx * 0.15} cy={cy}
                rx={innerRx} ry={r} fill="black"/>
            )}
            {fullOrNew && phase < 0.5 && <circle cx={cx} cy={cy} r={r} fill="black"/>}
          </mask>
        </defs>
        {/* Dark moon outline */}
        <circle cx={cx} cy={cy} r={r} fill="rgba(20,20,40,0.85)" stroke="rgba(212,175,90,0.22)" strokeWidth="0.8"/>
        {/* Lit portion */}
        <circle cx={cx} cy={cy} r={r} fill={`rgba(255,245,200,${0.55 + illum * 0.35})`} mask="url(#moonMask)"/>
        {/* Subtle craters on lit side */}
        {[{x:cx+4,y:cy-5,r:2},{x:cx-3,y:cy+4,r:1.5},{x:cx+7,y:cy+3,r:1}].map((c,i) => (
          <circle key={i} cx={c.x} cy={c.y} r={c.r}
            fill="rgba(200,185,120,0.25)" mask="url(#moonMask)"/>
        ))}
        {/* Glow */}
        <circle cx={cx} cy={cy} r={r+3} fill="none" stroke={`rgba(255,240,160,${0.08+illum*0.12})`} strokeWidth="2"/>
      </svg>
      <span className="text-[9px] uppercase tracking-widest text-gold/60 text-center leading-tight">{name}</span>
      <span className="text-[11px] text-gold/80 font-mono">{timeStr}</span>
      <span className="text-[9px] text-gold/40">{dateStr}</span>
    </div>
  );
}

/* ───────── Zodiac Wheel footer ornament ───────── */
// Each zodiac glyph drawn as SVG path in a 16×16 coordinate space, centered at (8,8)
const ZODIAC_GLYPHS: { name: string; d: string }[] = [
  { name: "Aries",       d: "M8,3 Q4,3 4,7 Q4,11 8,11 Q12,11 12,7 Q12,3 8,3 M8,3 L8,0 M5,5 L3,3 M11,5 L13,3" },
  { name: "Taurus",      d: "M4,10 Q4,6 8,6 Q12,6 12,10 Q12,14 8,14 Q4,14 4,10 M5,6 Q6,2 4,2 M11,6 Q10,2 12,2" },
  { name: "Gemini",      d: "M3,2 L3,14 M13,2 L13,14 M3,2 L13,2 M3,8 L13,8 M3,14 L13,14" },
  { name: "Cancer",      d: "M3,6 Q8,2 13,6 M3,10 Q8,14 13,10 M5,6 Q5,9 8,9 Q11,9 11,6 M5,10 Q5,7 8,7 Q11,7 11,10" },
  { name: "Leo",         d: "M4,5 Q4,2 7,2 Q10,2 10,5 Q10,8 7,8 L7,9 Q7,12 9,14 Q12,14 13,12" },
  { name: "Virgo",       d: "M3,3 L3,11 Q3,14 6,14 Q9,14 9,11 Q9,14 12,14 Q15,14 15,11 L15,3 M15,11 Q16,15 14,15" },
  { name: "Libra",       d: "M3,9 Q3,5 8,5 Q13,5 13,9 M5,9 Q5,13 8,13 Q11,13 11,9 M1,15 L15,15" },
  { name: "Scorpio",     d: "M3,3 L3,11 Q3,14 6,14 Q9,14 9,11 Q9,14 12,14 Q15,14 15,11 L15,7 L18,10 M15,7 L18,4" },
  { name: "Sagittarius", d: "M2,14 L14,2 M14,2 L9,2 M14,2 L14,7 M5,5 L10,10" },
  { name: "Capricorn",   d: "M2,3 Q3,9 6,12 Q8,15 9,12 Q9,8 6,8 Q3,8 3,12 L5,15 M9,8 Q11,7 12,5 Q14,2 13,2" },
  { name: "Aquarius",    d: "M2,7 Q4.5,5 7,7 Q9.5,9 12,7 Q14.5,5 16,7 M2,11 Q4.5,9 7,11 Q9.5,13 12,11 Q14.5,9 16,11" },
  { name: "Pisces",      d: "M8,1 L8,15 M3,1 Q0,8 3,15 M13,1 Q16,8 13,15" },
];

function ZodiacWheelOrnament() {
  const mounted = useMounted();
  const rotRef = useRef<SVGGElement>(null);
  const frameRef = useRef<number>(0);
  const angleRef = useRef(0);

  useEffect(() => {
    if (!mounted) return;
    const tick = () => {
      angleRef.current += 0.025;
      if (rotRef.current) rotRef.current.setAttribute("transform", `rotate(${angleRef.current}, 90, 90)`);
      frameRef.current = requestAnimationFrame(tick);
    };
    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
  }, [mounted]);

  if (!mounted) return null;
  const CX = 90, CY = 90, R_SIGN = 72, R_DOT = 64;

  return (
    <div className="select-none" style={{ width: 180, height: 180 }}>
      <svg viewBox="0 0 180 180" className="w-full h-full">
        {/* Static rings */}
        <circle cx={CX} cy={CY} r="86" fill="none" stroke="rgba(212,175,90,0.14)" strokeWidth="0.6"/>
        <circle cx={CX} cy={CY} r="80" fill="none" stroke="rgba(212,175,90,0.22)" strokeWidth="1.0"/>
        <circle cx={CX} cy={CY} r="58" fill="none" stroke="rgba(212,175,90,0.16)" strokeWidth="0.7"/>
        <circle cx={CX} cy={CY} r="28" fill="rgba(4,8,22,0.55)" stroke="rgba(212,175,90,0.28)" strokeWidth="0.8"/>
        {/* Static 12 section dividers */}
        {Array.from({length:12},(_,i) => {
          const a = (i/12)*Math.PI*2;
          return <line key={i}
            x1={CX+Math.cos(a)*58} y1={CY+Math.sin(a)*58}
            x2={CX+Math.cos(a)*80} y2={CY+Math.sin(a)*80}
            stroke="rgba(212,175,90,0.18)" strokeWidth="0.6"/>;
        })}
        {/* Static center star */}
        <polygon points={`${CX},${CY-12} ${CX+3.5},${CY-3.5} ${CX+12},${CY} ${CX+3.5},${CY+3.5} ${CX},${CY+12} ${CX-3.5},${CY+3.5} ${CX-12},${CY} ${CX-3.5},${CY-3.5}`}
          fill="rgba(212,175,90,0.22)" stroke="rgba(212,175,90,0.45)" strokeWidth="0.5"/>
        <circle cx={CX} cy={CY} r="4" fill="rgba(212,175,90,0.55)"/>

        {/* Rotating group: glyph icons + dot markers */}
        <g ref={rotRef}>
          {ZODIAC_GLYPHS.map((z, i) => {
            const a = (i / 12) * Math.PI * 2 - Math.PI / 2;
            const sx = CX + Math.cos(a) * R_SIGN;
            const sy = CY + Math.sin(a) * R_SIGN;
            const dx = CX + Math.cos(a) * R_DOT;
            const dy = CY + Math.sin(a) * R_DOT;
            const rot = (i / 12) * 360 + 90; // keep glyph upright relative to wheel spoke
            return (
              <g key={i}>
                {/* Dot marker on inner track */}
                <circle cx={dx} cy={dy} r="1.8" fill="rgba(212,175,90,0.55)"/>
                {/* Glyph icon */}
                <g transform={`translate(${sx - 8}, ${sy - 8}) rotate(${rot}, 8, 8)`}>
                  <path d={z.d} fill="none" stroke="rgba(212,175,90,0.80)" strokeWidth="1.3"
                    strokeLinecap="round" strokeLinejoin="round"/>
                </g>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}

/* ───────── Cathedral window frame — gothic tracery overlay at viewport edges ───────── */
function CathedralFrame() {
  const mounted = useMounted();
  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[6] overflow-hidden" aria-hidden>
      <svg className="absolute inset-0 w-full h-full" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMid meet" style={{ opacity: 0.38 }}>
        {/* Top-left corner arch tracery */}
        <g fill="none" stroke="rgba(212,175,90,0.55)" strokeWidth="0.8">
          <path d="M 0,0 L 0,180 Q 0,220 40,220 L 160,220 Q 200,220 200,180 L 200,0"/>
          <path d="M 8,0 L 8,178 Q 8,212 40,212 L 160,212 Q 192,212 192,178 L 192,0"/>
          <path d="M 0,0 Q 0,80 100,80 Q 200,80 200,0"/>
          {/* Trefoil top-left */}
          <circle cx="100" cy="60" r="22"/>
          <circle cx="68" cy="68" r="14"/>
          <circle cx="132" cy="68" r="14"/>
          <circle cx="100" cy="100" r="10" fill="rgba(212,175,90,0.06)"/>
          {/* Corner diamond */}
          <polygon points="0,0 18,18 0,36 -18,18" transform="translate(10,10)" fill="rgba(212,175,90,0.08)" stroke="rgba(212,175,90,0.4)"/>
          {/* Side tracery left */}
          <line x1="0" y1="40" x2="30" y2="40"/>
          <line x1="0" y1="80" x2="30" y2="80"/>
          <line x1="0" y1="120" x2="30" y2="120"/>
          <line x1="0" y1="160" x2="30" y2="160"/>
          <circle cx="15" cy="40" r="4"/>
          <circle cx="15" cy="80" r="4"/>
          <circle cx="15" cy="120" r="4"/>
          <circle cx="15" cy="160" r="4"/>
        </g>
        {/* Top-right corner arch tracery — mirror */}
        <g fill="none" stroke="rgba(212,175,90,0.55)" strokeWidth="0.8" transform="translate(1000,0) scale(-1,1)">
          <path d="M 0,0 L 0,180 Q 0,220 40,220 L 160,220 Q 200,220 200,180 L 200,0"/>
          <path d="M 8,0 L 8,178 Q 8,212 40,212 L 160,212 Q 192,212 192,178 L 192,0"/>
          <path d="M 0,0 Q 0,80 100,80 Q 200,80 200,0"/>
          <circle cx="100" cy="60" r="22"/>
          <circle cx="68" cy="68" r="14"/>
          <circle cx="132" cy="68" r="14"/>
          <circle cx="100" cy="100" r="10" fill="rgba(212,175,90,0.06)"/>
          <polygon points="0,0 18,18 0,36 -18,18" transform="translate(10,10)" fill="rgba(212,175,90,0.08)" stroke="rgba(212,175,90,0.4)"/>
          <line x1="0" y1="40" x2="30" y2="40"/>
          <line x1="0" y1="80" x2="30" y2="80"/>
          <line x1="0" y1="120" x2="30" y2="120"/>
          <line x1="0" y1="160" x2="30" y2="160"/>
          <circle cx="15" cy="40" r="4"/>
          <circle cx="15" cy="80" r="4"/>
          <circle cx="15" cy="120" r="4"/>
          <circle cx="15" cy="160" r="4"/>
        </g>
        {/* Bottom-left corner — inverted */}
        <g fill="none" stroke="rgba(212,175,90,0.45)" strokeWidth="0.7" transform="translate(0,700) scale(1,-1)">
          <path d="M 0,0 L 0,130 Q 0,160 30,160 L 120,160 Q 150,160 150,130 L 150,0"/>
          <path d="M 6,0 L 6,128 Q 6,154 30,154 L 120,154 Q 144,154 144,128 L 144,0"/>
          <path d="M 0,0 Q 0,55 75,55 Q 150,55 150,0"/>
          <circle cx="75" cy="40" r="16"/>
          <circle cx="50" cy="47" r="10"/>
          <circle cx="100" cy="47" r="10"/>
          <polygon points="0,0 14,14 0,28 -14,14" transform="translate(8,8)" fill="rgba(212,175,90,0.06)" stroke="rgba(212,175,90,0.35)"/>
        </g>
        {/* Bottom-right corner — inverted mirror */}
        <g fill="none" stroke="rgba(212,175,90,0.45)" strokeWidth="0.7" transform="translate(1000,700) scale(-1,-1)">
          <path d="M 0,0 L 0,130 Q 0,160 30,160 L 120,160 Q 150,160 150,130 L 150,0"/>
          <path d="M 6,0 L 6,128 Q 6,154 30,154 L 120,154 Q 144,154 144,128 L 144,0"/>
          <path d="M 0,0 Q 0,55 75,55 Q 150,55 150,0"/>
          <circle cx="75" cy="40" r="16"/>
          <circle cx="50" cy="47" r="10"/>
          <circle cx="100" cy="47" r="10"/>
          <polygon points="0,0 14,14 0,28 -14,14" transform="translate(8,8)" fill="rgba(212,175,90,0.06)" stroke="rgba(212,175,90,0.35)"/>
        </g>
        {/* Top center crown ornament */}
        <g fill="none" stroke="rgba(212,175,90,0.38)" strokeWidth="0.7" transform="translate(500,0)">
          <line x1="0" y1="0" x2="0" y2="28"/>
          <line x1="-80" y1="0" x2="-80" y2="18"/>
          <line x1="80" y1="0" x2="80" y2="18"/>
          <path d="M -80,18 Q -40,40 0,28 Q 40,40 80,18"/>
          <circle cx="0" cy="14" r="6" fill="rgba(212,175,90,0.10)"/>
          <circle cx="-80" cy="9" r="4"/>
          <circle cx="80" cy="9" r="4"/>
          {[-160,-120,-40,40,120,160].map((x,i) => (
            <g key={i}>
              <line x1={x} y1="0" x2={x} y2="8"/>
              <circle cx={x} cy="4" r="2.5"/>
            </g>
          ))}
        </g>
        {/* Thin outer border */}
        <rect x="2" y="2" width="996" height="696" fill="none" stroke="rgba(212,175,90,0.12)" strokeWidth="0.5"/>
        <rect x="6" y="6" width="988" height="688" fill="none" stroke="rgba(212,175,90,0.06)" strokeWidth="0.3"/>
      </svg>
    </div>
  );
}

/* ───────── Aurora borealis — slow drifting celestial light bands ───────── */
function AuroraLayer() {
  return (
    <div className="pointer-events-none fixed inset-0 overflow-hidden" style={{ zIndex: 1 }} aria-hidden>
      <motion.div
        className="absolute"
        style={{
          width: "220%", height: "38%", top: "2%", left: "-60%",
          background: "radial-gradient(ellipse 55% 100% at 40% 50%, rgba(40,160,130,0.18) 0%, rgba(60,40,160,0.14) 55%, transparent 80%)",
          filter: "blur(36px)",
        }}
        animate={{ x: [0, 120, -60, 0], opacity: [0.85, 1, 0.90, 0.85] }}
        transition={{ duration: 26, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "190%", height: "28%", top: "18%", left: "-45%",
          background: "radial-gradient(ellipse 65% 80% at 60% 50%, rgba(70,40,180,0.16) 0%, rgba(120,60,180,0.12) 55%, transparent 80%)",
          filter: "blur(44px)",
        }}
        animate={{ x: [0, -90, 70, 0], opacity: [0.70, 0.95, 0.80, 0.70] }}
        transition={{ duration: 33, repeat: Infinity, ease: "easeInOut", delay: 6 }}
      />
      <motion.div
        className="absolute"
        style={{
          width: "200%", height: "32%", top: "8%", left: "-50%",
          background: "radial-gradient(ellipse 80% 60% at 50% 50%, rgba(30,160,200,0.12) 0%, rgba(60,30,140,0.10) 60%, transparent 80%)",
          filter: "blur(50px)",
        }}
        animate={{ x: [0, 70, -100, 0], opacity: [0.60, 0.80, 0.65, 0.60] }}
        transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", delay: 14 }}
      />
    </div>
  );
}

/* ───────── Heavenly rays — golden light fans from arch at mid-scroll ───────── */
function HeavenlyRays() {
  const { scrollYProgress } = useScroll();
  const mounted = useMounted();
  const [inRange, setInRange] = useState(false);
  useMotionValueEvent(scrollYProgress, "change", (v) => setInRange(v > 0.36 && v < 0.78));
  const opacity = useTransform(scrollYProgress, [0.38, 0.50, 0.60, 0.75], [0, 1, 0.85, 0], { clamp: true });
  if (!mounted || !inRange) return null;
  const RAYS = 11;
  return (
    <motion.div
      className="pointer-events-none fixed inset-x-0 top-0 z-[2]"
      style={{ opacity, height: "100vh" }}
      aria-hidden
    >
      <svg width="100%" height="100%" viewBox="0 0 1000 700" preserveAspectRatio="xMidYMin meet">
        <defs>
          <radialGradient id="rayGrad" cx="50%" cy="0%" r="100%" fx="50%" fy="0%">
            <stop offset="0%" stopColor="rgba(255,230,120,0.55)"/>
            <stop offset="40%" stopColor="rgba(212,175,90,0.18)"/>
            <stop offset="100%" stopColor="rgba(212,175,90,0)"/>
          </radialGradient>
        </defs>
        {/* Individual ray beams fanning from center top */}
        {Array.from({length:RAYS},(_,i) => {
          const t = (i/(RAYS-1)) - 0.5; // -0.5 to 0.5
          const spread = 0.65;
          const x1 = 500; const y1 = 0;
          const x2 = 500 + t * spread * 1400;
          const y2 = 750;
          return (
            <line key={i} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="rgba(255,225,110,0.08)" strokeWidth={i===5?18:i===4||i===6?12:8}
              strokeLinecap="round"/>
          );
        })}
        {/* Broad central radial overlay */}
        <ellipse cx="500" cy="-60" rx="420" ry="600" fill="url(#rayGrad)" opacity="0.45"/>
        {/* Bright center source glow */}
        <ellipse cx="500" cy="0" rx="80" ry="40" fill="rgba(255,240,160,0.20)" style={{ filter: "blur(12px)" }}/>
      </svg>
    </motion.div>
  );
}

/* ───────── Lantern cursor ───────── */
function LanternCursor({ theme }: { theme: "dark" | "candlelight" }) {
  const [pos, setPos] = useState({ x: -1000, y: -1000 });
  const [enabled, setEnabled] = useState(false);
  const posRef = useRef({ x: -1000, y: -1000 });
  const targetRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    setEnabled(true);
    const onMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };

    let frame = 0;
    const tickFrame = () => {
      const current = posRef.current;
      const target = targetRef.current;
      const nextX = current.x + (target.x - current.x) * 0.18;
      const nextY = current.y + (target.y - current.y) * 0.18;
      const moved = Math.abs(nextX - current.x) > 0.01 || Math.abs(nextY - current.y) > 0.01;
      posRef.current = { x: nextX, y: nextY };
      if (moved) setPos(posRef.current);
      frame = window.requestAnimationFrame(tickFrame);
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    frame = window.requestAnimationFrame(tickFrame);
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("pointermove", onMove);
    };
  }, []);

  if (!enabled) return null;
  const inner = theme === "candlelight" ? "rgba(255,200,100,0.45)" : "rgba(240,217,138,0.22)";
  const outer = theme === "candlelight" ? "rgba(255,120,40,0)" : "rgba(212,175,90,0)";
  return (
    <div aria-hidden className="pointer-events-none fixed z-[2] rounded-full mix-blend-screen"
      style={{
        left: pos.x - 160, top: pos.y - 160, width: 320, height: 320,
        background: `radial-gradient(circle, ${inner} 0%, ${outer} 70%)`,
        transition: "background 0.6s ease",
      }} />
  );
}

/* ───────── Konami code → gate slams + coat-of-arms reveal ───────── */
function useKonami(onTrigger: () => void) {
  useEffect(() => {
    const seq = ["ArrowUp","ArrowUp","ArrowDown","ArrowDown","ArrowLeft","ArrowRight","ArrowLeft","ArrowRight","b","a"];
    let i = 0;
    const onKey = (e: KeyboardEvent) => {
      const k = e.key.length === 1 ? e.key.toLowerCase() : e.key;
      if (k === seq[i]) {
        i++;
        if (i === seq.length) { i = 0; onTrigger(); }
      } else {
        i = k === seq[0] ? 1 : 0;
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onTrigger]);
}

function CoatOfArms({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          key="coa"
          initial={{ opacity: 0, scale: 0.3, rotate: -8 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          exit={{ opacity: 0, scale: 1.6 }}
          transition={{ type: "spring", stiffness: 140, damping: 16 }}
          className="pointer-events-none fixed inset-0 z-[70] flex items-center justify-center"
        >
          <div className="absolute inset-0 bg-black/55 backdrop-blur-sm" />
          <svg width="320" height="380" viewBox="0 0 320 380" className="relative drop-shadow-[0_10px_40px_rgba(212,175,90,0.7)]">
            <defs>
              <linearGradient id="shieldG" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0" stopColor="#1a2a55" />
                <stop offset="1" stopColor="#060814" />
              </linearGradient>
              <radialGradient id="centerGlow" cx="0.5" cy="0.4" r="0.5">
                <stop offset="0" stopColor="#f0d98a" stopOpacity="0.95" />
                <stop offset="1" stopColor="#d4af5a" stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Shield */}
            <path d="M160 20 L290 60 L290 200 Q290 300 160 360 Q30 300 30 200 L30 60 Z"
              fill="url(#shieldG)" stroke="#d4af5a" strokeWidth="3" />
            <path d="M160 20 L290 60 L290 200 Q290 300 160 360 Q30 300 30 200 L30 60 Z"
              fill="url(#centerGlow)" opacity="0.4" />
            {/* Crossed swords */}
            <g stroke="#f0d98a" strokeWidth="3" fill="#d4af5a">
              <line x1="80" y1="110" x2="240" y2="270" />
              <line x1="240" y1="110" x2="80" y2="270" />
              <circle cx="80" cy="110" r="6" />
              <circle cx="240" cy="110" r="6" />
              <circle cx="80" cy="270" r="6" />
              <circle cx="240" cy="270" r="6" />
            </g>
            {/* DP monogram */}
            <text x="160" y="200" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700"
              fontSize="64" fill="#f0d98a" letterSpacing="4"
              style={{ filter: "drop-shadow(0 0 8px #d4af5a)" }}>DP</text>
            <text x="160" y="320" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="11"
              fill="#d4af5a" letterSpacing="6">FORTIS · ET · FIDELIS</text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}


/* ───────── Wax seal ───────── */
function WaxSeal({ show }: { show: boolean }) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div key="seal"
          initial={{ opacity: 0, scale: 0.2, rotate: -25 }}
          animate={{ opacity: 1, scale: 1, rotate: -8 }}
          exit={{ opacity: 0, scale: 0.6, rotate: -8 }}
          transition={{ type: "spring", stiffness: 220, damping: 14 }}
          className="pointer-events-none fixed bottom-24 right-8 z-[60]"
          style={{ filter: "drop-shadow(0 6px 16px rgba(0,0,0,0.55))" }}>
          <svg width="120" height="120" viewBox="0 0 120 120">
            <defs>
              <radialGradient id="wax" cx="0.4" cy="0.35" r="0.7">
                <stop offset="0" stopColor="#c44545" />
                <stop offset="0.6" stopColor="#8a1a1a" />
                <stop offset="1" stopColor="#4a0a0a" />
              </radialGradient>
            </defs>
            <path d="M60 8 L72 18 L88 14 L92 30 L106 38 L100 54 L108 70 L94 78 L92 94 L76 92 L66 106 L52 96 L36 102 L30 86 L14 82 L18 66 L8 52 L20 40 L18 24 L34 22 L42 8 L58 14 Z"
              fill="url(#wax)" stroke="#5a0a0a" strokeWidth="1" />
            <circle cx="60" cy="60" r="32" fill="none" stroke="#f0d98a" strokeWidth="1.2" opacity="0.85" />
            <text x="60" y="66" textAnchor="middle" fontFamily="Cinzel, serif" fontWeight="700" fontSize="22" fill="#f0d98a" letterSpacing="2">DP</text>
            <text x="60" y="84" textAnchor="middle" fontFamily="Cinzel, serif" fontSize="6" fill="#f0d98a" letterSpacing="3" opacity="0.85">VERIFIED · CV</text>
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────── Rune divider ───────── */
function RuneDivider({ candleOffset = -1, candleLitCount = 0 }: { candleOffset?: number; candleLitCount?: number }) {
  return (
    <div className="my-10" aria-hidden>
      {candleOffset >= 0 && <CandleRow candleLitCount={candleLitCount} offset={candleOffset} />}
      <div className="flex items-center justify-center gap-4 opacity-80">
        <span className="h-px flex-1 max-w-[220px] bg-gradient-to-r from-transparent to-gold/60" />
        <svg width="140" height="20" viewBox="0 0 140 20" className="text-gold-soft">
          <g stroke="currentColor" strokeWidth="1.1" fill="none" filter="drop-shadow(0 0 3px var(--gold))">
            <path d="M8 4 L8 18 M8 6 L16 4 M8 11 L14 9" />
            <path d="M30 18 L30 4 L36 4 Q40 4 40 8 Q40 12 36 12 L30 12 M36 12 L40 18" />
            <path d="M70 4 L78 11 L70 18 L62 11 Z" fill="var(--gold)" fillOpacity="0.25" />
            <path d="M100 4 L96 11 L100 18 L104 11 Z M100 4 L100 18" />
            <path d="M124 4 L132 18 M132 4 L124 18" />
          </g>
        </svg>
        <span className="h-px flex-1 max-w-[220px] bg-gradient-to-l from-transparent to-gold/60" />
      </div>
    </div>
  );
}

/* ───────── Active section observer ───────── */
function useActiveSection(ids: string[]) {
  const [active, setActive] = useState(ids[0] ?? "home");
  const activeRef = useRef(active);

  useEffect(() => {
    activeRef.current = active;
  }, [active]);

  useEffect(() => {
    let frameId = 0;

    const update = () => {
      const viewportTop = window.scrollY + 120;
      const candidates = ids
        .map((id) => {
          const el = document.getElementById(id);
          if (!el) return null;
          const top = el.getBoundingClientRect().top + window.scrollY;
          return { id, top };
        })
        .filter(Boolean) as { id: string; top: number }[];

      if (!candidates.length) return;

      const current = candidates.filter((item) => item.top <= viewportTop).sort((a, b) => b.top - a.top)[0];
      if (!current || current.id === activeRef.current) return;

      activeRef.current = current.id;
      setActive(current.id);
    };

    const onScroll = () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      if (frameId) window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [ids]);
  return active;
}

/* ───────── Ambient SFX (medieval organum + bell) + Knock one-shot ─────────
   Notes on the sound:
   - Base: low D/A perfect-fifth drone (organum style) routed through a lowpass
     filter modulated by a slow LFO — gives the "cathedral breathing" feel.
   - Periodic tolling bell every ~14s with inharmonic partials and natural
     exponential decay so it sounds like a distant chapel bell, not a sine.
   - Knock: triggered ONCE when the gates have mostly swung open
     (scrollYProgress > 0.78). It's a filtered noise burst layered with a
     dull low thud, repeated 3 times with short gaps — like a heavy iron
     knocker hitting oak. Resets if the user scrolls back near the top so
     it can play again next time the gates open.
*/
function useAmbientSfx() {
  const [enabled, setEnabled] = useState<boolean>(true);
  const [volume, setVolumeState] = useState<number>(() => {
    if (typeof window === "undefined") return 70;
    return Number(localStorage.getItem("sfx_volume") ?? 70);
  });
  const ctxRef = useRef<AudioContext | null>(null);
  const masterRef = useRef<GainNode | null>(null);
  const nodesRef = useRef<{ oscs: OscillatorNode[]; bellInterval: number | null } | null>(null);
  const choirAudioRef = useRef<HTMLAudioElement | null>(null);

  const ensureCtx = (): AudioContext | null => {
    if (typeof window === "undefined") return null;
    if (ctxRef.current) return ctxRef.current;
    try {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      const ctx: AudioContext = new AC();
      ctxRef.current = ctx;
      return ctx;
    } catch { return null; }
  };

  const start = () => {
    const ctx = ensureCtx();
    if (!ctx || nodesRef.current) return;
    const master = ctx.createGain();
    master.gain.value = 0;
    master.connect(ctx.destination);
    masterRef.current = master;

    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 380;
    filter.Q.value = 1.2;
    filter.connect(master);

    const lfo = ctx.createOscillator();
    lfo.type = "sine";
    lfo.frequency.value = 0.08;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 120;
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);
    lfo.start();

    const freqs = [36.7, 55, 73.4, 110]; // D1 A1 D2 A2
    const oscs: OscillatorNode[] = [];
    freqs.forEach((f, i) => {
      const o = ctx.createOscillator();
      o.type = i === 3 ? "triangle" : "sine";
      o.frequency.value = f;
      o.detune.value = (Math.random() - 0.5) * 10;
      const g = ctx.createGain();
      g.gain.value = i === 0 ? 0.55 : 0.22;
      o.connect(g);
      g.connect(filter);
      o.start();
      oscs.push(o);
    });

    const ringBell = () => {
      if (!ctxRef.current || !masterRef.current) return;
      const now = ctx.currentTime;
      const bellGain = ctx.createGain();
      bellGain.gain.setValueAtTime(0, now);
      bellGain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      bellGain.gain.exponentialRampToValueAtTime(0.0001, now + 5.5);
      bellGain.connect(masterRef.current);
      [220, 329.6, 523.25, 880].forEach((bf, idx) => {
        const bo = ctx.createOscillator();
        bo.type = "sine";
        bo.frequency.value = bf;
        const bg = ctx.createGain();
        bg.gain.value = [0.6, 0.4, 0.25, 0.12][idx];
        bo.connect(bg);
        bg.connect(bellGain);
        bo.start(now);
        bo.stop(now + 6);
      });
    };
    const bellInterval = window.setInterval(ringBell, 14000);
    window.setTimeout(ringBell, 4000);

    master.gain.linearRampToValueAtTime(0.07, ctx.currentTime + 3);
    nodesRef.current = { oscs: [...oscs, lfo], bellInterval };

    if (typeof window !== "undefined") {
      const choir = new Audio("/choir.mp3");
      choir.loop = true;
      choir.volume = 0;
      choirAudioRef.current = choir;
      choir.play().catch(() => {});
      // Fade in over 8s
      const fadeStep = () => {
        if (!choirAudioRef.current) return;
        if (choirAudioRef.current.volume < 0.28) {
          choirAudioRef.current.volume = Math.min(0.28, choirAudioRef.current.volume + 0.007);
          setTimeout(fadeStep, 200);
        }
      };
      setTimeout(fadeStep, 1000);
    }
  };

  const stop = () => {
    const ctx = ctxRef.current;
    const master = masterRef.current;
    const nodes = nodesRef.current;
    if (!ctx || !master || !nodes) return;
    try {
      if (nodes.bellInterval) window.clearInterval(nodes.bellInterval);
      master.gain.cancelScheduledValues(ctx.currentTime);
      master.gain.linearRampToValueAtTime(0, ctx.currentTime + 0.6);
      if (choirAudioRef.current) {
        const ca = choirAudioRef.current;
        const fadeOut = () => {
          if (ca.volume > 0.01) { ca.volume = Math.max(0, ca.volume - 0.02); setTimeout(fadeOut, 80); }
          else { ca.pause(); ca.currentTime = 0; choirAudioRef.current = null; }
        };
        fadeOut();
      }
      setTimeout(() => {
        nodes.oscs.forEach((o) => { try { o.stop(); } catch {} });
        masterRef.current = null;
        nodesRef.current = null;
      }, 700);
    } catch {}
  };

  // Knock — short, one-shot. Plays regardless of drone state if SFX enabled.
  const knock = () => {
    if (!enabled) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    ctx.resume?.().catch(() => {});
    const dest = masterRef.current ?? ctx.destination;
    const playOne = (when: number) => {
      // Low thud — sine pulse with quick decay
      const thud = ctx.createOscillator();
      thud.type = "sine";
      thud.frequency.setValueAtTime(110, when);
      thud.frequency.exponentialRampToValueAtTime(45, when + 0.18);
      const tg = ctx.createGain();
      tg.gain.setValueAtTime(0, when);
      tg.gain.linearRampToValueAtTime(0.55, when + 0.005);
      tg.gain.exponentialRampToValueAtTime(0.001, when + 0.35);
      thud.connect(tg); tg.connect(dest);
      thud.start(when); thud.stop(when + 0.4);

      // Wood crack — filtered noise burst
      const bufferSize = Math.floor(ctx.sampleRate * 0.25);
      const noiseBuf = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = noiseBuf.getChannelData(0);
      for (let j = 0; j < bufferSize; j++) data[j] = (Math.random() * 2 - 1);
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuf;
      const bp = ctx.createBiquadFilter();
      bp.type = "bandpass"; bp.frequency.value = 900; bp.Q.value = 0.9;
      const ng = ctx.createGain();
      ng.gain.setValueAtTime(0, when);
      ng.gain.linearRampToValueAtTime(0.25, when + 0.003);
      ng.gain.exponentialRampToValueAtTime(0.001, when + 0.18);
      noise.connect(bp); bp.connect(ng); ng.connect(dest);
      noise.start(when); noise.stop(when + 0.25);
    };
    const now = ctx.currentTime + 0.02;
    playOne(now);
    playOne(now + 0.35);
    playOne(now + 0.7);
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sfx_enabled", String(enabled));
    }
    if (!enabled) {
      stop();
      if (choirAudioRef.current) {
        const ca = choirAudioRef.current;
        const fadeOut = () => {
          if (ca.volume > 0.01) { ca.volume = Math.max(0, ca.volume - 0.02); setTimeout(fadeOut, 80); }
          else { ca.pause(); ca.currentTime = 0; choirAudioRef.current = null; }
        };
        fadeOut();
      }
    }
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    // Attempt immediate autoplay — succeeds on return visits or permissive browsers
    const ctx = ensureCtx();
    if (ctx) {
      ctx.resume().then(() => start()).catch(() => {});
    } else {
      start();
    }
    // Fallback: start on first interaction for strict autoplay browsers
    const tryStart = () => {
      start();
      window.removeEventListener("pointerdown", tryStart);
      window.removeEventListener("keydown", tryStart);
      window.removeEventListener("scroll", tryStart);
    };
    window.addEventListener("pointerdown", tryStart, { once: true });
    window.addEventListener("keydown", tryStart, { once: true });
    window.addEventListener("scroll", tryStart, { once: true, passive: true });
    return () => {
      window.removeEventListener("pointerdown", tryStart);
      window.removeEventListener("keydown", tryStart);
      window.removeEventListener("scroll", tryStart);
    };
  }, [enabled]);

  // Candle ignite — matchstick lighting: scratch → ignite pop → rising flame breath.
  const candleLight = () => {
    if (!enabled) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    ctx.resume?.().catch(() => {});
    const dest = masterRef.current ?? ctx.destination;
    const t0 = ctx.currentTime;
    const makeNoise = (dur: number) => {
      const sz = Math.floor(ctx.sampleRate * dur);
      const buf = ctx.createBuffer(1, sz, ctx.sampleRate);
      const d = buf.getChannelData(0);
      for (let j = 0; j < sz; j++) d[j] = Math.random() * 2 - 1;
      const src = ctx.createBufferSource(); src.buffer = buf;
      return src;
    };
    // 1. Scratch — rough high-freq friction (0 – 0.065s)
    const scratch = makeNoise(0.07);
    const scratchBp = ctx.createBiquadFilter(); scratchBp.type = "bandpass"; scratchBp.frequency.value = 5800; scratchBp.Q.value = 0.4;
    const scratchG = ctx.createGain();
    scratchG.gain.setValueAtTime(0.18, t0);
    scratchG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.065);
    scratch.connect(scratchBp); scratchBp.connect(scratchG); scratchG.connect(dest);
    scratch.start(t0); scratch.stop(t0 + 0.07);
    // 2. Ignition pop — brief mid-low transient (0.04 – 0.18s)
    const pop = ctx.createOscillator(); pop.type = "sine";
    pop.frequency.setValueAtTime(320, t0 + 0.04);
    pop.frequency.exponentialRampToValueAtTime(60, t0 + 0.12);
    const popG = ctx.createGain();
    popG.gain.setValueAtTime(0.12, t0 + 0.04);
    popG.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.18);
    pop.connect(popG); popG.connect(dest);
    pop.start(t0 + 0.04); pop.stop(t0 + 0.19);
    // 3. Rising flame breath — bandpass sweep up from 900 → 3200 Hz (0.1 – 0.58s)
    const flame = makeNoise(0.5);
    const flameBp = ctx.createBiquadFilter(); flameBp.type = "bandpass"; flameBp.Q.value = 0.8;
    flameBp.frequency.setValueAtTime(900, t0 + 0.1);
    flameBp.frequency.exponentialRampToValueAtTime(3200, t0 + 0.45);
    const flameG = ctx.createGain();
    flameG.gain.setValueAtTime(0, t0 + 0.1);
    flameG.gain.linearRampToValueAtTime(0.11, t0 + 0.2);
    flameG.gain.exponentialRampToValueAtTime(0.001, t0 + 0.56);
    flame.connect(flameBp); flameBp.connect(flameG); flameG.connect(dest);
    flame.start(t0 + 0.1); flame.stop(t0 + 0.6);
    // 4. Crackle tail — low-freq texture (0.18 – 0.5s)
    const crackle = makeNoise(0.35);
    const crackleLp = ctx.createBiquadFilter(); crackleLp.type = "lowpass"; crackleLp.frequency.value = 600;
    const crackleG = ctx.createGain();
    crackleG.gain.setValueAtTime(0.06, t0 + 0.18);
    crackleG.gain.exponentialRampToValueAtTime(0.001, t0 + 0.5);
    crackle.connect(crackleLp); crackleLp.connect(crackleG); crackleG.connect(dest);
    crackle.start(t0 + 0.18); crackle.stop(t0 + 0.54);
  };

  // Hover chime — soft, short bell ping for hovering interactive icons.
  const lastHoverRef = useRef(0);
  const hoverChime = () => {
    if (!enabled) return;
    const ctx = ensureCtx();
    if (!ctx) return;
    // Throttle so a fast sweep across icons doesn't drone.
    const now = performance.now();
    if (now - lastHoverRef.current < 70) return;
    lastHoverRef.current = now;
    ctx.resume?.().catch(() => {});
    const dest = masterRef.current ?? ctx.destination;
    const t0 = ctx.currentTime;
    // Pick from a small medieval-flavored pitch set so successive hovers feel musical.
    const pitches = [659.25, 783.99, 880, 987.77, 1174.66]; // E5 G5 A5 B5 D6
    const f = pitches[Math.floor(Math.random() * pitches.length)];
    [f, f * 2.0, f * 3.0].forEach((freq, i) => {
      const o = ctx.createOscillator();
      o.type = "sine";
      o.frequency.value = freq;
      const g = ctx.createGain();
      const peak = [0.06, 0.025, 0.012][i];
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(peak, t0 + 0.008);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
      o.connect(g); g.connect(dest);
      o.start(t0); o.stop(t0 + 0.6);
    });
  };

  useEffect(() => () => stop(), []);

  const setVolume = (v: number) => {
    const clamped = Math.max(0, Math.min(100, v));
    setVolumeState(clamped);
    localStorage.setItem("sfx_volume", String(clamped));
    const frac = clamped / 100;
    if (masterRef.current) masterRef.current.gain.value = frac * 0.07;
    if (choirAudioRef.current) choirAudioRef.current.volume = frac * 0.28;
  };
  return { enabled, toggle: () => setEnabled((v) => !v), volume, setVolume, knock, hoverChime, candleLight };
}

/* Horizontal volume bar — lives directly in the Navbar right section */
function VolumeBar({ enabled, toggle, volume, setVolume }: { enabled: boolean; toggle: () => void; volume: number; setVolume: (v: number) => void }) {
  return (
    <div className="flex items-center gap-1.5">
      <button
        onClick={toggle}
        aria-label={enabled ? "Mute ambient sound" : "Enable ambient sound"}
        title={enabled ? "Mute" : "Enable sound"}
        className="inline-flex items-center justify-center w-7 h-7 rounded-full border border-gold/40 text-gold/80 hover:text-gold hover:border-gold/70 hover:bg-gold/10 transition flex-shrink-0"
      >
        {enabled ? <Volume2 size={13} /> : <VolumeX size={13} />}
      </button>
      <AnimatePresence>
        {enabled && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 72, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeInOut" }}
            style={{ overflow: "hidden", flexShrink: 0 }}
            className="flex items-center"
          >
            <div className="relative flex items-center" style={{ width: 72, height: 20 }}>
              <div className="absolute inset-x-0 top-1/2 -translate-y-1/2 h-px rounded-full" style={{ background: "rgba(212,175,90,0.18)" }} />
              <div className="absolute left-0 top-1/2 -translate-y-1/2 h-px rounded-full pointer-events-none"
                style={{ width: `${volume}%`, background: "rgba(212,175,90,0.75)", boxShadow: "0 0 4px rgba(212,175,90,0.5)" }} />
              <input
                type="range" min="0" max="100" value={volume}
                onChange={(e) => setVolume(Number(e.target.value))}
                className="absolute inset-0 w-full cursor-pointer opacity-0"
                style={{ margin: 0, padding: 0 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── Scribe Mode — offline-aware parchment reader ─────────
   - Snapshots the page's main text content into localStorage on each visit.
   - A button in the navbar opens a parchment-styled modal of that snapshot.
   - When the browser reports offline (or the user has no network) we auto-open
     it and show an offline banner — the site stays "readable in the scriptorium"
     even when the network is gone. This is intentionally NOT a full PWA service
     worker (see note in chat) — it's a lightweight, framework-safe alternative
     that doesn't risk caching stale builds in the Lovable preview.
*/
type ScribeSnapshot = { title: string; sections: { heading: string; body: string }[]; savedAt: number };

function snapshotPage(): ScribeSnapshot {
  if (typeof document === "undefined") return { title: "", sections: [], savedAt: 0 };
  const main = document.querySelector("main");
  const sections: { heading: string; body: string }[] = [];
  main?.querySelectorAll("section").forEach((s) => {
    const h = s.querySelector("h1, h2, h3");
    const heading = (h?.textContent || "").trim();
    // Pull readable text; collapse whitespace; ignore very short fragments.
    const body = Array.from(s.querySelectorAll("p, li"))
      .map((n) => (n.textContent || "").trim())
      .filter((x) => x.length > 0)
      .join("\n\n");
    if (heading || body) sections.push({ heading, body });
  });
  return { title: document.title, sections, savedAt: Date.now() };
}

function useOnlineStatus() {
  const [online, setOnline] = useState<boolean>(() => (typeof navigator !== "undefined" ? navigator.onLine : true));
  useEffect(() => {
    const up = () => setOnline(true);
    const down = () => setOnline(false);
    window.addEventListener("online", up);
    window.addEventListener("offline", down);
    return () => { window.removeEventListener("online", up); window.removeEventListener("offline", down); };
  }, []);
  return online;
}

function ScribeMode() {
  const [open, setOpen] = useState(false);
  const [snap, setSnap] = useState<ScribeSnapshot | null>(null);
  const online = useOnlineStatus();

  // Snapshot on mount (give content a beat to render), then persist.
  useEffect(() => {
    const id = window.setTimeout(() => {
      try {
        const s = snapshotPage();
        if (s.sections.length > 0) {
          localStorage.setItem("scribe_snapshot", JSON.stringify(s));
          setSnap(s);
        } else {
          const raw = localStorage.getItem("scribe_snapshot");
          if (raw) setSnap(JSON.parse(raw));
        }
      } catch {}
    }, 1200);
    return () => window.clearTimeout(id);
  }, []);

  // Auto-open when we go offline (only if we have a snapshot to show).
  const wasOnline = useRef(online);
  useEffect(() => {
    if (wasOnline.current && !online && snap) setOpen(true);
    wasOnline.current = online;
  }, [online, snap]);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="Open Scribe Mode (offline reader)"
        title={online ? "Scribe Mode (offline reader)" : "Offline — open the scriptorium"}
        className="relative inline-flex items-center justify-center w-9 h-9 rounded-full border border-gold/50 text-gold hover:bg-gold/15 transition"
      >
        <ScrollText size={16} />
        {!online && (
          <span aria-hidden className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
        )}
      </button>

      {open && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div
            className="relative w-full max-w-3xl max-h-[85vh] overflow-hidden rounded-md border-2 shadow-2xl"
            style={{
              background:
                "radial-gradient(ellipse at top, #f4e4bc 0%, #e8d39a 50%, #c9a86a 100%)",
              borderColor: "#6b4a1f",
              boxShadow: "0 0 60px rgba(212,175,90,0.4), inset 0 0 80px rgba(120,80,30,0.35)",
            }}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-5 py-3 border-b-2"
              style={{ borderColor: "rgba(107,74,31,0.6)", background: "rgba(60,30,10,0.18)" }}>
              <div className="flex items-center gap-2">
                <ScrollText size={16} className="text-[#3a230a]" />
                <h2 className="font-display tracking-[0.25em] uppercase text-[#3a230a] text-sm">Scribe Mode</h2>
                {!online && (
                  <span className="ml-2 inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-amber-900 bg-amber-200/70 border border-amber-700/50 rounded px-1.5 py-0.5">
                    <WifiOff size={10} /> Offline
                  </span>
                )}
              </div>
              <button onClick={() => setOpen(false)} aria-label="Close"
                className="text-[#3a230a] hover:text-black transition">
                <X size={18} />
              </button>
            </div>
            {/* Body */}
            <div className="overflow-y-auto px-6 py-5 text-[#2a1a08]"
              style={{ maxHeight: "calc(85vh - 56px)", fontFamily: "Georgia, 'Iowan Old Style', serif" }}>
              {!snap || snap.sections.length === 0 ? (
                <p className="italic text-[#5a3a18]">The scribe is still copying these pages… visit once while online to fill the book.</p>
              ) : (
                <>
                  <p className="text-[11px] uppercase tracking-[0.3em] text-[#6b4a1f] mb-4">
                    Transcribed {new Date(snap.savedAt).toLocaleString()}
                  </p>
                  {snap.sections.map((s, i) => (
                    <article key={i} className="mb-6">
                      {s.heading && (
                        <h3 className="font-display text-xl tracking-wider text-[#3a230a] border-b border-[#6b4a1f]/40 pb-1 mb-3">
                          {s.heading}
                        </h3>
                      )}
                      {s.body.split("\n\n").map((para, j) => (
                        <p key={j} className="leading-relaxed mb-3 text-[15px]">{para}</p>
                      ))}
                    </article>
                  ))}
                  <div className="text-center text-[11px] uppercase tracking-[0.3em] text-[#6b4a1f] mt-6">
                    ✦ Explicit ✦
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}


/* ───────── Candle button icon — gothic hanging lantern ───────── */
function CandleButtonIcon({ lit }: { lit: boolean }) {
  return (
    <svg width="14" height="20" viewBox="0 0 14 20" fill="none" aria-hidden>
      {/* hanging hook */}
      <path d="M5.5 0.5 Q4.5 1.8 5.5 3 L8.5 3 Q9.5 1.8 8.5 0.5 Q7 -0.4 5.5 0.5 Z" fill="rgba(212,175,90,0.72)"/>
      {/* top cap */}
      <rect x="2.5" y="3" width="9" height="1.8" rx="0.7" fill="rgba(212,175,90,0.78)"/>
      {/* left + right frame bars */}
      <rect x="2.5" y="4.8" width="1.6" height="10.4" fill="rgba(212,175,90,0.62)"/>
      <rect x="9.9" y="4.8" width="1.6" height="10.4" fill="rgba(212,175,90,0.62)"/>
      {/* glass panels */}
      <rect x="4.1" y="4.8" width="5.8" height="4.8" fill={lit ? "rgba(255,138,10,0.22)" : "rgba(8,6,24,0.72)"}/>
      <rect x="4.1" y="10.4" width="5.8" height="4.8" fill={lit ? "rgba(255,110,8,0.18)" : "rgba(8,6,24,0.65)"}/>
      {/* mid crossbar */}
      <rect x="2.5" y="9.6" width="9" height="0.9" fill="rgba(212,175,90,0.5)"/>
      {/* bottom cap */}
      <rect x="2.5" y="15.2" width="9" height="1.8" rx="0.7" fill="rgba(212,175,90,0.78)"/>
      {/* bottom pendant */}
      <path d="M6 17 L7 19.5 L8 17 Z" fill="rgba(212,175,90,0.65)"/>
      {/* flame */}
      {lit && (
        <>
          <ellipse cx="7" cy="7.8" rx="1.9" ry="2.7" fill="rgba(255,152,12,0.92)"/>
          <ellipse cx="7" cy="8.6" rx="0.95" ry="1.6" fill="rgba(255,224,45,0.96)"/>
          <ellipse cx="7" cy="9.4" rx="0.42" ry="0.72" fill="rgba(255,255,195,0.9)"/>
        </>
      )}
    </svg>
  );
}

const NAV: { id: string; key: keyof T; rune: string }[] = [
  { id: "home", key: "home", rune: "ᚺ" },
  { id: "about", key: "about", rune: "ᚨ" },
  { id: "skills", key: "skills", rune: "ᛋ" },
  { id: "experience", key: "experience", rune: "ᛖ" },
  { id: "education", key: "education", rune: "ᛟ" },
  { id: "projects", key: "projects", rune: "ᛈ" },
  { id: "contact", key: "contact", rune: "ᚲ" },
];

/* ───────── Star Map Navigation — vertical constellation on right ───────── */
const SM_STARS: { id: string; label: string; rune: string }[] = [
  { id: "home",       label: "Gate",       rune: "ᚺ" },
  { id: "about",      label: "Scribe",     rune: "ᚨ" },
  { id: "skills",     label: "Constellation", rune: "ᛋ" },
  { id: "experience", label: "Chronicle",  rune: "ᛖ" },
  { id: "education",  label: "Lore",       rune: "ᛟ" },
  { id: "projects",   label: "Relics",     rune: "ᛈ" },
  { id: "contact",    label: "Raven",      rune: "ᚲ" },
];

function StarMapNav({ active }: { active: string }) {
  const mounted = useMounted();
  const [tick, setTick] = useState(0);
  useEffect(() => {
    if (!mounted) return;
    const id = setInterval(() => setTick(t => (t+1)%360), 120);
    return () => clearInterval(id);
  }, [mounted]);
  if (!mounted) return null;
  const N = SM_STARS.length;
  const H = 280; // total height of the SVG
  const spacing = H / (N - 1);
  return (
    <div className="pointer-events-none fixed right-10 top-1/2 -translate-y-1/2 z-40 hidden lg:block" aria-hidden>
      <svg width="90" height={H + 40} viewBox={`0 0 90 ${H + 40}`} fill="none">
        {/* Constellation edge lines */}
        {SM_STARS.slice(0,-1).map((_,i) => (
          <line key={i}
            x1="28" y1={20 + i*spacing}
            x2="28" y2={20 + (i+1)*spacing}
            stroke="rgba(212,175,90,0.12)" strokeWidth="0.8"
            strokeDasharray="2 4"/>
        ))}
        {/* Diagonal accent lines between alternate stars */}
        {SM_STARS.slice(0,-2).map((_,i) => i%2===0 && (
          <line key={`d${i}`}
            x1="28" y1={20 + i*spacing}
            x2="34" y2={20 + (i+1)*spacing}
            stroke="rgba(212,175,90,0.07)" strokeWidth="0.5"/>
        ))}
        {SM_STARS.map((s, i) => {
          const isActive = active === s.id || (active === "feedback" && i === N-1);
          const cy = 20 + i * spacing;
          const twinkle = ((tick * 3 + i * 40) % 360) / 360;
          const glowR = isActive ? 10 + Math.sin(twinkle * Math.PI * 2) * 3 : 0;
          const starR = isActive ? 5 : 3;
          return (
            <g key={s.id}>
              {/* Glow halo on active */}
              {isActive && (
                <circle cx="28" cy={cy} r={glowR}
                  fill="rgba(212,175,90,0.08)"/>
              )}
              {/* Star diamond shape */}
              <polygon
                points={`28,${cy-starR} ${28+starR*0.6},${cy} 28,${cy+starR} ${28-starR*0.6},${cy}`}
                fill={isActive ? "rgba(255,235,140,0.95)" : "rgba(212,175,90,0.45)"}
                stroke={isActive ? "rgba(255,235,140,0.60)" : "rgba(212,175,90,0.20)"}
                strokeWidth="0.5"/>
              {/* Cross sparkle on active */}
              {isActive && (
                <g stroke="rgba(255,240,160,0.70)" strokeWidth="0.6">
                  <line x1="28" y1={cy-8} x2="28" y2={cy+8}/>
                  <line x1="21" y1={cy} x2="35" y2={cy}/>
                </g>
              )}
              {/* Label */}
              <text x="38" y={cy+3.5} fontSize="8.5" fill={isActive ? "rgba(255,235,140,0.90)" : "rgba(212,175,90,0.45)"}
                fontFamily="var(--font-body)" style={{ userSelect:"none" }}>
                {s.label}
              </text>
              {/* Rune glyph */}
              <text x="17" y={cy+3.5} fontSize="8" textAnchor="middle"
                fill={isActive ? "rgba(255,235,140,0.70)" : "rgba(212,175,90,0.25)"}
                fontFamily="var(--font-display)" style={{ userSelect:"none" }}>
                {s.rune}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

function Navbar({
  onPreviewCV, theme, toggleTheme, gateSettings, setGateSettings, resetGate,
  active, sfxEnabled, toggleSfx, sfxVolume, setSfxVolume, lang, setLang, t, onLightCandles, candleLitCount, onNavigateSection,
}: {
  onPreviewCV: () => void; theme: string; toggleTheme: () => void;
  gateSettings: GateSettings; setGateSettings: (s: GateSettings) => void; resetGate: () => void;
  active: string; sfxEnabled: boolean; toggleSfx: () => void; sfxVolume: number; setSfxVolume: (v: number) => void;
  lang: Lang; setLang: (l: Lang) => void; t: T;
  onLightCandles: () => void; candleLitCount: number; onNavigateSection: (id: string) => void;
}) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <nav className={`fixed top-0 inset-x-0 z-40 transition-all ${scrolled ? "bg-navy-deep/85 backdrop-blur-md border-b border-gold/30 shadow-lg" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-2 md:px-4 h-14 md:h-16 relative flex items-center">
        {/* LEFT — logo */}
        <a href="#home" className="font-display tracking-[0.25em] text-gold-soft text-[11px] md:text-base font-bold shrink-0 whitespace-nowrap mr-2 md:mr-0">
          D · PARRUCA
        </a>
        {/* CENTER — nav links, absolutely centered on md+, scrollable on mobile */}
        <ul className="flex-1 min-w-0 md:flex-none md:absolute md:left-1/2 md:-translate-x-1/2 flex items-center gap-0.5 overflow-x-auto overflow-y-hidden no-scrollbar md:overflow-visible mx-1 md:mx-0"
            style={{ scrollSnapType: "x proximity" }}>
          {NAV.map((n) => {
            const isActive = active === n.id;
            return (
              <li key={n.id} className="shrink-0 relative" style={{ scrollSnapAlign: "start" }}>
                <a href={`#${n.id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    onNavigateSection(n.id);
                  }}
                  className={`flex items-center gap-1.5 px-2 sm:px-2.5 py-2 text-[10.5px] sm:text-[11.5px] md:text-[12.5px] tracking-[0.15em] uppercase whitespace-nowrap transition ${
                    isActive ? "text-gold" : "text-ink-soft hover:text-gold-soft"
                  }`}>
                  <span aria-hidden className={`text-[14px] leading-none ${isActive ? "text-gold" : "text-gold/60"}`}
                    style={{ textShadow: isActive ? "0 0 6px var(--gold)" : "none" }}>{n.rune}</span>
                  <span>{t[n.key] as string}</span>
                </a>
                {isActive && (
                  <motion.span layoutId="nav-underline"
                    className="absolute left-2 right-2 -bottom-0.5 h-[2px] rounded-full"
                    style={{ background: "linear-gradient(90deg, transparent, var(--gold), transparent)", boxShadow: "0 0 8px var(--gold)" }}
                    transition={{ type: "spring", stiffness: 300, damping: 28 }} />
                )}
              </li>
            );
          })}
        </ul>
        {/* RIGHT — action buttons */}
        <div className="flex items-center gap-1 sm:gap-2 shrink-0 ml-auto">
          {/* Candle — light all candles */}
          <button onClick={onLightCandles} aria-label={candleLitCount > 0 ? "Snuff all candles" : "Light all candles"}
            title={candleLitCount > 0 ? "Snuff all candles" : "Light all candles"}
            className={`relative inline-flex items-center justify-center w-9 h-9 rounded-full border text-gold hover:bg-gold/15 transition ${
              candleLitCount > 0
                ? "border-amber-400/65 shadow-[0_0_12px_rgba(255,165,35,0.45)]"
                : "border-gold/50"
            }`}>
            <CandleButtonIcon lit={candleLitCount > 0} />
            {candleLitCount > 0 && candleLitCount < 14 && (
              <span className="absolute -top-1 -right-1 text-[8px] text-amber-400 font-bold leading-none">{candleLitCount}</span>
            )}
          </button>
          <ThemeToggle theme={theme} toggle={toggleTheme} />
          {/* CV button */}
          <button onClick={onPreviewCV}
            className="hidden md:inline-flex items-center gap-1.5 border border-gold/60 text-gold-soft px-3 py-1.5 text-xs font-semibold uppercase tracking-wider hover:bg-gold hover:text-navy-deep transition rounded">
            <FileText size={14} /> CV
          </button>
          {/* Standalone collapsible controls */}
          <VerticalControls lang={lang} setLang={setLang} sfxEnabled={sfxEnabled} toggleSfx={toggleSfx}
            sfxVolume={sfxVolume} setSfxVolume={setSfxVolume}
            gateSettings={gateSettings} setGateSettings={setGateSettings} resetGate={resetGate} />
        </div>
      </div>
    </nav>
  );
}

function BackToTop() {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const f = () => setShow(window.scrollY > 600);
    f();
    window.addEventListener("scroll", f, { passive: true });
    return () => window.removeEventListener("scroll", f);
  }, []);
  if (!show) return null;
  return (
    <a href="#home"
       className="fixed bottom-6 right-6 z-40 border border-gold/60 bg-navy/80 backdrop-blur text-gold-soft hover:bg-gold hover:text-navy-deep rounded-full w-11 h-11 flex items-center justify-center transition shadow-lg"
       aria-label="Back to top">
      <ArrowUp size={18} />
    </a>
  );
}

/* ───────── CV Dialog ───────── */
function CVDialog({ open, onOpenChange, onDownload }: { open: boolean; onOpenChange: (v: boolean) => void; onDownload?: () => void }) {
  const url = "/Dari_Parruca_CV.pdf";
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-5xl w-[95vw] h-[90vh] bg-navy-deep border-gold/40 p-0 flex flex-col">
        <DialogHeader className="px-5 pt-4 pb-3 border-b border-gold/20">
          <DialogTitle className="text-gold-soft font-display tracking-wider">Curriculum Vitae — Dari Parruca</DialogTitle>
          <DialogDescription className="text-ink-soft text-xs">Preview, open in a new tab, or download.</DialogDescription>
        </DialogHeader>
        <div className="flex-1 bg-navy/40 overflow-hidden relative">
          <object data={url} type="application/pdf" className="w-full h-full" style={{ border: "none" }}>
            <div className="flex flex-col items-center justify-center h-full gap-4 p-6 text-center">
              <p className="text-ink-soft text-sm">Your browser doesn't render PDFs inline.</p>
              <a href={url} target="_blank" rel="noreferrer"
                className="inline-flex items-center gap-2 border border-gold/50 text-gold-soft px-4 py-2 text-xs uppercase tracking-wider hover:bg-gold/10 rounded">
                <FileText size={14}/> Open PDF in new tab
              </a>
            </div>
          </object>
        </div>
        <div className="px-5 py-3 border-t border-gold/20 flex justify-between items-center gap-2">
          <p className="text-[11px] text-ink-soft/70">If the preview is blank, your browser blocks inline PDFs — use Open in tab.</p>
          <Popover>
            <PopoverTrigger asChild>
              <button className="inline-flex items-center gap-1.5 border border-gold/50 text-gold-soft px-3 py-1.5 text-xs uppercase tracking-wider hover:bg-gold/10 rounded transition">
                Actions <ChevronDown size={11} className="opacity-70"/>
              </button>
            </PopoverTrigger>
            <PopoverContent align="end" className="w-44 p-1.5 bg-navy-deep/96 backdrop-blur-md border-gold/30">
              <a href={url} target="_blank" rel="noreferrer"
                 className="flex items-center gap-2 px-3 py-2 text-xs text-gold-soft hover:bg-gold/10 rounded transition w-full">
                <FileText size={13}/> Open in tab
              </a>
              <a href={url} download onClick={onDownload}
                 className="flex items-center gap-2 px-3 py-2 text-xs text-gold-soft hover:bg-gold/10 rounded transition w-full">
                <Download size={13}/> Download PDF
              </a>
            </PopoverContent>
          </Popover>
        </div>
      </DialogContent>
    </Dialog>
  );
}

/* ───────── Feedback section (public submit + owner-only view) ───────── */

type FeedbackRow = { id: string; name: string; email: string | null; rating: number; message: string; createdAt: string };

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((n) => (
        <button type="button" key={n} onClick={() => onChange(n)} aria-label={`Rate ${n}`}
          className="p-0.5">
          <Star size={20} className={n <= value ? "text-gold fill-gold" : "text-gold/30"} />
        </button>
      ))}
    </div>
  );
}

/* ───────── Raven flyout — triggers on feedback submit success ───────── */
function RavenFlyout({ active, onDone }: { active: boolean; onDone: () => void }) {
  return (
    <AnimatePresence>
      {active && (
        <motion.div
          aria-hidden
          className="pointer-events-none fixed z-[998]"
          style={{ bottom: "30vh", left: "50%" }}
          initial={{ x: 0, y: 0, opacity: 0, scale: 0.4 }}
          animate={{ x: "46vw", y: -180, opacity: [0, 1, 1, 0.7, 0], scale: [0.4, 1.1, 1, 0.6] }}
          transition={{ duration: 3.0, ease: [0.2, 0, 0.65, 1], times: [0, 0.12, 0.65, 0.82, 1] }}
          onAnimationComplete={onDone}
        >
          <svg width="58" height="34" viewBox="0 0 58 34" fill="none">
            {/* body */}
            <ellipse cx="29" cy="22" rx="14" ry="7.5" fill="#0f0a18" />
            {/* head */}
            <ellipse cx="43" cy="17" rx="6" ry="5.5" fill="#0f0a18" />
            {/* beak */}
            <path d="M49,16 L58,14.5 L49,19 Z" fill="#1e1528" />
            {/* eye */}
            <circle cx="45" cy="15.5" r="1.4" fill="#d4af5a" />
            <circle cx="45.5" cy="15" r="0.5" fill="rgba(255,255,255,0.75)" />
            {/* tail */}
            <path d="M15,22 L3,28 L8,22 L1,31 L10,25 L5,33 L14,26 Z" fill="#0f0a18" />
            {/* left wing — flaps via translateY */}
            <motion.path d="M29,19 C23,13 15,8 7,6 C13,10 21,15 25,19 Z" fill="#1c1228"
              animate={{ y: [-7, 7, -7] }}
              transition={{ duration: 0.36, repeat: Infinity, ease: "easeInOut" }} />
            {/* right wing */}
            <motion.path d="M29,19 C35,13 43,8 51,6 C45,10 37,15 33,19 Z" fill="#1c1228"
              animate={{ y: [-7, 7, -7] }}
              transition={{ duration: 0.36, repeat: Infinity, ease: "easeInOut" }} />
            {/* wing sheen */}
            <motion.line x1="12" y1="10" x2="25" y2="17" stroke="rgba(212,175,90,0.18)" strokeWidth="0.7"
              animate={{ y: [-7, 7, -7] }}
              transition={{ duration: 0.36, repeat: Infinity, ease: "easeInOut" }} />
          </svg>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function FeedbackSection({ t, onSealed }: { t: T; onSealed?: () => void }) {
  const submit = submitFeedback;
  const getAdmin = getFeedbackAdmin;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [rating, setRating] = useState(5);
  const [message, setMessage] = useState("");
  const [company, setCompany] = useState(""); // honeypot
  const mountedAt = useRef<number>(Date.now());
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [ravenActive, setRavenActive] = useState(false);

  const [adminOpen, setAdminOpen] = useState(false);
  const [adminKey, setAdminKey] = useState("");
  const [adminLoading, setAdminLoading] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const [rows, setRows] = useState<FeedbackRow[] | null>(null);
  const [adminCvCount, setAdminCvCount] = useState<number | null>(null);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !message.trim()) {
      setError("Name and message are required.");
      return;
    }
    setSubmitting(true);
    try {
      await submit({ data: {
        name: name.trim(),
        email: email.trim(),
        rating,
        message: message.trim(),
        company,
        dwellMs: Date.now() - mountedAt.current,
      } });
      setDone(true);
      setRavenActive(true);
      setName(""); setEmail(""); setMessage(""); setRating(5);
      onSealed?.();
      setTimeout(() => setDone(false), 5000);
    } catch (err: any) {
      setError(err?.message ?? "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  const onUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdminError(null);
    setAdminLoading(true);
    try {
      const res = await getAdmin({ data: { key: adminKey } });
      setRows(res.feedback as FeedbackRow[]);
      setAdminCvCount((res as any).cvDownloads ?? null);
    } catch (err: any) {
      setAdminError("Wrong key.");
    } finally {
      setAdminLoading(false);
    }
  };

  return (
    <section className="max-w-4xl mx-auto relative">
      <RavenFlyout active={ravenActive} onDone={() => setRavenActive(false)} />
      <RevealHeading id="feedback">{t.feedbackHeading}</RevealHeading>
      <div className="rounded-xl border border-gold/30 bg-navy/38 backdrop-blur-md p-6 md:p-8">
        <p className="text-center text-ink-soft max-w-xl mx-auto text-sm">{t.feedbackIntro}</p>

        <form onSubmit={onSubmit} className="mt-6 grid sm:grid-cols-2 gap-3">
          {/* Honeypot — hidden from humans, irresistible to bots */}
          <input type="text" tabIndex={-1} autoComplete="off" value={company}
            onChange={(e) => setCompany(e.target.value)} aria-hidden="true"
            className="hidden" name="company" />
          <input value={name} onChange={(e) => setName(e.target.value)} maxLength={80}
            placeholder={t.yourName} required
            className="rounded border border-gold/30 bg-navy-deep/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold outline-none" />
          <input value={email} onChange={(e) => setEmail(e.target.value)} maxLength={200} type="email"
            placeholder={t.yourEmail}
            className="rounded border border-gold/30 bg-navy-deep/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold outline-none" />
          <div className="sm:col-span-2 flex items-center gap-3">
            <span className="text-[11px] uppercase tracking-wider text-ink-soft">{t.yourRating}</span>
            <StarPicker value={rating} onChange={setRating} />
          </div>
          <textarea value={message} onChange={(e) => setMessage(e.target.value)} maxLength={2000} rows={4}
            placeholder={t.yourMessage} required
            className="sm:col-span-2 rounded border border-gold/30 bg-navy-deep/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold outline-none resize-y" />
          {error && <p className="sm:col-span-2 text-xs text-red-400">{error}</p>}
          {done && <p className="sm:col-span-2 text-xs text-gold-soft">{t.thanks}</p>}
          <div className="sm:col-span-2 flex justify-end">
            <button type="submit" disabled={submitting}
              className="relative inline-flex items-center gap-2.5 border border-gold/65 bg-navy-deep text-gold px-5 py-2.5 text-xs font-semibold uppercase tracking-[0.18em] hover:bg-gold/12 hover:border-gold transition-all duration-200 disabled:opacity-50">
              <RuneSigil />
              {submitting ? t.sending : t.submit}
              <span className="absolute top-0.5 left-0.5 w-2.5 h-2.5 border-t border-l border-gold/50 pointer-events-none" />
              <span className="absolute bottom-0.5 right-0.5 w-2.5 h-2.5 border-b border-r border-gold/50 pointer-events-none" />
            </button>
          </div>
        </form>

        <div className="mt-6 border-t border-gold/20 pt-4 flex justify-center">
          <button
            onClick={() => setAdminOpen((v) => !v)}
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.25em] text-ink-soft/60 hover:text-gold-soft transition">
            <Lock size={12} /> {t.adminUnlock}
          </button>
        </div>

        <AnimatePresence>
          {adminOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden">
              <div className="mt-4 border border-gold/30 rounded-lg p-4 bg-navy-deep/60">
                {!rows && (
                  <form onSubmit={onUnlock} className="flex gap-2">
                    <input type="password" value={adminKey} onChange={(e) => setAdminKey(e.target.value)}
                      placeholder={t.adminPrompt} autoFocus
                      className="flex-1 rounded border border-gold/30 bg-navy-deep/60 px-3 py-2 text-sm text-ink placeholder:text-ink-soft/50 focus:border-gold outline-none" />
                    <button type="submit" disabled={adminLoading}
                      className="inline-flex items-center gap-1.5 bg-gold text-navy-deep px-3 py-2 text-xs font-semibold uppercase tracking-wider hover:bg-gold-soft rounded disabled:opacity-60">
                      {adminLoading ? "…" : t.adminUnlockBtn}
                    </button>
                  </form>
                )}
                {adminError && <p className="mt-2 text-xs text-red-400">{adminError}</p>}
                {rows && (
                  <div>
                    <div className="flex items-center justify-between mb-3 gap-3 flex-wrap">
                      <p className="text-xs text-ink-soft/70">{rows.length} {t.adminEntries}</p>
                      {adminCvCount !== null && (
                        <p className="text-xs text-gold-soft">
                          <Download size={11} className="inline mr-1" />
                          {adminCvCount} CV download{adminCvCount === 1 ? "" : "s"} (all visitors)
                        </p>
                      )}
                    </div>
                    <ul className="space-y-3 max-h-[420px] overflow-y-auto pr-2">
                      {rows.map((r) => (
                        <li key={r.id} className="rounded border border-gold/20 bg-navy/34 p-3">
                          <div className="flex items-baseline justify-between gap-2">
                            <div className="font-semibold text-ink text-sm">{r.name}</div>
                            <div className="text-[10px] text-ink-soft/70">{new Date(r.createdAt).toLocaleString()}</div>
                          </div>
                          <div className="flex items-center gap-1 mt-1">
                            {Array.from({ length: 5 }).map((_, i) => (
                              <Star key={i} size={12} className={i < r.rating ? "text-gold fill-gold" : "text-gold/30"} />
                            ))}
                            {r.email && <span className="ml-2 text-[10px] text-ink-soft">· {r.email}</span>}
                          </div>
                          <p className="mt-1.5 text-[13px] text-ink-soft whitespace-pre-wrap">{r.message}</p>
                        </li>
                      ))}
                      {rows.length === 0 && <li className="text-xs text-ink-soft/70">No feedback yet.</li>}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

/* ───────── Eye Ornament — replaces hero star, tracks mouse, random blinks ───────── */
function EyeOrnament({ className = "" }: { className?: string }) {
  const [gaze, setGaze] = useState({ x: 0, y: 0 });
  const [blinking, setBlinking] = useState(false);
  const eyeRef = useRef<SVGSVGElement>(null);
  const blinkTimer = useRef<number>(0);

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      if (!eyeRef.current) return;
      const r = eyeRef.current.getBoundingClientRect();
      const cx = r.left + r.width / 2;
      const cy = r.top + r.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.hypot(dx, dy) || 1;
      const t = Math.min(dist / 90, 1);
      setGaze({ x: (dx / dist) * t * 7, y: (dy / dist) * t * 7 });
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, []);

  useEffect(() => {
    const schedule = () => {
      blinkTimer.current = window.setTimeout(() => {
        setBlinking(true);
        window.setTimeout(() => { setBlinking(false); schedule(); }, 160);
      }, 2800 + Math.random() * 4600);
    };
    schedule();
    return () => window.clearTimeout(blinkTimer.current);
  }, []);

  return (
    <svg ref={eyeRef} viewBox="0 0 80 80" className={className}>
      <defs>
        <radialGradient id="eyeIrisG" cx="0.4" cy="0.35" r="0.65">
          <stop offset="0" stopColor="#c8950a" />
          <stop offset="0.55" stopColor="#6b4a08" />
          <stop offset="1" stopColor="#1a0c02" />
        </radialGradient>
        <filter id="eyeGlowF" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.5" result="b" />
          <feComposite in="SourceGraphic" in2="b" operator="over" />
        </filter>
      </defs>
      {/* ornament frame lines */}
      <g stroke="var(--gold)" strokeWidth="0.7" fill="none" opacity="0.75">
        <line x1="0" y1="21" x2="13" y2="21" />
        <line x1="21" y1="0" x2="21" y2="13" />
        <line x1="28" y1="21" x2="52" y2="21" strokeDasharray="2 3" />
        <line x1="21" y1="28" x2="21" y2="52" strokeDasharray="2 3" />
        <circle cx="52" cy="21" r="1.4" fill="var(--gold)" />
        <circle cx="21" cy="52" r="1.4" fill="var(--gold)" />
      </g>
      {/* eye group — centered at 40,40 */}
      <g style={{ transform: "translate(40px,40px)" }}>
        {/* blinkable content — scaleY collapses for blink, origin at 0,0 = SVG center */}
        <g style={{
          transform: `scaleY(${blinking ? 0.05 : 1})`,
          transition: "transform 0.07s ease",
          transformOrigin: "0px 0px",
        }}>
          {/* sclera */}
          <path d="M-19 0 Q0 -13 19 0 Q0 13 -19 0 Z" fill="#f0e6cc" />
          {/* iris + pupil — translate for gaze direction */}
          <g style={{ transform: `translate(${gaze.x}px,${gaze.y}px)`, transition: "transform 0.11s ease" }}>
            <circle cx="0" cy="0" r="8.5" fill="url(#eyeIrisG)" />
            <circle cx="0" cy="0" r="4.2" fill="#050202" />
            <circle cx="2.2" cy="-2.8" r="1.6" fill="rgba(255,255,255,0.72)" />
          </g>
        </g>
        {/* lid curves — always visible (frame the closed eye) */}
        <path d="M-19 0 Q0 -13 19 0" stroke="var(--gold)" strokeWidth="1.3" fill="none" />
        <path d="M-19 0 Q0 13 19 0" stroke="var(--gold)" strokeWidth="1.1" fill="none" />
      </g>
      {/* ambient glow ring */}
      <ellipse cx="40" cy="40" rx="23" ry="14" fill="none"
        stroke="var(--gold)" strokeWidth="0.5" opacity="0.5"
        filter="url(#eyeGlowF)"
        style={{ transition: "opacity 0.1s" }}
      />
    </svg>
  );
}

/* ───────── Torch glyph — follows cursor over interactive elements ───────── */
function TorchFollower() {
  return null;
}

/* ───────── Gem cursor — amethyst with orbiting sparkles ───────── */
function MedievalCursor() {
  const mounted = useMounted();
  const [pos, setPos] = useState({ x: -300, y: -300 });
  const [interactive, setInteractive] = useState(false);
  const [pressed, setPressed] = useState(false);
  const [tick, setTick] = useState(0);
  const posRef = useRef({ x: -300, y: -300 });
  const targetRef = useRef({ x: -300, y: -300 });

  useEffect(() => {
    if (!mounted) return;
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;
    document.documentElement.classList.add("using-custom-cursor");
    const INTERACTIVE = 'a, button, [role="button"], input, textarea, select, [tabindex="0"]';
    const onMove = (e: PointerEvent) => {
      targetRef.current = { x: e.clientX, y: e.clientY };
    };
    const onOver = (e: PointerEvent) => {
      if ((e.target as Element | null)?.closest(INTERACTIVE)) setInteractive(true);
    };
    const onOut = (e: PointerEvent) => {
      if (!(e.relatedTarget as Element | null)?.closest(INTERACTIVE)) setInteractive(false);
    };
    const onDown = () => setPressed(true);
    const onUp = () => setPressed(false);

    let frame = 0;
    const tickFrame = () => {
      const current = posRef.current;
      const target = targetRef.current;
      const nextX = current.x + (target.x - current.x) * 0.18;
      const nextY = current.y + (target.y - current.y) * 0.18;
      const moved = Math.abs(nextX - current.x) > 0.01 || Math.abs(nextY - current.y) > 0.01;
      posRef.current = { x: nextX, y: nextY };
      if (moved) setPos(posRef.current);
      frame = window.requestAnimationFrame(tickFrame);
    };
    frame = window.requestAnimationFrame(tickFrame);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerover", onOver, { passive: true });
    window.addEventListener("pointerout", onOut, { passive: true });
    window.addEventListener("pointerdown", onDown);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.cancelAnimationFrame(frame);
      document.documentElement.classList.remove("using-custom-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerover", onOver);
      window.removeEventListener("pointerout", onOut);
      window.removeEventListener("pointerdown", onDown);
      window.removeEventListener("pointerup", onUp);
    };
  }, [mounted]);

  useEffect(() => {
    if (!mounted) return;
    const iv = setInterval(() => setTick((t) => (t + 1) % 240), interactive ? 110 : 320);
    return () => clearInterval(iv);
  }, [mounted, interactive]);

  if (!mounted) return null;

  const sc = pressed ? 0.88 : interactive ? 1.10 : 1;
  const glowStr = interactive
    ? "drop-shadow(0 0 11px rgba(160,0,0,0.98)) drop-shadow(0 0 5px rgba(220,50,50,0.72))"
    : "drop-shadow(0 0 6px rgba(100,0,0,0.88)) drop-shadow(0 0 2px rgba(180,20,20,0.45))";
  const PI2 = Math.PI * 2;
  // Orbit center = middle of marquise (~x=6, y=16 in SVG)
  const SP = [0, 1, 2, 3].map((i) => {
    const ang = ((tick * 8 + i * 90) % 360) * (PI2 / 360);
    const dist = 10 + i * 1.5;
    const on = (tick + i * 35) % 52 < 28;
    const sz = 1.2 + (i % 3) * 0.28;
    return { x: 6 + Math.cos(ang) * dist, y: 16 + Math.sin(ang) * dist, on, sz };
  });

  return (
    <div
      aria-hidden
      className="pointer-events-none fixed z-[999]"
      style={{
        left: pos.x - 6,
        top: pos.y - 0,
        transform: `scale(${sc})`,
        transformOrigin: "6px 0px",
        filter: glowStr,
        transition: "filter 0.06s ease-out, transform 0.04s ease-out",
        willChange: "transform",
      }}
    >
      {/* Smooth marquise ruby — pointed tip at (6,0), bottom point at (6,32) */}
      <svg width="12" height="32" viewBox="0 0 12 32" fill="none">
        <defs>
          <radialGradient id="pearRuby" cx="28%" cy="15%" r="75%">
            <stop offset="0%" stopColor={interactive ? "#cc1010" : "#880000"} />
            <stop offset="35%" stopColor={interactive ? "#780000" : "#500000"} />
            <stop offset="70%" stopColor="#2a0000" />
            <stop offset="100%" stopColor="#0c0000" />
          </radialGradient>
          <radialGradient id="marquiseSheen" cx="25%" cy="18%" r="60%">
            <stop offset="0%" stopColor="rgba(255,120,120,0.22)" />
            <stop offset="100%" stopColor="rgba(0,0,0,0)" />
          </radialGradient>
        </defs>

        {/* Main marquise silhouette — smooth bezier, tip at (6,0), bottom at (6,32) */}
        <path d="M6,0 C2,5 0,11 0,16 C0,21 2,27 6,32 C10,27 12,21 12,16 C12,11 10,5 6,0 Z"
          fill="url(#pearRuby)" stroke={interactive ? "rgba(200,50,50,0.80)" : "rgba(140,20,20,0.60)"} strokeWidth="0.55"/>

        {/* Sheen overlay */}
        <path d="M6,0 C2,5 0,11 0,16 C0,21 2,27 6,32 C10,27 12,21 12,16 C12,11 10,5 6,0 Z"
          fill="url(#marquiseSheen)"/>

        {/* Crown facet — left upper */}
        <path d="M6,0 C2,5 0,11 0,16 L3,16 L6,1 Z" fill="rgba(200,50,50,0.22)"/>
        {/* Crown facet — right upper (darker) */}
        <path d="M6,0 C10,5 12,11 12,16 L9,16 L6,1 Z" fill="rgba(60,0,0,0.28)"/>

        {/* Table facet — oval window */}
        <ellipse cx="6" cy="13" rx="3" ry="5" fill="rgba(60,0,0,0.60)" stroke="rgba(180,30,30,0.18)" strokeWidth="0.3"/>

        {/* Girdle */}
        <line x1="0" y1="16" x2="12" y2="16" stroke="rgba(212,175,90,0.30)" strokeWidth="0.5"/>

        {/* Pavilion facets */}
        <path d="M0,16 L3,16 L6,32 Z" fill="rgba(50,0,0,0.52)"/>
        <path d="M12,16 L9,16 L6,32 Z" fill="rgba(35,0,0,0.62)"/>

        {/* Primary specular — upper left */}
        <line x1="2" y1="3" x2="5" y2="10" stroke="rgba(255,255,255,0.88)" strokeWidth="1.0" strokeLinecap="round"/>
        <line x1="2.5" y1="4.5" x2="4.5" y2="9" stroke="rgba(255,200,200,0.45)" strokeWidth="0.5" strokeLinecap="round"/>

        {/* Culet tip highlight */}
        <line x1="5" y1="31" x2="7" y2="31" stroke="rgba(200,50,50,0.50)" strokeWidth="0.7" strokeLinecap="round"/>

        {/* Orbiting sparkle stars */}
        {SP.map((sp, i) =>
          sp.on ? (
            <g key={i} transform={`translate(${sp.x.toFixed(1)},${sp.y.toFixed(1)})`}>
              <line x1={-sp.sz} y1="0" x2={sp.sz} y2="0"
                stroke={interactive ? "rgba(255,100,100,0.95)" : "rgba(210,50,50,0.80)"} strokeWidth="0.75" />
              <line x1="0" y1={-sp.sz} x2="0" y2={sp.sz}
                stroke={interactive ? "rgba(255,100,100,0.95)" : "rgba(210,50,50,0.80)"} strokeWidth="0.75" />
            </g>
          ) : null
        )}

        {/* Hover tip glow */}
        {interactive && <circle cx="6" cy="16" r="5" fill="rgba(200,0,0,0.18)" style={{ filter: "blur(3px)" }} />}
        {/* Press burst */}
        {pressed && <path d="M6,0 C2,5 0,11 0,16 C0,21 2,27 6,32 C10,27 12,21 12,16 C12,11 10,5 6,0 Z"
          fill="none" stroke="rgba(255,80,80,0.40)" strokeWidth="2" style={{ filter: "blur(1px)" }}/>}
      </svg>
    </div>
  );
}

function CornerShield({ corner }: { corner: "tl" | "tr" | "bl" | "br" }) {
  const { scrollYProgress } = useScroll();
  const isLeft = corner === "tl" || corner === "bl";
  const isTop = corner === "tl" || corner === "tr";
  const floatY = useTransform(scrollYProgress, [0, 0.5, 1], [0, isTop ? -5 : 5, 0]);
  const glow = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0.28, 0.62, 0.52, 0.34]);
  const id = corner;

  // Each corner has a different charge
  const charges: Record<string, React.ReactElement> = {
    tl: <g>
          {/* Fleur-de-lis */}
          <path d="M40 22 C40 26 37 29 34 31 C32 33 33 37 36 37 C38 37 39 35 40 33 C41 35 42 37 44 37 C47 37 48 33 46 31 C43 29 40 26 40 22 Z"
            fill="rgba(212,175,90,0.55)" stroke="rgba(255,220,140,0.7)" strokeWidth="0.8"/>
          <rect x="37.5" y="37" width="5" height="7" rx="1" fill="rgba(212,175,90,0.4)" stroke="rgba(255,220,140,0.5)" strokeWidth="0.6"/>
          <rect x="34" y="43" width="12" height="2.5" rx="1" fill="rgba(212,175,90,0.5)" stroke="rgba(255,220,140,0.55)" strokeWidth="0.5"/>
        </g>,
    tr: <g stroke="rgba(255,220,140,0.75)" strokeWidth="1.6" strokeLinecap="round" fill="none">
          <line x1="40" y1="24" x2="40" y2="48"/>
          <line x1="28" y1="36" x2="52" y2="36"/>
          <circle cx="40" cy="36" r="4" fill="rgba(212,175,90,0.3)" stroke="rgba(255,220,140,0.65)" strokeWidth="1"/>
          <circle cx="40" cy="36" r="1.5" fill="rgba(255,220,140,0.6)"/>
        </g>,
    bl: <g>
          <polyline points="28,46 40,26 52,46"
            stroke="rgba(255,220,140,0.75)" strokeWidth="1.5" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/>
          <polyline points="32,46 40,32 48,46"
            stroke="rgba(212,175,90,0.35)" strokeWidth="0.8" fill="rgba(212,175,90,0.12)"
            strokeLinecap="round" strokeLinejoin="round"/>
        </g>,
    br: <path d="M40 22 L42.2 29.8 L50.5 29.8 L43.9 34.5 L46.1 42.3 L40 37.6 L33.9 42.3 L36.1 34.5 L29.5 29.8 L37.8 29.8 Z"
          stroke="rgba(255,220,140,0.7)" strokeWidth="0.9" fill="rgba(212,175,90,0.3)"
          strokeLinejoin="round"/>,
  };

  return (
    <motion.div aria-hidden className="pointer-events-none fixed z-30"
      style={{
        top: isTop ? 50 : undefined,
        bottom: isTop ? undefined : 46,
        left: isLeft ? -8 : undefined,
        right: isLeft ? undefined : -8,
        opacity: glow,
        y: floatY,
      } as any}>
      <svg width="88" height="88" viewBox="0 0 80 80"
        style={{
          transform: `scale(${isLeft ? 1 : -1},${isTop ? 1 : -1})`,
          filter: "drop-shadow(3px 5px 8px rgba(0,0,0,0.85)) drop-shadow(-1px -1px 3px rgba(212,175,90,0.18))",
        }}>
        <defs>
          {/* Main face gradient — lit from top-left */}
          <linearGradient id={`shFace${id}`} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#2a2040"/>
            <stop offset="0.45" stopColor="#1a1530"/>
            <stop offset="1" stopColor="#0d0a1e"/>
          </linearGradient>
          {/* Bevel highlight — top-left edge bright */}
          <linearGradient id={`shHi${id}`} x1="0" y1="0" x2="0.3" y2="0.3">
            <stop offset="0" stopColor="rgba(212,175,90,0.7)"/>
            <stop offset="1" stopColor="rgba(212,175,90,0)"/>
          </linearGradient>
          {/* Field inner glow */}
          <radialGradient id={`shGl${id}`} cx="0.38" cy="0.32" r="0.6">
            <stop offset="0" stopColor="rgba(80,65,130,0.3)"/>
            <stop offset="1" stopColor="rgba(20,15,40,0)"/>
          </radialGradient>
        </defs>

        {/* Drop shadow slab (depth illusion) */}
        <path d="M19 17 L65 17 L65 53 Q65 65 40 73 Q15 65 15 53 Z"
          fill="rgba(0,0,0,0.5)" transform="translate(3,3)"/>

        {/* Shield body */}
        <path d="M15 15 L65 15 L65 52 Q65 64 40 72 Q15 64 15 52 Z"
          fill={`url(#shFace${id})`}
          stroke="rgba(212,175,90,0.25)" strokeWidth="0.6"/>

        {/* Top bevel highlight edge */}
        <path d="M15 15 L65 15" stroke={`url(#shHi${id})`} strokeWidth="2.2"/>
        <path d="M15 15 L15 52" stroke="rgba(212,175,90,0.35)" strokeWidth="1.4"/>

        {/* Inner field */}
        <path d="M20 20 L60 20 L60 51 Q60 61 40 68 Q20 61 20 51 Z"
          fill={`url(#shGl${id})`}
          stroke="rgba(212,175,90,0.22)" strokeWidth="0.8"/>

        {/* Boss rivets at top corners */}
        <circle cx="16" cy="16" r="3.5" fill="#1a1530" stroke="rgba(212,175,90,0.5)" strokeWidth="0.9"/>
        <circle cx="16" cy="16" r="1.5" fill="rgba(212,175,90,0.4)"/>
        <circle cx="64" cy="16" r="3.5" fill="#1a1530" stroke="rgba(212,175,90,0.5)" strokeWidth="0.9"/>
        <circle cx="64" cy="16" r="1.5" fill="rgba(212,175,90,0.4)"/>

        {/* Dividing lines on field (per-bend horizontal + vertical) */}
        <line x1="20" y1="44" x2="60" y2="44" stroke="rgba(212,175,90,0.14)" strokeWidth="0.7"/>
        <line x1="40" y1="20" x2="40" y2="68" stroke="rgba(212,175,90,0.12)" strokeWidth="0.7"/>

        {/* Charge */}
        {charges[corner]}

        {/* Top-left corner bracket ornament */}
        <path d="M6 6 L6 18 M6 6 L18 6" stroke="rgba(212,175,90,0.5)" strokeWidth="1.4" fill="none" strokeLinecap="round"/>
        <circle cx="6" cy="6" r="1.6" fill="rgba(212,175,90,0.55)"/>
      </svg>
    </motion.div>
  );
}

/* ───────── Page Candle ───────── */
function PageCandle({ lit }: { lit: boolean }) {
  return (
    <span className="inline-flex items-end relative" style={{ width: 18, height: 36 }}>
      <svg width="18" height="36" viewBox="0 0 18 36">
        <defs>
          <radialGradient id="cFl" cx="0.5" cy="0.8" r="0.6">
            <stop offset="0" stopColor="#fff8a0" />
            <stop offset="0.5" stopColor="#ffb830" />
            <stop offset="1" stopColor="rgba(255,80,0,0)" />
          </radialGradient>
        </defs>
        <path d="M5 15 Q4 19 5 23" stroke="rgba(240,220,180,0.45)" strokeWidth="1.1" fill="none" />
        <path d="M13 17 Q14 21 13 25" stroke="rgba(240,220,180,0.35)" strokeWidth="0.9" fill="none" />
        <rect x="5" y="13" width="8" height="23" rx="2" fill="#e8d8b0" stroke="rgba(160,130,70,0.4)" strokeWidth="0.5" />
        <line x1="9" y1="13" x2="9" y2="9" stroke="#3a230a" strokeWidth="1.1" />
        <AnimatePresence>
          {lit && (
            <motion.g key="fl"
              initial={{ scale: 0, opacity: 0, y: 5 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0, opacity: 0 }}
              style={{ transformOrigin: "9px 8px" }}
            >
              {/* flame body animated via CSS transform on wrapper */}
              <motion.g
                style={{ transformOrigin: "9px 8px" }}
                animate={{ scaleX: [1, 0.78, 1.12, 0.85, 1], scaleY: [1, 1.22, 0.88, 1.14, 1], x: [0, 0.5, -0.4, 0.3, 0] }}
                transition={{ duration: 1.1, repeat: Infinity, ease: "easeInOut" }}
              >
                <ellipse cx="9" cy="5.5" rx="3.4" ry="5" fill="url(#cFl)" />
              </motion.g>
              <ellipse cx="9" cy="6.5" rx="1.4" ry="2.4" fill="rgba(255,240,120,0.95)" />
              <ellipse cx="9" cy="7.8" rx="0.6" ry="1" fill="rgba(255,255,200,0.9)" />
            </motion.g>
          )}
        </AnimatePresence>
      </svg>
      {lit && (
        <motion.div aria-hidden className="absolute pointer-events-none"
          style={{ inset: "-8px -8px -4px", borderRadius: "50%", background: "radial-gradient(circle at 50% 22%, rgba(255,175,45,0.38) 0%, transparent 65%)" }}
          animate={{ opacity: [0.55, 1, 0.65, 0.95, 0.6], scale: [0.88, 1.12, 0.94, 1.06, 0.9] }}
          transition={{ duration: 1.7, repeat: Infinity, ease: "easeInOut" }} />
      )}
    </span>
  );
}

function CandleRow({ candleLitCount, offset }: { candleLitCount: number; offset: number }) {
  return (
    <div className="flex items-end justify-center gap-8 my-0.5" aria-hidden>
      <PageCandle lit={candleLitCount > offset} />
      <PageCandle lit={candleLitCount > offset + 1} />
    </div>
  );
}

/* ───────── Extra dark ambient — cold mist, edge shadows ───────── */
function DarkMystAura({ show }: { show: boolean }) {
  const mounted = useMounted();
  const wisps = useMemo(
    () => Array.from({ length: 7 }).map((_, i) => ({
      x: 8 + (i * 13),
      y: 25 + (i % 3) * 22,
      w: 90 + (i * 18),
      delay: i * 1.4,
      dur: 16 + (i * 2.1),
      op: 0.04 + (i % 3) * 0.02,
    })),
    [],
  );
  if (!mounted) return null;
  return (
    <motion.div
      className="pointer-events-none fixed inset-0 z-[1] overflow-hidden"
      aria-hidden
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 2.4, ease: "easeInOut" } }}
    >
      <motion.div className="absolute inset-0"
        style={{ background: "radial-gradient(ellipse at 50% 50%, transparent 38%, rgba(0,0,14,0.52) 100%)", boxShadow: "inset 0 0 110px rgba(0,0,22,0.65)" }}
        animate={{ opacity: [0.7, 1, 0.72, 0.95, 0.78] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut" }} />
      {wisps.map((w, i) => (
        <motion.div key={i} className="absolute rounded-full"
          style={{ top: `${w.y}%`, width: w.w, height: 20, background: "radial-gradient(ellipse, rgba(120,135,190,0.22) 0%, transparent 70%)", filter: "blur(16px)" }}
          animate={{ x: [-w.w, 2600], opacity: [0, w.op, w.op, 0] }}
          transition={{ duration: w.dur, delay: w.delay, repeat: Infinity, ease: "linear" }} />
      ))}
      <motion.div className="absolute inset-y-0 left-0 w-14"
        style={{ background: "linear-gradient(90deg, rgba(4,4,28,0.55), transparent)" }}
        animate={{ opacity: [0.35, 0.8, 0.4] }} transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }} />
      <motion.div className="absolute inset-y-0 right-0 w-14"
        style={{ background: "linear-gradient(-90deg, rgba(4,4,28,0.55), transparent)" }}
        animate={{ opacity: [0.45, 0.85, 0.38, 0.72] }} transition={{ duration: 7.5, repeat: Infinity, ease: "easeInOut" }} />
    </motion.div>
  );
}

/* ───────── Extra candlelight ambient — warm glow halos ───────── */
function CandleMysticGlow({ show }: { show: boolean }) {
  const mounted = useMounted();
  const halos = useMemo(
    () => Array.from({ length: 5 }).map((_, i) => ({
      x: 10 + i * 20,
      dur: 4 + (i * 0.7),
      delay: i * 0.9,
      size: 180 + (i * 40),
    })),
    [],
  );
  if (!mounted) return null;
  return (
    <div className="pointer-events-none fixed inset-0 z-[1] overflow-hidden" aria-hidden>
      <motion.div className="absolute bottom-0 left-0 right-0 h-1/2"
        style={{ background: "linear-gradient(0deg, rgba(200,96,18,0.14) 0%, transparent 100%)" }}
        animate={{ opacity: [0.5, 1, 0.62, 0.9, 0.52] }}
        transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut" }} />
      {halos.map((h, i) => (
        <motion.div key={i} className="absolute bottom-0 rounded-full"
          style={{ left: `${h.x}%`, width: h.size, height: h.size / 2, marginLeft: -h.size / 2, background: "radial-gradient(ellipse at 50% 100%, rgba(255,155,36,0.2) 0%, transparent 70%)", filter: "blur(22px)" }}
          animate={{ opacity: [0.4, 0.9, 0.5, 0.82, 0.42], scaleX: [0.88, 1.12, 0.94, 1.06, 0.88] }}
          transition={{ duration: h.dur, delay: h.delay, repeat: Infinity, ease: "easeInOut" }} />
      ))}
      <motion.div className="absolute inset-0"
        style={{ background: "linear-gradient(40deg, transparent 30%, rgba(255,195,75,0.05) 50%, transparent 70%)", backgroundSize: "220% 220%" }}
        animate={{ backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"] }}
        transition={{ duration: 13, repeat: Infinity, ease: "linear" }} />
    </div>
  );
}

/* ───────── Quill Signature — draws on contact section enter ───────── */
function QuillSignature() {
  const containerRef = useRef<HTMLDivElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const [pathLen, setPathLen] = useState(9999);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "start 0.2"],
  });

  useEffect(() => {
    if (pathRef.current) setPathLen(pathRef.current.getTotalLength() || 9999);
  }, []);

  const dashOffset = useTransform(scrollYProgress, [0, 1], [pathLen, 0]);
  const dotOpacity = useTransform(scrollYProgress, [0.9, 1], [0, 1]);
  const dotScale = useTransform(scrollYProgress, [0.9, 1], [0, 1.6]);

  return (
    <div ref={containerRef} className="flex flex-col items-center mt-5 mb-1" aria-hidden>
      <svg width="310" height="72" viewBox="0 0 310 72"
        style={{ filter: "drop-shadow(0 0 8px rgba(212,175,90,0.5))" }}>
        <path d="M42 64 Q155 72 268 64" fill="none" stroke="var(--gold)" strokeWidth="0.7" opacity="0.45" />
        <path ref={pathRef}
          d="M18 50 C20 32 27 20 34 26 C40 30 38 44 43 41 C47 38 45 20 52 18 C57 15 59 31 63 37 C66 41 67 28 72 27
             M80 46 C79 28 84 16 90 20 C96 24 93 40 97 38 C101 36 99 18 105 15 C110 12 113 30 116 37 C119 43 120 29 126 26
             M140 44 C138 26 144 14 151 19 C157 24 154 39 158 37 C162 35 160 17 166 14 C171 11 175 28 177 36 C180 43 181 29 186 26 C191 23 193 38 194 41 C197 44 199 28 204 25 C209 22 211 38 212 41 C215 43 216 30 220 27 C225 24 228 40 229 43
             M237 47 C235 30 240 18 246 22 C252 26 249 39 250 41
             M258 44 C260 28 266 16 272 20 C278 24 276 36 278 38 C280 40 282 28 286 26 C290 23 293 38 294 41"
          fill="none" stroke="var(--gold-soft)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
          style={{ strokeDasharray: pathLen, strokeDashoffset: dashOffset as any }}
        />
        <motion.circle cx="294" cy="41" r="2.8" fill="var(--gold)"
          style={{ opacity: dotOpacity, scale: dotScale }}/>
      </svg>
      <p className="text-[10px] uppercase tracking-[0.35em] text-gold-soft/55 mt-0.5">— Dari Parruca</p>
    </div>
  );
}

/* ───────── Collapsible control strip — standalone toggle ───────── */
function VerticalControls({
  lang, setLang, sfxEnabled, toggleSfx, sfxVolume, setSfxVolume, gateSettings, setGateSettings, resetGate,
}: {
  lang: Lang; setLang: (l: Lang) => void;
  sfxEnabled: boolean; toggleSfx: () => void; sfxVolume: number; setSfxVolume: (v: number) => void;
  gateSettings: GateSettings; setGateSettings: (s: GateSettings) => void; resetGate: () => void;
}) {
  const [open, setOpen] = useState(false);
  return (
    <div className="relative hidden md:block">
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close controls" : "Open controls"}
        title={open ? "Collapse" : "Controls"}
        className={`inline-flex items-center justify-center w-9 h-9 rounded-full border text-gold hover:bg-gold/15 transition ${
          open ? "border-gold/70 bg-gold/8" : "border-gold/50"
        }`}
      >
        <Settings2 size={15} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.92 }}
            transition={{ duration: 0.15 }}
            className="absolute right-0 mt-2 flex flex-col gap-1.5 items-center py-2 px-1.5 rounded-xl border border-gold/28 bg-navy-deep/92 backdrop-blur-md shadow-xl z-50"
            style={{ top: "100%", minWidth: 44 }}
          >
            <LangToggle lang={lang} setLang={setLang} />
            {/* Horizontal volume control inside collapse menu */}
            <div className="w-full px-1">
              <VolumeBar enabled={sfxEnabled} toggle={toggleSfx} volume={sfxVolume} setVolume={setSfxVolume} />
            </div>
            <ScribeMode />
            <GateSettingsPopover settings={gateSettings} onChange={setGateSettings} onReset={resetGate} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ───────── Experience Timeline ───────── */
function ExperienceTimeline({ t }: { t: T }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.9", "end 0.55"] });
  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const jobs = [
    {
      role: t.jobBank, company: t.jobBankCo, period: t.jobBankPeriod,
      bullets: t.bullets.bank as unknown as string[], dropCap: true,
      icon: "◈",
    },
    {
      role: t.jobSoft, company: t.jobSoftCo, period: t.jobSoftPeriod,
      bullets: t.bullets.soft as unknown as string[], dropCap: false,
      icon: "◇",
    },
  ];

  return (
    <div ref={ref} className="relative">
      {/* vertical rail */}
      <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gold/10" aria-hidden/>
      {/* animated fill */}
      <motion.div aria-hidden className="absolute left-4 md:left-1/2 top-0 w-px -translate-x-1/2 origin-top bg-gradient-to-b from-gold/70 to-gold/20"
        style={{ height: lineHeight }}/>

      {jobs.map((job, i) => (
        <div key={i} className={`relative flex flex-col md:flex-row gap-0 md:gap-8 mb-10 ${i % 2 === 0 ? "" : "md:flex-row-reverse"}`}>
          {/* timeline dot */}
          <motion.div aria-hidden
            className="absolute left-4 md:left-1/2 -translate-x-1/2 z-10 flex items-center justify-center"
            style={{ top: 28 }}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ delay: i * 0.18, duration: 0.4, type: "spring", stiffness: 200 }}
          >
            <div className="w-8 h-8 rounded-full bg-navy-deep border-2 border-gold/70 flex items-center justify-center shadow-[0_0_14px_rgba(212,175,90,0.4)]">
              <span className="text-gold text-[11px]">{job.icon}</span>
            </div>
          </motion.div>

          {/* spacer — pushes card to right/left of center on md+ */}
          <div className="hidden md:block md:w-1/2 shrink-0" />

          {/* card */}
          <motion.div
            className="ml-12 md:ml-0 md:w-1/2 shrink-0"
            initial={{ opacity: 0, x: i % 2 === 0 ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.12, duration: 0.5, ease: "easeOut" }}
          >
            <article className="rounded-lg border border-gold/30 bg-navy/60 backdrop-blur-md p-5 hover:border-gold/55 transition">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3 className="font-bold text-ink text-[17px]">{job.role}</h3>
                <span className="italic text-gold text-sm">{job.period}</span>
              </div>
              <p className="text-gold-soft text-sm font-semibold mt-0.5">▸ {job.company}</p>
              <ul className="mt-2 space-y-1 text-[14px] text-ink-soft leading-snug">
                {job.bullets.map((b, bi) => (
                  <li key={bi} className="flex gap-2">
                    <span className="text-gold select-none">–</span>
                    <span className={job.dropCap && bi === 0 ? "drop-cap-wrap" : undefined}>
                      {job.dropCap && bi === 0 ? (
                        <>
                          <span className="float-left font-display text-gold leading-none mr-1 select-none"
                            style={{ fontSize: "2.1rem", lineHeight: 0.82, marginTop: "0.04em", textShadow: "0 0 10px rgba(212,175,90,0.65)" }}>
                            {b[0]}
                          </span>
                          {b.slice(1)}
                        </>
                      ) : b}
                    </span>
                  </li>
                ))}
              </ul>
            </article>
          </motion.div>
        </div>
      ))}
    </div>
  );
}

/* ───────── Skill Constellation ───────── */
type StarNode = { id: string; label: string; x: number; y: number; group: string; r: number };
const STAR_NODES: StarNode[] = [
  // Programming cluster (left)
  { id: "csharp",  label: "C# / .NET",    x: 80,  y: 80,  group: "lang",  r: 5.5 },
  { id: "python",  label: "Python",        x: 50,  y: 135, group: "lang",  r: 4.2 },
  { id: "sql",     label: "SQL",           x: 130, y: 115, group: "lang",  r: 4.0 },
  { id: "js",      label: "JavaScript",    x: 45,  y: 190, group: "lang",  r: 3.5 },
  { id: "bash",    label: "Bash",          x: 110, y: 175, group: "lang",  r: 3.2 },
  // Security cluster (right)
  { id: "kali",    label: "Kali Linux",    x: 380, y: 70,  group: "sec",   r: 5.2 },
  { id: "burp",    label: "Burp Suite",    x: 435, y: 120, group: "sec",   r: 4.5 },
  { id: "msf",     label: "Metasploit",    x: 360, y: 145, group: "sec",   r: 4.2 },
  { id: "wireshark",label:"Wireshark",     x: 420, y: 175, group: "sec",   r: 3.8 },
  { id: "wazuh",   label: "Wazuh / ELK",  x: 385, y: 215, group: "sec",   r: 3.5 },
  { id: "openvas", label: "OpenVAS",       x: 340, y: 195, group: "sec",   r: 3.2 },
  // Data & Automation (bottom-left)
  { id: "docker",  label: "Docker",        x: 90,  y: 260, group: "infra", r: 4.5 },
  { id: "gitlab",  label: "GitLab",        x: 155, y: 240, group: "infra", r: 4.0 },
  { id: "ssis",    label: "SSIS / ETL",    x: 60,  y: 305, group: "infra", r: 3.5 },
  { id: "rest",    label: "REST APIs",     x: 145, y: 295, group: "infra", r: 3.8 },
  { id: "powerbi", label: "Power BI",      x: 110, y: 340, group: "infra", r: 3.6 },
  // Frameworks cluster (center-bottom)
  { id: "iso",     label: "ISO 27001",     x: 250, y: 80,  group: "fw",    r: 4.8 },
  { id: "owasp",   label: "OWASP",         x: 220, y: 145, group: "fw",    r: 4.2 },
  { id: "cis",     label: "CIS Controls",  x: 280, y: 175, group: "fw",    r: 3.8 },
  { id: "mitre",   label: "MITRE ATT&CK", x: 245, y: 230, group: "fw",    r: 4.0 },
  { id: "agile",   label: "Agile/SCRUM",   x: 205, y: 290, group: "fw",    r: 3.5 },
];
const STAR_EDGES: [string, string][] = [
  ["csharp","python"],["csharp","sql"],["python","js"],["sql","bash"],["python","bash"],
  ["kali","burp"],["kali","msf"],["burp","wireshark"],["msf","openvas"],["wazuh","openvas"],["wazuh","wireshark"],
  ["docker","gitlab"],["docker","ssis"],["gitlab","rest"],["ssis","rest"],["ssis","powerbi"],["rest","powerbi"],
  ["iso","owasp"],["iso","cis"],["owasp","mitre"],["cis","mitre"],["mitre","agile"],
  ["mitre","msf"],["owasp","burp"],["iso","csharp"],["rest","csharp"],["agile","gitlab"],
];
const GROUP_COLORS: Record<string,string> = {
  lang: "rgba(100,180,255,0.8)", sec: "rgba(255,120,90,0.8)",
  infra: "rgba(100,230,160,0.8)", fw: "rgba(212,175,90,0.9)",
};
const GROUP_GLOW: Record<string,string> = {
  lang: "rgba(100,180,255,", sec: "rgba(255,120,90,",
  infra: "rgba(100,230,160,", fw: "rgba(212,175,90,",
};

function SkillConstellation() {
  const [hovered, setHovered] = useState<string | null>(null);
  const [tooltip, setTooltip] = useState<{ x: number; y: number; label: string } | null>(null);

  const activeEdgeIds = hovered
    ? new Set(STAR_EDGES.filter(([a,b]) => a === hovered || b === hovered).flatMap(([a,b]) => [a,b]))
    : null;

  return (
    <div className="rounded-xl border border-gold/25 backdrop-blur-md p-3 relative overflow-hidden"
      style={{ background: "radial-gradient(ellipse at 30% 40%, rgba(50,20,120,0.28) 0%, rgba(4,8,22,0.75) 55%), radial-gradient(ellipse at 75% 60%, rgba(20,80,120,0.18) 0%, transparent 50%)" }}>
      <div className="pointer-events-none absolute inset-x-8 -top-px h-px bg-gradient-to-r from-transparent via-gold/60 to-transparent"/>
      {/* background star field */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none" aria-hidden>
        {[...Array(28)].map((_,i) => (
          <div key={i} className="absolute rounded-full bg-white"
            style={{ width: i%5===0?2:1, height: i%5===0?2:1, opacity: 0.08+((i*37)%30)*0.01,
              left: `${(i*71+13)%100}%`, top: `${(i*53+7)%100}%` }}/>
        ))}
      </div>
      <svg viewBox="0 0 480 380" className="w-full h-auto relative z-10"
        style={{ maxHeight: 350 }} aria-label="Skill constellation">
        {/* constellation lines */}
        {STAR_EDGES.map(([a,b],i) => {
          const na = STAR_NODES.find(n=>n.id===a)!;
          const nb = STAR_NODES.find(n=>n.id===b)!;
          const isActive = activeEdgeIds?.has(a) && activeEdgeIds?.has(b);
          return (
            <line key={i} x1={na.x} y1={na.y} x2={nb.x} y2={nb.y}
              stroke={isActive ? GROUP_COLORS[na.group] : "rgba(212,175,90,0.12)"}
              strokeWidth={isActive ? 1 : 0.5}
              style={{ transition: "stroke 0.2s, stroke-width 0.2s" }}/>
          );
        })}
        {/* star nodes */}
        {STAR_NODES.map((n) => {
          const active = hovered === n.id;
          const faded = hovered && !activeEdgeIds?.has(n.id);
          const col = GROUP_COLORS[n.group];
          const glow = GROUP_GLOW[n.group];
          return (
            <g key={n.id} style={{ cursor: "default" }}
              onMouseEnter={() => {
                setHovered(n.id);
                setTooltip({ x: n.x, y: n.y - n.r - 8, label: n.label });
              }}
              onMouseLeave={() => { setHovered(null); setTooltip(null); }}>
              {active && (
                <circle cx={n.x} cy={n.y} r={n.r + 8} fill={`${glow}0.12)`}/>
              )}
              <circle cx={n.x} cy={n.y} r={active ? n.r + 2 : n.r}
                fill={active ? col : `${glow}0.35)`}
                stroke={col}
                strokeWidth={active ? 1.5 : 0.8}
                opacity={faded ? 0.2 : 1}
                style={{ transition: "all 0.18s ease, opacity 0.15s" }}/>
              {(active || n.r >= 4.5) && (
                <text x={n.x} y={n.y + n.r + 11} textAnchor="middle"
                  fontSize={active ? 9.5 : 8} fill={active ? col : "rgba(212,175,90,0.55)"}
                  fontFamily="var(--font-body)" style={{ transition: "all 0.18s", pointerEvents: "none", userSelect: "none" }}>
                  {n.label}
                </text>
              )}
              {!active && n.r < 4.5 && hovered && activeEdgeIds?.has(n.id) && (
                <text x={n.x} y={n.y + n.r + 11} textAnchor="middle"
                  fontSize={8.5} fill={col}
                  fontFamily="var(--font-body)" style={{ pointerEvents: "none", userSelect: "none" }}>
                  {n.label}
                </text>
              )}
            </g>
          );
        })}
        {/* tooltip */}
        {tooltip && (
          <g style={{ pointerEvents: "none" }}>
            <rect x={tooltip.x - tooltip.label.length * 3} y={tooltip.y - 13}
              width={tooltip.label.length * 6} height={16} rx={4}
              fill="rgba(6,13,31,0.88)" stroke="rgba(212,175,90,0.4)" strokeWidth={0.7}/>
            <text x={tooltip.x} y={tooltip.y - 2} textAnchor="middle"
              fontSize={8.5} fill="rgba(212,175,90,0.95)"
              fontFamily="var(--font-body)" style={{ userSelect: "none" }}>
              {tooltip.label}
            </text>
          </g>
        )}
        {/* group legends */}
        {[
          { label: "Programming", col: GROUP_COLORS.lang,  x: 100, y: 368 },
          { label: "Security",    col: GROUP_COLORS.sec,   x: 190, y: 368 },
          { label: "Infra",       col: GROUP_COLORS.infra, x: 280, y: 368 },
          { label: "Frameworks",  col: GROUP_COLORS.fw,    x: 370, y: 368 },
        ].map((lg) => (
          <g key={lg.label} style={{ pointerEvents: "none" }}>
            <circle cx={lg.x + 4} cy={lg.y - 3} r={3.5} fill={lg.col} opacity={0.75}/>
            <text x={lg.x + 11} y={lg.y} fontSize={8.5} fill="rgba(185,194,220,0.7)"
              fontFamily="var(--font-body)" style={{ userSelect: "none" }}>{lg.label}</text>
          </g>
        ))}
      </svg>
    </div>
  );
}

/* ───────── Theme wipe overlay ───────── */
function ThemeWipe({ theme, trigger }: { theme: string; trigger: number }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (trigger === 0) return;
    setVisible(true);
    const t = window.setTimeout(() => setVisible(false), 700);
    return () => window.clearTimeout(t);
  }, [trigger]);

  if (!visible) return null;
  return (
    <motion.div aria-hidden className="pointer-events-none fixed inset-0 z-[200]"
      initial={{ opacity: 0 }}
      animate={{ opacity: [0, 0.38, 0] }}
      transition={{ duration: 0.65, ease: "easeInOut" }}
      style={{
        background: theme === "candlelight"
          ? "radial-gradient(ellipse at 50% 30%, rgba(255,160,40,0.55) 0%, rgba(200,100,20,0.28) 50%, transparent 80%)"
          : "radial-gradient(ellipse at 50% 30%, rgba(6,13,31,0.72) 0%, rgba(20,30,60,0.45) 50%, transparent 80%)",
      }}
    />
  );
}

/* ───────── Scroll-driven parallax starfield ───────── */
const S1 = Array.from({length:55},(_,i)=>({x:(i*71+17)%100,y:(i*53+31)%300,r:i%7===0?1.8:i%3===0?1.2:0.7,o:0.06+((i*37)%40)*0.008}));
const S2 = Array.from({length:35},(_,i)=>({x:(i*97+43)%100,y:(i*67+11)%300,r:i%5===0?2.2:i%2===0?1.5:0.9,o:0.08+((i*53)%35)*0.01}));
const S3 = Array.from({length:18},(_,i)=>({x:(i*113+61)%100,y:(i*83+23)%300,r:i%3===0?3:1.8,o:0.1+((i*61)%30)*0.012}));

function ParallaxStarfield() {
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0,1], ["0%","-18%"]);
  const y2 = useTransform(scrollYProgress, [0,1], ["0%","-10%"]);
  const y3 = useTransform(scrollYProgress, [0,1], ["0%","-4%"]);
  // Mouse parallax: deeper layers shift more (stellar depth illusion)
  const [mx, setMx] = useState(0);
  const [my, setMy] = useState(0);
  const targetRef = useRef({ x: 0, y: 0 });
  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      targetRef.current = {
        x: (e.clientX / window.innerWidth - 0.5) * 2,
        y: (e.clientY / window.innerHeight - 0.5) * 2,
      };
    };
    let frame = 0;
    const tick = () => {
      const target = targetRef.current;
      setMx((value) => value + (target.x - value) * 0.14);
      setMy((value) => value + (target.y - value) * 0.14);
      frame = window.requestAnimationFrame(tick);
    };
    frame = window.requestAnimationFrame(tick);
    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.cancelAnimationFrame(frame);
      window.removeEventListener("mousemove", onMove);
    };
  }, []);
  const layers = [
    { stars: S1, y: y1, depth: 22 },  // farthest — most mouse shift
    { stars: S2, y: y2, depth: 12 },
    { stars: S3, y: y3, depth: 5 },   // nearest — least mouse shift
  ];
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
      {layers.map((layer, li) => (
        <motion.div
          key={li}
          className="absolute inset-x-0 top-0"
          style={{
            y: layer.y,
            height: "400%",
            x: mx * layer.depth,
            // Slight y mouse shift layered on top of scroll
            translateY: my * layer.depth * 0.4,
            transition: "transform 0.35s cubic-bezier(0.22,1,0.36,1)",
          } as any}
        >
          {layer.stars.map((s, si) => (
            <div key={si} className="absolute rounded-full bg-white"
              style={{ left:`${s.x}%`, top:`${s.y / 3}%`, width:s.r*2, height:s.r*2, opacity:s.o }}/>
          ))}
        </motion.div>
      ))}
    </div>
  );
}

/* ───────── Scroll-triggered section reveal ───────── */
function RevealHeading({ id, children }: { id?: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.95", "start 0.6"] });
  const x = useTransform(scrollYProgress, [0, 1], ["-100%", "0%"]);
  const lineWidth = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <div id={id} ref={ref} className="mt-14 mb-5 scroll-mt-24 overflow-hidden">
      <motion.h2
        className="font-display tracking-[0.35em] text-gold-soft text-sm md:text-base font-semibold flex items-center gap-3"
        style={{ x }}
        transition={{ ease: "easeOut" }}
      >
        <span className="text-gold">◆</span>
        <span>{children}</span>
        <span className="flex-1 relative h-px ml-3 overflow-hidden">
          <span className="absolute inset-0 bg-gold/40"/>
          <motion.span className="absolute inset-y-0 left-0 bg-gold"
            style={{ width: lineWidth, boxShadow: "0 0 8px var(--gold)" }}/>
        </span>
      </motion.h2>
    </div>
  );
}

/* ───────── Click sparks — gold particles burst on every click ───────── */
type SparkParticle = { id: number; x: number; y: number; angle: number; dist: number };

function ClickSparks() {
  const mounted = useMounted();
  const [sparks, setSparks] = useState<SparkParticle[]>([]);
  const nextId = useRef(0);

  useEffect(() => {
    if (!mounted) return;
    const onClick = (e: PointerEvent) => {
      const newSparks: SparkParticle[] = Array.from({ length: 14 }, (_, i) => ({
        id: nextId.current++,
        x: e.clientX,
        y: e.clientY,
        angle: (i / 14) * 360 + i * 3,
        dist: 10 + (i % 5) * 6,
      }));
      setSparks((prev) => [...prev.slice(-56), ...newSparks]);
      setTimeout(() => {
        const ids = new Set(newSparks.map((s) => s.id));
        setSparks((prev) => prev.filter((s) => !ids.has(s.id)));
      }, 480);
    };
    window.addEventListener("pointerdown", onClick);
    return () => window.removeEventListener("pointerdown", onClick);
  }, [mounted]);

  if (!mounted) return null;

  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 z-[997] overflow-hidden">
      {sparks.map((sp) => {
        const rad = (sp.angle * Math.PI) / 180;
        const tx = Math.cos(rad) * sp.dist;
        const ty = Math.sin(rad) * sp.dist;
        return (
          <motion.div
            key={sp.id}
            className="absolute rounded-full"
            style={{
              left: sp.x - 1.5,
              top: sp.y - 1.5,
              width: 3,
              height: 3,
              background: "radial-gradient(circle, #ffffff, rgba(210,230,255,0.85))",
              boxShadow: "0 0 4px rgba(255,255,255,0.95), 0 0 2px rgba(200,220,255,0.7)",
            }}
            initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
            animate={{ x: tx, y: ty, opacity: 0, scale: 0 }}
            transition={{ duration: 0.42, ease: "easeOut" }}
          />
        );
      })}
    </div>
  );
}

/* ───────── Sigil Builder — easter egg: click the footer rune text 3× to open ───────── */
type SigilPt = { x: number; y: number };
function SigilBuilder({ open, onClose }: { open: boolean; onClose: () => void }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pts, setPts] = useState<SigilPt[]>([]);
  const [sealed, setSealed] = useState(false);
  const [cursor, setCursor] = useState<SigilPt | null>(null);
  const W = 320, H = 320;

  useEffect(() => {
    if (!open) { setPts([]); setSealed(false); setCursor(null); }
  }, [open]);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const ctx = cv.getContext("2d")!;
    ctx.clearRect(0, 0, W, H);
    // Dark circle background
    ctx.save();
    ctx.beginPath(); ctx.arc(W/2, H/2, W/2-4, 0, Math.PI*2);
    ctx.fillStyle = "rgba(4,8,22,0.92)"; ctx.fill();
    ctx.strokeStyle = "rgba(212,175,90,0.35)"; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.restore();
    // Inner ring + tick marks
    ctx.save();
    ctx.beginPath(); ctx.arc(W/2, H/2, W/2-18, 0, Math.PI*2);
    ctx.strokeStyle = "rgba(212,175,90,0.18)"; ctx.lineWidth = 0.6; ctx.stroke();
    for (let i = 0; i < 24; i++) {
      const a = (i/24)*Math.PI*2;
      const r1 = W/2-18, r2 = i%8===0 ? W/2-10 : W/2-14;
      ctx.beginPath();
      ctx.moveTo(W/2+Math.cos(a)*r1, H/2+Math.sin(a)*r1);
      ctx.lineTo(W/2+Math.cos(a)*r2, H/2+Math.sin(a)*r2);
      ctx.strokeStyle = "rgba(212,175,90,0.22)"; ctx.lineWidth = 0.5; ctx.stroke();
    }
    ctx.restore();
    // Sigil lines
    if (pts.length > 1) {
      ctx.save();
      ctx.beginPath();
      ctx.moveTo(pts[0].x, pts[0].y);
      for (let i = 1; i < pts.length; i++) ctx.lineTo(pts[i].x, pts[i].y);
      ctx.strokeStyle = sealed ? "rgba(212,175,90,0.95)" : "rgba(212,175,90,0.70)";
      ctx.lineWidth = 1.4;
      ctx.shadowColor = "rgba(212,175,90,0.8)"; ctx.shadowBlur = sealed ? 14 : 6;
      ctx.lineJoin = "round"; ctx.lineCap = "round";
      ctx.stroke();
      ctx.restore();
    }
    // Dots at each point
    pts.forEach((p, i) => {
      ctx.save();
      ctx.beginPath(); ctx.arc(p.x, p.y, i === 0 ? 5 : 3.5, 0, Math.PI*2);
      ctx.fillStyle = i === 0 ? "rgba(212,175,90,0.95)" : "rgba(212,175,90,0.70)";
      ctx.shadowColor = "rgba(212,175,90,0.8)"; ctx.shadowBlur = 8;
      ctx.fill(); ctx.restore();
    });
    // Cursor crosshair (drawn on canvas so it works even when system cursor is hidden)
    if (cursor && !sealed) {
      ctx.save();
      ctx.strokeStyle = "rgba(212,175,90,0.85)";
      ctx.lineWidth = 1;
      ctx.shadowColor = "rgba(212,175,90,0.6)"; ctx.shadowBlur = 4;
      // Cross lines
      ctx.beginPath();
      ctx.moveTo(cursor.x - 10, cursor.y); ctx.lineTo(cursor.x - 3, cursor.y);
      ctx.moveTo(cursor.x + 3, cursor.y); ctx.lineTo(cursor.x + 10, cursor.y);
      ctx.moveTo(cursor.x, cursor.y - 10); ctx.lineTo(cursor.x, cursor.y - 3);
      ctx.moveTo(cursor.x, cursor.y + 3); ctx.lineTo(cursor.x, cursor.y + 10);
      ctx.stroke();
      // Outer circle
      ctx.beginPath(); ctx.arc(cursor.x, cursor.y, 5, 0, Math.PI*2);
      ctx.strokeStyle = "rgba(212,175,90,0.55)"; ctx.lineWidth = 0.8;
      ctx.stroke();
      // Snap indicator: show if close to last point
      if (pts.length > 0) {
        const last = pts[pts.length-1];
        const d = Math.hypot(cursor.x-last.x, cursor.y-last.y);
        if (d < 120) {
          ctx.beginPath();
          ctx.moveTo(last.x, last.y); ctx.lineTo(cursor.x, cursor.y);
          ctx.strokeStyle = "rgba(212,175,90,0.22)"; ctx.lineWidth = 0.6;
          ctx.setLineDash([3, 4]);
          ctx.stroke(); ctx.setLineDash([]);
        }
      }
      ctx.restore();
    }
  }, [pts, sealed, cursor]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (sealed) return;
    const rect = canvasRef.current!.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const dx = x - W/2, dy = y - H/2;
    if (dx*dx + dy*dy < (W/2-22)*(W/2-22)) setPts(prev => [...prev, {x, y}]);
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const rect = canvasRef.current!.getBoundingClientRect();
    setCursor({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9800] flex flex-col items-center justify-center"
          style={{ background: "rgba(2,4,14,0.92)", backdropFilter: "blur(12px)" }}
        >
          <motion.div
            initial={{ scale: 0.85, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.85, opacity: 0 }}
            className="flex flex-col items-center gap-5"
          >
            <p className="font-display text-gold tracking-[0.4em] text-xs uppercase">Sigil Forger</p>
            <p className="text-[10px] text-gold/40 tracking-widest uppercase">{sealed ? "Sigil sealed — its power is bound" : "Click within the circle to place nodes"}</p>
            <div className="relative" style={{ width: W, height: H }}>
              <canvas
                ref={canvasRef} width={W} height={H}
                onClick={handleClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setCursor(null)}
                style={{ cursor: "none", display: "block" }}
              />
              {sealed && (
                <motion.div
                  initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }}
                  className="absolute inset-0 pointer-events-none flex items-center justify-center"
                  style={{ borderRadius: "50%" }}
                >
                  <div className="absolute inset-0 rounded-full" style={{ background: "radial-gradient(circle, rgba(212,175,90,0.12) 0%, transparent 70%)", animation: "pulse 2s infinite" }}/>
                </motion.div>
              )}
            </div>
            <div className="flex gap-3">
              <button onClick={() => { setPts([]); setSealed(false); }}
                className="px-4 py-1.5 text-[11px] uppercase tracking-widest border border-gold/30 text-gold/60 hover:text-gold hover:border-gold/60 transition rounded">
                Clear
              </button>
              {!sealed && pts.length > 2 && (
                <button onClick={() => setSealed(true)}
                  className="px-4 py-1.5 text-[11px] uppercase tracking-widest border border-gold/60 text-gold hover:bg-gold/10 transition rounded"
                  style={{ boxShadow: "0 0 12px rgba(212,175,90,0.25)" }}>
                  Seal Sigil
                </button>
              )}
              <button onClick={onClose}
                className="px-4 py-1.5 text-[11px] uppercase tracking-widest border border-gold/20 text-gold/40 hover:text-gold/70 transition rounded">
                Dismiss
              </button>
            </div>
            <p className="text-[9px] text-gold/20 tracking-[0.3em] uppercase">ᛏ · the sigil holds what the tongue cannot speak · ᛏ</p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ───────── Rune sigil — icon for the seal-style submit button ───────── */
function RuneSigil() {
  return (
    <svg width="13" height="13" viewBox="0 0 13 13" fill="none" aria-hidden>
      <polygon points="6.5,0.5 12.5,6.5 6.5,12.5 0.5,6.5"
        stroke="rgba(212,175,90,0.90)" strokeWidth="1" fill="rgba(212,175,90,0.08)" />
      <polygon points="6.5,2.5 10.5,6.5 6.5,10.5 2.5,6.5"
        stroke="rgba(212,175,90,0.45)" strokeWidth="0.5" fill="none" />
      <circle cx="6.5" cy="6.5" r="1.6" fill="rgba(212,175,90,0.88)" />
    </svg>
  );
}

/* ───────── Page ───────── */

const NAV_IDS = [...NAV.map((n) => n.id), "feedback"];

const CANDLE_COUNT = 14; // 2 candles × 7 RuneDividers

function Index() {
  const [cvOpen, setCvOpen] = useState(false);
  const [sealShow, setSealShow] = useState(false);
  const [coaShow, setCoaShow] = useState(false);
  const [slamKey, setSlamKey] = useState(0);
  const [candleLitCount, setCandleLitCount] = useState(0);
  const [candleAction, setCandleAction] = useState<"lighting" | "extinguishing" | null>(null);
  const candleIntervalRef = useRef<number | null>(null);
  const [sigilOpen, setSigilOpen] = useState(false);
  const [active, setActive] = useState("home");
  const [navTarget, setNavTarget] = useState<string | null>(null);
  const sigilClicksRef = useRef<number[]>([]);
  const [doorsOpen, setDoorsOpen] = useState(false);
  const { theme, toggle, wipeTrigger } = useTheme();
  const { count: cvDownloads, track: trackCv } = useCvDownloads();
  const { settings: gateSettings, set: setGateSettings, reset: resetGate } = useGateSettings();
  const { enabled: sfxEnabled, toggle: toggleSfx, volume: sfxVolume, setVolume: setSfxVolume, knock, hoverChime, candleLight } = useAmbientSfx();
  const observedActive = useActiveSection(NAV_IDS);
  const { lang, setLang, t } = useI18n();
  const [filter, setFilter] = useState<"All" | ProjectCategory>("All");
  const { scrollYProgress: pageScroll } = useScroll();
  useMotionValueEvent(pageScroll, "change", (v) => setDoorsOpen(v > 0.72));

  const stopCandleAnimation = () => {
    if (candleIntervalRef.current !== null) {
      window.clearInterval(candleIntervalRef.current);
      candleIntervalRef.current = null;
    }
  };

  const animateCandles = (direction: "lighting" | "extinguishing") => {
    stopCandleAnimation();
    setCandleAction(direction);

    const step = () => {
      setCandleLitCount((prev) => {
        const next = direction === "lighting" ? prev + 1 : prev - 1;
        if (direction === "lighting" && next >= CANDLE_COUNT) {
          stopCandleAnimation();
          setCandleAction(null);
          return CANDLE_COUNT;
        }
        if (direction === "extinguishing" && next <= 0) {
          stopCandleAnimation();
          setCandleAction(null);
          return 0;
        }
        candleLight();
        return next;
      });
    };

    step();
    candleIntervalRef.current = window.setInterval(step, 230);
  };

  useEffect(() => {
    if (!navTarget) {
      if (observedActive) setActive(observedActive);
      return;
    }

    setActive(navTarget);
    const timer = window.setTimeout(() => setNavTarget(null), 1000);
    return () => window.clearTimeout(timer);
  }, [navTarget, observedActive]);

  const handleNavigateSection = (id: string) => {
    setActive(id);
    setNavTarget(id);
    const el = document.getElementById(id);
    if (!el) return;
    const y = window.scrollY + el.getBoundingClientRect().top - 84;
    window.scrollTo({ top: y, behavior: "smooth" });
    if (window.history.pushState) {
      window.history.pushState(null, "", `#${id}`);
    }
  };

  const lightAllCandles = () => {
    if (candleAction) {
      animateCandles(candleAction === "lighting" ? "extinguishing" : "lighting");
      return;
    }

    if (candleLitCount >= CANDLE_COUNT) {
      animateCandles("extinguishing");
      return;
    }

    if (candleLitCount <= 0) {
      animateCandles("lighting");
      return;
    }

    animateCandles("extinguishing");
  };

  const visibleProjects = filter === "All" ? projects : projects.filter((p) => p.category === filter);

  const onCvDownload = () => {
    trackCv();
    console.log("[CV] downloaded at", new Date().toISOString());
    setSealShow(true);
    window.setTimeout(() => setSealShow(false), 3200);
  };

  const showSeal = () => {
    setSealShow(true);
    window.setTimeout(() => setSealShow(false), 3200);
  };

  // Konami → scroll to top so doors close, then re-slam + knocks + coat-of-arms
  useEffect(() => () => stopCandleAnimation(), []);

  useKonami(() => {
    // First scroll to the very top so scrollYProgress → 0 (doors shut)
    window.scrollTo({ top: 0, behavior: "smooth" });
    // After scroll settles, remount tunnel so it re-animates from closed
    const delay = window.scrollY > 0 ? 700 : 0;
    setTimeout(() => {
      setSlamKey((k) => k + 1);
      knock();
      setTimeout(knock, 400);
      setTimeout(knock, 800);
      setCoaShow(true);
      setTimeout(() => setCoaShow(false), 3600);
    }, delay);
  });

  const projectFilters: ("All" | ProjectCategory)[] = ["All", "Pentest", "SOC", "GRC", "Network", "Dev"];
  const filterLabel = (f: "All" | ProjectCategory) => (f === "All" ? t.filterAll : f);

  return (
    <div className="relative min-h-screen bg-navy-deep text-ink">
      <ParallaxStarfield />
      <CathedralFrame />
      <AuroraLayer />
      <HeavenlyRays />
      <ScrollTorch />
      <StarMapNav active={active} />
      <DoorsOfDurin settings={gateSettings} onKnock={knock} slamKey={slamKey} />
      <AmbientLayer theme={theme} doorsOpen={doorsOpen} />
      <LanternCursor theme={theme} />
      <TorchFollower />
      <MedievalCursor />
      <ClickSparks />
      <WaxSeal show={sealShow} />
      <CoatOfArms show={coaShow} />
      <ThemeWipe theme={theme} trigger={wipeTrigger} />
      <CornerShield corner="tl" />
      <CornerShield corner="tr" />
      <CornerShield corner="bl" />
      <CornerShield corner="br" />
      <Navbar
        onPreviewCV={() => setCvOpen(true)}
        theme={theme} toggleTheme={toggle}
        gateSettings={gateSettings} setGateSettings={setGateSettings} resetGate={resetGate}
        active={active} sfxEnabled={sfxEnabled} toggleSfx={toggleSfx} sfxVolume={sfxVolume} setSfxVolume={setSfxVolume}
        lang={lang} setLang={setLang} t={t}
        onLightCandles={lightAllCandles} candleLitCount={candleLitCount} onNavigateSection={handleNavigateSection}
      />
      <CVDialog open={cvOpen} onOpenChange={setCvOpen} onDownload={onCvDownload} />


      <main className="relative z-10 pt-20 md:pt-24 pb-16 px-4 sm:px-6 md:px-10">
        {/* HERO */}
        <section id="home" className="max-w-5xl mx-auto min-h-[70vh] flex flex-col items-center justify-center text-center scroll-mt-24">
          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}
            className="font-display font-bold text-4xl sm:text-5xl md:text-7xl tracking-wider">
            <span className="text-ink">DARI</span>{" "}
            <span className="text-gold drop-shadow-[0_0_18px_rgba(212,175,90,0.5)]">PARRUCA</span>
          </motion.h1>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.8 }}
            className="font-display tracking-[0.4em] mt-4 text-xs sm:text-sm text-gold-soft">{t.tagline}</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7, duration: 0.8 }}
            className="max-w-2xl mt-6 text-sm sm:text-base text-ink-soft leading-relaxed">{t.heroBlurb}</motion.p>
          <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.95, duration: 0.7 }}
            className="mt-5 text-[10.5px] sm:text-xs uppercase tracking-[0.32em] text-gold/70">
            For a more immersive visit, leave the page music on.
          </motion.p>
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.8 }}
            className="mt-8 flex flex-wrap gap-3 justify-center">
            <a href="#contact" className="inline-flex items-center gap-2 bg-gold text-navy-deep px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-gold-soft transition">
              {t.contactMe}
            </a>
            <a href="#projects" className="inline-flex items-center gap-2 border border-gold/60 text-gold-soft px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-gold/10 transition">
              {t.viewWork}
            </a>
            <button onClick={() => setCvOpen(true)}
              className="inline-flex items-center gap-2 border border-gold/60 text-gold-soft px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-gold/10 transition">
              <FileText size={14} /> {t.previewCV}
            </button>
          </motion.div>
          <p className="mt-12 text-xs text-ink-soft/60 tracking-[0.3em] uppercase animate-pulse">{t.scroll}</p>
        </section>

        <RuneDivider candleOffset={0} candleLitCount={candleLitCount} />

        {/* ABOUT */}
        <section className="max-w-4xl mx-auto">
          <RevealHeading id="about">{t.aboutHeading}</RevealHeading>
          <div className="rounded-xl border border-gold/30 backdrop-blur-md p-6 md:p-8 relative overflow-hidden"
            style={{ background: "radial-gradient(ellipse at 25% 20%, rgba(90,40,160,0.22) 0%, rgba(4,8,22,0.72) 55%), radial-gradient(ellipse at 80% 80%, rgba(30,60,140,0.18) 0%, transparent 60%)" }}>
            <p className="drop-cap-wrap text-[15px] text-ink-soft leading-relaxed">
              <span className="float-left font-display text-gold leading-none mr-2 select-none"
                style={{ fontSize: "3.4rem", lineHeight: 0.78, marginTop: "0.06em", textShadow: "0 0 16px rgba(212,175,90,0.65), 0 0 4px var(--gold)" }}>
                {t.aboutBody[0]}
              </span>
              {t.aboutBody.slice(1)}
            </p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 text-center">
              {[
                ["2+", t.statYears],
                ["11", t.statProjects],
                ["3", t.statLangs],
                ["MSc", t.statMsc],
              ].map(([n, l]) => (
                <div key={l} className="rounded-md border border-gold/25 bg-navy/40 py-3">
                  <div className="font-display text-2xl text-gold">{n}</div>
                  <div className="text-xs uppercase tracking-wider text-ink-soft mt-1">{l}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        <RuneDivider candleOffset={2} candleLitCount={candleLitCount} />

        {/* SKILLS */}
        <section className="max-w-5xl mx-auto">
          <RevealHeading id="skills">{t.skillsHeading}</RevealHeading>
          <div className="mb-4"><SkillConstellation /></div>
          <div className="backdrop-blur-md border border-gold/30 rounded-xl p-5 md:p-7 grid md:grid-cols-3 gap-x-6 gap-y-6"
            style={{ background: "radial-gradient(ellipse at 70% 15%, rgba(60,30,140,0.20) 0%, rgba(4,8,22,0.70) 50%), radial-gradient(ellipse at 20% 85%, rgba(20,80,60,0.14) 0%, transparent 55%)" }}>
            <div className="space-y-5">
              <SkillCol title={t.skLanguages} items={["C# / .NET / ASP.NET MVC", "Python · Java · JavaScript", "SQL · Bash · Linux"]} />
              <SkillCol title={t.skInfrastructure} items={["Docker · GitLab · SSIS", "REST APIs · LDAP · SSMS · Power BI", "VMware"]} />
            </div>
            <div className="space-y-5">
              <SkillCol title={t.skSecurity} items={["Kali · Nmap · Metasploit", "Burp Suite · Hydra · SQLMap", "Wazuh · ELK · OpenVAS", "Wireshark"]} />
              <SkillCol title={t.skMethod} items={["Agile / SCRUM"]} />
            </div>
            <SkillCol title={t.skFrameworks} items={["ISO 27001 / 27002 / 27005", "OWASP Top 10", "CIS Controls v8", "MITRE ATT&CK · CVSS · STRIDE"]} />
          </div>
          <div className="mt-5"><TechIconsRow t={t} onHover={hoverChime} /></div>
        </section>

        <RuneDivider candleOffset={4} candleLitCount={candleLitCount} />

        {/* EXPERIENCE */}
        <section className="max-w-5xl mx-auto">
          <RevealHeading id="experience">{t.experienceHeading}</RevealHeading>
          <div className="mb-6 flex flex-wrap items-center gap-2 rounded-full border border-gold/20 bg-gold/10 px-4 py-2.5 text-sm text-ink-soft shadow-[0_0_18px_rgba(212,175,90,0.08)]">
            <span className="text-[10px] font-semibold uppercase tracking-[0.28em] text-gold">{t.currentFocusLabel}</span>
            <span className="h-1.5 w-1.5 rounded-full bg-gold/70" />
            <span>{t.currentFocusText}</span>
          </div>
          <ExperienceTimeline t={t} />
        </section>

        <RuneDivider candleOffset={6} candleLitCount={candleLitCount} />

        {/* EDUCATION */}
        <section className="max-w-5xl mx-auto">
          <RevealHeading id="education">{t.educationHeading}</RevealHeading>
          <div className="grid md:grid-cols-2 gap-5">
            <div className="space-y-3">
              <EduCard title="MSc Cyber Security & Resilience" sub="FH St. Pölten UAS · Austria" period={`2025 – ${t.eduOngoing}`} />
              <EduCard title="BSc Computer Sciences" sub="University of Tirana · Albania" period="2021 – 2024" />
              <div className="rounded-md border border-gold/25 bg-navy/34 backdrop-blur-sm p-3">
                <h4 className="font-bold text-ink text-[15px]">{t.languagesTitle}</h4>
                <p className="text-sm text-ink-soft">{t.languagesBody}</p>
              </div>
            </div>
            <div className="space-y-3">
              <EduCard title="ASP .NET MVC — Udemy" sub="" period="May–Jun 2024" />
              <EduCard title="Java Beginner & Intermediate — Tirana CoT" sub="" period="Sep 2022 – Mar 2023" />
              <EduCard title="Python — ICT Academy" sub="" period="Jan–Apr 2021" />
            </div>
          </div>
        </section>

        <RuneDivider candleOffset={8} candleLitCount={candleLitCount} />

        {/* PROJECTS */}
        <section className="max-w-6xl mx-auto">
          <RevealHeading id="projects">{t.projectsHeading}</RevealHeading>
          <p className="text-xs text-ink-soft/70 mb-4">{t.projectsHint} <span className="text-gold-soft">{t.viewReport}</span>.</p>
          <div className="flex flex-wrap gap-2 mb-5">
            {projectFilters.map((f) => {
              const isActive = filter === f;
              const count = f === "All" ? projects.length : projects.filter((p) => p.category === f).length;
              return (
                <button key={f} onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 text-[11px] uppercase tracking-wider rounded-full border transition ${
                    isActive ? "bg-gold text-navy-deep border-gold shadow-[0_0_12px_rgba(212,175,90,0.5)]"
                             : "border-gold/40 text-gold-soft hover:border-gold hover:bg-gold/10"
                  }`}>
                  {filterLabel(f)} <span className={`ml-1 ${isActive ? "text-navy-deep/70" : "text-ink-soft/70"}`}>· {count}</span>
                </button>
              );
            })}
          </div>
          <motion.div layout className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {visibleProjects.map((p) => <ProjectCard key={p.slug} p={p} t={t} />)}
          </motion.div>
          {visibleProjects.length === 0 && (
            <p className="text-center text-ink-soft/70 text-sm py-8">{t.noProjects}</p>
          )}
        </section>

        <RuneDivider candleOffset={10} candleLitCount={candleLitCount} />

        {/* CONTACT */}
        <section className="max-w-4xl mx-auto">
          <RevealHeading id="contact">{t.contactHeading}</RevealHeading>
          <div className="rounded-xl border border-gold/40 backdrop-blur-md p-6 md:p-8"
            style={{ background: "radial-gradient(ellipse at 50% 10%, rgba(80,30,130,0.24) 0%, rgba(4,8,22,0.78) 55%), radial-gradient(ellipse at 85% 90%, rgba(30,70,140,0.16) 0%, transparent 55%)" }}>
            <p className="text-center text-ink-soft max-w-xl mx-auto">{t.contactBlurb}</p>
            <div className="mt-7 grid sm:grid-cols-2 gap-3">
              <a href="mailto:parrucadari@gmail.com"
                 className="group flex items-center gap-3 rounded-lg border border-gold/30 bg-navy/42 p-4 hover:border-gold hover:bg-navy/58 transition">
                <Mail className="text-gold shrink-0" size={20} />
                <div className="min-w-0">
                  <div className="text-[11px] uppercase tracking-wider text-ink-soft">{t.email}</div>
                  <div className="text-sm text-ink truncate">parrucadari@gmail.com</div>
                </div>
              </a>
              <a href="tel:+436641472727"
                 className="group flex items-center gap-3 rounded-lg border border-gold/30 bg-navy/42 p-4 hover:border-gold hover:bg-navy/58 transition">
                <Phone className="text-gold shrink-0" size={20} />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-soft">{t.phone}</div>
                  <div className="text-sm text-ink">+43 664 147 2727</div>
                </div>
              </a>
              <a href="https://www.linkedin.com/in/dari-parruca-71ab4b122" target="_blank" rel="noreferrer"
                 className="group flex items-center gap-3 rounded-lg border border-gold/30 bg-navy/42 p-4 hover:border-gold hover:bg-navy/58 transition">
                <Linkedin className="text-gold shrink-0" size={20} />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-soft">LinkedIn</div>
                  <div className="text-sm text-ink">/in/dari-parruca</div>
                </div>
              </a>
              <div className="flex items-center gap-3 rounded-lg border border-gold/30 bg-navy/60 p-4">
                <MapPin className="text-gold shrink-0" size={20} />
                <div>
                  <div className="text-[11px] uppercase tracking-wider text-ink-soft">{t.location}</div>
                  <div className="text-sm text-ink">St. Pölten, Austria</div>
                </div>
              </div>
            </div>

            <div className="mt-6 border-t border-gold/20 pt-6">
              <h3 className="text-center text-gold-soft uppercase tracking-[0.3em] text-xs mb-4">{t.cvSection}</h3>
              <div className="flex flex-wrap justify-center gap-3">
                <button onClick={() => setCvOpen(true)}
                  className="inline-flex items-center gap-2 bg-gold text-navy-deep px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-gold-soft transition rounded">
                  <FileText size={16} /> {t.previewCV}
                </button>
                <a href="/Dari_Parruca_CV.pdf" download onClick={onCvDownload}
                   className="inline-flex items-center gap-2 border border-gold/60 text-gold-soft px-5 py-2.5 text-sm font-semibold uppercase tracking-wider hover:bg-gold/10 transition rounded">
                  <Download size={16} /> {t.downloadPDF}
                </a>
              </div>
              {cvDownloads > 0 && (
                <p className="mt-3 text-center text-[11px] uppercase tracking-[0.25em] text-ink-soft/70">
                  {t.cvCount(cvDownloads)}
                </p>
              )}
            </div>
            <QuillSignature />
          </div>
        </section>

        <RuneDivider candleOffset={12} candleLitCount={candleLitCount} />

        {/* FEEDBACK */}
        <FeedbackSection t={t} onSealed={showSeal} />

        <footer className="max-w-5xl mx-auto mt-16 pt-6 border-t border-gold/20 text-center">
          <div className="flex justify-center items-center gap-8 mb-6 flex-wrap">
            <MoonPhaseClock />
            <ZodiacWheelOrnament />
          </div>
          <div className="flex items-center justify-center gap-4 text-gold-soft mb-3">
            <a href="mailto:parrucadari@gmail.com" aria-label="Email" className="hover:text-gold"><Mail size={18} /></a>
            <a href="https://www.linkedin.com/in/dari-parruca-71ab4b122" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="hover:text-gold"><Linkedin size={18} /></a>
            <a href="tel:+436641472727" aria-label="Phone" className="hover:text-gold"><Phone size={18} /></a>
          </div>
          <p className="text-xs text-ink-soft/70 tracking-wider">© {new Date().getFullYear()} Dari Parruca · Crafted with care</p>
          <p
            className="mt-2 text-[9px] tracking-[0.3em] uppercase text-gold/28 select-none cursor-default"
            title="Triple-click to open the Sigil Forger · ↑↑↓↓←→←→ for hidden passage"
            onClick={() => {
              const now = Date.now();
              sigilClicksRef.current = [...sigilClicksRef.current.filter(t => now - t < 900), now];
              if (sigilClicksRef.current.length >= 3) {
                sigilClicksRef.current = [];
                setSigilOpen(true);
              }
            }}
          >
            ᛏ · those who know the old ways may find hidden passage · ᛏ
          </p>
        </footer>
      </main>
      <SigilBuilder open={sigilOpen} onClose={() => setSigilOpen(false)} />

      <BackToTop />
    </div>
  );
}
