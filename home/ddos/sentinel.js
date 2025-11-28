
// sentinel.js

(function() {
  const requestCounts = {};
  const blockList = {};
  const MAX_REQUESTS_PER_MINUTE = 100; // Allow 100 requests per minute
  const BLOCK_DURATION_MS = 60 * 1000; // Block for 1 minute

  function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }

  // Middleware to intercept requests
  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const clientIp = "127.0.0.1"; // Placeholder, as we can't get the real IP securely on the client-side
    const now = Date.now();

    // Clean up old request counts
    if (requestCounts[clientIp]) {
      requestCounts[clientIp] = requestCounts[clientIp].filter(timestamp => now - timestamp < 60000);
    } else {
      requestCounts[clientIp] = [];
    }

    // Check if the client is blocked
    if (blockList[clientIp] && now < blockList[clientIp]) {
      // Reject the request
      return Promise.reject(new Error('Too many requests. You are temporarily blocked.'));
    }

    // Add the new request timestamp
    requestCounts[clientIp].push(now);

    // If the request count exceeds the limit, block the client
    if (requestCounts[clientIp].length > MAX_REQUESTS_PER_MINUTE) {
      blockList[clientIp] = now + BLOCK_DURATION_MS;
      console.warn(`Client ${clientIp} blocked for exceeding request limit.`);
      // Optionally, you could send a notification to a logging service here
    }

    return originalFetch.apply(this, args);
  };

  console.log('DDoS Sentinel activated.');
})();
