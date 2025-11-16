// CORS handler for serverless functions
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3000',
  'https://localhost:3000',
];

// Add Vercel preview URLs pattern
if (process.env.VERCEL_URL) {
  allowedOrigins.push(`https://${process.env.VERCEL_URL}`);
}

const corsHeaders = (origin) => {
  const isAllowed = allowedOrigins.some(allowed => 
    origin === allowed || 
    (origin && origin.includes('vercel.app'))
  );

  return {
    'Access-Control-Allow-Origin': isAllowed ? origin : allowedOrigins[0],
    'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    'Access-Control-Allow-Credentials': 'true',
  };
};

const handleCors = (req, res) => {
  const origin = req.headers.origin || req.headers.referer;
  const headers = corsHeaders(origin);
  
  Object.keys(headers).forEach(key => {
    res.setHeader(key, headers[key]);
  });

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return true;
  }
  
  return false;
};

module.exports = { handleCors, corsHeaders };

