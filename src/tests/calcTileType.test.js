import { calcTileType } from '../js/utils';

test('Check left border', () => {
  expect(calcTileType(8, 8)).toBe('left');
});
test('Check center border', () => {
  expect(calcTileType(9, 8)).toBe('center');
});
test('Check right border', () => {
  expect(calcTileType(15, 8)).toBe('right');
});
test('Check bottom border', () => {
  expect(calcTileType(60, 8)).toBe('bottom');
});
test('Check left-top border', () => {
  expect(calcTileType(0, 8)).toBe('top-left');
});
test('Check right-top border', () => {
  expect(calcTileType(7, 8)).toBe('top-right');
});
test('Check left-bottom border', () => {
  expect(calcTileType(56, 8)).toBe('bottom-left');
});
test('Check left-bottom border', () => {
  expect(calcTileType(63, 8)).toBe('bottom-right');
});
