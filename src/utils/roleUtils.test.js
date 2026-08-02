import test from 'node:test';
import assert from 'node:assert/strict';

import { normalizeRole } from './roleUtils.js';

test('normalizes supported roles to lowercase values', () => {
  assert.equal(normalizeRole('Admin'), 'admin');
  assert.equal(normalizeRole('STAFF'), 'staff');
  assert.equal(normalizeRole('user'), 'user');
});

test('falls back to user for unknown roles', () => {
  assert.equal(normalizeRole('moderator'), 'user');
  assert.equal(normalizeRole(''), 'user');
});
