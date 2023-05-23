
import GamePlay from './GamePlay';
import GameState from './GameState';
import PositionedCharacter from './PositionedCharacter';
import themes from './themes';
import {
  calculateAttackCharacter,
  calculateMoveCharacter,
  createGameBoard,
  createNewTeam,
  jsonParseGameState,
  rankedAttack,
  rankedMove,
  setDefaultPosition,
} from './utils';

export default class GameController {
  constructor(gamePlay, stateService) {
    this.gamePlay = gamePlay;
    this.boardSize = this.gamePlay.boardSize
    this.stateService = stateService;
    this.calculateAttackCharacter = calculateAttackCharacter;
    this.calculateMoveCharacter = calculateMoveCharacter;
    this.rankedMove = rankedMove;
    this.rankedAttack = rankedAttack;
    this.setDefaultPosition = setDefaultPosition;
    this.gamePlay.addNewGameListener(this.onNewGame.bind(this));
    this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this));
    this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this));
  }

  init() {
    this.userTeam = createNewTeam('user');
    this.enemyTeam = createNewTeam('enemy');
    this.gameLevel = { level: 1, theme: 'prairie' };
    this.gameBoard = createGameBoard(this.gamePlay.boardSize);

    this.activeClickPosition = null;
    this.activeEnterPosition = null;

    this.userTeamPositionedCharacters = this.creatPositionedCharactersTeam(
      this.userTeam,
      'user'
    );
    this.enemyTeamPositionedCharacters = this.creatPositionedCharactersTeam(
      this.enemyTeam,
      'enemy'
    );
    this.allPositionedCharacter = this.userTeamPositionedCharacters.concat(
      this.enemyTeamPositionedCharacters
    );
    this.gameState = new GameState(this);
    this.startGame();

    // TODO: add event listeners to gamePlay events
    // TODO: load saved stated from stateService
  }

  syncGameState({
    userTeam,
    enemyTeam,
    userTeamPositionedCharacters,
    enemyTeamPositionedCharacters,
    gameLevel,
    boardSize
  }) {
    this.userTeam = userTeam;
    this.enemyTeam = enemyTeam;
    this.boardSize = boardSize;
    this.userTeamPositionedCharacters = userTeamPositionedCharacters;
    this.enemyTeamPositionedCharacters = enemyTeamPositionedCharacters;
    this.allPositionedCharacter = [...userTeamPositionedCharacters,...enemyTeamPositionedCharacters];
    this.gameLevel = gameLevel;
  }

  startGame() {
    this.gameState.update(this)
    this.gamePlay.drawUi(this.gameLevel.theme);
    this.gamePlay.redrawPositions(this.allPositionedCharacter);
    this.addEventListener();
  }

  roundOver() {
    if (!this.userTeamPositionedCharacters.length) {
      this.gameOver();
    } else {
      this.enemyTeam = createNewTeam('enemy');

      this.updateGameLevel(this.userTeam);

      this.gameState = new GameState(this);
      this.clear()
      this.startGame();
    }
  }

  gameOver() {
    this.removeEvenetListener();
    this.gamePlay.drawUi(this.gameLevel.theme);
  }

  updateGameLevel(team) {
    this.gameLevel.level += 1;
    const keys = Object.keys(themes);
    this.gameLevel.theme =
      themes[keys[(this.gameLevel.level - 1) % keys.length]];
    for (let i = 0; i < team.characters.length; i += 1) {
      const person = team.characters[i];
      person.leveUp(1);
    }
    this.userTeamPositionedCharacters = this.creatPositionedCharactersTeam(
      this.userTeam,
      'user'
    );
    this.enemyTeamPositionedCharacters = this.creatPositionedCharactersTeam(
      this.enemyTeam,
      'enemy'
    );
    this.allPositionedCharacter = [
      ...this.userTeamPositionedCharacters,
      ...this.enemyTeamPositionedCharacters,
    ];
  
  }

  update() {
    this.clear();
    this.gameState.update(this)
    this.gameState.changeTeam();
    this.gamePlay.redrawPositions(this.allPositionedCharacter);
    if (this.gameState.activeTeam === 'enemy') {
      this.removeEvenetListener();
      this.aiLogic();
    } else {
      this.addEventListener();
    }
  }

 clear(){
if(this.activeClickPosition){
  this.gamePlay.deselectCell(this.activeClickPosition)
}
if (this.activeEnterPosition){
  this.gamePlay.deselectCell(this.activeEnterPosition)
}
this.activeEnterPosition = null;
this.activeClickPosition = null;
this.gamePlay.setCursor('auto');
this.removeEvenetListener();


 }
  // Создание команды игроком со своими полями на поле

  creatPositionedCharactersTeam(team, typeTeam) {
    const { characters } = team;
    const { boardSize } = this.gamePlay;
    const teamAllStartPosition =
      typeTeam === 'user'
        ? this.setDefaultPosition(1, boardSize)
        : this.setDefaultPosition(boardSize - 1, boardSize);
    const positionedTeam = [];

    for (let i = 0; i < characters.length; i += 1) {
      const arrayPositions = Array.from(teamAllStartPosition);
      const randomIndex = Math.floor(Math.random() * arrayPositions.length);
      const position = arrayPositions[randomIndex];
      teamAllStartPosition.delete(position);
      const characterPositioned = new PositionedCharacter(
        characters[i],
        position
      );
      positionedTeam.push(characterPositioned);
    }
    return positionedTeam;
  }

  // действие движение

  moved(index) {
    if (
      this.calculateMoveCharacter(this.getActiveCharacter()).includes(index)
    ) {
      this.getActiveCharacter().position = index;
      this.update();
    }
  }
  // Действие атака

  async attacked(index) {
    const attackCharacter = this.getActiveCharacter();
    const targetCharacter = this.getTargetCharacter(index);
    const attack = Math.max(
      attackCharacter.character.attack - targetCharacter.character.defence,
      attackCharacter.character.attack * 0.1
    );
    await this.gamePlay.showDamage(index, attack);

    targetCharacter.character.health -= attack;
    this.checkDead(targetCharacter);
    if (
      !this.userTeamPositionedCharacters.length ||
      !this.enemyTeamPositionedCharacters.length
    ) {
      this.roundOver();
    } else {
      this.update();
    }
  }
  // Проверка живой ли персонаж

  checkDead(character) {
    if (character.character.health <= 0) {
      if (this.userTeamPositionedCharacters.includes(character)) {
        const newUserTeam = new Set(this.userTeamPositionedCharacters);
        newUserTeam.delete(character);
        this.userTeamPositionedCharacters = Array.from(newUserTeam);
      } else {
        const newEnemyTeam = new Set(this.enemyTeamPositionedCharacters);
        newEnemyTeam.delete(character);
        this.enemyTeamPositionedCharacters = Array.from(newEnemyTeam);
      }

      this.allPositionedCharacter = this.userTeamPositionedCharacters.concat(
        this.enemyTeamPositionedCharacters
      );
    }

  }
  // Логика ии выбор атаки или передвижения

  aiLogic() {
    const aiMove = this.caluclatePositionToMove(
      this.enemyTeamPositionedCharacters,
      this.userTeamPositionedCharacters
    );
    const aiAttack = this.calculatePositionToAttack(
      this.enemyTeamPositionedCharacters,
      this.userTeamPositionedCharacters
    );
    const topAiMove = [];
    for (let i = 0; i < aiMove.length; i += 1) {
      const bestMove = aiMove[i][0];

      topAiMove.push(bestMove);
    }

    for (let i = 0; i < aiAttack.length; i += 1) {
      topAiMove.push(aiAttack[i]);
    }
    const nextStep = topAiMove[Math.floor(Math.random() * topAiMove.length)];
    [, this.activeClickPosition] = nextStep;
    if (nextStep[4] === 'attack') {
      this.attacked(nextStep[2]);
    } else {
      this.moved(nextStep[2]);
    }
  }
  //  вычесление возможных позиций длядвижения ИИ

  caluclatePositionToMove(team, targetTeam) {
    const aiCharacterMovePosition = [];
    const targetCharacterAttackPosition = [];
    const allRankedMove = [];
    for (let i = 0; i < team.length; i += 1) {
      const position = this.calculateMoveCharacter(team[i]);
      aiCharacterMovePosition.push(position);
    }
    for (let i = 0; i < targetTeam.length; i += 1) {
      const position = this.calculateAttackCharacter(targetTeam[i]);
      targetCharacterAttackPosition.push(position);
    }
    for (
      let indexCharacter = 0;
      indexCharacter < aiCharacterMovePosition.length;
      indexCharacter += 1
    ) {
      const positions = aiCharacterMovePosition[indexCharacter];
      const aiTeam = team[indexCharacter];
      const rankedPosition = [];
      for (
        let indexPosition = 0;
        indexPosition < positions.length;
        indexPosition += 1
      ) {
        const aiPosition = positions[indexPosition];
        let rank = 1;
        for (
          let indexTargetCharacter = 0;
          indexTargetCharacter < targetCharacterAttackPosition.length;
          indexTargetCharacter += 1
        ) {
          const afterAttack =
            targetCharacterAttackPosition[indexTargetCharacter].includes(
              aiPosition
            );
          rank -= this.rankedMove(
            aiTeam,
            targetTeam[indexTargetCharacter],
            afterAttack
          );
        }
        rankedPosition.push([
          indexCharacter,
          aiTeam.position,
          aiPosition,
          rank,
          'move',
        ]);
      }
      allRankedMove.push(rankedPosition.sort((a, b) => b[2] - a[2]));
    }
    return allRankedMove;
  }

  // вычесление всех возожных позиций для атаки ИИ

  calculatePositionToAttack(team, targetTeam) {
    const aiCharacterAttackPosition = [];
    const targetCharacterAttackPosition = [];
    const attackList = [];
    for (let i = 0; i < team.length; i += 1) {
      const position = this.calculateAttackCharacter(team[i]);
      aiCharacterAttackPosition.push(position);
    }
    for (let i = 0; i < targetTeam.length; i += 1) {
      const position = this.calculateAttackCharacter(targetTeam[i]);
      targetCharacterAttackPosition.push(position);
    }
    for (
      let indexCharacter = 0;
      indexCharacter < team.length;
      indexCharacter += 1
    ) {
      const attackedTeam = team[indexCharacter];
      const positions = aiCharacterAttackPosition[indexCharacter];
      const { position } = attackedTeam;
      for (
        let indexTargetCharacter = 0;
        indexTargetCharacter < targetTeam.length;
        indexTargetCharacter += 1
      ) {
        const enemyTeam = targetTeam[indexTargetCharacter];
        const enemyPosition = enemyTeam.position;
        const enemyPositions =
          targetCharacterAttackPosition[indexTargetCharacter];
        const afterAttack = enemyPositions.includes(position) ? 1 : 0;
        if (positions.includes(enemyPosition)) {
          const rank = this.rankedAttack(attackedTeam, enemyTeam, afterAttack);
          attackList.push([
            indexCharacter,
            position,
            enemyPosition,
            rank,
            'attack',
          ]);
        }
      }
    }

    return attackList.sort((a, b) => b[3] - a[3]);
  }

  //  Создания информации о перонаже

  createTooltipMessage(character) {
    const { level, attack, defence, health } = character;
    this.message = `\u{1f396}${level} \u{2694}${attack} \u{1f6e1}${defence} \u{2764}${health}`;
  }
  //  Выбор типа курсора

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
  //  Проверка всех занятых полей

  checkBusyField(index) {
    const isbusy =
      this.allPositionedCharacter.filter((el) => el.position === index).length >
      0;
    return isbusy;
  }
  //  Проверка полей команды

  checkActiveTeamField(index) {
    const activeTeam =
      this.gameState.activeTeam === 'user'
        ? this.userTeamPositionedCharacters
        : this.enemyTeamPositionedCharacters;
    const activeTeamCharacterPosition = activeTeam.map((el) => el.position);
    return activeTeamCharacterPosition.indexOf(index) !== -1;
  }
  //  Проверка полей соперника

  checkTargedTeamField(index) {
    const targetTeam =
      this.gameState.activeTeam === 'user'
        ? this.enemyTeamPositionedCharacters
        : this.userTeamPositionedCharacters;
    const targetTeamCharacterPosition = targetTeam.map((el) => el.position);
    return targetTeamCharacterPosition.indexOf(index) !== -1;
  }
  // возвращает выбраного персонажа

  getActiveCharacter() {
    const activeTeam =
      this.gameState.activeTeam === 'user'
        ? this.userTeamPositionedCharacters
        : this.enemyTeamPositionedCharacters;
    return activeTeam.filter(
      (el) => el.position === this.activeClickPosition
    )[0];
  }

  getTargetCharacter(index) {
    const targetTeam =
      this.gameState.activeTeam === 'user'
        ? this.enemyTeamPositionedCharacters
        : this.userTeamPositionedCharacters;
    return targetTeam.filter((el) => el.position === index)[0];
  }
  // реакция на нажатия правой кнопки мыши

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
  // Реакция на движение мышки

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

  onCellLeave(index) {}

  onNewGame() {
    this.removeEvenetListener();
    this.init();
  }

  onSaveGame() {
    this.stateService.save(this.gameState);
  }

  onLoadGame() {
    const jsonObject = this.stateService.load();
    this.gameState = new GameState(jsonParseGameState(jsonObject))
    this.syncGameState(this.gameState);
    this.clear()
    this.startGame();

  }

  


  addEventListener() {
    this.gamePlay.addCellClickListener(this.onCellLeave.bind(this));
    this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this));
    this.gamePlay.addCellClickListener(this.onCellClick.bind(this));
  }

  removeEvenetListener() {
    this.gamePlay.cellClickListeners = [];
    this.gamePlay.cellEnterListeners = [];
    this.gamePlay.cellLeaveListeners = [];
  }
}
