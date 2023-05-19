/**
 * Базовый класс, от которого наследуются классы персонажей
 * @property level - уровень персонажа, от 1 до 4
 * @property attack - показатель атаки
 * @property defence - показатель защиты
 * @property health - здоровье персонажа
 * @property type - строка с одним из допустимых значений:
 * swordsman
 * bowman
 * magician
 * daemon
 * undead
 * vampire
 */
export default class Character {
  constructor(level = 1, type = 'generic') {
    if (new.target.name === 'Character') {
      throw new Error('Error Character class target');
    } else {
      this.level = level;
      this.attack = 0;
      this.defence = 0;
      this.health = 50;
      this.type = type;
      
        
    }

    // TODO: выбросите исключение, если кто-то использует 'new Character()'
  }

  leveUp(level) {
    for (let i = 0; i < level; i += 1) {
      this.attack = Math.max(
        this.attack,
        (this.attack * (80 + this.health)) / 100
      );
      this.defence = Math.max(
        this.defence,
        (this.defence * (80 + this.health)) / 100
      );
    }
    this.health = this.health + 80 > 100 ? 100 : this.health + 80;
  }
}
