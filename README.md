# Design Collaboration Tool - Backend API

A TypeScript Node.js/Express backend API for a design collaboration platform, featuring MongoDB integration, validation with Zod, and a well-structured codebase.

## 🚀 Features

- **TypeScript**: Type-safe code with full TypeScript support
- **Express.js**: Fast and minimalist web framework
- **MongoDB/Mongoose**: Database integration with Mongoose ODM
- **Zod**: Schema validation for request data
- **CORS**: Cross-Origin Resource Sharing enabled
- **Helmet**: Security headers
- **Morgan**: HTTP request logging
- **Compression**: Response compression
- **Error Handling**: Centralized error handling middleware
- **ESLint & Prettier**: Code quality and formatting

## 📦 Tech Stack

- **Runtime**: Node.js
- **Language**: TypeScript
- **Framework**: Express.js
- **Database**: MongoDB (with Mongoose)
- **Validation**: Zod
- **Dev Tools**: tsx (for development), ESLint, Prettier

## 🛠️ Installation

1. **Clone the repository** (if not already done)

2. **Install dependencies**:
```bash
npm install
```

3. **Set up environment variables**:
Create a `.env` file in the root directory:
```env
# Server Configuration
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/design-collab

# CORS
CORS_ORIGIN=http://localhost:3000

# JWT (if you plan to add authentication)
JWT_SECRET=your-secret-key-here
JWT_EXPIRES_IN=7d
```

4. **Start MongoDB**:
Make sure MongoDB is running on your system. If you have MongoDB installed locally:
```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Or use Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

## 🚦 Running the Application

### Development Mode
Run with hot-reload using tsx:
```bash
npm run dev
```

### Production Build
Build TypeScript to JavaScript:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## 📁 Project Structure

```
design-collab-backend/
├── src/
│   ├── config/           # Configuration files (database, middleware)
│   ├── controllers/      # Route controllers
│   ├── middleware/       # Custom middleware (error handling, etc.)
│   ├── models/          # Mongoose models
│   ├── routes/          # API routes
│   ├── types/           # TypeScript types and Zod schemas
│   ├── utils/           # Utility functions
│   └── index.ts         # Application entry point
├── dist/                # Compiled JavaScript (generated)
├── .eslintrc.json       # ESLint configuration
├── .prettierrc          # Prettier configuration
├── tsconfig.json        # TypeScript configuration
└── package.json         # Project dependencies
```

## 🔌 API Endpoints

### Health Check
```
GET /health
```
Returns server status and uptime.

### Example Resource
```
POST /api/examples
GET  /api/examples
```

Example POST request body:
```json
{
  "name": "Example Item",
  "description": "This is an example",
  "isActive": true
}
```

## 🧪 Scripts

- `npm run dev` - Start development server with hot-reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run format` - Format code with Prettier

## 🔒 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `PORT` | Server port | `5000` |
| `NODE_ENV` | Environment mode | `development` |
| `MONGODB_URI` | MongoDB connection string | `mongodb://localhost:27017/design-collab` |
| `CORS_ORIGIN` | Allowed CORS origin | `http://localhost:3000` |
| `JWT_SECRET` | JWT secret key | - |
| `JWT_EXPIRES_IN` | JWT expiration time | `7d` |

## 📝 Code Style

This project uses:
- **ESLint** for linting
- **Prettier** for code formatting
- **TypeScript strict mode** for type safety

## 🤝 Contributing

1. Create a new branch for your feature
2. Make your changes
3. Run linter and fix any issues: `npm run lint`
4. Format your code: `npm run format`
5. Test your changes
6. Submit a pull request

## 📄 License

ISC

## 🙋 Support

For questions or issues, please create an issue in the repository.
