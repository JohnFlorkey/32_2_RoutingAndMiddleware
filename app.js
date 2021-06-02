const express = require('express');
const itemsRoutes = require('./itemsRoutes');

const app = new express();

app.use(express.json());

app.use('/items', itemsRoutes);

app.use((err, req, res, next) => {
    let status = err.status || 500;
    let message = err.message;

    return res.status(status).json({
        error: {message, status}
    });
});

module.exports = app;