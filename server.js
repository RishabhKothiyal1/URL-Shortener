const express = require('express');
const app = express();
const path = require('path');
const fs = require('fs');

app.use(express.json());
app.use(express.static('public'));

// Mock Database (in-memory)
const urlDb = {};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'src', 'template.html'));
});

// Shorten Endpoint
app.post('/shorten', (req, res) => {
    const { originalUrl } = req.body;
    if (!originalUrl) {
        return res.status(400).json({ message: "URL is required" });
    }
    
    // Generate a random 6-character ID
    const id = Math.random().toString(36).substring(2, 8);
    urlDb[id] = originalUrl;
    
    // Return the full short URL
    const protocol = req.protocol;
    const host = req.get('host');
    const shortUrl = `${protocol}://${host}/${id}`;
    
    console.log(`Shortened: ${originalUrl} -> ${shortUrl}`);
    res.json({ shortUrl });
});

// Redirect Endpoint
app.get('/:id', (req, res) => {
    const id = req.params.id;
    const originalUrl = urlDb[id];
    
    if (originalUrl) {
        console.log(`Redirecting: ${id} -> ${originalUrl}`);
        res.redirect(originalUrl);
    } else {
        res.status(404).send('URL not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
