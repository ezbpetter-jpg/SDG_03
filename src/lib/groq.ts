import Groq from "groq-sdk";

export const GROQ_MODEL = "llama-3.1-8b-instant";

const apiKey = process.env.GROQ_API_KEY || "";

export const groq = new Groq({
  apiKey,
});

export default groq;
