# Guia de Desenvolvimento - TMDB Movies

## 🏗️ Arquitetura do Projeto

### Domain-Driven Design (DDD)

O projeto está estruturado seguindo os princípios do DDD:

#### Domain Layer (`src/domain/`)
- **Entities**: Modelos de dados puros (Movie, Genre, etc.)
- **Repositories**: Interfaces que definem contratos para acesso a dados
- **Use Cases**: Lógica de negócio da aplicação

#### Infrastructure Layer (`src/infrastructure/`)
- **API**: Cliente HTTP para comunicação com APIs externas
- **Repositories**: Implementações concretas dos repositórios
- **Config**: Configurações da aplicação
- **DI**: Container de injeção de dependências

#### Presentation Layer (`src/presentation/`)
- **Components**: Componentes React reutilizáveis
- **Pages**: Páginas da aplicação
- **ViewModels**: Hooks customizados que implementam o padrão MVVM

### Model-View-ViewModel (MVVM)

- **Model**: Entidades e dados (Domain Layer)
- **View**: Componentes React (Presentation/Components)
- **ViewModel**: Hooks customizados que gerenciam estado e lógica de apresentação

## 🔧 Configuração do Ambiente

### Dependências Principais

```json
{
  "react": "^19.1.0",
  "typescript": "^5.9.2",
  "styled-components": "^6.1.19",
  "react-router-dom": "^7.6.1",
  "lucide-react": "^0.510.0"
}
```

### Dependências de Desenvolvimento

```json
{
  "jest": "^30.0.5",
  "@testing-library/react": "^16.3.0",
  "@testing-library/jest-dom": "^6.6.4",
  "@types/styled-components": "^5.1.34",
  "vite": "^6.3.5"
}
```

## 📁 Estrutura de Pastas Detalhada

```
src/
├── domain/
│   ├── entities/
│   │   └── Movie.ts                 # Entidades de filme
│   ├── repositories/
│   │   └── MovieRepository.ts       # Interface do repositório
│   └── usecases/
│       ├── SearchMoviesUseCase.ts   # Caso de uso para pesquisa
│       ├── GetMovieDetailsUseCase.ts # Caso de uso para detalhes
│       └── GetGenresUseCase.ts      # Caso de uso para gêneros
├── infrastructure/
│   ├── api/
│   │   └── httpClient.ts            # Cliente HTTP
│   ├── repositories/
│   │   └── TMDBMovieRepository.ts   # Implementação TMDB
│   ├── config/
│   │   └── apiConfig.ts             # Configurações da API
│   └── di/
│       └── container.ts             # Container de DI
├── presentation/
│   ├── components/
│   │   ├── MovieCard.tsx            # Card de filme
│   │   ├── SearchBar.tsx            # Barra de pesquisa
│   │   ├── MovieFilters.tsx         # Filtros de pesquisa
│   │   ├── Pagination.tsx           # Componente de paginação
│   │   └── LoadingSpinner.tsx       # Indicador de carregamento
│   ├── pages/
│   │   ├── MovieSearchPage.tsx      # Página de pesquisa
│   │   └── MovieDetailsPage.tsx     # Página de detalhes
│   └── viewmodels/
│       ├── MovieSearchViewModel.ts  # ViewModel para pesquisa
│       └── MovieDetailsViewModel.ts # ViewModel para detalhes
└── shared/
    ├── types/
    │   └── index.ts                 # Tipos compartilhados
    └── utils/
        ├── imageUtils.ts            # Utilitários para imagens
        └── formatUtils.ts           # Utilitários de formatação
```

## 🧪 Estratégia de Testes

### Tipos de Testes

1. **Testes Unitários**
   - Utilitários (`formatUtils`, `imageUtils`)
   - Casos de uso (`SearchMoviesUseCase`)
   - Componentes isolados

2. **Testes de Integração**
   - Componentes com ViewModels
   - Fluxos completos de funcionalidades

### Convenções de Testes

- Arquivos de teste em `__tests__/` dentro de cada pasta
- Nomenclatura: `ComponentName.test.tsx` ou `utilityName.test.ts`
- Mocks para dependências externas
- Testes de comportamento, não implementação

### Exemplo de Teste

```typescript
import { render, screen, fireEvent } from '@testing-library/react'
import { MovieCard } from '../MovieCard'

describe('MovieCard', () => {
  it('should call onClick when card is clicked', () => {
    const mockOnClick = jest.fn()
    render(<MovieCard movie={mockMovie} onClick={mockOnClick} />)
    
    fireEvent.click(screen.getByText('Movie Title'))
    
    expect(mockOnClick).toHaveBeenCalledWith(mockMovie)
  })
})
```

## 🎨 Padrões de Estilização

### Styled Components

```typescript
import styled from 'styled-components'

const Container = styled.div`
  background: #1a1a1a;
  border-radius: 8px;
  padding: 16px;
  
  &:hover {
    background: #2a2a2a;
  }
`
```

### Cores Padronizadas

```typescript
const colors = {
  background: '#0a0a0a',
  surface: '#1a1a1a',
  accent: '#ffd700',
  text: '#ffffff',
  textSecondary: '#888888',
  border: '#444444'
}
```

## 🔄 Fluxo de Dados

### Arquitetura de Dados

1. **View** (Componente React) → 
2. **ViewModel** (Hook customizado) → 
3. **Use Case** (Lógica de negócio) → 
4. **Repository** (Interface) → 
5. **Implementation** (TMDB API)

### Exemplo de Fluxo

```typescript
// 1. Componente chama ViewModel
const { state, actions } = useMovieSearchViewModel()

// 2. ViewModel chama Use Case
const searchMovies = async (filters) => {
  const result = await searchMoviesUseCase.execute(filters)
  setState(result)
}

// 3. Use Case chama Repository
class SearchMoviesUseCase {
  execute(filters) {
    return this.movieRepository.searchMovies(filters)
  }
}

// 4. Repository implementa interface
class TMDBMovieRepository implements MovieRepository {
  searchMovies(filters) {
    return this.httpClient.get('/search/movie', filters)
  }
}
```

## 🚀 Deployment

### Build de Produção

```bash
pnpm build
```

### Variáveis de Ambiente

```env
VITE_TMDB_API_KEY=your_api_key
VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
```

### Otimizações

- Code splitting automático pelo Vite
- Lazy loading de imagens
- Debounce na pesquisa
- Paginação para performance

## 🐛 Debugging

### Ferramentas Recomendadas

- **React Developer Tools**: Para inspecionar componentes
- **Redux DevTools**: Para gerenciamento de estado (se necessário)
- **Network Tab**: Para monitorar requisições da API

### Logs Úteis

```typescript
// Debug de API calls
console.log('API Request:', { url, params })

// Debug de estado
console.log('ViewModel State:', state)
```

## 📋 Checklist de Desenvolvimento

### Antes de Criar um PR

- [ ] Testes passando (`pnpm test`)
- [ ] Lint sem erros (`pnpm lint`)
- [ ] Build funcionando (`pnpm build`)
- [ ] Funcionalidade testada no browser
- [ ] Responsividade verificada
- [ ] Documentação atualizada

### Padrões de Commit

```
feat: adiciona nova funcionalidade
fix: corrige bug
docs: atualiza documentação
style: mudanças de estilo/formatação
refactor: refatoração de código
test: adiciona ou modifica testes
chore: tarefas de manutenção
```

## 🤝 Contribuindo

1. Siga a arquitetura DDD/MVVM estabelecida
2. Mantenha a cobertura de testes alta
3. Use TypeScript rigorosamente
4. Siga os padrões de estilização
5. Documente mudanças significativas

## 📚 Recursos Adicionais

- [TMDB API Documentation](https://developers.themoviedb.org/3)
- [React Testing Library](https://testing-library.com/docs/react-testing-library/intro/)
- [Styled Components](https://styled-components.com/)
- [Domain-Driven Design](https://martinfowler.com/bliki/DomainDrivenDesign.html)

