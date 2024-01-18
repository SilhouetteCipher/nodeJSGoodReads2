
// server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
const port = process.env.PORT || 3000;

// Enable All CORS Requests for simplicity, or configure as needed
app.use(cors());
app.use(express.static('public'));

app.get('/fetch-rss', async (req, res) => {
    try {
        const feedUrl = req.query.shelfUrl;
        console.log(`Fetching RSS feed from ${feedUrl}`);
        console.log('Query parameters:', req.query);
        const response = await fetch(feedUrl);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.text();
        
        res.send(data);
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).send('Error fetching RSS feed');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});