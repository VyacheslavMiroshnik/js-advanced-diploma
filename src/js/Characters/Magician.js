import Character from '../Character';

export default class Magician extends Character {
  constructor() {
    super('magician');
    this.attack = 10 ;
    this.defence = 40 ;
    this.stepMove = 1;
    this.stepAttack = 4;
  }
}
