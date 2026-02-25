import { Test, TestingModule } from '@nestjs/testing';
import { InternalServerErrorException } from '@nestjs/common';
import { GeminiService } from './gemini.service';

describe('GeminiService', () => {
  let service: GeminiService;
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset environment before each test
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  describe('API Key Validation', () => {
    it('should throw error when API key is missing', async () => {
      // Remove API key from environment
      delete process.env.GEMINI_API_KEY;

      const module: TestingModule = await Test.createTestingModule({
        providers: [GeminiService],
      }).compile();

      // Expect error during initialization
      expect(() => {
        const service = module.get<GeminiService>(GeminiService);
        service.onModuleInit();
      }).toThrow(InternalServerErrorException);
    });

    it('should initialize successfully when API key is present', async () => {
      // Set valid API key
      process.env.GEMINI_API_KEY = 'test-api-key-12345';

      const module: TestingModule = await Test.createTestingModule({
        providers: [GeminiService],
      }).compile();

      service = module.get<GeminiService>(GeminiService);

      // Should not throw
      expect(() => service.onModuleInit()).not.toThrow();
    });

    it('should validate API key exists on initialization', async () => {
      process.env.GEMINI_API_KEY = 'test-api-key-12345';

      const module: TestingModule = await Test.createTestingModule({
        providers: [GeminiService],
      }).compile();

      service = module.get<GeminiService>(GeminiService);
      service.onModuleInit();

      // Verify API key is stored
      expect(service.getApiKey()).toBe('test-api-key-12345');
    });
  });

  describe('Generation Configuration', () => {
    beforeEach(async () => {
      process.env.GEMINI_API_KEY = 'test-api-key-12345';

      const module: TestingModule = await Test.createTestingModule({
        providers: [GeminiService],
      }).compile();

      service = module.get<GeminiService>(GeminiService);
      service.onModuleInit();
    });

    it('should configure temperature parameter', () => {
      const config = service.getGenerationConfig();
      expect(config.temperature).toBe(0.7);
    });

    it('should configure maxOutputTokens parameter', () => {
      const config = service.getGenerationConfig();
      expect((config as any).maxOutputTokens).toBe(2048);
    });

    it('should configure topP parameter', () => {
      const config = service.getGenerationConfig();
      expect((config as any).topP).toBe(0.95);
    });

    it('should configure topK parameter', () => {
      const config = service.getGenerationConfig();
      expect((config as any).topK).toBe(40);
    });
  });

  describe('Conversation History Formatting', () => {
    beforeEach(async () => {
      process.env.GEMINI_API_KEY = 'test-api-key-12345';

      const module: TestingModule = await Test.createTestingModule({
        providers: [GeminiService],
      }).compile();

      service = module.get<GeminiService>(GeminiService);
      service.onModuleInit();
    });

    it('should format empty message array', () => {
      const result = service.formatHistory([]);
      expect(result).toEqual([]);
    });

    it('should map user role correctly', () => {
      const messages = [
        {
          id: 1,
          conversationId: 'conv-1',
          role: 'user' as const,
          content: 'Hello',
          isStreaming: false,
          createdAt: new Date(),
        },
      ];

      const result = service.formatHistory(messages as any);
      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('user');
      expect(result[0].parts).toEqual([{ text: 'Hello' }]);
    });

    it('should map assistant role to model', () => {
      const messages = [
        {
          id: 1,
          conversationId: 'conv-1',
          role: 'assistant' as const,
          content: 'Hi there!',
          isStreaming: false,
          createdAt: new Date(),
        },
      ];

      const result = service.formatHistory(messages as any);
      expect(result).toHaveLength(1);
      expect(result[0].role).toBe('model');
      expect(result[0].parts).toEqual([{ text: 'Hi there!' }]);
    });

    it('should format multiple messages in order', () => {
      const messages = [
        {
          id: 1,
          conversationId: 'conv-1',
          role: 'user' as const,
          content: 'Hello',
          isStreaming: false,
          createdAt: new Date('2024-01-01T10:00:00Z'),
        },
        {
          id: 2,
          conversationId: 'conv-1',
          role: 'assistant' as const,
          content: 'Hi there!',
          isStreaming: false,
          createdAt: new Date('2024-01-01T10:00:01Z'),
        },
        {
          id: 3,
          conversationId: 'conv-1',
          role: 'user' as const,
          content: 'How are you?',
          isStreaming: false,
          createdAt: new Date('2024-01-01T10:00:02Z'),
        },
      ];

      const result = service.formatHistory(messages as any);
      expect(result).toHaveLength(3);
      expect(result[0].role).toBe('user');
      expect(result[0].parts[0].text).toBe('Hello');
      expect(result[1].role).toBe('model');
      expect(result[1].parts[0].text).toBe('Hi there!');
      expect(result[2].role).toBe('user');
      expect(result[2].parts[0].text).toBe('How are you?');
    });

    it('should limit context window to last 10 messages', () => {
      // Create 15 messages
      const messages = Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        conversationId: 'conv-1',
        role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        content: `Message ${i + 1}`,
        isStreaming: false,
        createdAt: new Date(`2024-01-01T10:00:${String(i).padStart(2, '0')}Z`),
      }));

      const result = service.formatHistory(messages as any);
      
      // Should only return last 10 messages
      expect(result).toHaveLength(10);
      
      // Verify it's the last 10 messages (messages 6-15)
      expect(result[0].parts[0].text).toBe('Message 6');
      expect(result[9].parts[0].text).toBe('Message 15');
    });

    it('should handle messages with exactly 10 items', () => {
      const messages = Array.from({ length: 10 }, (_, i) => ({
        id: i + 1,
        conversationId: 'conv-1',
        role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        content: `Message ${i + 1}`,
        isStreaming: false,
        createdAt: new Date(`2024-01-01T10:00:${String(i).padStart(2, '0')}Z`),
      }));

      const result = service.formatHistory(messages as any);
      expect(result).toHaveLength(10);
      expect(result[0].parts[0].text).toBe('Message 1');
      expect(result[9].parts[0].text).toBe('Message 10');
    });

    it('should handle messages with less than 10 items', () => {
      const messages = Array.from({ length: 5 }, (_, i) => ({
        id: i + 1,
        conversationId: 'conv-1',
        role: (i % 2 === 0 ? 'user' : 'assistant') as 'user' | 'assistant',
        content: `Message ${i + 1}`,
        isStreaming: false,
        createdAt: new Date(`2024-01-01T10:00:${String(i).padStart(2, '0')}Z`),
      }));

      const result = service.formatHistory(messages as any);
      expect(result).toHaveLength(5);
    });

    it('should preserve message content exactly', () => {
      const specialContent = 'Hello! This has special chars: @#$%^&*()_+{}[]|\\:";\'<>?,./';
      const messages = [
        {
          id: 1,
          conversationId: 'conv-1',
          role: 'user' as const,
          content: specialContent,
          isStreaming: false,
          createdAt: new Date(),
        },
      ];

      const result = service.formatHistory(messages as any);
      expect(result[0].parts[0].text).toBe(specialContent);
    });
  });
});
