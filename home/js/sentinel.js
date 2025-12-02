
(function() {
  const requestCounts = {};
  const blockList = {};
  const MAX_REQUESTS_PER_MINUTE = 100;
  const BLOCK_DURATION_MS = 60 * 1000;

  function getClientIp(req) {
    return req.headers['x-forwarded-for'] || req.connection.remoteAddress;
  }

  const originalFetch = window.fetch;
  window.fetch = function(...args) {
    const clientIp = "127.0.0.1";
    const now = Date.now();

    if (requestCounts[clientIp]) {
      requestCounts[clientIp] = requestCounts[clientIp].filter(timestamp => now - timestamp < 60000);
    } else {
      requestCounts[clientIp] = [];
    }

    if (blockList[clientIp] && now < blockList[clientIp]) {
      return Promise.reject(new Error('Too many requests. You are temporarily blocked.'));
    }

    requestCounts[clientIp].push(now);

    if (requestCounts[clientIp].length > MAX_REQUESTS_PER_MINUTE) {
      blockList[clientIp] = now + BLOCK_DURATION_MS;
      console.warn(`Client ${clientIp} blocked for exceeding request limit.`);
    }

    return originalFetch.apply(this, args);
  };

  console.log('Sentinel activated.');
})();
