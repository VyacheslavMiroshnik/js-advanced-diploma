import Character from '../Character';

export default class Vampire extends Character {
  constructor () {
    super('vampire');
    this.attack = 25 ;
    this.defence = 25 ;
    this.stepMove = 2;
    this.stepAttack = 2;
  }
}
