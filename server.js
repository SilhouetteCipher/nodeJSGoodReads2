
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
    const userUrl = req.query.url; // Get the URL from the query parameter
    if (!userUrl) {
        return res.status(400).send('No URL provided');
    }

    try {
        const response = await fetch(userUrl);
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
