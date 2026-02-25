const API_ORIGIN = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_BASE = `${API_ORIGIN}/api/v1`;

export type UserProfile = {
  id: number;
  clerkId: string;
  email: string | null;
  name: string | null;
  plan: string;
  country: string | null;
  preferredLanguage: string | null;
  fieldOfInterest: string | null;
  brandName: string | null;
  address: string | null;
  tone: string | null;
  marketingTypes?: string[];
  phone?: string;
  createdAt: string;
  updatedAt: string;
};

export type UpdateProfileBody = {
  name?: string;
  email?: string;
  country?: string;
  preferredLanguage?: string;
  fieldOfInterest?: string;
  brandName?: string;
  address?: string;
  tone?: string;
  marketingTypes?: string[];
  phone?: string;
};

async function authFetch(path: string, token: string, options?: RequestInit) {
  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });
  if (!res.ok) throw new Error(await res.text().catch(() => res.statusText));
  return res.json();
}

export async function fetchMe(token: string): Promise<UserProfile> {
  return authFetch("/users/me", token);
}

export async function updateMe(
  token: string,
  data: UpdateProfileBody
): Promise<UserProfile> {
  return authFetch("/users/me", token, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export type Conversation = {
  id: string;
  clerkId: string;
  title: string | null;
  createdAt: string;
  updatedAt: string;
};

export type Message = {
  id: string;
  conversationId: string;
  role: "user" | "assistant";
  content: string;
  createdAt: string;
};

export async function createConversation(
  token: string,
  title?: string
): Promise<Conversation> {
  console.log('📝 API: Creating conversation with title:', title || 'untitled');
  const result = await authFetch("/conversations", token, {
    method: "POST",
    body: JSON.stringify(title ? { title } : {}),
  });
  console.log('✅ API: Conversation created:', result.id);
  return result;
}

export async function listConversations(
  token: string
): Promise<Conversation[]> {
  return authFetch("/conversations", token);
}

export async function migrateTitles(token: string): Promise<{ updated: number }> {
  return authFetch("/conversations/migrate-titles", token, { method: "POST" });
}


export async function getConversation(
  token: string,
  id: string
): Promise<{ conversation: Conversation; messages: Message[] }> {
  return authFetch(`/conversations/${id}`, token);
}

export async function streamMessage(
  token: string,
  conversationId: string,
  role: string,
  content: string,
  imageData?: string,
  imageMimeType?: string,
  onChunk?: (text: string) => void,
  onError?: (error: string) => void,
  onFinish?: () => void
): Promise<void> {
  console.log('🌊 Frontend: Starting streamMessage');
  console.log('Conversation ID:', conversationId);
  console.log('Content:', content.substring(0, 50) + '...');

  const response = await fetch(`${API_BASE}/conversations/${conversationId}/messages`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ role, content, imageData, imageMimeType }),
  });

  console.log('📡 Response status:', response.status);

  if (!response.ok) {
    let errorMsg = response.statusText;
    try {
      const errorData = await response.json();
      errorMsg = errorData.message || errorData.error || errorMsg;
    } catch (e) {
      // Ignore
    }
    console.error('❌ Response error:', errorMsg);
    if (onError) onError(errorMsg);
    if (onFinish) onFinish();
    return;
  }

  const reader = response.body?.getReader();
  const decoder = new TextDecoder();

  if (!reader) {
    console.error('❌ No reader available');
    if (onError) onError("Failed to read stream.");
    if (onFinish) onFinish();
    return;
  }

  console.log('✅ Stream reader ready');

  try {
    let chunkCount = 0;
    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        console.log('✅ Stream done. Total chunks:', chunkCount);
        break;
      }

      const chunkStr = decoder.decode(value, { stream: true });
      const lines = chunkStr.split("\n\n");

      for (const line of lines) {
        if (line.startsWith("data: ")) {
          const dataStr = line.slice(6);
          if (dataStr === "[DONE]") {
            console.log('✅ Received [DONE] signal');
            if (onFinish) onFinish();
            return;
          }
          try {
            const data = JSON.parse(dataStr);
            if (data.error && onError) {
              console.error('❌ Stream error:', data.error);
              onError(data.error);
            } else if (data.text && onChunk) {
              chunkCount++;
              if (chunkCount === 1) console.log('✅ First chunk received');
              onChunk(data.text);
            }
          } catch (e) {
            // console.error("Error parsing stream chunk", dataStr);
          }
        }
      }
    }
  } catch (error) {
    console.error('❌ Stream reading error:', error);
    if (onError) onError(String(error));
  } finally {
    if (onFinish) onFinish();
  }
}
