# RBT GENIUS

Proyecto local con Vite, React y Tailwind para estudiar y practicar contenidos de RBT.

## About

Este repositorio ya no depende de Base44. La app funciona como un proyecto frontend local y usa almacenamiento del navegador para varias pantallas demo, como `Dashboard`, `Practice`, `MockExams`, `Flashcards`, `Analytics`, `AI Tutor`, `Pricing` y `Profile`.

## Run Locally

1. Instala dependencias:

```bash
npm install
```

2. Inicia el entorno de desarrollo:

```bash
npm run dev
```

3. Abre la URL que te muestre Vite en la terminal.

## Available Scripts

- `npm run dev`
- `npm run build`
- `npm run preview`
- `npm run lint`
- `npm run lint:fix`
- `npm run typecheck`

## Environment Variables

No hay variables obligatorias para levantar el boilerplate.

Si más adelante conectas autenticación o endpoints externos, este proyecto ya reconoce estas variables opcionales:

```env
VITE_APP_ID=your_app_id
VITE_APP_BASE_URL=https://your-backend.example.com
VITE_FUNCTIONS_VERSION=your_version
```

## Project Structure

- `entities/`: modelos base del dominio
- `src/pages/`: pantallas principales
- `src/components/`: componentes reutilizables
- `src/components/ui/`: componentes UI estilo shadcn
- `src/lib/`: contexto, utilidades y helpers de aplicación
- `src/hooks/`: hooks compartidos
- `src/utils/`: helpers generales

## Notes

- `npm run build` y `npm run lint` están funcionando.
- `npm run typecheck` existe, pero hoy todavía reporta errores de tipado en varios componentes JS porque `checkJs` está activo y el proyecto sigue siendo JavaScript.
