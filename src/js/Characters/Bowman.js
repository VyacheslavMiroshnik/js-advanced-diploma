import Character from '../Character';

export default class Bowman extends Character {
  constructor(level) {
    super(level, 'bowman');
    this.attack = 25 * this.level;
    this.defence = 25 * this.level;
    
  }
}
