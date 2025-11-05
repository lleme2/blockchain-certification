// Exemplo de como seu backend pode ser estruturado
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Para permitir requisições do frontend

const app = express();
const PORT = 3001;

app.use(cors());
app.use(bodyParser.json());

// Mock de banco de dados (em produção, use um banco de dados real)
let documents = [];

// GET /api/documents (READ)
app.get('/api/documents', (req, res) => {
    res.json(documents);
});

// POST /api/documents (CREATE)
app.post('/api/documents', (req, res) => {
    const newDoc = { id: Date.now().toString(), ...req.body };
    documents.push(newDoc);
    res.status(201).json(newDoc);
});

// PUT /api/documents/:id (UPDATE)
app.put('/api/documents/:id', (req, res) => {
    const { id } = req.params;
    const updatedDoc = req.body;
    documents = documents.map(doc => (doc.id === id ? { ...doc, ...updatedDoc } : doc));
    res.json({ message: 'Document updated successfully' });
});

// DELETE /api/documents/:id (DELETE)
app.delete('/api/documents/:id', (req, res) => {
    const { id } = req.params;
    documents = documents.filter(doc => doc.id !== id);
    res.json({ message: 'Document deleted successfully' });
});

app.listen(PORT, () => {
    console.log(`Backend is running on http://localhost:${PORT}`);
});