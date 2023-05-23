
export default class Character {
  constructor( type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('Error Character class target');
    } else {
      this.level = 1;
      this.attack = 0;
      this.defence = 0;
      this.health = 50;
      this.type = type;  
    }

    // TODO: выбросите исключение, если кто-то использует 'new Character()'
  }

  leveUp() {
    this.level += 1
      this.attack = Math.max(
        this.attack,
        (this.attack * (80 + this.health)) / 100
      );
      this.defence = Math.max(
        this.defence,
        (this.defence * (80 + this.health)) / 100
      );
    this.health = this.health + 80 > 100 ? 100 : this.health + 80;
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

}
