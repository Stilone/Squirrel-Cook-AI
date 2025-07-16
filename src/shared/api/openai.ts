import { ApiResponse, ImageApiResponse, OpenAIRequest } from '@/app/types';
import { API_ENDPOINTS } from '@/shared/config/constants';

class OpenAIApi {
  private async makeRequest<T>(request: OpenAIRequest): Promise<T> {
    const response = await fetch(API_ENDPOINTS.OPENAI_PROXY, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(request)
    });

    if (!response.ok) {
      let errorMessage = '';
      
      if (response.status === 429) {
        errorMessage = 'Превышен лимит запросов к API. Попробуйте позже или проверьте ваш API ключ.';
      } else if (response.status === 401) {
        errorMessage = 'Неверный API ключ. Проверьте ваш ключ OpenAI.';
      } else if (response.status === 403) {
        errorMessage = 'Доступ запрещен. Проверьте права доступа вашего API ключа.';
      } else {
        try {
          const errorResponse = await response.json();
          errorMessage = (errorResponse as { error: { message: string } }).error?.message || `Ошибка ${response.status}: ${response.statusText}`;
        } catch {
          errorMessage = `Ошибка ${response.status}: ${response.statusText}`;
        }
      }
      
      throw new Error(errorMessage);
    }

    return response.json();
  }

  async generateText(prompt: string, apiKey: string): Promise<ApiResponse> {
    return this.makeRequest<ApiResponse>({
      prompt,
      apiKey,
      type: 'text'
    });
  }

  async generateImage(prompt: string, apiKey: string): Promise<ImageApiResponse> {
    return this.makeRequest<ImageApiResponse>({
      prompt,
      apiKey,
      type: 'image'
    });
  }
}

export const openAIApi = new OpenAIApi(); 