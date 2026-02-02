const logger = require('../config/logger');
const aj = require('../config/arcjet');
const { slidingWindow } = require('@arcjet/node');

const security = async (req, res, next) => {
    try {
        const role = req.user?.role || 'guest';

        let limit;
        let message;

        switch (role) {
            case 'admin':
                limit = 20;
                message = "Admin limit reached";
                break;
            case 'user':
                limit = 10;
                message = "User limit reached";
                break;
            default:
                limit = 5;
                message = "Guest limit reached";
                break;
        }
        const isProduction = process.env.NODE_ENV === 'production';
        const mode = isProduction ? "LIVE" : "DRY_RUN";

        const client = aj.withRule(slidingWindow({
            mode,
            interval: "1m",
            max: limit,
            characteristics: ["ip.src"],
        }));

        const decision = await client.protect(req);

        if (decision.isDenied()) {
            if (decision.reason.isBot()) {
                logger.warn('Bot request detected', { ip: req.ip, userAgent: req.headers['user-agent'], path: req.path, method: req.method, mode });
                if (mode === 'LIVE') return res.status(403).json({ message: "Bot request blocked" });
            }
            if (decision.reason.isShield()) {
                logger.warn('Shield request detected', { ip: req.ip, userAgent: req.headers['user-agent'], path: req.path, method: req.method, mode });
                if (mode === 'LIVE') return res.status(403).json({ message: "Shield request blocked" });
            }
            if (decision.reason.isRateLimit()) {
                logger.warn('Rate limit exceeded', { ip: req.ip, userAgent: req.headers['user-agent'], path: req.path, method: req.method, mode });
                if (mode === 'LIVE') return res.status(403).json({ message: "Too many requests" });
            }
        }
        next();
    } catch (err) {
        logger.error(`Arcjet Error: ${err.message}`);
        next(); // Proceed even if Arcjet fails to avoid blocking legitimate users
    }
}

module.exports = security;