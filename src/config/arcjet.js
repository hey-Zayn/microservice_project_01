const arcjetNode = require("@arcjet/node");
const arcjet = arcjetNode.default;
const { shield, detectBot, tokenBucket, slidingWindow } = arcjetNode;




const isProduction = process.env.NODE_ENV === 'production';
const mode = isProduction ? "LIVE" : "DRY_RUN";

const aj = arcjet({
    key: process.env.ARCJET_KEY,
    rules: [
        // Shield protects your app from common attacks e.g. SQL injection
        shield({ mode }),
        // Create a bot detection rule
        detectBot({
            mode, // Blocks requests in production. Use "DRY_RUN" in dev.
            // Block all bots except the following
            allow: [
                "CATEGORY:SEARCH_ENGINE", // Google, Bing, etc
                "CATEGORY:MONITOR", // Uptime monitoring services
                "CATEGORY:PREVIEW", // Link previews e.g. Slack, Discord
            ],
        }),
        // Create a token bucket rate limit.
        tokenBucket({
            mode,
            refillRate: 5, // Refill 5 tokens per interval
            interval: 10, // Refill every 10 seconds
            capacity: 10, // Bucket capacity of 10 tokens
        }),

        slidingWindow({
            mode,
            interval: "2s",
            max: 5, // 5 requests per window
        }),
    ],
});

module.exports = aj;
