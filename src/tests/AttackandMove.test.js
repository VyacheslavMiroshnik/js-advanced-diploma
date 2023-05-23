import Bowman from '../js/Characters/Bowman';
import Magician from '../js/Characters/Magician';
import Swordsman from '../js/Characters/Swordsman';
import Undead from '../js/Characters/Undead';
import PositionedCharacter from '../js/PositionedCharacter';
import {
  calculateAttackCharacter,
  calculateMoveCharacter,
  createGameBoard,
} from '../js/utils';

const boardSize = 8;
const gameBoard = createGameBoard(boardSize);

test('test calculate all move field for Magician', () => {
  const person = new Magician(1);
  const positionedPerson = new PositionedCharacter(person, 0);

  expect(
    calculateMoveCharacter(
      positionedPerson,
      [positionedPerson],
      gameBoard,
      boardSize
    ).sort((a, b) => b - a)
  ).toEqual([9, 8, 1].sort((a, b) => b - a));
});
test('test calculate all move field for Bowman', () => {
  const person = new Bowman(1);
  const positionedPerson = new PositionedCharacter(person, 0);

  expect(
    calculateMoveCharacter(
      positionedPerson,
      [positionedPerson],
      gameBoard,
      boardSize
    ).sort((a, b) => b - a)
  ).toEqual([9, 8, 1, 2, 16, 18].sort((a, b) => b - a));
});
test('test calculate all move field for Swordsman', () => {
  const person = new Swordsman(1);
  const positionedPerson = new PositionedCharacter(person, 0);
  expect(
    calculateMoveCharacter(
      positionedPerson,
      [positionedPerson],
      gameBoard,
      boardSize
    ).sort((a, b) => b - a)
  ).toEqual([9, 8, 1, 2, 16, 18, 3, 4, 24, 32, 27, 36].sort((a, b) => b - a));
});

test('test calculate all attack field for Magician', () => {
  const person = new Magician(1);
  const positionedPerson = new PositionedCharacter(person, 0);

  expect(
    calculateAttackCharacter(
      positionedPerson,
      [positionedPerson],
      gameBoard,
      boardSize
    ).sort((a, b) => b - a)
  ).toEqual(
    [
      8, 16, 24, 32, 1, 9, 17, 25, 33, 2, 10, 18, 26, 34, 3, 11, 19, 27, 35, 4,
      12, 20, 28, 36,
    ].sort((a, b) => b - a)
  );
});
test('test calculate all attack field for Bowman', () => {
  const person = new Bowman(1);
  const positionedPerson = new PositionedCharacter(person, 0);

  expect(
    calculateAttackCharacter(
      positionedPerson,
      [positionedPerson],
      gameBoard,
      boardSize
    ).sort((a, b) => b - a)
  ).toEqual([10, 9, 8, 1, 2, 16, 17, 18].sort((a, b) => b - a));
});
test('test calculate all attack field for Swordsman', () => {
  const person = new Swordsman(1);
  const positionedPerson = new PositionedCharacter(person, 0);

  expect(
    calculateAttackCharacter(
      positionedPerson,
      [positionedPerson],
      gameBoard,
      boardSize
    ).sort((a, b) => b - a)
  ).toEqual([9, 8, 1].sort((a, b) => b - a));
});
test('test calculate all attack field for Undead', () => {
  const person = new Undead(1);
  const positionedPerson = new PositionedCharacter(person, 7);

  expect(
    calculateAttackCharacter(
      positionedPerson,
      [positionedPerson],
      gameBoard,
      boardSize
    ).sort((a, b) => b - a)
  ).toEqual([6, 15, 14].sort((a, b) => b - a));
});
