import rateLimit from "express-rate-limit";

// Create a rate limiter for login users (20 URLs per hour)
export const loginLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 20,
    message: 'You have reached your maximum for basic User, subscribe to enjoy more!',
  });
  
  // Create a rate limiter for not logged in users (5 URLs per session)
  export const sessionLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5,
    message: 'You have reached your maximum for unregister User',
  });
  