
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
        const feedUrl = 'https://www.goodreads.com/review/list_rss/6488681?key=KX5MqFq81m7QFOl2FbIOteVWOe9dnpIbbPSvi8hB-G6QPpev&shelf=to-read';
        const response = await fetch(feedUrl);
        const data = await response.text();
        res.type('application/xml');
        res.send(data);
    } catch (error) {
        console.error('Error fetching RSS feed:', error);
        res.status(500).send('Error fetching RSS feed');
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
