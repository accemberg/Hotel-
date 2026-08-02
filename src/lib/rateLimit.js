const requestLog = new Map();

export function rateLimit({ windowMs = 60_000, max = 20 } = {}) {
  return (handler) => async (req, res) => {
    const ip = req.headers["x-forwarded-for"]?.split(",")[0] || req.socket.remoteAddress || "unknown";
    const key = `${ip}:${req.url}`;
    const now = Date.now();

    const entry = requestLog.get(key) || { count: 0, start: now };

    if (now - entry.start > windowMs) {
      entry.count = 0;
      entry.start = now;
    }

    entry.count += 1;
    requestLog.set(key, entry);

    if (entry.count > max) {
      res.setHeader("Retry-After", Math.ceil((entry.start + windowMs - now) / 1000));
      return res.status(429).json({ success: false, error: "Too many requests, please try again shortly" });
    }

    return handler(req, res);
  };
}