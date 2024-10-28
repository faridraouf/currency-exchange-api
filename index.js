// index.js
const express = require('express');
const axios = require('axios');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON requests
app.use(express.json());


app.get('/', async (req, res) => {     
    res.send("Hi, use /api/exchange to use this api.")
});
// Route to get exchange rate
app.get('/api/exchange', async (req, res) => {
    const { from, to } = req.query;

    if (!from || !to) {
        return res.status(400).json({ error: 'Please provide both "from" and "to" currencies.' });
    }
    const test_from = await axios.get(`https://open.er-api.com/v6/latest`);
    
    // test 'from' currency
    if(!test_from.data.rates[from]){   
        return res.status(404).json({ error: `Currency "${from}" not found.` });
    }

    try {

        const response = await axios.get(`https://open.er-api.com/v6/latest/${from}`);
        const rates = response.data.rates;

        // test 'to' currency
        if (!rates[to]) {
            return res.status(404).json({ error: `Currency "${to}" not found.` });
        }
        
        const exchangeRate = rates[to];
        return res.json({ from, to, exchangeRate });
    } catch (error) {
        console.error(error); // Log the error for debugging
        return res.status(500).json({ error: 'Failed to fetch exchange rates. Please try again later.' });
    }
});
        
            

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
