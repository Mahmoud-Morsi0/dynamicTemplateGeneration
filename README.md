# Smart Document Template Generator

A production-ready Phase 1 MVP for generating dynamic document templates with React forms.

## Features

- **Document Upload & Inspection**: Upload .docx templates and automatically extract field specifications
- **Dynamic Form Generation**: Generate React forms with validation using React Hook Form + Zod
- **Multi-language Support**: English and Arabic with RTL support
- **Template Rendering**: Fill templates with form data and download completed documents
- **Clean Architecture**: Modular backend with TypeScript, SQLite, and comprehensive validation

## Tech Stack

### Frontend
- React + Vite + TypeScript
- TailwindCSS + shadcn/ui
- React Hook Form + Zod
- Framer Motion
- i18next (EN/AR, RTL)
- Axios + TanStack Query

### Backend
- Node.js + Express + TypeScript
- SQLite + Drizzle ORM
- docxtemplater + pizzip
- multer (file uploads)
- pino (logging)
- Vitest (testing)

## Quick Start

1. **Clone and setup**:
   ```bash
   npm run setup
   ```

2. **Start development servers**:
   ```bash
   npm run dev
   ```

3. **Access the application**:
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:4000

## Project Structure

```
/
├── frontend/          # React application
├── backend/           # Express API server
├── package.json       # Root workspace config
└── README.md         # This file
```

## API Endpoints

### Phase 1 (Implemented)
- `POST /templates/inspect` - Upload and inspect .docx template
- `POST /templates/render/docx` - Render filled document

### Future Phases (Stubbed)
- `GET /templates` - List saved templates
- `POST /templates/:id/render.pdf` - PDF export (LibreOffice worker)

## Sample Templates

The backend includes sample templates in `/backend/tests/samples/`:
- `employment_offer_en.docx` - Employment offer with various field types
- `benefit_en_ar.docx` - Benefits form with loops and mixed languages

## Development

```bash
# Run all tests
npm run test

# Lint and format code
npm run lint
npm run format

# Build for production
npm run build
```

## Environment Variables

Copy `.env.example` to `.env` in the backend directory and configure:

```env
PORT=4000
NODE_ENV=development
STORAGE_DIR=./storage
DB_URL=file:./storage/app.db
MAX_UPLOAD_MB=10
CORS_ORIGIN=http://localhost:5173
```

## License

MIT
