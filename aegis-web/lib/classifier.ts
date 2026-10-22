export type ThreatLabel = "BENIGN" | "JAILBREAK" | "PROMPT_INJECTION";

export interface AnalysisResult {
  label: ThreatLabel;
  confidence: number;
  explanation: string;
}

type DetectionRule = {
  pattern: RegExp;
  label: Exclude<ThreatLabel, "BENIGN">;
  description: string;
};

// Normalize Unicode and Vietnamese accents so both "bỏ qua" and "bo qua" match.
function normalizeText(value: string): string {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();
}

const detectionRules: DetectionRule[] = [
  {
    pattern: /\b(ignore|disregard|forget) (all )?(previous|prior|above|earlier) (instructions|rules|directions)\b/,
    label: "PROMPT_INJECTION",
    description: "Attempts to override earlier instructions.",
  },
  {
    pattern: /\b(system override|system prompt|system message|developer message|new system instructions?)\b/,
    label: "PROMPT_INJECTION",
    description: "Claims or targets privileged system-level instructions.",
  },
  {
    pattern: /\b(reveal|show|print|expose|leak) (me )?(your |the )?(hidden|system|developer|secret) (prompt|instructions|message)\b/,
    label: "PROMPT_INJECTION",
    description: "Attempts to disclose hidden instructions.",
  },
  {
    pattern: /\b(send|upload|exfiltrate|forward) (the )?(confidential|private|secret|sensitive) (data|information|files?)\b/,
    label: "PROMPT_INJECTION",
    description: "Requests disclosure or transfer of sensitive data.",
  },
  {
    pattern: /\b(bo qua|phớt lờ|phot lo) (tat ca |moi )?(chi dan|huong dan|lenh|yeu cau) (truoc do|truoc day)\b/,
    label: "PROMPT_INJECTION",
    description: "Vietnamese instruction-override attempt detected.",
  },
  {
    pattern: /\b(huong dan he thong moi|ghi de he thong|lenh he thong moi|bo qua cac chi dan truoc do)\b/,
    label: "PROMPT_INJECTION",
    description: "Vietnamese system-override attempt detected.",
  },
  {
    pattern: /\b(gui|tiet lo|lam lo) (du lieu|thong tin|tai lieu) (bi mat|bao mat|nhay cam)\b/,
    label: "PROMPT_INJECTION",
    description: "Vietnamese sensitive-information disclosure request detected.",
  },
  {
    pattern: /\b(ignore|disable|remove|turn off) (all )?(safety|security|content) (rules|restrictions|policies|checks|filters)\b/,
    label: "JAILBREAK",
    description: "Attempts to disable safety protections.",
  },
  {
    pattern: /\b(bypass|evade|circumvent) (the )?(safety|security|content) (filter|filters|policy|policies|checks)\b/,
    label: "JAILBREAK",
    description: "Attempts to bypass safety controls.",
  },
  {
    pattern: /\byou are now (dan|an unrestricted ai|unfiltered|without restrictions)\b/,
    label: "JAILBREAK",
    description: "Attempts to assign an unrestricted assistant persona.",
  },
  {
    pattern: /\b(bo qua|vo hieu hoa|tat) (tat ca |moi )?(quy tac|chinh sach|bo loc|gioi han) (an toan|bao mat)\b/,
    label: "JAILBREAK",
    description: "Vietnamese safety-bypass attempt detected.",
  },
  {
    pattern: /\bkhong (can|phai) tuan theo (cac |nhung )?(quy tac|chinh sach) (an toan|bao mat)\b/,
    label: "JAILBREAK",
    description: "Vietnamese request to disregard safety policies detected.",
  },
];

export function classifyPrompt(prompt: string): AnalysisResult {
  const normalized = normalizeText(prompt);

  if (!normalized) {
    throw new Error("Prompt cannot be empty.");
  }

  const matches = detectionRules.filter((rule) => rule.pattern.test(normalized));

  if (matches.length === 0) {
    return {
      label: "BENIGN",
      confidence: 0.6,
      explanation:
        "No known suspicious patterns were detected by the demo rules. This does not guarantee the prompt is safe.",
    };
  }

  // Prefer injection when both categories match, as in the original demo.
  const injectionMatches = matches.filter((rule) => rule.label === "PROMPT_INJECTION");
  const selectedMatches = injectionMatches.length
    ? injectionMatches
    : matches.filter((rule) => rule.label === "JAILBREAK");

  return {
    label: selectedMatches[0].label,
    // Heuristic demonstration score, NOT a calibrated ML probability.
    confidence: Math.min(0.95, 0.7 + (selectedMatches.length - 1) * 0.08),
    explanation: [...new Set(selectedMatches.map((rule) => rule.description))].join(" "),
  };
}
