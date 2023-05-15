import GameState from "./GameState";

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
export function calcTileType(index, boardSize) {
  const topLeft = index === 0 ? 'top-left' : null;
  const topRight = index === boardSize - 1 ? 'top-right' : null;
  const bottomLeft = index === boardSize * (boardSize - 1) ? 'bottom-left' : null;
  const bottomRight = index === boardSize ** 2 - 1 ? 'bottom-right' : null;
  const left = index > 0 && !(index % boardSize) ? 'left' : null;
  const right = index > boardSize && !((index + 1) % boardSize) ? 'right' : null;
  const top = index > 0 && index < boardSize - 1 ? 'top' : null;
  const bottom = index > boardSize * (boardSize - 1) && index < boardSize ** 2 - 1
    ? 'bottom'
    : null;

  return (
    topLeft
    || topRight
    || bottomLeft
    || bottomRight
    || left
    || bottom
    || top
    || right
    || 'center'
  );
}

export function calculateMoveCharacter({ character, position }) {
  const { type } = character;
  const { boardSize } = this.gameState;
  const moved = GameState.moved(type);
  const leftBorderPosition = this.gameState.border.get('leftBorder');
  const rightBorderPosition = this.gameState.border.get('rightBorder');
  const movedSet = new Set();
  for (let i  = 1; i <= moved; i+=1 ){
    if(rightBorderPosition.includes(position - i) || position - i < 0){
      break;
    }
    movedSet.add(position - ((i)*boardSize)  )
    movedSet.add(position + ((i)*boardSize)  )
    movedSet.add(position - i + ((i)*boardSize) )
    movedSet.add(position - i - ((i)*boardSize) )
    movedSet.add(position - i )
  }
  
  for (let i  = 1; i <= moved; i+=1 ){
    if(leftBorderPosition.includes(position + i)){
      break;
    }
    movedSet.add(position - ((i)*boardSize)  )
    movedSet.add(position + ((i)*boardSize)  )
    movedSet.add(position + i + ((i)*boardSize) )
    movedSet.add(position + i - ((i)*boardSize) )
    movedSet.add(position + i )
  }
  movedSet.delete(position)

  return Array.from(movedSet).filter((el) => el >= 0 && el < boardSize ** 2);
}
export function  calculateAttackCharacter({ character, position }) {
  const { type } = character;
  const { boardSize } = this.gameState;
  const attack = GameState.attack(type);
  const leftBorderPosition = this.gameState.border.get('leftBorder');
  const rightBorderPosition = this.gameState.border.get('rightBorder');
  const rowCharacterPosition = Math.floor((position ) / boardSize);
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
  attackSet.delete(position);
  return Array.from(attackSet).filter((el) => el >= 0 && el < boardSize ** 2);
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
