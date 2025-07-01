// app.js
const express = require('express');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const cors = require('cors');

const app = express();
const extractRoute = require('./routes/extract');

app.use(helmet());
app.use(cors());
app.use(express.json());

app.use(morgan('dev'));

const limiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
});
app.use(limiter);

app.use('/api', extractRoute);

app.use((req, res) => res.status(404).json({ error: 'Not Found' }));

// Start server (only in non-cluster mode)
if (require.main === module) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`🚀 Server running on http://localhost:${PORT}`);
    });
}

module.exports = app;
