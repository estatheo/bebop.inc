import { describe, it, expect } from 'vitest';
import { canUnlock } from './upgradeLogic.js';

describe('canUnlock', () => {
  it('allows nodes when prerequisites met', () => {
    expect(canUnlock('drill', ['root'])).toBe(true);
  });
  it('blocks nodes when prerequisites missing', () => {
    expect(canUnlock('thrusters', ['drill'])).toBe(false);
  });
});
