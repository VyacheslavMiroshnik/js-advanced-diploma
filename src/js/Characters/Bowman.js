import Character from '../Character';

export default class Bowman extends Character {
  constructor() {
    super('bowman');
    this.attack = 25 ;
    this.defence = 25 ;
  }
}
