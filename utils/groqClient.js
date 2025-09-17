const Groq = require("groq-sdk");

// groq-sdk may export a constructor as the default export. When using CommonJS
// `require`, some packages expose the default export on `.default`. Attempt to
// support both shapes so this file works regardless of how the package is
// transpiled/published.
const GroqConstructor = Groq && Groq.default ? Groq.default : Groq;
const client = new GroqConstructor();

const AppError = require("./appError");

const generateCompatibility = async (user1Data, user2Data) => {
  const systemPrompt = `
System: You are a love compatibility generator. Reply ONLY with valid JSON in this schema:

{
  "compatibility_percent": number (0–100),
  "funny_message": string
}

Rules for funny_message:
- Keep it SHORT (max 10 words).
- Prioritize humor, innuendo, and Gen-Z slang over technical details.
- Think: flirty roast, meme caption, dumb joke.
- Example: "you two better like pythons 🐍" or "lowkey feels like situationship vibes."
- No explanations. Just JSON.

User: Here are two users info:


User1: ${JSON.stringify(user1Data)}
User2: ${JSON.stringify(user2Data)}
`;

  // Wrap Groq call in a timeout so requests cannot hang indefinitely.
  const groqTimeoutMs = Number(process.env.GROQ_TIMEOUT_MS) || 20000;

  const makeRequest = () =>
    client.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "user", content: systemPrompt }],
      temperature: 1,
      max_completion_tokens: 8192,
      top_p: 1,
      reasoning_effort: "medium",
      stream: false,
      response_format: { type: "json_object" },
    });

  const timeoutPromise = new Promise((_, reject) => {
    const id = setTimeout(() => {
      clearTimeout(id);
      reject(new AppError("AI request timed out", 504));
    }, groqTimeoutMs);
  });

  let completion;
  try {
    completion = await Promise.race([makeRequest(), timeoutPromise]);
  } catch (err) {
    // Re-throw AppError directly, otherwise wrap other errors
    if (err instanceof AppError) throw err;
    throw new AppError("Error calling AI service", 502);
  }
  // groq-sdk returns a structure where choices[0].message may be an object
  // or a string. We try to handle both shapes.
  let payload;
  try {
    const raw = completion.choices[0].message;
    // If the SDK already returns an object use it, otherwise parse
    payload =
      typeof raw === "string"
        ? JSON.parse(raw)
        : raw.content
        ? JSON.parse(raw.content)
        : raw;
  } catch (err) {
    throw new AppError("Invalid response from AI service", 502);
  }

  // Validate schema
  if (
    !payload ||
    typeof payload.compatibility_percent !== "number" ||
    payload.compatibility_percent < 0 ||
    payload.compatibility_percent > 100 ||
    typeof payload.funny_message !== "string"
  ) {
    throw new AppError("AI returned unexpected schema", 502);
  }

  return payload;
};

module.exports = { generateCompatibility };
