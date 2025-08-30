import { describe, it, expect } from 'vitest';
import { exchangeMineralsForCredit, exchangeScrapForCredit } from './gameLogic.js';

describe('exchangeMineralsForCredit', () => {
  it('converts 10 minerals into 1 credit', () => {
    const result = exchangeMineralsForCredit({ mineral: 10, credit: 0 });
    expect(result).toEqual({ mineral: 0, credit: 1 });
  });

  it('does nothing if minerals are insufficient', () => {
    const result = exchangeMineralsForCredit({ mineral: 9, credit: 0 });
    expect(result).toEqual({ mineral: 9, credit: 0 });
  });
});

describe('exchangeScrapForCredit', () => {
  it('converts 5 scrap into 1 credit', () => {
    const result = exchangeScrapForCredit({ scrap: 5, credit: 0 });
    expect(result).toEqual({ scrap: 0, credit: 1 });
  });

  it('does nothing if scrap is insufficient', () => {
    const result = exchangeScrapForCredit({ scrap: 4, credit: 0 });
    expect(result).toEqual({ scrap: 4, credit: 0 });
  });
});
