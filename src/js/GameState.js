export default class GameState {
  constructor(object) {
    this.boardSize = object.boardSize;
    this.activeTeam = 'user';
    this.targetTeam = 'enemy';
    this.userTeam = object.userTeam;
    this.enemyTeam = object.enemyTeam;
    this.userTeamPositionedCharacters = object.userTeamPositionedCharacters;
    this.enemyTeamPositionedCharacters = object.enemyTeamPositionedCharacters;
    this.gameLevel = object.gameLevel;
  }

  update(object) {
    this.userTeam = object.userTeam
    this.enemyTeam = object.enemyTeam
    this.userTeamPositionedCharacters = object.userTeamPositionedCharacters;
    this.enemyTeamPositionedCharacters = object.enemyTeamPositionedCharacters;
    this.gameLevel = object.gameLevel;
  }

  changeTeam() {
    this.targetTeam = this.activeTeam;
    this.activeTeam = this.activeTeam === 'user' ? 'enemy' : 'user';
  }

  static from(object) {
    return new this(object);
  }
}
