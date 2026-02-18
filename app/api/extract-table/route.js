import Anthropic from "@anthropic-ai/sdk";

const client = new Anthropic();

export async function POST(request) {
  try {
    const { image } = await request.json();
    if (!image) {
      return Response.json({ error: "No image provided" }, { status: 400 });
    }
    let mediaType = "image/png";
    let base64Data = image;
    const match = image.match(/^data:(image\/\w+);base64,(.+)$/);
    if (match) {
      mediaType = match[1];
      base64Data = match[2];
    }
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 4096,
      messages: [{
        role: "user",
        content: [
          { type: "image", source: { type: "base64", media_type: mediaType, data: base64Data } },
          { type: "text", text: 'Look at this dashboard screenshot. Extract ALL table data you can see. Return a JSON object with:\n- "columns": array of column header strings\n- "rows": array of arrays, each inner array is one row\'s cell values as strings\nInclude every row and column visible. Return ONLY valid JSON, no markdown.' },
        ],
      }],
    });
    const raw = message.content[0].text.trim();
    let parsed;
    try {
      parsed = JSON.parse(raw);
    } catch {
      const jsonMatch = raw.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        parsed = JSON.parse(jsonMatch[0]);
      } else {
        return Response.json({ error: "Could not parse AI response as JSON" }, { status: 422 });
      }
    }
    if (!parsed.columns || !parsed.rows || !Array.isArray(parsed.columns) || !Array.isArray(parsed.rows)) {
      return Response.json({ error: "AI response missing columns or rows" }, { status: 422 });
    }
    return Response.json(parsed);
  } catch (e) {
    console.error("extract-table error:", e);
    const msg = e.message || "Failed to extract table data";
    return Response.json({ error: msg }, { status: 500 });
  }
}
