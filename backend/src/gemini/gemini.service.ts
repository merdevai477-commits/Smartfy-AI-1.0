import {
  Injectable,
  OnModuleInit,
  Logger,
  InternalServerErrorException,
} from '@nestjs/common';
import { Message } from '../messages/schemas/message.schema';

/**
 * Service for interfacing with AI API (Groq - Fast & Free!)
 */
@Injectable()
export class GeminiService implements OnModuleInit {
  private readonly logger = new Logger(GeminiService.name);
  private readonly apiKey: string;
  private readonly baseUrl = 'https://api.groq.com/openai/v1';

  private readonly generationConfig = {
    temperature: 0.8,
    max_tokens: 2048,
    top_p: 0.95,
  };

  private readonly systemPrompt = `You are Smartfy AI — a world-class marketing strategist, content creator, and digital growth expert built for ambitious brands and creators.

## Your Identity
- Name: **Smartfy AI** 🚀
- Role: Elite marketing consultant, copywriter, and content strategist
- You speak the user's language (Arabic or English) fluently and naturally

## Your Deep Expertise
You are an expert in ALL areas of modern marketing:
1. **Social Media Marketing** — Viral content, hooks, captions, hashtag strategy, platform algorithms (Instagram, TikTok, Twitter/X, LinkedIn, YouTube, Snapchat)
2. **Email Marketing** — Subject line optimization, sequences, drip campaigns, A/B testing copy
3. **SEO & Content Marketing** — Keyword research, blog strategy, pillar content, meta descriptions
4. **Paid Advertising** — Facebook/Google/TikTok Ads copy, audience targeting strategies, ad creatives
5. **Brand Storytelling** — Brand voice, mission, positioning, value propositions
6. **Influencer Marketing** — Outreach scripts, campaign briefs, collaboration strategies
7. **E-commerce Marketing** — Product descriptions, conversion optimization, cart abandonment strategies
8. **Video Marketing** — YouTube scripts, Reels/Shorts scripts, video hooks

## How You Respond
- **Always structured**: Use headers (##), bullet points, and bold text for clarity
- **Always actionable**: Give specific, implementable advice — not generic tips
- **Context-aware**: You remember the full conversation history. Reference earlier messages when relevant
- **Examples-first**: Include real-world examples, templates, and copy that users can use immediately
- **Metrics-driven**: When relevant, mention KPIs and how to measure success
- **Creative**: Generate fresh ideas, not clichés

## Tone Adaptation
Adapt your communication style based on user preference:
- If user chose "مهني" → formal, data-driven, executive tone
- If user chose "ودود" → warm, conversational, encouraging
- If user chose "إبداعي" → bold, imaginative, trend-forward
- If user chose "رسمي" → precise, structured, corporate
- If user chose "مرح" → energetic, fun, with appropriate emoji

## Important Rules
- ALWAYS maintain the conversation context — never forget what was discussed
- If a question is outside marketing/business, politely redirect: "هذا خارج تخصصي، لكن يمكنني مساعدتك في التسويق بدلاً من ذلك"
- Never give half-answers — go deep on every topic
- Use 🎯, ✅, 💡, 📊, 🚀 emojis naturally but not excessively

Remember: You are Smartfy AI — the AI marketing partner that helps businesses grow faster. 🎯`;


  constructor() {
    this.apiKey = process.env.GROQ_API_KEY || '';
  }

  onModuleInit() {
    if (!this.apiKey) {
      throw new InternalServerErrorException('GROQ_API_KEY is required');
    }
    this.logger.log('Smartfy AI initialized with Groq (Free & Fast!)');
  }

  formatHistory(messages: Message[]): any[] {
    const recentMessages = messages.slice(-10);
    return recentMessages.map((message) => ({
      role: message.role === 'assistant' ? 'assistant' : 'user',
      content: message.content,
    }));
  }

  getGenerationConfig() {
    return { ...this.generationConfig };
  }

  getApiKey(): string {
    return this.apiKey;
  }

  async *generateStreamingResponse(
    content: string,
    conversationHistory: Message[],
    imageData?: string,
    imageMimeType?: string,
  ): AsyncGenerator<string, void, unknown> {
    console.log('🤖 === SMARTFY (Groq): generateStreamingResponse ===');
    console.log('Content:', content.substring(0, 50) + '...');
    console.log('History:', conversationHistory.length, 'messages');

    const history = this.formatHistory(conversationHistory);
    const messages = [
      { role: 'system', content: this.systemPrompt },
      ...history,
      { role: 'user', content: content },
    ];

    const maxAttempts = 3;
    const baseDelay = 1000;

    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
      try {
        console.log(`🔄 Attempt ${attempt}/${maxAttempts}`);

        const response = await fetch(`${this.baseUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.apiKey}`,
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages: messages,
            temperature: this.generationConfig.temperature,
            max_tokens: this.generationConfig.max_tokens,
            top_p: this.generationConfig.top_p,
            stream: true,
          }),
        });

        if (!response.ok) {
          const errorText = await response.text();
          throw new Error(`Groq API error: ${response.status} - ${errorText}`);
        }

        console.log('✅ Groq API connected, streaming...');

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();

        if (!reader) throw new Error('No reader available');

        let chunkIndex = 0;

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n').filter(line => line.trim() !== '');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                const delta = parsed.choices?.[0]?.delta?.content;

                if (delta) {
                  chunkIndex++;
                  if (chunkIndex === 1) console.log('✅ First chunk received');
                  yield delta;
                }
              } catch (e) {
                // Skip invalid JSON
              }
            }
          }
        }

        console.log(`✅ Streaming completed. Total chunks: ${chunkIndex}\n`);
        return;

      } catch (error) {
        console.error(`❌ Attempt ${attempt} failed:`, error.message);

        if (attempt === maxAttempts) {
          throw new InternalServerErrorException(
            `Failed to generate response: ${error.message}`,
          );
        }

        const delay = baseDelay * Math.pow(2, attempt - 1);
        await new Promise((resolve) => setTimeout(resolve, delay));
      }
    }
  }
}
