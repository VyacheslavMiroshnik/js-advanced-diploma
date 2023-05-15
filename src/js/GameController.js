import GamePlay from './GamePlay';
import GameState from './GameState';
import { calculateAttackCharacter, calculateMoveCharacter } from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.stateService = stateService;
    this.gameState = new GameState(this.gamePlay);
    this.activeClickPosition = null;
    this.activeEnterPosition = null;
  }

  init() {
    this.gamePlay.drawUi('prairie');
    this.gamePlay.addCellClickListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
    this.createNewGame(this.gameState);
    this.gamePlay.redrawPositions(this.allPositionedCharacter);
    this.calculateAttackCharacter = calculateAttackCharacter;
    this.calculateMoveCharacter = calculateMoveCharacter;
    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  getActiveCharacter() {
    return this.gameState.activeTeam.filter(
      (el) => el.position === this.activeClickPosition
    )[0];
  }

  getTargetCharacter(index) {
    return this.gameState.targetTeam.filter((el) => el.position === index)[0];
  }

  createNewGame({
    userTeam,
    enemyTeam,
    userTeamPositionedCharacters,
    enemyTeamPositionedCharacters,
    allPositionedCharacter,
  }) {
    this.userTeam = userTeam;
    this.enemyTeam = enemyTeam;
    this.userTeamPositionedCharacters = userTeamPositionedCharacters;
    this.enemyTeamPositionedCharacters = enemyTeamPositionedCharacters;
    this.allPositionedCharacter = allPositionedCharacter;
  }

  update() {
    this.gamePlay.deselectCell(this.activeClickPosition);
    this.gamePlay.deselectCell(this.activeEnterPosition);
    this.activeClickPosition = null;
    this.activeEnterPosition = null;
    this.gameState.changeTeam();
    this.gamePlay.setCursor('auto');
    this.gamePlay.redrawPositions(this.allPositionedCharacter);
  }

  createTooltipMessage(character) {
    const { level, attack, defence, health } = character;
    this.message = `\u{1f396}${level} \u{2694}${attack} \u{1f6e1}${defence} \u{2764}${health}`;
  }

  moved(index) {
    if (
      this.calculateMoveCharacter(this.getActiveCharacter()).includes(index)
    ) {
      this.getActiveCharacter().position = index;
      this.update();
    }
  }

  async attacked(index) {
    const attackCharacter = this.getActiveCharacter();
    const targetCharacter = this.getTargetCharacter(index);
    const attack = Math.max(
      attackCharacter.character.attack - targetCharacter.character.defence,
      attackCharacter.character.attack * 0.1
    );
    await this.gamePlay.showDamage(index, attack);
    // setTimeout(()=>{
    //   this.gamePlay.showDamage(index,attack)
    // },1)
    targetCharacter.character.health -= attack;
    this.update();
  }

  changeCursorType(index) {
    let cursorType = 'auto';
    if (this.activeClickPosition !== index) {
      if (this.checkBusyField(index)) {
        if (this.checkActiveTeamField(index)) {
          cursorType = 'pointer';
        } else if (
          this.calculateAttackCharacter(this.getActiveCharacter()).includes(
            index
          )
        ) {
          this.gamePlay.selectCell(index, 'red');
          cursorType = 'crosshair';
        } else {
          cursorType = 'not-allowed';
        }
      } else if (
        this.calculateMoveCharacter(this.getActiveCharacter()).includes(index)
      ) {
        this.gamePlay.selectCell(index, 'green');
        cursorType = 'pointer';
      } else {
        cursorType = 'not-allowed';
      }
    }
    return cursorType;
  }

  checkBusyField(index) {
    const isbusy =
      this.allPositionedCharacter.filter((el) => el.position === index).length >
      0;
    return isbusy;
  }

  checkActiveTeamField(index) {
    const activeTeamCharacterPosition = this.gameState.activeTeam.map(
      (el) => el.position
    );
    return activeTeamCharacterPosition.indexOf(index) !== -1;
  }

  checkTargedTeamField(index) {
    const targetTeamCharacterPosition = this.gameState.targetTeam.map(
      (el) => el.position
    );
    return targetTeamCharacterPosition.indexOf(index) !== -1;
  }

  onCellClick(index) {
    if (this.activeClickPosition !== null) {
      this.gamePlay.deselectCell(this.activeClickPosition);
      if (this.checkBusyField(index)) {
        if (this.checkActiveTeamField(index)) {
          this.gamePlay.selectCell(index);
          this.activeClickPosition = index;
        } else if (this.changeCursorType(index) === 'crosshair') {
          this.attacked(index);
        } else {
          GamePlay.showError('Данным персонажем управляет компьютер');
        }
      } else {
        this.moved(index);
      }
    } else if (this.checkBusyField(index)) {
      if (this.checkActiveTeamField(index)) {
        this.gamePlay.selectCell(index);
        this.activeClickPosition = index;
      } else {
        GamePlay.showError('Данным персонажем управляет компьютер');
      }
    }
  }

  onCellEnter(index) {
    if (
      this.activeEnterPosition !== null &&
      this.activeEnterPosition !== this.activeClickPosition
    ) {
      this.gamePlay.deselectCell(this.activeEnterPosition);
    }
    if (this.activeClickPosition !== null) {
      this.activeEnterPosition = index;

      this.gamePlay.setCursor(this.changeCursorType(index));
    } else if (this.checkBusyField(index)) {
      const characterPositions = this.allPositionedCharacter.map(
        (el) => el.position
      );
      const indexCharacter = characterPositions.indexOf(index);
      this.createTooltipMessage(
        this.allPositionedCharacter[indexCharacter].character
      );
      this.gamePlay.showCellTooltip(this.message, index);
      this.message = ``;
    }
  }

  onCellLeave(index) {
    // TODO: react to mouse leave
  }
}
