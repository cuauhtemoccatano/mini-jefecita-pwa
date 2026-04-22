import { expect, test } from 'vitest';
import { add } from '../js/test_mod';

test('add test', () => {
  expect(add(1, 2)).toBe(3);
});
