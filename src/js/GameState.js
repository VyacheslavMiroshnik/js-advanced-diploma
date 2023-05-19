import Bowman from './Characters/Bowman';
import Daemon from './Characters/Daemon';
import Magician from './Characters/Magician';
import Swordsman from './Characters/Swordsman';
import Undead from './Characters/Undead';
import Vampire from './Characters/Vampire';
import { generateTeam } from './generators';
import PositionedCharacter from './PositionedCharacter';

export default class GameState {
  constructor({ boardSize }) {
    this.boardSize = boardSize;
    this.userTeam = generateTeam([Bowman, Magician, Swordsman], 4, 3);
    this.enemyTeam = generateTeam([Daemon, Undead, Vampire], 4, 3);
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
    this.activeTeam = this.userTeamPositionedCharacters;
    this.targetTeam = this.enemyTeamPositionedCharacters;
    this.border = this.createGameField();
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
      this.activeTeam === this.userTeamPositionedCharacters
        ? this.enemyTeamPositionedCharacters
        : this.userTeamPositionedCharacters;
  }

  creatPositionedCharactersTeam(team, typeTeam) {
    const { characters } = team;
    const teamAllStartPosition =
      typeTeam === 'user'
        ? this.setDefaultPosition(1)
        : this.setDefaultPosition(this.boardSize - 1);
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

  setDefaultPosition(startposition) {
    const set = new Set();
    for (let i = startposition; i < this.boardSize ** 2; i += this.boardSize) {
      set.add(i);
      set.add(i - 1);
    }
    return set;
  }

  createGameField() {
    const map = new Map();
    const leftBorder = [];
    const rightBorder = [];
    const topBorder = [];
    const bottomBorder = [];
    for (let i = 0; i < this.boardSize ** 2; i += this.boardSize) {
      leftBorder.push(i);
    }
    map.set('leftBorder', leftBorder);

    for (
      let i = this.boardSize - 1;
      i < this.boardSize ** 2;
      i += this.boardSize
    ) {
      rightBorder.push(i);
    }
    map.set('rightBorder', rightBorder);

    for (let i = 0; i < this.boardSize; i += 1) {
      topBorder.push(i);
    }
    map.set('topBorder', topBorder);

    for (
      let i = this.boardSize ** 2 - this.boardSize;
      i < this.boardSize ** 2;
      i += 1
    ) {
      bottomBorder.push(i);
    }
    map.set('bottomBorder', bottomBorder);

    return map;
  }

  static from(object) {
    // TODO: create objecthjhj
    return null;
  }
}
