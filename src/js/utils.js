import { generateTeam } from './generators';
import Bowman from './Characters/Bowman';
import Daemon from './Characters/Daemon';
import Magician from './Characters/Magician';
import Swordsman from './Characters/Swordsman';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import Team from './Team';
import PositionedCharacter from './PositionedCharacter';

/**
 * @todo
 * @param index - индекс поля
 * @param boardSize - размер квадратного поля (в длину или ширину)
 * @returns строка - тип ячейки на поле:
 *
 * top-left
 * top-right
 * top
 * bottom-left
 * bottom-right
 * bottom
 * right
 * left
 * center
 *
 * @example
 * ```js
 * calcTileType(0, 8); // 'top-left'
 * calcTileType(1, 8); // 'top'
 * calcTileType(63, 8); // 'bottom-right'
 * calcTileType(7, 7); // 'left'
 * ```
 * */

// генерирует новую команду
export function createNewTeam(type) {
  if (type === 'user') {
    return generateTeam([Bowman,Magician, Swordsman], 4, 2);
  }

  return generateTeam([Daemon,Undead, Vampire], 4, 2);
}

// создает границы игрового поля
export function createGameBoard(boardSize) {
  const map = new Map();
  const leftBorder = [];
  const rightBorder = [];
  const topBorder = [];
  const bottomBorder = [];
  for (let i = 0; i < boardSize ** 2; i += boardSize) {
    leftBorder.push(i);
  }
  map.set('leftBorder', leftBorder);

  for (let i = boardSize - 1; i < boardSize ** 2; i += boardSize) {
    rightBorder.push(i);
  }
  map.set('rightBorder', rightBorder);

  for (let i = 0; i < boardSize; i += 1) {
    topBorder.push(i);
  }
  map.set('topBorder', topBorder);

  for (let i = boardSize ** 2 - boardSize; i < boardSize ** 2; i += 1) {
    bottomBorder.push(i);
  }
  map.set('bottomBorder', bottomBorder);

  return map;
}

// для отрисовки игрового поля и задание правильного стиля ячеек

export function calcTileType(index, boardSize) {
  const topLeft = index === 0 ? 'top-left' : null;
  const topRight = index === boardSize - 1 ? 'top-right' : null;
  const bottomLeft =
    index === boardSize * (boardSize - 1) ? 'bottom-left' : null;
  const bottomRight = index === boardSize ** 2 - 1 ? 'bottom-right' : null;
  const left = index > 0 && !(index % boardSize) ? 'left' : null;
  const right =
    index > boardSize && !((index + 1) % boardSize) ? 'right' : null;
  const top = index > 0 && index < boardSize - 1 ? 'top' : null;
  const bottom =
    index > boardSize * (boardSize - 1) && index < boardSize ** 2 - 1
      ? 'bottom'
      : null;

  return (
    topLeft ||
    topRight ||
    bottomLeft ||
    bottomRight ||
    left ||
    bottom ||
    top ||
    right ||
    'center'
  );
}

// расчитывает все возможные ячеейки для передвижение персонажа
export function calculateMoveCharacter(team, allTeam, gameBoard, boardSize) {
  const { character, position } = team;
  const friendlyPosition = allTeam.map((el) => el.position);
  const moved = character.stepMove;
  const leftBorderPosition = gameBoard.get('leftBorder');
  const rightBorderPosition = gameBoard.get('rightBorder');
  const movedSet = new Set();

  for (let i = 1; i <= moved; i += 1) {
    if (rightBorderPosition.includes(position - i) || position - i < 0) {
      break;
    }
    movedSet.add(position - i * boardSize);
    movedSet.add(position + i * boardSize);
    movedSet.add(position - i + i * boardSize);
    movedSet.add(position - i - i * boardSize);
    movedSet.add(position - i);
  }

  for (let i = 1; i <= moved; i += 1) {
    if (
      leftBorderPosition.includes(position + i) ||
      position + i >= boardSize ** 2
    ) {
      break;
    }
    movedSet.add(position - i * boardSize);
    movedSet.add(position + i * boardSize);
    movedSet.add(position + i + i * boardSize);
    movedSet.add(position + i - i * boardSize);
    movedSet.add(position + i);
  }
  for (let i = 0; i < friendlyPosition.length; i += 1) {
    movedSet.delete(friendlyPosition[i]);
  }

  return Array.from(movedSet).filter((el) => el >= 0 && el < boardSize ** 2);
}

// расчитывает все возможные ячееки для атаки 

export function calculateAttackCharacter(
  attackCharacter,
  team,
  gameBoard,
  boardSize
) {
  const { character, position } = attackCharacter;
  const friendlyPosition = team.map((el) => el.position);
  const attack = character.stepAttack;
  const leftBorderPosition = gameBoard.get('leftBorder');
  const rightBorderPosition = gameBoard.get('rightBorder');
  const rowCharacterPosition = Math.floor(position / boardSize);
  const startRow =
    rowCharacterPosition >= attack ? rowCharacterPosition - attack : 0;
  const stopRow =
    rowCharacterPosition + attack <= boardSize - 1
      ? rowCharacterPosition + attack
      : boardSize - 1;
  const leftStart =
    position - attack >= leftBorderPosition[rowCharacterPosition]
      ? position - leftBorderPosition[rowCharacterPosition] - attack
      : 0;
  const rightStop =
    position + attack <= rightBorderPosition[rowCharacterPosition]
      ? position + attack - leftBorderPosition[rowCharacterPosition]
      : boardSize - 1;
  const attackSet = new Set();
  for (let i = startRow; i <= stopRow; i += 1) {
    for (let x = leftStart; x <= rightStop; x += 1) {
      attackSet.add(leftBorderPosition[i] + x);
    }
  }
  for (let i = 0; i < friendlyPosition.length; i += 1) {
    attackSet.delete(friendlyPosition[i]);
  }
  return Array.from(attackSet).filter((el) => el >= 0 && el < boardSize ** 2);
}

// Что то вроде оценивания ячейки для движения

export function rankedMove(aiTeam, targetCharacter, afterAttack) {
  const { character } = targetCharacter;
  const rank =
    (character.stepMove + character.health) /
      (100 * character.stepAttack) +
    (1 / character.attack) * afterAttack;
  return rank;
}

// Что то вроде оценивания ячейки для атаки

export function rankedAttack(aiTeam, targetTeam, afterAttack) {
  const rank =
    aiTeam.character.attack -
    targetTeam.character.defence -
    afterAttack * (targetTeam.character.attack - aiTeam.character.defence);
  return rank / 10;
}

// Создает определеного перcонажа после загрузки сохранения
export function createCharacter(char) {
  let character;
  switch (char.type) {
    case 'bowman':
      character = new Bowman();
      break;
    case 'daemon':
      character = new Daemon();
      break;
    case 'magician':
      character = new Magician();
      break;
    case 'swordsman':
      character = new Swordsman();
      break;
    case 'undead':
      character = new Undead();
      break;
    case 'vampire':
      character = new Vampire();
      break;

    default:
      break;
  }
  character.health = char.health;
  character.attack = char.attack;
  character.defence = char.defence;
  character.level = char.level
  return character;
}

// обьект после сохранения приводит  к рабочему состоянию

export function jsonParseGameState(object) {
  const { activeTeam, targetTeam, boardSize, gameLevel } = object;
  const userTeam = new Team();
  const enemyTeam = new Team();
  const userTeamPositionedCharacters = [];
  const enemyTeamPositionedCharacters = [];
  for (let i = 0; i < object.userTeamPositionedCharacters.length; i += 1) {
    const char = createCharacter(
      object.userTeamPositionedCharacters[i].character
    );
    const { position } = object.userTeamPositionedCharacters[i];
    userTeam.add(char);
    userTeamPositionedCharacters.push(new PositionedCharacter(char, position));
  }
  for (let i = 0; i < object.enemyTeamPositionedCharacters.length; i += 1) {
    const char = createCharacter(
      object.enemyTeamPositionedCharacters[i].character
    );
    const { position } = object.enemyTeamPositionedCharacters[i];
    enemyTeam.add(char);
    enemyTeamPositionedCharacters.push(new PositionedCharacter(char, position));
  }
  return {
    boardSize,
    activeTeam,
    targetTeam,
    userTeam,
    enemyTeam,
    userTeamPositionedCharacters,
    enemyTeamPositionedCharacters,
    gameLevel,
  };
}
// создает список всех стартовых  startPosition указывает на тип команды и где она будет распологаться 
export function setDefaultPosition(startposition, boardSize) {
  const set = new Set();
  for (let i = startposition; i < boardSize ** 2; i += boardSize) {
    set.add(i);
    set.add(i - 1);
  }
  return set;
}

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
