# PlantMatch

Landing page interactiva para descubrir y adoptar digitalmente una planta. Las adopciones se guardan en Supabase y aparecen en una línea del tiempo pública usando la hora local de cada visitante.

## Configuración

1. Ejecuta `supabase.sql` en el SQL Editor de Supabase.
2. Configura estas variables en Vercel:

```env
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

3. Instala y ejecuta:

```bash
npm install
npm run dev
```
