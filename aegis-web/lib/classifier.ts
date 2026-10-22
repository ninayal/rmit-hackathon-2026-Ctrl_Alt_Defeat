
export type ThreatLabel =
  | "BENIGN"
  | "JAILBREAK"
  | "PROMPT_INJECTION";

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

const detectionRules: DetectionRule[] = [
  // Prompt injection patterns
  {
    pattern: /ignore (all )?(previous|prior|above) instructions/i,
    label: "PROMPT_INJECTION",
    description: "Attempts to override existing instructions.",
  },
  {
    pattern: /system (override|prompt|message)/i,
    label: "PROMPT_INJECTION",
    description: "References privileged system-level instructions.",
  },
  {
    pattern: /reveal (your )?(hidden|system|developer) (prompt|instructions)/i,
    label: "PROMPT_INJECTION",
    description: "Attempts to extract hidden instructions.",
  },
  {
    pattern: /send (confidential|private|secret) (data|information)/i,
    label: "PROMPT_INJECTION",
    description: "Requests potentially unauthorized data disclosure.",
  },
  {
    pattern: /bỏ qua (mọi |tất cả )?(chỉ dẫn|hướng dẫn|quy tắc) trước/i,
    label: "PROMPT_INJECTION",
    description: "Vietnamese instruction-override pattern detected.",
  },

  // Jailbreak patterns
  {
    pattern: /ignore (all )?(safety|security) (rules|restrictions|policies)/i,
    label: "JAILBREAK",
    description: "Attempts to bypass safety restrictions.",
  },
  {
    pattern: /bypass (the )?(safety|security|content) (filter|filters|policy|policies)/i,
    label: "JAILBREAK",
    description: "Requests bypassing safety controls.",
  },
  {
    pattern: /you are now (dan|an unrestricted ai|unfiltered)/i,
    label: "JAILBREAK",
    description: "Attempts to assign an unrestricted AI persona.",
  },
  {
    pattern: /disable (your )?(safety|security) (checks|filters|rules)/i,
    label: "JAILBREAK",
    description: "Attempts to disable safety protections.",
  },
  {
    pattern: /không cần tuân theo (quy tắc|chính sách) an toàn/i,
    label: "JAILBREAK",
    description: "Vietnamese safety-bypass pattern detected.",
  },
];

export function classifyPrompt(prompt: string): AnalysisResult {
  const normalized = prompt.trim();

  if (!normalized) {
    throw new Error("Prompt cannot be empty.");
  }

  const matches = detectionRules.filter((rule) =>
    rule.pattern.test(normalized)
  );

  if (matches.length === 0) {
    return {
      label: "BENIGN",
      confidence: 0.6,
      explanation:
        "No known suspicious patterns were detected by the demo rules. This does not guarantee that the prompt is safe.",
    };
  }

  // Prioritize prompt injection when both categories match.
  const injectionMatches = matches.filter(
    (rule) => rule.label === "PROMPT_INJECTION"
  );

  const selectedMatches =
    injectionMatches.length > 0
      ? injectionMatches
      : matches.filter((rule) => rule.label === "JAILBREAK");

  const label = selectedMatches[0].label;

  // Heuristic score for demonstration, not calibrated ML confidence.
  const confidence = Math.min(
    0.95,
    0.7 + (selectedMatches.length - 1) * 0.08
  );

  const explanations = [
    ...new Set(selectedMatches.map((rule) => rule.description)),
  ];

  return {
    label,
    confidence,
    explanation: explanations.join(" "),
  };
}
