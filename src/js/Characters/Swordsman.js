import Character from '../Character';

export default class Swordsman extends Character {
  constructor() {
    super('swordsman');
    this.attack = 40 ;
    this.defence = 10 ;
    this.stepMove = 4;
    this.stepAttack = 1;
  }
}
