import { describe, it, expect } from 'vitest';
import Tower from '../src/tower/Tower.js';

describe('Tower', () => {
  it('should initialize with correct default values', () => {
    const tower = new Tower(100, 100);
    expect(tower.x).toBe(100);
    expect(tower.y).toBe(100);
    expect(tower.range).toBe(185);
    expect(tower.damage).toBe(22);
    expect(tower.attackSpeed).toBe(1);
  });

  it('should be able to upgrade range if gold is sufficient', () => {
    const tower = new Tower(100, 100);
    let gold = 100;
    const initialRange = tower.range;
    const initialCost = tower.rangeCost;

    gold = tower.upgradeRange(gold);

    expect(tower.range).toBeGreaterThan(initialRange);
    expect(gold).toBe(100 - initialCost);
    expect(tower.rangeCost).toBeGreaterThan(initialCost);
  });

  it('should not upgrade range if gold is insufficient', () => {
    const tower = new Tower(100, 100);
    let gold = 5;
    const initialRange = tower.range;

    gold = tower.upgradeRange(gold);

    expect(tower.range).toBe(initialRange);
    expect(gold).toBe(5);
  });
});
