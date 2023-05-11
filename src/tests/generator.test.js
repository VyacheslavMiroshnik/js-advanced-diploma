import { characterGenerator, generateTeam } from '../js/generators';
import Bowman from '../js/Characters/Bowman';
import Daemon from '../js/Characters/Daemon';
import Magician from '../js/Characters/Magician';
import Swordsman from '../js/Characters/Swordsman';
import Undead from '../js/Characters/Undead';
import Vampire from '../js/Characters/Vampire';

for (let i = 0; i <= 10; i += 1) {
  test('test characterGenerator create new character', () => {
    const generator = characterGenerator([Bowman, Daemon, Magician], 3);
    const character = generator.next().value;
    expect(['bowman', 'daemon', 'magician'].includes(character.type)).toBe(true);
  });
}

test('test generateteam size', () => {
  const team = generateTeam([Swordsman, Undead, Vampire], 3, 3);
  expect(team.characters.length).toBe(3);
});
test('test generateteam maxlevel character', () => {
  const team = generateTeam([Swordsman, Undead, Vampire], 4, 10).characters;
  for (let i = 0; i < team.length; i += 1) {
    const { level } = team[i];
    expect(level > 0 && level <= 4).toBe(true);
  }
});
