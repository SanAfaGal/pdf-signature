import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import { processSignedPDF } from './services/pdfProcessor.js';
import { generateSignature } from './services/signatureGenerator.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3001;
const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE) || (10 * 1024 * 1024); // 10MB default

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Only PDF files are allowed'), false);
    }
  }
});

// Routes
// NOTE: This endpoint is kept as fallback but is no longer used by default.
// The frontend now calls the signature API directly from the browser to avoid IP blocking in production.
app.post('/api/generate-signature', async (req, res) => {
  try {
    const { firstName, lastName } = req.body;

    if (!firstName || !lastName) {
      return res.status(400).json({ 
        error: 'Nombre y apellido son requeridos' 
      });
    }

    const trimmedFirstName = firstName.trim();
    const trimmedLastName = lastName.trim();

    if (!trimmedFirstName || !trimmedLastName) {
      return res.status(400).json({ 
        error: 'Nombre y apellido no pueden estar vacíos' 
      });
    }

    console.log(`Generating signature for server: ${trimmedFirstName} ${trimmedLastName}`);
    
    const result = await generateSignature(trimmedFirstName, trimmedLastName);
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    res.json({
      imageUrl: result.imageUrl,
      metadata: result.metadata
    });
  } catch (error) {
    console.error('Error generating signature:', error);
    res.status(500).json({ error: 'Internal server error while generating signature' });
  }
});

app.post('/api/process-pdf-with-position', upload.single('pdf'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No PDF file provided' });
    }

    const { signatureImageUrl, positionX, positionY, page, firstName, lastName } = req.body;

    if (!signatureImageUrl) {
      return res.status(400).json({ 
        error: 'URL de imagen de firma requerida' 
      });
    }

    // Get coordinates from request body, environment variables, or use defaults
    const x = positionX ? parseFloat(positionX) : (parseFloat(process.env.SIGNATURE_X) || 200);
    const y = positionY ? parseFloat(positionY) : (parseFloat(process.env.SIGNATURE_Y) || 400);
    const pageNumber = page ? parseInt(page) : (parseInt(process.env.SIGNATURE_PAGE) || 1);

    console.log(`Processing PDF with positioned signature: ${req.file.originalname}`);
    console.log(`Signature position: x=${x}, y=${y}, page=${pageNumber}`);
    
    const result = await processSignedPDF(
      req.file.buffer, 
      req.file.originalname,
      firstName,
      lastName,
      {
        imageUrl: signatureImageUrl,
        position: {
          x,
          y,
          page: pageNumber
        }
      }
    );
    
    if (!result.success) {
      return res.status(400).json({ error: result.error });
    }

    // Set headers for file download
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${result.filename}"`);
    res.setHeader('Content-Length', result.pdfBuffer.length);
    
    res.send(result.pdfBuffer);
  } catch (error) {
    console.error('Error processing PDF:', error);
    res.status(500).json({ error: 'Internal server error while processing PDF' });
  }
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development'
  });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      const maxSizeMB = Math.round(MAX_FILE_SIZE / (1024 * 1024));
      return res.status(400).json({ error: `File too large. Maximum size is ${maxSizeMB}MB.` });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`Max file size: ${Math.round(MAX_FILE_SIZE / (1024 * 1024))}MB`);
});