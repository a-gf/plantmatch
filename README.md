# PlantMatch 🌿

PlantMatch es una experiencia web ficticia que recomienda una planta según el espacio y los hábitos de cada visitante. Después del test, la persona puede nombrar y adoptar digitalmente su planta.

La adopción se guarda de verdad en **Supabase** y aparece inmediatamente en una línea del tiempo pública. No solicita correo ni datos sensibles: solo un apodo público, el nombre elegido para la planta y las respuestas necesarias para calcular la recomendación.

## Funcionalidades

- Test breve de compatibilidad con plantas.
- Recomendación entre Sansevieria, Peperomia, Pothos y Monstera.
- Formulario funcional conectado a Supabase.
- Línea del tiempo con las 12 adopciones más recientes.
- Tres adopciones recientes visibles en el primer viewport.
- Fecha y hora convertidas a la zona horaria local de cada visitante.
- Ilustraciones vinculadas permanentemente al tipo de planta.
- Diseño responsive para computador y celular.
- Row Level Security: el sitio público puede insertar y consultar, pero no editar ni eliminar adopciones.

## Tecnologías

- Next.js 16
- React 19
- TypeScript
- Supabase / PostgreSQL
- Vercel

## Demo

[Ver PlantMatch en línea](https://plantmatch-kohl.vercel.app/)

## Configuración local

1. Ejecuta `supabase.sql` en el SQL Editor de Supabase.
2. Crea `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sb_publishable_xxxxx
```

3. Instala y ejecuta:

```bash
npm install
npm run dev
```

> Proyecto ficticio creado para demostrar que una landing page puede verse bien y, al mismo tiempo, capturar y recuperar datos reales.
