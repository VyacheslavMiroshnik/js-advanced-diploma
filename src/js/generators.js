import Team from './Team';
/**
 * Формирует экземпляр персонажа из массива allowedTypes со
 * случайным уровнем от 1 до maxLevel
 *
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @returns генератор, который при каждом вызове
 * возвращает новый экземпляр класса персонажа
 *
 */
export function* characterGenerator(allowedTypes) {
  while (true) {
    yield new allowedTypes[Math.floor(Math.random() * allowedTypes.length)]();
  }
}

/**
 * Формирует массив персонажей на основе characterGenerator
 * @param allowedTypes массив классов
 * @param maxLevel максимальный возможный уровень персонажа
 * @param characterCount количество персонажей, которое нужно сформировать
 * @returns экземпляр Team, хранящий экземпляры персонажей. Количество персонажей в команде - chara
 * */
export function generateTeam(allowedTypes, maxLevel, characterCount) {
  const team = [];
  const generator = characterGenerator(allowedTypes);
  for (let i = 0; i < characterCount; i += 1) {

    const level = Math.floor(Math.random() * maxLevel + 1);
    const pers = generator.next().value
    for (let x = 1; x < level; x += 1) {
      pers.levelUp();

    }
    team.push(pers);
  }
  return new Team(team);
}
