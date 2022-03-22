const rateLimit = require('express-rate-limit')

const rateLimiter = rateLimit({
    max: 100,
    windowMs: 100 * 1000,
    standardHeaders: true,
    store: new rateLimit.MemoryStore(),
})

module.exports = rateLimiter