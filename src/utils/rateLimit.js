const STORAGE_PREFIX = 'cinemahub-rate-limit';

export const RATE_LIMITS = {
  login: { max: 5, windowMs: 15 * 60 * 1000, message: 'Too many login attempts. Please wait 15 minutes and try again.' },
  register: { max: 3, windowMs: 15 * 60 * 1000, message: 'Too many account creation attempts. Please wait 15 minutes and try again.' },
  contact: { max: 3, windowMs: 10 * 60 * 1000, message: 'Too many messages sent. Please wait a few minutes before trying again.' },
  review: { max: 5, windowMs: 5 * 60 * 1000, message: 'You are posting reviews too quickly. Please wait a few minutes and try again.' },
};

function getStorage() {
  if (typeof window === 'undefined') {
    return null;
  }

  return window.localStorage;
}

function getActionKey(action, identifier = 'global') {
  const normalizedIdentifier = String(identifier || 'global').trim().toLowerCase();
  return `${STORAGE_PREFIX}:${action}:${normalizedIdentifier}`;
}

function getTimestamps(action, identifier = 'global') {
  const storage = getStorage();
  if (!storage) {
    return [];
  }

  const rawValue = storage.getItem(getActionKey(action, identifier));
  if (!rawValue) {
    return [];
  }

  try {
    const parsed = JSON.parse(rawValue);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setTimestamps(action, identifier, timestamps) {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.setItem(getActionKey(action, identifier), JSON.stringify(timestamps));
}

export function checkRateLimit(action, identifier = 'global') {
  const limit = RATE_LIMITS[action];
  if (!limit) {
    return { allowed: true, remaining: 0, retryAfterMs: 0, message: '' };
  }

  const now = Date.now();
  const timestamps = getTimestamps(action, identifier).filter((timestamp) => timestamp > now - limit.windowMs);

  if (timestamps.length >= limit.max) {
    const retryAfterMs = timestamps[0] + limit.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(retryAfterMs, 0),
      message: limit.message,
    };
  }

  return {
    allowed: true,
    remaining: limit.max - timestamps.length,
    retryAfterMs: 0,
    message: '',
  };
}

export function recordRateLimitAttempt(action, identifier = 'global') {
  const limit = RATE_LIMITS[action];
  if (!limit) {
    return { allowed: true, remaining: 0, retryAfterMs: 0, message: '' };
  }

  const now = Date.now();
  const timestamps = getTimestamps(action, identifier).filter((timestamp) => timestamp > now - limit.windowMs);

  if (timestamps.length >= limit.max) {
    const retryAfterMs = timestamps[0] + limit.windowMs - now;
    return {
      allowed: false,
      remaining: 0,
      retryAfterMs: Math.max(retryAfterMs, 0),
      message: limit.message,
    };
  }

  timestamps.push(now);
  setTimestamps(action, identifier, timestamps);

  return {
    allowed: true,
    remaining: limit.max - timestamps.length,
    retryAfterMs: 0,
    message: '',
  };
}

export function clearRateLimit(action, identifier = 'global') {
  const storage = getStorage();
  if (!storage) {
    return;
  }

  storage.removeItem(getActionKey(action, identifier));
}
