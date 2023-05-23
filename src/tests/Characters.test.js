import Character from '../js/Character';
import Bowman from '../js/Characters/Bowman';

const listHeroes = [
  [
    'Bowman',
    new Bowman(1),
    {
      type: 'bowman',
      health: 50,
      attack: 25,
      defence: 25,
      level: 1,
    },
  ],
  [
    'bowman',
    new Bowman(),
    {
      type: 'bowman',
      health: 50,
      attack: 25,
      defence: 25,
      level: 1,
    },
  ],
];
test.each(listHeroes)('test %s', (_, classObj, result) => {
  const person = classObj;
  expect(person).toEqual(result);
});
test('Test Character error', () => {
  expect(() => new Character(2)).toThrow();
});
