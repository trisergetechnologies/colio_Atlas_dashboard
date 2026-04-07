/**
 * Must stay in sync with colio-backend/src/models/User.js
 * (consultantProfile.category enum and consultantProfile.skills enum).
 */
export const CONSULTANT_CATEGORIES = [
  "Loneliness",
  "Breakup",
  "Feeling Low",
  "Stress",
  "Overthinking",
] as const;

export type ConsultantCategory = (typeof CONSULTANT_CATEGORIES)[number];

export const CONSULTANT_SKILLS = [
  "active-listening",
  "empathy",
  "stress-management",
  "relationship-advice",
  "career-guidance",
  "general-chat",
  "anxiety-support",
  "motivation",
  "life-coaching",
] as const;

export type ConsultantSkill = (typeof CONSULTANT_SKILLS)[number];

/** Human-readable labels for skills UI */
export const CONSULTANT_SKILL_LABELS: Record<ConsultantSkill, string> = {
  "active-listening": "Active listening",
  empathy: "Empathy",
  "stress-management": "Stress management",
  "relationship-advice": "Relationship advice",
  "career-guidance": "Career guidance",
  "general-chat": "General chat",
  "anxiety-support": "Anxiety support",
  motivation: "Motivation",
  "life-coaching": "Life coaching",
};
