/**
 * TypeScript types for Google Gemini API integration
 */

/**
 * Role types for conversation messages
 */
export type MessageRole = 'user' | 'model';

/**
 * Content part for text messages
 */
export interface TextPart {
  text: string;
}

/**
 * Content part for inline image data
 */
export interface InlineDataPart {
  inlineData: {
    mimeType: string;
    data: string; // base64 encoded
  };
}

/**
 * Union type for content parts
 */
export type ContentPart = TextPart | InlineDataPart;

/**
 * Content structure for Gemini API requests
 */
export interface GeminiContent {
  role: MessageRole;
  parts: ContentPart[];
}

/**
 * Generation configuration parameters
 */
export interface GenerationConfig {
  temperature?: number;
  maxOutputTokens?: number;
  topP?: number;
  topK?: number;
}

/**
 * Request payload for Gemini API
 */
export interface GeminiRequest {
  contents: GeminiContent[];
  generationConfig?: GenerationConfig;
}

/**
 * Response chunk from streaming API
 */
export interface GeminiResponseChunk {
  text: string;
}

/**
 * Error response from Gemini API
 */
export interface GeminiError {
  code: string;
  message: string;
  status?: string;
}

/**
 * Stream event types for SSE
 */
export type StreamEventType = 'chunk' | 'complete' | 'error';

/**
 * SSE event data structure
 */
export interface StreamEventData {
  content?: string;
  messageId?: string;
  error?: {
    code: string;
    message: string;
    messageAr: string;
  };
}

/**
 * SSE event structure
 */
export interface StreamEvent {
  type: StreamEventType;
  data: StreamEventData;
}

/**
 * Configuration for retry logic
 */
export interface RetryConfig {
  maxAttempts: number;
  baseDelay: number; // milliseconds
  maxDelay: number; // milliseconds
  backoffMultiplier: number;
  retryableErrors: string[];
}

/**
 * Error log structure
 */
export interface ErrorLog {
  timestamp: string; // ISO 8601
  errorCode: string;
  errorType: 'API' | 'NETWORK' | 'VALIDATION' | 'DATABASE';
  message: string;
  userId?: string;
  conversationId?: string;
  requestId?: string;
  stackTrace?: string;
  metadata?: Record<string, any>;
}
