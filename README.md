# Iranian Churn Analytics — Frontend

Frontend acadêmico para análise, comparação de modelos e previsão de churn com base no Iranian Churn Dataset. A aplicação foi preparada para consumir uma API FastAPI responsável pelo pré-processamento, treinamento, avaliação e inferência dos modelos de Regressão Logística e Random Forest.

Não há lógica de Machine Learning no frontend e nenhum resultado científico é simulado.

## Stack

- Next.js 16 com App Router
- TypeScript
- Material UI (MUI)
- Axios
- Recharts

## Páginas

- `/` — redireciona para a visão geral
- `/dashboard` — indicadores e distribuições calculados pela API
- `/models` — comparação de métricas, curvas ROC e matrizes de confusão reais
- `/prediction` — formulário com os 13 atributos e apresentação da resposta do modelo
- `/analysis` — catálogo dos atributos e importância por permutação do Random Forest

## Configuração

Copie o arquivo de exemplo de ambiente:

```bash
cp .env.example .env.local
```

No Windows PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Variável disponível:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

Todas as chamadas HTTP usam a instância centralizada em `src/services/api.ts`.

## Instalação e execução

```bash
npm install
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

Para validar uma versão de produção:

```bash
npm run typecheck
npm run build
npm start
```

## Integração esperada com a API

- `GET /api/models/metrics` — métricas comparativas dos modelos
- `POST /api/predict` — inferência a partir dos 13 atributos

Enquanto a API estiver offline, a interface mantém placeholders explícitos, apresenta estados de carregamento e mensagens de conexão sem inventar valores. Os gráficos e indicadores são carregados da API; se o dataset ou os artefatos estiverem ausentes, a aplicação mostra um aviso em vez de valores fictícios.

## Organização

```text
src/
├── app/           # rotas e páginas do App Router
├── components/    # layout, cards, gráficos, formulários e componentes comuns
├── constants/     # configuração central dos 13 atributos
├── services/      # cliente HTTP Axios
├── types/         # contratos TypeScript da API
└── theme.ts       # tema global do Material UI
```

## Endpoints consumidos

- `GET /api/analytics/summary`: totais de clientes, taxa de churn e distribuições agrupadas;
- `GET /api/models/metrics`: métricas, pontos das curvas ROC e matrizes de confusão;
- `GET /api/models/feature-importance`: importâncias medidas por permutação no conjunto de teste;
- `POST /api/predict`: classe prevista, probabilidade e modelo escolhido pelo backend.

Execute primeiro `python -m app.ml.train` no repositório backend, com `data/raw/iranian_churn.csv` instalado. A API FastAPI fica em `http://localhost:8000` e o Next.js em `http://localhost:3000`. Para validar o frontend execute `npm run typecheck` e `npm run build`.

A previsão e os gráficos não simulam dados: nenhum resultado aparece até que os artefatos reais sejam disponibilizados pelo backend.
