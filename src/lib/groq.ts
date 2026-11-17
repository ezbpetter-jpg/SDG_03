import Groq from "groq-sdk";

export const GROQ_MODEL = process.env.GROQ_MODEL || "openai/gpt-oss-20b";

const rawKey = process.env.GROQ_API_KEY || "";
const apiKey = rawKey.replace(/^["']|["']$/g, "").trim();

export const groq = new Groq({
  apiKey,
});

export default groq;
