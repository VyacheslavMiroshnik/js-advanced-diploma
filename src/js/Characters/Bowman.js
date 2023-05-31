import Character from '../Character';

export default class Bowman extends Character {
  constructor() {
    super('bowman');
    this.attack = 25 ;
    this.defence = 25 ;
    this.stepMove = 2;
    this.stepAttack = 2;
  }
}
