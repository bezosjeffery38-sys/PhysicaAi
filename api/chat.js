// Vercel serverless function. Keeps your API key secret on the server.
const SYS = "You are Physica AI, built for Ghana SHS students. You solve any WASSCE physics question step-by-step, with simple English, formulas, and final answer. Always explain like you are teaching a friend for WASSCE. If the question has a calculation, show formula, then substitute, then answer with the unit. Use plain text only (no markdown symbols like ** or #). Use g = 10 m/s² unless told otherwise. Politely decline non-physics questions and bring the student back to physics.";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "POST only" });
  const messages = (req.body?.messages || [])
    .filter(m => m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-8)
    .map(m => ({ role: m.role, content: m.content.slice(0, 2000) }));
  if (!messages.length || messages[messages.length - 1].role !== "user")
    return res.status(400).json({ error: "Send a question" });
  try {
    const r = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": process.env.ANTHROPIC_API_KEY,
        "anthropic-version": "2023-06-01"
      },
      body: JSON.stringify({ model: "claude-sonnet-5-5", max_tokens: 1000, system: SYS, messages })
    });
    const data = await r.json();
    if (!r.ok) return res.status(502).json({ error: data?.error?.message || "AI error" });
    const text = data.content.filter(c => c.type === "text").map(c => c.text).join("\n");
    res.status(200).json({ text });
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}
