// Simple in-memory rate limiter for serverless
// Note: This resets on cold starts, for production use Redis or a service like Upstash

const requestCounts = new Map();

const rateLimit = (options = {}) => {
  const { windowMs = 15 * 60 * 1000, max = 5 } = options;

  return (handler) => async (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || 'unknown';
    const now = Date.now();
    const key = `${ip}:${req.url}`;

    // Clean old entries
    for (const [k, data] of requestCounts.entries()) {
      if (now - data.resetTime > windowMs) {
        requestCounts.delete(k);
      }
    }

    const record = requestCounts.get(key) || { count: 0, resetTime: now };

    if (now - record.resetTime > windowMs) {
      record.count = 0;
      record.resetTime = now;
    }

    record.count++;
    requestCounts.set(key, record);

    if (record.count > max) {
      return res.status(429).json({ 
        message: 'Too many requests, please try again later' 
      });
    }

    return handler(req, res);
  };
};

module.exports = rateLimit;

