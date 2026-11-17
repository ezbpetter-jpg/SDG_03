/**
 * Client-Side Clinical Safety & Crisis Guardrails
 * Protects users from self-harm, poisoning, severe emergencies, and dangerous medication misuse.
 */

export interface GuardrailCheckResult {
  isSelfHarmOrCrisis: boolean;
  isAcuteMedicalEmergency: boolean;
  matchedKeywords: string[];
  recommendedHelpline?: {
    name: string;
    phone: string;
    descEn: string;
    descUr: string;
  };
}

// Comprehensive multilingual keywords for crisis & self-harm detection
const CRISIS_PATTERNS = [
  // English patterns
  /\bsuicide\b/i,
  /\bkill\s+myself\b/i,
  /\bend\s+my\s+life\b/i,
  /\bend\s+of\s+life\b/i,
  /\bwant\s+to\s+die\b/i,
  /\bcommit\s+suicide\b/i,
  /\bself\s*harm\b/i,
  /\bhurt\s+myself\b/i,
  /\bcut\s+myself\b/i,
  /\boverdose\b/i,
  /\btake\s+my\s+own\s+life\b/i,

  // Roman Urdu & Urdu phonetic patterns
  /\bmar\s*l[ou]\s*ga\b/i,
  /\bmar\s*l[ou]\s*gi\b/i,
  /\bmar\s*ja[ou]n\b/i,
  /\bmar\s*jana\b/i,
  /\bmarna\s*chahta\b/i,
  /\bmarna\s*chahti\b/i,
  /\bkhud\s*kushi\b/i,
  /\bkhud\s*kashi\b/i,
  /\bkhud\s*ko\s*mar\b/i,
  /\bkhud\s*ko\s*khatam\b/i,
  /\bkhatam\s*kar\s*(lu|du|na)\b/i,
  /\bzindagi\s*khatam\b/i,
  /\bjaan\s*(de|le)\s*(du|lu|nga|gi)\b/i,
  /\bzeher\s*(kha|pi)\b/i,
  /\bphansi\b/i,

  // Native Urdu text patterns
  /خودکشی/,
  /مرنا چاہتا/,
  /مرنا چاہتی/,
  /زندگی ختم/,
  /جان لے لوں/,
  /جان دے دوں/,
  /خود کو مار/,
  /زہر کھا/,
];

// Acute physical emergencies requiring immediate 1122 escalation
const ACUTE_EMERGENCY_PATTERNS = [
  /\bchest\s+pain\b/i,
  /\bheart\s+attack\b/i,
  /\bseene\s+m(ei|e)n\s+dard\b/i,
  /\bcannot\s+breathe\b/i,
  /\bshortness\s+of\s+breath\b/i,
  /\bsaans\s+m(ei|e)n\s+(takleef|mushkil|dushwari)\b/i,
  /\bheavy\s+bleeding\b/i,
  /\bkhoon\s+beh\b/i,
  /\bunconscious\b/i,
  /\bbehosh\b/i,
  /\bstroke\b/i,
  /\bfalij\b/i,
  /\bparalysis\b/i,
  /سینے میں درد/,
  /سانس لینے میں دشواری/,
  /بے ہوش/,
  /فالج/,
];

export function checkSafetyGuardrails(text: string): GuardrailCheckResult {
  const normalized = text.trim();
  const matchedKeywords: string[] = [];

  let isSelfHarmOrCrisis = false;
  let isAcuteMedicalEmergency = false;

  // Check crisis patterns
  for (const pattern of CRISIS_PATTERNS) {
    if (pattern.test(normalized)) {
      isSelfHarmOrCrisis = true;
      matchedKeywords.push(pattern.source);
    }
  }

  // Check physical emergency patterns
  for (const pattern of ACUTE_EMERGENCY_PATTERNS) {
    if (pattern.test(normalized)) {
      isAcuteMedicalEmergency = true;
      matchedKeywords.push(pattern.source);
    }
  }

  let recommendedHelpline: GuardrailCheckResult["recommendedHelpline"];

  if (isSelfHarmOrCrisis) {
    recommendedHelpline = {
      name: "Umang Mental Health & Crisis Helpline",
      phone: "0317-4288665",
      descEn: "24/7 Free, Confidential Mental Health Support in Pakistan",
      descUr: "پاکستان میں 24/7 مفت، خفیہ اور پیشہ ورانہ ذہنی صحت و بحران رہنمائی",
    };
  } else if (isAcuteMedicalEmergency) {
    recommendedHelpline = {
      name: "Rescue 1122 Pakistan",
      phone: "1122",
      descEn: "Emergency Ambulance & Medical Response Service",
      descUr: "ایمرجنسی ایمبولینس اور فوری طبی امداد سروس",
    };
  }

  return {
    isSelfHarmOrCrisis,
    isAcuteMedicalEmergency,
    matchedKeywords,
    recommendedHelpline,
  };
}
