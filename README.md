# Japan 2026

Planejador do itinerário da viagem ao Japão em novembro de 2026.

## Como rodar

Copie `.env.example` para `.env.local` e preencha `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY`.

Para o roteiro aparecer para quem abre o site, no Vercel (e no `.env.local`) coloque `TRIP_GITHUB_TOKEN` com um token que possa gravar `data/trip.json` neste repositório. Sem isso, as edições ficam só no navegador.

```bash
npm install
npm run dev
```
