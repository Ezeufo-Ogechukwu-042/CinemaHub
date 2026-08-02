import test from 'node:test';
import assert from 'node:assert/strict';

import { checkRateLimit, clearRateLimit, recordRateLimitAttempt } from './rateLimit.js';

function createStorage() {
  const store = new Map();
  return {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, value);
    },
    removeItem(key) {
      store.delete(key);
    },
  };
}

test('records and blocks repeated review submissions after the limit is reached', () => {
  global.window = { localStorage: createStorage() };

  const identifier = 'movie-42';

  for (let index = 0; index < 5; index += 1) {
    const result = recordRateLimitAttempt('review', identifier);
    if (index < 4) {
      assert.equal(result.allowed, true);
    }
  }

  const blocked = checkRateLimit('review', identifier);
  assert.equal(blocked.allowed, false);
  assert.equal(blocked.message, 'You are posting reviews too quickly. Please wait a few minutes and try again.');

  clearRateLimit('review', identifier);
});
