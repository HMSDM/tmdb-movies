export interface HttpClient {
  get<T>(url: string, params?: Record<string, any>): Promise<T>
}

export class FetchHttpClient implements HttpClient {
  constructor(
    private baseURL: string,
    private apiKey: string
  ) {}

  async get<T>(url: string, params: Record<string, any> = {}): Promise<T> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      language: 'pt-BR',
      ...params
    })

    const fullUrl = `${this.baseURL}${url}?${searchParams.toString()}`

    try {
      const response = await fetch(fullUrl)
      
      if (!response.ok) {
        throw new Error(`HTTP Error: ${response.status} - ${response.statusText}`)
      }

      const data = await response.json()
      return data as T
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Erro na requisição: ${error.message}`)
      }
      throw new Error('Erro desconhecido na requisição')
    }
  }
}

