export interface ClinicalProtocol {
  id: string;
  title: string;
  keywords: string[];
  protocol: string;
  severity: "emergency" | "urgent" | "routine" | "home";
}

export const CLINICAL_PROTOCOLS: ClinicalProtocol[] = [
  {
    id: "cardiac-chest-pain",
    title: "Cardiac Emergency & Acute Chest Pain",
    keywords: [
      "chest", "cardiac", "heart", "crushing", "pressure", "jaw", "left arm",
      "angina", "heart attack", "seene mein dard", "seena", "dil ka daura", "tightness"
    ],
    protocol: "EMERGENCY PROTOCOL (WHO / ESI Level 1-2): Crushing central retrosternal chest pressure or pain radiating to left arm, neck, jaw, or back, associated with diaphoresis (sweating), dyspnea, nausea, or lightheadedness is presumed Acute Coronary Syndrome (ACS). Action: Keep patient sitting upright or semi-reclined. Never exert. Instruct immediate transfer to nearest emergency center with cardiac capabilities or call 1122 immediately. If conscious and not allergic or contraindicated, chewable aspirin 300mg may be administered.",
    severity: "emergency"
  },
  {
    id: "respiratory-distress",
    title: "Acute Respiratory Distress & Asthma Exacerbation",
    keywords: [
      "breathing", "breathless", "wheeze", "asthma", "oxygen", "inhale", "lungs",
      "dyspnea", "saans", "saans lene mein dushwari", "dam", "khansi breathless"
    ],
    protocol: "EMERGENCY PROTOCOL (ESI Level 1-2): Inability to complete full sentences in one breath, audible wheezing/stridor, cyanosis (blue lips/fingertips), respiratory rate > 30/min, or intercostal retractions indicates impending respiratory failure. Action: Sit upright, loosen tight clothing. If patient has a prescribed reliever inhaler (Salbutamol), administer 2-4 puffs via spacer immediately. Call 1122 or arrange immediate ambulance transport with supplemental oxygen.",
    severity: "emergency"
  },
  {
    id: "stroke-fast",
    title: "Acute Stroke & Neurological Deficit (FAST Protocol)",
    keywords: [
      "stroke", "face droop", "arm weak", "speech slur", "fast", "vision loss sudden",
      "numbness", "falij", "lakwa", "bolne mein mushkil", " paralysis", "hemiparesis"
    ],
    protocol: "EMERGENCY PROTOCOL (ESI Level 1): Sudden focal neurological deficit assessed by FAST criteria: Facial asymmetry/droop, Arm drift/weakness, Slurred or absent speech, Time critical. Every minute brain tissue is lost (Time is Brain). Action: Note exact time of onset. Do NOT administer food, water, or aspirin (risk of hemorrhagic stroke or aspiration). Immediate transfer via 1122 to a stroke-ready center capable of neuroimaging (CT scan) within the acute thrombolysis window.",
    severity: "emergency"
  },
  {
    id: "high-fever-sepsis",
    title: "High Fever, Rigors & Sepsis Warning",
    keywords: [
      "fever", "temperature", "39", "40", "41", "rigor", "chills", "shivering",
      "hot", "bukhar", "tez bukhar", "sepsis", "lethargy", "mottled"
    ],
    protocol: "URGENT TO EMERGENCY PROTOCOL: Persistent high fever (>39°C or 102.2°F), rigors, extreme shivering, altered mental confusion, tachycardia, or cold mottled extremities indicate possible systemic bacterial infection or sepsis (or severe dengue/malaria endemic in Pakistan). Action: Tepid sponging, oral rehydration. Urgent same-day physician evaluation or emergency care if accompanied by low BP, stiff neck, or petechial rash. Paracetamol for comfort; avoid NSAIDs if dengue is suspected.",
    severity: "urgent"
  },
  {
    id: "acute-abdominal-pain",
    title: "Acute Abdomen & Severe Abdominal Pain",
    keywords: [
      "abdomen", "stomach", "belly", "nausea", "vomit", "pain after eating",
      "upper right", "pet dard", "pet mein shadeed dard", "appendix", "gallbladder"
    ],
    protocol: "URGENT PROTOCOL: Severe, localized, or progressive abdominal pain, especially if associated with rigid guarding, rebound tenderness, persistent vomiting, high fever, or hematemesis (vomiting blood). Right lower quadrant pain suggests appendicitis; right upper quadrant suggests cholecystitis. Action: Nil by mouth (do not feed or give pain relievers that mask clinical signs). Urgent clinical evaluation by a general surgeon or primary clinic.",
    severity: "urgent"
  },
  {
    id: "head-injury-concussion",
    title: "Head Trauma, Concussion & Intracranial Pressure",
    keywords: [
      "head", "hit", "fall", "concussion", "unconscious", "dizzy", "confusion",
      "sar", "sar mein chot", "sar phatna", "vomiting after head injury"
    ],
    protocol: "URGENT TO EMERGENCY PROTOCOL: Head trauma with any loss of consciousness (even momentary), retrograde amnesia, persistent vomiting (>2 episodes), unequal pupils, cerebrospinal fluid leak from ears/nose, or worsening lethargy requires urgent non-contrast CT brain. Action: Immobilize cervical spine if fall was from height or road traffic accident. Do not allow patient to sleep unmonitored.",
    severity: "urgent"
  },
  {
    id: "anaphylaxis-allergy",
    title: "Severe Allergic Reaction & Anaphylaxis",
    keywords: [
      "allergy", "rash", "hives", "throat swelling", "anaphylaxis", "reaction",
      "allergic", "kharish", "gala band hona", "soojan", "lip swelling", "tongue"
    ],
    protocol: "EMERGENCY PROTOCOL (ESI Level 1): Rapidly evolving urticaria (hives), angioedema (swelling of lips, tongue, uvula), stridor or throat tightness, wheeze, or hypotension following food, medication (e.g. penicillin, sulfa), or insect bite constitutes life-threatening anaphylaxis. Action: Immediate intramuscular Epinephrine (Adrenaline) 0.5mg if available. Call 1122 immediately. Lay patient flat with legs elevated unless respiratory distress requires sitting.",
    severity: "emergency"
  },
  {
    id: "diabetic-emergency",
    title: "Diabetic Ketoacidosis & Severe Hypoglycemia",
    keywords: [
      "sugar", "glucose", "hypoglycemia", "hyperglycemia", "diabetic", "insulin",
      "faint", "dizzy", "diabetes", "kamzor", "behoshi", "sugar low", "sugar high"
    ],
    protocol: "EMERGENCY PROTOCOL: Hypoglycemia (Blood glucose < 70 mg/dL): diaphoresis, tremors, confusion, seizure, coma. If conscious: Rule of 15 (15g rapid carbs: 3-4 glucose tablets, half cup fruit juice or 3 tsp sugar in water); retest in 15 min. If unconscious: Do NOT force liquids; seek immediate IV dextrose or glucagon via emergency services. Hyperglycemia (>300 mg/dL) with Kussmaul rapid breathing and fruity breath indicates Diabetic Ketoacidosis (DKA) requiring hospital admission.",
    severity: "emergency"
  },
  {
    id: "hypertensive-crisis",
    title: "Hypertensive Urgency and Crisis",
    keywords: [
      "blood pressure", "bp", "hypertension", "180", "severe headache", "bp high",
      "blood pressure barh gaya", "chakkar bp", "vision blurred"
    ],
    protocol: "URGENT TO EMERGENCY PROTOCOL: Blood pressure systolic > 180 mmHg or diastolic > 120 mmHg. If accompanied by end-organ symptoms (crushing chest pain, shortness of breath, acute neurological deficits, papilledema, encephalopathy), this is a Hypertensive Emergency requiring immediate emergency room admission and IV antihypertensives. If asymptomatic (Hypertensive Urgency), arrange prompt same-day medical review.",
    severity: "urgent"
  },
  {
    id: "poisoning-overdose",
    title: "Poisoning, Chemical Ingestion & Drug Overdose",
    keywords: [
      "poison", "overdose", "ingested", "bleach", "medication excess", "pills",
      "zahr", "dawa zyada kha li", "phenyl", "acid peena"
    ],
    protocol: "EMERGENCY PROTOCOL: Acute exposure or ingestion of toxic substances (pesticides, household caustic chemicals, excessive paracetamol/sedatives). Action: Do NOT induce vomiting (risk of chemical burn or aspiration). Do NOT give neutralizing acids/bases. Collect the chemical container or medication blister packs. Immediately transport patient to the nearest hospital or contact National Poisons Centre / 1122.",
    severity: "emergency"
  },
  {
    id: "pediatric-fever-seizure",
    title: "Pediatric High Fever & Febrile Convulsion",
    keywords: [
      "child", "baby", "infant", "febrile", "convulsion", "bacha", "seizure",
      "bacche ko bukhar", "jhatke", "chota bacha bukhar"
    ],
    protocol: "URGENT PROTOCOL: Fever in infants < 3 months is a medical emergency requiring full sepsis workup. In children aged 6 months to 5 years, sudden temperature spike can trigger febrile convulsions (rhythmic twitching, upward eye rolling). Action during convulsion: Place child on side (recovery position), clear surrounding hazards, do not place anything in mouth, time the seizure. If > 5 minutes, call 1122. Administer pediatric paracetamol suspension as per weight.",
    severity: "urgent"
  },
  {
    id: "mental-health-crisis",
    title: "Acute Psychological Distress & Crisis Intervention",
    keywords: [
      "suicide", "self harm", "hopeless", "can't go on", "khatam karna", "marna",
      "dil nahi karta jeene ko", "depression", "panic attack", "overdose intentional"
    ],
    protocol: "EMERGENCY CRISIS PROTOCOL: Explicit suicidal ideation, self-harm gestures, or acute agitation. Action: Maintain continuous supportive visual contact; do not leave patient alone. Remove sharp objects and medications. Encourage immediate contact with trusted family or mental health emergency hotlines (Pakistan Mental Health Helpline Umang: 0317-4288665, Rozan Helpline: 0800-22444, or emergency services 1122).",
    severity: "emergency"
  },
  {
    id: "wound-hemorrhage",
    title: "Acute Traumatic Wound & Uncontrolled Bleeding",
    keywords: [
      "bleeding", "wound", "cut", "laceration", "uncontrolled blood", "zakhm",
      "khoon beh raha hai", "khoon band nahi ho raha", "tourniquet"
    ],
    protocol: "URGENT TO EMERGENCY PROTOCOL: Active arterial (pulsatile, bright red) or profuse venous hemorrhage. Action: Apply firm, direct, continuous pressure using clean cloth or sterile gauze for at least 10 minutes without releasing to check. Elevate bleeding limb above heart level if no fracture. If limb bleeding continues unabated, apply an approved tourniquet 2-3 inches proximal to wound. Seek urgent surgical closure / suture at emergency clinic.",
    severity: "urgent"
  },
  {
    id: "urinary-kidney",
    title: "Urinary Tract Infection & Renal Colic",
    keywords: [
      "urine", "burning", "kidney", "blood in urine", "flank pain", "peshab",
      "peshab mein jalan", "gurday mein dard", "stone", "hematuria"
    ],
    protocol: "ROUTINE TO URGENT PROTOCOL: Dysuria (burning urination), urinary frequency, and suprapubic discomfort suggest uncomplicated lower UTI requiring urine routine analysis and targeted antibiotics. Severe unilateral loin-to-groin spasmodic pain with hematuria suggests renal calculus (kidney stone). High fever with flank tenderness and chills indicates ascending pyelonephritis requiring urgent medical evaluation.",
    severity: "routine"
  },
  {
    id: "minor-respiratory-cold",
    title: "Common Cold, Acute Viral Pharyngitis & Flu",
    keywords: [
      "cold", "cough", "runny nose", "mild fever", "sore throat", "nazla",
      "zukam", "gala kharab", "khansi", "body ache", "flu"
    ],
    protocol: "HOME CARE / ROUTINE PROTOCOL: Self-limiting upper respiratory viral illness. Action: Rest, generous warm oral fluids (green tea, broth, honey for cough), warm saline gargles, steam inhalation. Paracetamol for myalgia or mild pyrexia. Antibiotics are NOT indicated for uncomplicated viral cold/flu. Consult a physician if symptoms worsen after 7 days, or if chest pain or shortness of breath develops.",
    severity: "home"
  }
];
