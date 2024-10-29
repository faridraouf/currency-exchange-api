const express = require('express');
const axios = require('axios');
require('dotenv').config();
const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const app = express();
const PORT = process.env.PORT || 3000;


app.use(express.json());


const swaggerOptions = {
    swaggerDefinition: {
        openapi: '3.0.0',
        info: {
            title: 'Currency Exchange API',
            version: '1.0.0',
            description: 'API for fetching currency exchange rates',
        },
        servers: [
            {
                url: `http://localhost:${PORT}`,
            },
        ],
    },
    apis: ['index.js'], 
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/api-docs.json', (req, res) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(swaggerDocs); 
});

app.get('/', (req, res) => {     
    res.send("Hi, use /api/exchange to use this api.")
});


/**
 * @swagger
 * /:
 *   get:
 *     summary: Welcome message
 *     description: Returns a message directing users to the /api/exchange endpoint.
 *     responses:
 *       200:
 *         description: A welcome message
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hi, use /api/exchange to use this API."
 * 
 * /api/exchange:
 *   get:
 *     summary: Get the exchange rate between two currencies
 *     parameters:
 *       - in: query
 *         name: from
 *         required: true
 *         description: Currency to convert from (e.g., USD)
 *         schema:
 *           type: string
 *       - in: query
 *         name: to
 *         required: true
 *         description: Currency to convert to (e.g., EUR)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Successful response with exchange rate
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 from:
 *                   type: string
 *                 to:
 *                   type: string
 *                 exchangeRate:
 *                   type: number
 *       400:
 *         description: Missing parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Currency not found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
app.get('/api/exchange', async (req, res) => {

    // ensure it is in uppercase
    const from = req.query.from.toLocaleUpperCase();
    const to = req.query.to.toLocaleUpperCase();

    if (!from || !to) {
        return res.status(400).json({ error: 'Please provide both "from" and "to" currencies.' });
    }
    
    try {

        const response = await axios.get(`https://open.er-api.com/v6/latest/${from}`);
        const rates = response.data.rates;

        // test 'to' currency
        if (!rates[to]) {
            return res.status(404).json({ error: `Currency ${to} not found.` });
        }
        
        const exchangeRate = rates[to];
        return res.json({ from, to, exchangeRate });
    } 
    catch (error) {
        console.error(error); 
        return res.status(500).json({ error: 'Failed to fetch exchange rates. Please ensure currencies are correct and try again later.' });
    }
});
        
            


app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
