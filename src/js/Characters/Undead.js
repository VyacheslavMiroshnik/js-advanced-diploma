import Character from '../Character';

export default class Undead extends Character {
  constructor() {
    super('undead');
    this.attack = 40 ;
    this.defence = 10 ;
    this.stepMove = 4;
    this.stepAttack = 1;
  }
}
