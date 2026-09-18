const HIGH_RISK_KEYWORDS = [
  "chest pain",
  "difficulty breathing",
  "shortness of breath",
  "fainting",
  "severe bleeding",
  "unconscious",
  "heart attack",
  "stroke",
  "seizure",
  "anaphylaxis",
  "severe allergic",
];

const MEDIUM_RISK_KEYWORDS = [
  "fever",
  "persistent cough",
  "moderate pain",
  "vomiting",
  "dizziness",
  "headache",
  "stomach pain",
  "body pain",
  "diarrhea",
  "nausea",
  "infection",
  "swelling",
  "rash",
  "bleeding",
  "high blood pressure",
  "fatigue",
];

export function classifyRisk(symptomText) {
  const text = (symptomText || "").toLowerCase();

  for (const keyword of HIGH_RISK_KEYWORDS) {
    if (text.includes(keyword)) {
      return {
        level: "High Risk",
        color: "red",
        recommendation:
          "Requires immediate medical attention. Please proceed to the emergency consultation room.",
      };
    }
  }

  for (const keyword of MEDIUM_RISK_KEYWORDS) {
    if (text.includes(keyword)) {
      return {
        level: "Medium Risk",
        color: "amber",
        recommendation:
          "Schedule consultation with the attending physician. Monitor symptoms closely.",
      };
    }
  }

  return {
    level: "Low Risk",
    color: "green",
    recommendation:
      "Routine consultation recommended. Follow up if symptoms persist beyond 3 days.",
  };
}

export function generateQueueNumber(index) {
  const num = 101 + index;
  return `A-${num}`;
}

// Prototype rule: route symptom text to the right OPD department
export function classifyDepartment(symptomText) {
  const text = (symptomText || "").toLowerCase();

  const cardiologyKeywords = [
    "chest pain",
    "heart",
    "palpitation",
    "breathing",
    "breath",
    "pulse",
    "blood pressure",
    "bp",
    "cholesterol",
    "fainting",
    "dizziness",
  ];
  const orthoKeywords = [
    "knee",
    "joint",
    "bone",
    "fracture",
    "back pain",
    "spine",
    "shoulder",
    "arthritis",
    "swelling in",
    "sprain",
    "stiffness",
    "walking",
  ];

  for (const k of cardiologyKeywords) {
    if (text.includes(k)) return "Cardiology";
  }
  for (const k of orthoKeywords) {
    if (text.includes(k)) return "Orthopedics";
  }
  return "General Medicine";
}
