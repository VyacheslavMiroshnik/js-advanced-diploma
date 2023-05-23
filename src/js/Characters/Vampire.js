import Character from '../Character';

export default class Vampire extends Character {
  constructor(level) {
    super(level, 'vampire');
    this.attack = 25 * this.level;
    this.defence = 25 * this.level;
    
  }
}
