const express = require("express");
const logger = require("./config/logger");
const helmet = require('helmet')
const morgan = require('morgan')
const cors = require('cors')
const cookieParser = require('cookie-parser');
const router = require("./routes/auth.route");
const security = require("./middelwares/security");

const app = express();


app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));
app.use(security)


app.use('/api/auth', router);

app.get('/health', (req, res) => {
    logger.info("Health check");
    res.status(200).json({ status: "OK", timestamp: new Date().toISOString(), uptime: process.uptime() });
});
app.get('/api', (req, res) => {
    logger.info("API check");
    res.status(200).json({
        message: "API is running",
    });
});

app.get("/", (req, res) => {
    logger.info("Hello World!");
    res.send("Hello World!");
});

module.exports = app;