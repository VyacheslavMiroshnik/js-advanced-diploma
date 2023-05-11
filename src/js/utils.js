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

export function calcHealthLevel(health) {
  if (health < 15) {
    return 'critical';
  }

  if (health < 50) {
    return 'normal';
  }

  return 'high';
}
