import { NextApiRequest, NextApiResponse } from 'next'

interface RateLimitStore {
  [key: string]: {
    count: number
    resetTime: number
  }
}

const store: RateLimitStore = {}

export interface RateLimitOptions {
  interval: number // Time window in milliseconds
  maxRequests: number // Max requests per interval
}

/**
 * Simple in-memory rate limiter
 * For production, use Redis or a dedicated rate limiting service
 */
export function rateLimit(options: RateLimitOptions) {
  const { interval, maxRequests } = options

  return async (req: NextApiRequest, res: NextApiResponse, next?: () => void) => {
    // Get identifier (IP address or user ID)
    const identifier = 
      req.headers['x-forwarded-for'] || 
      req.headers['x-real-ip'] || 
      req.socket.remoteAddress || 
      'unknown'

    const key = Array.isArray(identifier) ? identifier[0] : identifier
    const now = Date.now()

    // Initialize or get existing record
    if (!store[key] || now > store[key].resetTime) {
      store[key] = {
        count: 1,
        resetTime: now + interval
      }
      return true
    }

    // Increment count
    store[key].count++

    // Check if limit exceeded
    if (store[key].count > maxRequests) {
      const resetIn = Math.ceil((store[key].resetTime - now) / 1000)
      res.status(429).json({
        error: 'Too many requests',
        message: `Rate limit exceeded. Try again in ${resetIn} seconds.`,
        retryAfter: resetIn
      })
      return false
    }

    return true
  }
}

// Preset rate limiters
export const strictRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 5
})

export const moderateRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 20
})

export const relaxedRateLimit = rateLimit({
  interval: 60 * 1000, // 1 minute
  maxRequests: 60
})

// Cleanup old entries periodically
setInterval(() => {
  const now = Date.now()
  Object.keys(store).forEach(key => {
    if (now > store[key].resetTime) {
      delete store[key]
    }
  })
}, 60 * 1000) // Clean up every minute