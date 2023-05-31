import Character from '../Character';

export default class Daemon extends Character {
  constructor() {
    super('daemon');
    this.attack = 10 ;
    this.defence = 10 ;
    this.stepMove = 1;
    this.stepAttack = 4;
  }
}
