// routes/extract.js
const express = require('express');
const router = express.Router();
const { extractFirstEmail } = require('../services/email-extractor');
const { extractSchema } = require('../validation/schema');

router.post('/extract', async (req, res) => {
    try {
        await extractSchema.validateAsync(req.body);

        const { description } = req.body;
        const content = extractFirstEmail(description);

        res.json({ content });
    } catch (err) {
        res.status(400).json({ error: err.details?.[0]?.message || 'Invalid request' });
    }
});

module.exports = router;
