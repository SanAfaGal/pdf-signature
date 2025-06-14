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

// Middleware
app.use(cors());
app.use(express.json());

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ 
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024 // 10MB limit
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

    console.log(`Generating signature for: ${trimmedFirstName} ${trimmedLastName}`);
    
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

    if (!signatureImageUrl || !positionX || !positionY) {
      return res.status(400).json({ 
        error: 'Datos de posición de firma requeridos' 
      });
    }

    console.log(`Processing PDF with positioned signature: ${req.file.originalname}`);
    
    const result = await processSignedPDF(
      req.file.buffer, 
      req.file.originalname,
      firstName,
      lastName,
      {
        imageUrl: signatureImageUrl,
        position: {
          x: parseFloat(positionX),
          y: parseFloat(positionY),
          page: parseInt(page) || 1
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
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

// Error handling middleware
app.use((error, req, res, next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: 'File too large. Maximum size is 10MB.' });
    }
  }
  
  console.error('Unhandled error:', error);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});