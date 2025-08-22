# Backend API

Express.js backend for the Smart Document Template Generator.

## Features

- **Template Inspection**: Parse DOCX files and extract field specifications
- **Document Rendering**: Fill templates with data and generate completed documents
- **File Management**: Secure file upload and storage
- **Validation**: Server-side validation using Zod schemas
- **Database**: SQLite with Drizzle ORM for template storage
- **Security**: Rate limiting, CORS, helmet, input validation

## Tech Stack

- **Runtime**: Node.js + TypeScript
- **Framework**: Express.js
- **Database**: SQLite + Drizzle ORM
- **File Processing**: docxtemplater + pizzip
- **Validation**: Zod
- **Logging**: Pino
- **Testing**: Vitest

## API Endpoints

### Phase 1 (Implemented)

#### POST /api/templates/inspect
Upload and inspect a DOCX template.

**Request**: `multipart/form-data`
- `file`: DOCX file

**Response**:
```json
{
  "success": true,
  "data": {
    "templateId": "uuid",
    "version": 1,
    "fields": [...]
  }
}
```

#### POST /api/templates/render/docx
Render a filled document.

**Request**:
```json
{
  "templateId": "uuid",
  "data": {
    "field1": "value1",
    "field2": "value2"
  }
}
```

**Response**: DOCX file download

### Future Phases (Stubbed)

- `GET /api/templates` - List saved templates
- `POST /api/templates/:id/render.pdf` - PDF export

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Environment configuration**:
   ```bash
   cp env.example .env
   # Edit .env with your settings
   ```

3. **Database setup**:
   ```bash
   npm run db:push
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```

## Development

```bash
# Run tests
npm run test

# Run tests with coverage
npm run test:coverage

# Lint code
npm run lint

# Format code
npm run format

# Build for production
npm run build
```

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `4000` | Server port |
| `NODE_ENV` | `development` | Environment |
| `STORAGE_DIR` | `./storage` | File storage directory |
| `MAX_UPLOAD_MB` | `10` | Maximum upload size |
| `DB_URL` | `file:./storage/app.db` | Database URL |
| `CORS_ORIGIN` | `http://localhost:5173` | CORS origin |
| `LOG_LEVEL` | `info` | Log level |

## Project Structure

```
src/
├── config/          # Configuration
├── db/             # Database schema and connection
├── modules/        # Feature modules
│   └── templates/  # Template processing
├── middleware/     # Express middleware
├── utils/          # Utility functions
└── server.ts       # Main server file
```

## Database Schema

### templates
- `id`: Primary key (UUID)
- `name`: Template name
- `language`: Template language
- `createdAt`: Creation timestamp
- `updatedAt`: Update timestamp

### template_versions
- `id`: Primary key (UUID)
- `templateId`: Foreign key to templates
- `version`: Version number
- `filePath`: Stored file path
- `fileHash`: File hash for deduplication
- `fieldsSpec`: JSON field specifications
- `createdAt`: Creation timestamp

## Testing

Run unit tests for the DOCX parser:
```bash
npm run test
```

Tests cover:
- Placeholder parsing
- Field type inference
- Loop detection
- Schema generation
