/**
 * Класс, представляющий персонажей команды
 *
 * @todo Самостоятельно продумайте хранение персонажей в классе
 * Например
 * @example
 * ```js
 * const characters = [new Swordsman(2), new Bowman(1)]
 * const team = new Team(characters);
 *
 * team.characters // [swordsman, bowman]
 * ```
 * */
export default class Team {
  constructor(characters = []) {
    this.characters = characters;
  }

  has(character){
    return this.characters.includes(character)
  }

  add(character){
    this.characters.push(character)
  }

  addAll(characters){
    characters.forEach(element => {
      this.add(element)  
    });
  }

  remove(character){
    const set = new Set(this.characters);
    set.delete(character);
    this.characters = Array.from(set)
  }
}


