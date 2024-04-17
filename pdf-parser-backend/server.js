const express = require('express');
const multer = require('multer');
const PDFParse = require('pdf-parse');

const app = express();
const port = 3000;

// Configure multer for file storage
const storage = multer.memoryStorage(); // Stores files in memory
const upload = multer({ storage: storage });

app.post('/upload', upload.single('pdf'), (req, res) => {
  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  // Parse the uploaded PDF file
  PDFParse(req.file.buffer).then(result => {
    // Send the extracted text back to the client
    res.send({ text: result.text });
  }).catch(error => {
    console.error(error);
    res.status(500).send('Failed to parse the PDF file.');
  });
});

app.listen(port, () => {
  console.log(`PDF parser server listening at http://localhost:${port}`);
});
