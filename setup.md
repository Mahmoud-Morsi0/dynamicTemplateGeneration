# Smart Document Template Generator - Setup Guide

This guide will help you set up and run the complete Smart Document Template Generator project.

## Prerequisites

- Node.js 18+ 
- npm 9+
- Git

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

## Manual Setup

If you prefer to set up manually:

### 1. Install Dependencies

```bash
# Root dependencies
npm install

# Backend dependencies
cd backend
npm install

# Frontend dependencies
cd ../frontend
npm install
```

### 2. Environment Configuration

```bash
# Backend environment
cd backend
cp env.example .env
# Edit .env with your settings

# Frontend environment (optional)
cd ../frontend
# Create .env file if needed
echo "VITE_API_URL=http://localhost:4000/api" > .env
```

### 3. Database Setup

```bash
cd backend
npm run db:push
```

### 4. Start Development Servers

```bash
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

## Testing the Application

### 1. Health Check
Visit http://localhost:4000/health to verify the backend is running.

### 2. Upload a Template
1. Go to http://localhost:5173/upload
2. Create a simple DOCX file with placeholders like:
   ```
   Hello {{ name | type=text | label="Full Name" | required }}
   Your salary is {{ salary | type=number | min=0 }}
   ```
3. Upload the file and verify field extraction

### 3. Render a Document
1. After uploading, click "Continue"
2. Fill out the generated form
3. Click "Download Document" to get the rendered DOCX

## API Testing

Use the provided Postman collection (`postman_collection.json`) or test with curl:

```bash
# Health check
curl http://localhost:4000/health

# Upload template
curl -X POST -F "file=@your-template.docx" http://localhost:4000/api/templates/inspect

# Render document
curl -X POST -H "Content-Type: application/json" \
  -d '{"templateId":"your-id","data":{"name":"John","salary":50000}}' \
  http://localhost:4000/api/templates/render/docx \
  --output rendered-document.docx
```

## Development Commands

### Root Level
```bash
npm run dev          # Start both frontend and backend
npm run build        # Build both projects
npm run lint         # Lint both projects
npm run format       # Format both projects
npm run test         # Run backend tests
```

### Backend Only
```bash
cd backend
npm run dev          # Start development server
npm run build        # Build for production
npm run test         # Run tests
npm run db:push      # Update database schema
```

### Frontend Only
```bash
cd frontend
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
```

## Project Structure

```
/
├── frontend/                    # React application
│   ├── src/
│   │   ├── app/               # App setup (router, i18n)
│   │   ├── components/        # React components
│   │   ├── lib/              # Utilities and API
│   │   ├── pages/            # Page components
│   │   └── styles/           # Global styles
│   └── package.json
├── backend/                    # Express API server
│   ├── src/
│   │   ├── config/           # Configuration
│   │   ├── db/              # Database schema
│   │   ├── modules/         # Feature modules
│   │   ├── middleware/      # Express middleware
│   │   ├── utils/           # Utility functions
│   │   └── server.ts        # Main server
│   └── package.json
├── package.json               # Root workspace config
└── README.md                 # Main documentation
```

## Troubleshooting

### Common Issues

1. **Port already in use**:
   - Change ports in `.env` files
   - Kill processes using the ports

2. **Database errors**:
   - Delete `backend/storage/app.db` and run `npm run db:push`

3. **CORS errors**:
   - Verify `CORS_ORIGIN` in backend `.env` matches frontend URL

4. **File upload issues**:
   - Check file size limits in backend `.env`
   - Ensure file is valid DOCX format

### Logs

- Backend logs: Check terminal running backend server
- Frontend logs: Check browser developer console
- Database logs: Check backend terminal for SQL queries

## Next Steps

1. **Create Sample Templates**: Add DOCX files to `backend/tests/samples/`
2. **Customize Styling**: Modify Tailwind classes in frontend components
3. **Add Features**: Implement Phase 2 features (template library, PDF export)
4. **Deploy**: Set up production deployment with proper environment variables

## Support

For issues and questions:
1. Check the documentation in `/docs` page
2. Review API reference in `backend/README.md`
3. Check test files for usage examples
