import Bowman from './Characters/Bowman';
import Daemon from './Characters/Daemon';
import Magician from './Characters/Magician';
import Swordsman from './Characters/Swordsman';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import PositionedCharacter from './PositionedCharacter';
import { generateTeam } from './generators';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.tooltipMessage = ``;
    this.positionsCharacter = [];
    this.userTeam = generateTeam([Bowman, Magician, Swordsman], 3, 3);
    this.enemyTeam = generateTeam([Daemon, Undead, Vampire], 3, 3);
    this.userTeamPositions = this.setDefaultPosition(1);
    this.enemyTeamPositions = this.setDefaultPosition(
      this.gamePlay.boardSize - 1
    );
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.drawCharactersPosition('user');
    this.drawCharactersPosition('enemy');
    this.gamePlay.redrawPositions(this.positionsCharacter);
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  setDefaultPosition(startposition) {
    const set = new Set();
    const { boardSize } = this.gamePlay;
    for (let i = startposition; i < boardSize ** 2; i += boardSize) {
      set.add(i);
      set.add(i - 1);
    }
    return set;
  }

  drawCharactersPosition(typeTeam) {
    const { characters } = typeTeam === 'user' ? this.userTeam : this.enemyTeam;
    const positions =
      typeTeam === 'user' ? this.userTeamPositions : this.enemyTeamPositions;
    for (let i = 0; i < characters.length; i += 1) {
      const arrayPositions = Array.from(positions);
      const randomIndex = Math.floor(Math.random() * arrayPositions.length);
      const position = arrayPositions[randomIndex];
      positions.delete(position);
      this.positionsCharacter.push(
        new PositionedCharacter(characters[i], position)
      );
    }
  }

  createTooltipMessage(character) {
    const { level, attack, defence, health, type } = character;
    this.message = `\u{1f396}${level} \u{2694}${attack} \u{1f6e1}${defence} \u{2764}${health} ---${type}`;
  }

  onCellClick(index) {
    // TODO: react to click
  }

  onCellEnter(index) {
    const arr = this.positionsCharacter.map((el) => el.position);
    if (arr.includes(index)) {
      const indexCharacter = arr.indexOf(index);
      this.createTooltipMessage(
        this.positionsCharacter[indexCharacter].character
      );
      this.gamePlay.showCellTooltip(this.message, index);
      this.message = ``;
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
