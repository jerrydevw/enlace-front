# enlace-web

Frontend do Enlace — plataforma de live streaming para casamentos.

## Requisitos

- Node.js 18+
- npm 9+
- Backend Enlace API rodando em `http://enlace-alb-dev-1418603029.us-east-1.elb.amazonaws.com`

## Instalacao

```bash
npm install
```

## Configuracao

O arquivo `.env.local` ja esta criado com as variaveis para desenvolvimento local:

```env
NEXT_PUBLIC_API_URL=http://enlace-alb-dev-1418603029.us-east-1.elb.amazonaws.com
NEXT_PUBLIC_API_KEY=enlace-dev-key-troque-em-prod
```

Ajuste conforme necessario.

## Rodando em desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

## Testando o fluxo do espectador

Com o backend rodando e o seed v3 aplicado no banco:

**Evento READY (Paulo e Amanda):**
```
http://localhost:3000/watch/paulo-e-amanda-2026
Codigo: ANA-2026
```

**Evento LIVE (Thiago e Camila):**
```
http://localhost:3000/watch/thiago-e-camila-2026
Codigo: CAM-4521
```

**Evento encerrado (Lucas e Isabela):**
```
http://localhost:3000/watch/lucas-e-isabela-2026
Codigo: LUC-1111  (retorna 410 diretamente)
```

**Evento inexistente:**
```
http://localhost:3000/watch/nao-existe-2026
```

## Estrutura

```
src/
├── app/
│   ├── watch/[slug]/
│   │   ├── page.tsx          # Server Component — busca status inicial
│   │   ├── WatchClient.tsx   # Client Component — orquestra os estados
│   │   ├── loading.tsx       # Skeleton de carregamento
│   │   ├── not-found.tsx     # Evento nao encontrado
│   │   └── error.tsx         # Erro inesperado
│   ├── layout.tsx
│   ├── page.tsx
│   └── globals.css
├── components/
│   ├── watch/
│   │   ├── CodeForm.tsx      # Tela de entrada do codigo
│   │   ├── WaitingRoom.tsx   # Tela de espera com countdown
│   │   ├── LivePlayer.tsx    # Player hls.js
│   │   └── EventEnded.tsx    # Evento encerrado
│   └── ui/
│       └── LoadingSpinner.tsx
├── hooks/
│   ├── useEventStatus.ts     # Polling do public-status a cada 15s
│   └── useCountdown.ts       # Countdown regressivo
└── lib/
    ├── api.ts                # Wrapper fetch + ApiError
    ├── session.ts            # JWT no localStorage por slug
    └── types.ts              # Tipos compartilhados
```

## Build para producao

```bash
npm run build
npm start
```
