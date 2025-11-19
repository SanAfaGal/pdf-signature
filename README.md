# PDF Signature Processing Application

A modern, full-stack web application for automatically signing PDF documents with generated handwritten signatures. Built with React, TypeScript, and Node.js, this application provides a seamless user experience for document signing workflows.

![PDF Signature App](https://images.pexels.com/photos/4386321/pexels-photo-4386321.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop)

## ✨ Features

- **Automatic PDF Signing**: Upload PDFs and get them signed automatically
- **Handwritten Signature Generation**: Creates realistic handwritten signatures using AI
- **Real-time Preview**: Preview generated signatures before applying
- **Drag & Drop Upload**: Intuitive file upload with drag-and-drop support
- **Progress Tracking**: Visual progress indicators throughout the signing process
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Error Handling**: Comprehensive error handling with user-friendly messages
- **Performance Optimized**: Lazy loading, code splitting, and optimized bundle size

## 🚀 Quick Start

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn package manager

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/pdf-signature-app.git
   cd pdf-signature-app
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173` to access the application.

## 📖 Usage

### Basic Workflow

1. **Upload PDF**: Drag and drop or select a PDF file (max 10MB)
2. **Enter Details**: Provide your first name and last name
3. **Generate Signature**: Preview and regenerate signatures until satisfied
4. **Process Document**: The signature is automatically inserted into the PDF
5. **Download**: Download your signed PDF document

### Example Usage

```typescript
// Example of using the signature generation API
const response = await fetch('/api/generate-signature', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    firstName: 'John',
    lastName: 'Doe',
  }),
});

const signatureData = await response.json();
```

## 🛠️ Technology Stack

### Frontend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | ^18.3.1 | UI framework |
| `react-dom` | ^18.3.1 | React DOM rendering |
| `lucide-react` | ^0.344.0 | Icon library |
| `typescript` | ^5.5.3 | Type safety |
| `tailwindcss` | ^3.4.1 | CSS framework |
| `vite` | ^5.4.2 | Build tool |

### Backend Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.18.2 | Web server framework |
| `multer` | ^1.4.5-lts.1 | File upload handling |
| `pdf-lib` | ^1.17.1 | PDF manipulation |
| `cors` | ^2.8.5 | Cross-origin requests |

### Development Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@vitejs/plugin-react` | ^4.3.1 | Vite React plugin |
| `eslint` | ^9.9.1 | Code linting |
| `concurrently` | ^8.2.2 | Run multiple commands |
| `nodemon` | ^3.0.3 | Development server |

## ⚙️ Configuration

### Environment Variables

Create a `.env` file in the root directory:

```env
# Server Configuration
PORT=3001
NODE_ENV=development

# API Configuration
SIGNATURE_API_URL=https://onlinesignatures.net/api/get-signatures-data

# File Upload Limits
MAX_FILE_SIZE=10485760  # 10MB in bytes

# Signature Position (Backend - Server-side defaults)
# Coordinates are in pixels from top-left corner
SIGNATURE_X=200        # X coordinate (horizontal position)
SIGNATURE_Y=400        # Y coordinate (vertical position from top)
SIGNATURE_PAGE=1       # Page number where signature should be placed
```

### Frontend Environment Variables

Create a `.env` file in the root directory for frontend configuration:

```env
# Frontend Configuration
VITE_API_URL=/api

# Signature Position (Frontend - Client-side defaults)
# Coordinates are in pixels from top-left corner
VITE_SIGNATURE_X=200   # X coordinate (horizontal position)
VITE_SIGNATURE_Y=375   # Y coordinate (vertical position from top)
VITE_SIGNATURE_PAGE=1  # Page number where signature should be placed
```

### Build Configuration

The application uses Vite for building with the following optimizations:

- **Code Splitting**: Automatic vendor and icon chunks
- **Minification**: Terser for production builds
- **Tree Shaking**: Removes unused code
- **Asset Optimization**: Compresses images and fonts

### Server Configuration

The Express server is configured with:

- **CORS**: Enabled for cross-origin requests
- **File Upload**: 10MB limit with PDF validation
- **Error Handling**: Comprehensive error middleware
- **Security**: Input validation and sanitization

## 🏗️ Project Structure

```
pdf-signature-app/
├── public/                 # Static assets
├── server/                 # Backend server
│   ├── services/          # Business logic
│   │   ├── pdfProcessor.js
│   │   ├── signatureGenerator.js
│   │   └── pdfModifier.js
│   └── index.js           # Server entry point
├── src/                   # Frontend source
│   ├── components/        # React components
│   │   ├── steps/        # Step-specific components
│   │   └── ui/           # Reusable UI components
│   ├── hooks/            # Custom React hooks
│   ├── types/            # TypeScript definitions
│   ├── App.tsx           # Main application
│   └── main.tsx          # Application entry point
├── package.json          # Dependencies and scripts
├── vite.config.ts        # Vite configuration
├── tailwind.config.js    # Tailwind CSS config
└── tsconfig.json         # TypeScript config
```

## 🔧 Development

### Available Scripts

```bash
# Development
npm run dev          # Start both client and server in development mode
npm run dev:client   # Start only the frontend development server
npm run dev:server   # Start only the backend development server

# Production
npm run build        # Build the application for production
npm run preview      # Preview the production build

# Code Quality
npm run lint         # Run ESLint for code quality checks
```

### Development Workflow

1. **Start Development**: Run `npm run dev` to start both frontend and backend
2. **Make Changes**: Edit files in `src/` for frontend or `server/` for backend
3. **Hot Reload**: Changes are automatically reflected in the browser
4. **Test Features**: Use the application to test your changes
5. **Build**: Run `npm run build` before deploying

## 🧪 Testing

### Manual Testing Checklist

- [ ] PDF upload with drag & drop
- [ ] PDF upload with file selector
- [ ] Form validation (empty fields)
- [ ] Signature generation and regeneration
- [ ] PDF processing with signature insertion
- [ ] File download functionality
- [ ] Error handling for invalid files
- [ ] Responsive design on mobile devices

### API Testing

Test the API endpoints using curl or Postman:

```bash
# Health check
curl http://localhost:3001/api/health

# Generate signature
curl -X POST http://localhost:3001/api/generate-signature \
  -H "Content-Type: application/json" \
  -d '{"firstName":"John","lastName":"Doe"}'
```

## 🚀 Deployment

### Production Build

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve static files**
   The `dist/` folder contains the production build ready for deployment.

### Deployment Options

- **Netlify**: Deploy the `dist/` folder directly
- **Vercel**: Connect your GitHub repository for automatic deployments
- **Docker**: Use the provided Dockerfile for containerized deployment
- **Traditional Hosting**: Upload the `dist/` folder to your web server

### Environment Setup

Ensure these environment variables are set in production:

```env
NODE_ENV=production
PORT=3001
SIGNATURE_API_URL=https://onlinesignatures.net/api/get-signatures-data

# Optional: Customize signature position
SIGNATURE_X=200
SIGNATURE_Y=400
SIGNATURE_PAGE=1

# Frontend variables (if using Vite build)
VITE_API_URL=/api
VITE_SIGNATURE_X=200
VITE_SIGNATURE_Y=375
VITE_SIGNATURE_PAGE=1
```

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

### Getting Started

1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Make your changes**
4. **Follow the coding standards**
5. **Test your changes**
6. **Commit with descriptive messages**
   ```bash
   git commit -m "feat: add amazing feature"
   ```
7. **Push to your branch**
   ```bash
   git push origin feature/amazing-feature
   ```
8. **Open a Pull Request**

### Coding Standards

- **TypeScript**: Use strict type checking
- **ESLint**: Follow the configured linting rules
- **Prettier**: Format code consistently
- **Naming**: Use descriptive variable and function names
- **Comments**: Document complex logic and APIs

### Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` New features
- `fix:` Bug fixes
- `docs:` Documentation changes
- `style:` Code style changes
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

### Pull Request Process

1. **Update documentation** if needed
2. **Add tests** for new features
3. **Ensure all tests pass**
4. **Update the README** if necessary
5. **Request review** from maintainers

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

```
MIT License

Copyright (c) 2024 PDF Signature App

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## 🆘 Support

### Common Issues

**Q: PDF upload fails with "File too large" error**
A: Ensure your PDF is under 10MB. You can compress it using online tools.

**Q: Signature generation is slow**
A: This is normal as signatures are generated using external APIs. Please wait for the process to complete.

**Q: Downloaded PDF doesn't open**
A: Ensure you're using a modern PDF viewer. Try opening with Adobe Reader or Chrome.

### Getting Help

- **Issues**: Report bugs on [GitHub Issues](https://github.com/yourusername/pdf-signature-app/issues)
- **Discussions**: Join conversations on [GitHub Discussions](https://github.com/yourusername/pdf-signature-app/discussions)
- **Email**: Contact us at support@pdfsignatureapp.com

## 🙏 Acknowledgments

- [OnlineSignatures.net](https://onlinesignatures.net) for signature generation API
- [PDF-lib](https://pdf-lib.js.org/) for PDF manipulation
- [Lucide React](https://lucide.dev/) for beautiful icons
- [Tailwind CSS](https://tailwindcss.com/) for styling
- [Vite](https://vitejs.dev/) for fast development experience

---

**Made with ❤️ by the PDF Signature App Team**