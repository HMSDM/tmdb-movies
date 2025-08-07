# TMDB Movies

Um aplicativo web responsivo desenvolvido em React com TypeScript que consome a API do TMDB (The Movie Database) para permitir aos usuários pesquisar filmes e visualizar detalhes de cada um.

## 🎯 Funcionalidades

- **Página de Pesquisa**: Lista de filmes com pesquisa em tempo real
- **Filtros Avançados**: Filtrar por gênero, ano, nota mínima e ordenação
- **Paginação**: Navegação entre páginas de resultados (10 filmes por página)
- **Página de Detalhes**: Informações completas sobre cada filme
- **Design Responsivo**: Compatível com desktop e mobile
- **Interface Moderna**: Design baseado no Figma com cores do Radix Colors

## 🛠️ Tecnologias Utilizadas

- **React 19** - Biblioteca para interfaces de usuário
- **TypeScript** - Superset do JavaScript com tipagem estática
- **Styled Components** - CSS-in-JS para estilização
- **React Router DOM** - Roteamento da aplicação
- **Jest** - Framework de testes
- **Testing Library** - Utilitários para testes de componentes React
- **Vite** - Build tool e servidor de desenvolvimento
- **Lucide React** - Ícones SVG

## 🏗️ Arquitetura

O projeto segue os padrões **Domain-Driven Design (DDD)** e **Model-View-ViewModel (MVVM)**:

```
src/
├── domain/                 # Camada de domínio
│   ├── entities/          # Entidades de negócio
│   ├── repositories/      # Interfaces dos repositórios
│   └── usecases/          # Casos de uso
├── infrastructure/        # Camada de infraestrutura
│   ├── api/              # Cliente HTTP
│   ├── repositories/     # Implementações dos repositórios
│   ├── config/           # Configurações
│   └── di/               # Injeção de dependências
├── presentation/          # Camada de apresentação
│   ├── components/       # Componentes React
│   ├── pages/            # Páginas da aplicação
│   └── viewmodels/       # ViewModels (hooks customizados)
└── shared/               # Código compartilhado
    ├── types/            # Tipos TypeScript
    └── utils/            # Utilitários
```

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+ 
- pnpm (recomendado) ou npm

### Configuração

1. **Clone o repositório**
   ```bash
   git clone <url-do-repositorio>
   cd tmdb-movies
   ```

2. **Instale as dependências**
   ```bash
   pnpm install
   ```

3. **Configure a API Key do TMDB**
   
   Crie um arquivo `.env` na raiz do projeto:
   ```env
   VITE_TMDB_API_KEY=sua_chave_da_api_aqui
   VITE_TMDB_BASE_URL=https://api.themoviedb.org/3
   ```

   Para obter uma chave da API:
   1. Acesse [TMDB](https://www.themoviedb.org/)
   2. Crie uma conta
   3. Vá em Settings > API
   4. Solicite uma chave da API

4. **Execute o projeto**
   ```bash
   pnpm dev
   ```

   A aplicação estará disponível em `http://localhost:5173`

## 🧪 Testes

Execute os testes unitários:

```bash
# Executar todos os testes
pnpm test

# Executar testes em modo watch
pnpm test:watch

# Executar testes com coverage
pnpm test:coverage
```

## 📦 Build

Para gerar a versão de produção:

```bash
pnpm build
```

Os arquivos serão gerados na pasta `dist/`.

## 🎨 Design

O design foi baseado no [Figma fornecido](https://www.figma.com/design/yhag2s5vJBXMgyGabBIA3Y/Cubos---Movies) e utiliza a paleta de cores do [Radix Colors](https://www.radix-ui.com/colors).

### Cores Principais

- **Background**: `#0a0a0a` (preto profundo)
- **Cards**: `#1a1a1a` (cinza escuro)
- **Accent**: `#ffd700` (dourado)
- **Text**: `#ffffff` (branco)
- **Secondary Text**: `#888888` (cinza médio)

## 📱 Funcionalidades Detalhadas

### Página de Pesquisa

- **Pesquisa em tempo real** com debounce de 500ms
- **Filtros disponíveis**:
  - Gênero (baseado na API do TMDB)
  - Ano de lançamento
  - Nota mínima (slider de 0-10)
  - Ordenação (popularidade, avaliação, data, título)
- **Paginação** com navegação inteligente
- **Estado vazio** quando não há resultados
- **Loading states** durante carregamento

### Página de Detalhes

- **Informações completas** do filme
- **Backdrop** como imagem de fundo
- **Metadados**: data de lançamento, duração, avaliação
- **Gêneros** como tags
- **Informações de produção**: orçamento, receita, produtoras
- **Link para IMDb** quando disponível

## 🔧 Scripts Disponíveis

- `pnpm dev` - Inicia servidor de desenvolvimento
- `pnpm build` - Gera build de produção
- `pnpm preview` - Visualiza build de produção
- `pnpm test` - Executa testes
- `pnpm test:watch` - Executa testes em modo watch
- `pnpm test:coverage` - Executa testes com relatório de cobertura
- `pnpm lint` - Executa linting do código

## 📄 Licença

Este projeto foi desenvolvido como parte de um desafio técnico.

## 🤝 Contribuição

1. Faça um fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, por favor abra uma issue no repositório.

---

Desenvolvido com ❤️ usando React + TypeScript

