
export default class GameState {
  constructor(object) {
    this.boardSize = object.boardSize
    this.activeTeam = 'user'
    this.targetTeam = 'enemy'
    this.userTeam = object.userTeam;
    this.enemyTeam = object.enemyTeam;    
    this.userTeamPositionedCharacters = object.userTeamPositionedCharacters;
    this.enemyTeamPositionedCharacters = object.enemyTeamPositionedCharacters;
    this.gameLevel = object.gameLevel;
  }

update(object){ 
this.userPositionedCharacters = object.userTeamPositionedCharacters;
this.enemyTeamPositionedCharacters = object.enemyTeamPositionedCharacters;
this.gameLevel = object.gameLevel;
}

  static moved(type) {
    return new Map([
      ['bowman', 2],
      ['vampire', 2],
      ['swordsman', 4],
      ['undead', 4],
      ['magician', 1],
      ['daemon', 1],
    ]).get(type);
  }

  static attack(type) {
    return new Map([
      ['bowman', 2],
      ['vampire', 2],
      ['swordsman', 1],
      ['undead', 1],
      ['magician', 4],
      ['daemon', 4],
    ]).get(type);
  }

  changeTeam() {
    this.targetTeam = this.activeTeam;
    this.activeTeam =
      this.activeTeam === 'user'
        ? 'enemy'
        : 'user';
  }

  

 

  static from(object) {
  
    return new this(object);
  }
}
