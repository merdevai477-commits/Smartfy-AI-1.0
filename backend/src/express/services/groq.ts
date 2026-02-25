const baseUrl = "https://api.groq.com/openai/v1";

const generationConfig = {
  temperature: 0.8,
  max_tokens: 2048,
  top_p: 0.95,
};

const baseSystemPrompt = `أنت Smartfy، مساعد ذكاء اصطناعي محترف ومبدع متخصص في التسويق وكتابة المحتوى.

شخصيتك:
- اسمك Smartfy وأنت خبير تسويق رقمي ذكي ومبدع
- تتحدث بأسلوب احترافي ودود وملهم
- تفهم احتياجات العملاء وتقدم حلول إبداعية
- متخصص في كتابة المحتوى التسويقي بكل أنواعه

مجالات تخصصك:
✅ كتابة محتوى السوشيال ميديا
✅ إعداد خطط المحتوى
✅ كتابة الإعلانات التسويقية
✅ صياغة الإيميلات التسويقية
✅ تطوير الاستراتيجيات التسويقية

قواعد مهمة:
❌ لا تجيب على أي أسئلة خارج نطاق التسويق
✅ دائماً قدم محتوى عالي الجودة
`;

export type HistoryMessage = { role: "user" | "assistant"; content: string };

export type UserContext = {
  name?: string | null;
  brandName?: string | null;
  address?: string | null;
  tone?: string | null;
};

export async function* generateStreamingResponse(
  content: string,
  conversationHistory: HistoryMessage[],
  user?: UserContext,
): AsyncGenerator<string, void, unknown> {
  const apiKey = process.env.GROQ_API_KEY || "";
  if (!apiKey) throw new Error("GROQ_API_KEY is required");

  const history = conversationHistory.slice(-10).map((m) => ({
    role: m.role,
    content: m.content,
  }));

  const userLines: string[] = [];
  if (user?.name) userLines.push(`- اسم المستخدم: ${user.name}`);
  if (user?.brandName) userLines.push(`- اسم البراند: ${user.brandName}`);
  if (user?.address) userLines.push(`- المنطقة / العنوان: ${user.address}`);
  if (user?.tone) userLines.push(`- تفضيلات النبرة: ${user.tone}`);

  const personalizedPrompt =
    baseSystemPrompt +
    (userLines.length
      ? `\n\nمعلومات عن المستخدم الحالي:\n${userLines.join(
          "\n",
        )}\n\nقواعد إضافية:\n- استخدم اسم المستخدم في الترحيب والردود عندما يكون مناسبًا.\n- إذا سأل المستخدم "ما اسمي؟" أو "فاكر اسمي؟" فأجب مباشرة: "اسمك هو ${user?.name || "الاسم الذي أدخلته في ملفك الشخصي"}".\n- حافظ على النبرة المذكورة في التفضيلات قدر الإمكان.`
      : "");

  const messages = [
    { role: "system", content: personalizedPrompt },
    ...history,
    { role: "user", content },
  ];

  const response = await fetch(`${baseUrl}/chat/completions`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "llama-3.3-70b-versatile",
      messages,
      temperature: generationConfig.temperature,
      max_tokens: generationConfig.max_tokens,
      top_p: generationConfig.top_p,
      stream: true,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => "");
    throw new Error(`Groq API error: ${response.status} - ${errorText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) throw new Error("No response reader available");

  const decoder = new TextDecoder();

  while (true) {
    const { done, value } = await reader.read();
    if (done) break;

    const chunk = decoder.decode(value, { stream: true });
    const lines = chunk.split("\n").filter((l) => l.trim() !== "");
    for (const line of lines) {
      if (!line.startsWith("data: ")) continue;
      const data = line.slice(6);
      if (data === "[DONE]") continue;
      try {
        const parsed = JSON.parse(data);
        const delta = parsed.choices?.[0]?.delta?.content;
        if (delta) yield delta;
      } catch {
        // ignore
      }
    }
  }
}

