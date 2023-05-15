import Bowman from '../js/Characters/Bowman';
import GameController from '../js/GameController';
import GamePlay from '../js/GamePlay';

test('test tooltip message',() => {
const gameController = new GameController(new GamePlay());
gameController.createTooltipMessage(new Bowman(1));
expect(gameController.message).toBe(`\u{1f396}1 \u{2694}25 \u{1f6e1}25 \u{2764}50`)
})
