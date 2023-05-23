!function(){"use strict";class e{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:[];this.characters=e}has(e){return this.characters.includes(e)}add(e){this.characters.push(e)}addAll(e){e.forEach((e=>{this.add(e)}))}remove(e){const t=new Set(this.characters);t.delete(e),this.characters=Array.from(t)}}class t{constructor(){let e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"generic";if("Character"===new.target.name)throw new Error("Error Character class target");this.level=1,this.attack=0,this.defence=0,this.health=50,this.type=e}leveUp(){this.level+=1,this.attack=Math.max(this.attack,this.attack*(80+this.health)/100),this.defence=Math.max(this.defence,this.defence*(80+this.health)/100),this.health=this.health+80>100?100:this.health+80}static moved(e){return new Map([["bowman",2],["vampire",2],["swordsman",4],["undead",4],["magician",1],["daemon",1]]).get(e)}static attack(e){return new Map([["bowman",2],["vampire",2],["swordsman",1],["undead",1],["magician",4],["daemon",4]]).get(e)}}class a extends t{constructor(){super("bowman"),this.attack=25,this.defence=25}}class s extends t{constructor(){super("daemon"),this.attack=10,this.defence=10}}class i extends t{constructor(){super("magician"),this.attack=10,this.defence=40}}class r extends t{constructor(){super("swordsman"),this.attack=40,this.defence=10}}class n extends t{constructor(){super("undead"),this.attack=40,this.defence=10}}class o extends t{constructor(){super("vampire"),this.attack=25,this.defence=25}}class h{constructor(e,a){if(!(e instanceof t))throw new Error("character must be instance of Character or its children");if("number"!=typeof a)throw new Error("position must be a number");this.character=e,this.position=a}}function c(t){return function(t,a,s){const i=new e,r=function*(e){for(;;)yield new(e[Math.floor(Math.random()*e.length)])}(t);for(let e=0;e<s;e+=1){const e=Math.floor(Math.random()*a+1),t=r.next().value;for(let t=1;t<e;t+=1);i.add(t)}return i}("user"===t?[a,i,r]:[s,n,o],4,2)}function l(e,a,s,i){const{character:r,position:n}=e,{type:o}=r,h=a.map((e=>e.position)),c=t.moved(o),l=s.get("leftBorder"),d=s.get("rightBorder"),m=new Set;for(let e=1;e<=c&&!(d.includes(n-e)||n-e<0);e+=1)m.add(n-e*i),m.add(n+e*i),m.add(n-e+e*i),m.add(n-e-e*i),m.add(n-e);for(let e=1;e<=c&&!(l.includes(n+e)||n+e>=i**2);e+=1)m.add(n-e*i),m.add(n+e*i),m.add(n+e+e*i),m.add(n+e-e*i),m.add(n+e);for(let e=0;e<h.length;e+=1)m.delete(h[e]);return Array.from(m).filter((e=>e>=0&&e<i**2))}function d(e,a,s,i){const{character:r,position:n}=e,{type:o}=r,h=a.map((e=>e.position)),c=t.attack(o),l=s.get("leftBorder"),d=s.get("rightBorder"),m=Math.floor(n/i),u=m>=c?m-c:0,v=m+c<=i-1?m+c:i-1,C=n-c>=l[m]?n-l[m]-c:0,g=n+c<=d[m]?n+c-l[m]:i-1,P=new Set;for(let e=u;e<=v;e+=1)for(let t=C;t<=g;t+=1)P.add(l[e]+t);for(let e=0;e<h.length;e+=1)P.delete(h[e]);return Array.from(P).filter((e=>e>=0&&e<i**2))}function m(e,a,s){const{character:i}=a;return(t.moved(i.type)+i.health)/(100*t.attack(i.type))+1/i.attack*s}function u(e,t,a){return(e.character.attack-t.character.defence-a*(t.character.attack-e.character.defence))/10}function v(e){let t;switch(e.type){case"bowman":t=new a;break;case"daemon":t=new s;break;case"magician":t=new i;break;case"swordsman":t=new r;break;case"undead":t=new n;break;case"vampire":t=new o}return t.health=e.health,t.attack=e.attack,t.defence=e.defence,t.level=e.level,t}function C(e,t){const a=new Set;for(let s=e;s<t**2;s+=t)a.add(s),a.add(s-1);return a}class g{constructor(){this.boardSize=8,this.container=null,this.boardEl=null,this.cells=[],this.cellClickListeners=[],this.cellEnterListeners=[],this.cellLeaveListeners=[],this.newGameListeners=[],this.saveGameListeners=[],this.loadGameListeners=[]}bindToDOM(e){if(!(e instanceof HTMLElement))throw new Error("container is not HTMLElement");this.container=e}drawUi(e){this.checkBinding(),this.container.innerHTML="\n      <div class='controls'>\n        <button data-id='action-restart' class='btn'>New Game</button>\n        <button data-id='action-save' class='btn'>Save Game</button>\n        <button data-id='action-load' class='btn'>Load Game</button>\n      </div>\n      <div class='board-container'>\n        <div data-id='board' class='board'></div>\n      </div>\n    ",this.newGameEl=this.container.querySelector("[data-id=action-restart]"),this.saveGameEl=this.container.querySelector("[data-id=action-save]"),this.loadGameEl=this.container.querySelector("[data-id=action-load]"),this.newGameEl.addEventListener("click",(e=>this.onNewGameClick(e))),this.saveGameEl.addEventListener("click",(e=>this.onSaveGameClick(e))),this.loadGameEl.addEventListener("click",(e=>this.onLoadGameClick(e))),this.boardEl=this.container.querySelector("[data-id=board]"),this.boardEl.classList.add(e);for(let e=0;e<this.boardSize**2;e+=1){const s=document.createElement("div");s.classList.add("cell","map-tile",`map-tile-${t=e,a=this.boardSize,(0===t?"top-left":null)||(t===a-1?"top-right":null)||(t===a*(a-1)?"bottom-left":null)||(t===a**2-1?"bottom-right":null)||(t>0&&!(t%a)?"left":null)||(t>a*(a-1)&&t<a**2-1?"bottom":null)||(t>0&&t<a-1?"top":null)||(t>a&&!((t+1)%a)?"right":null)||"center"}`),s.addEventListener("mouseenter",(e=>this.onCellEnter(e))),s.addEventListener("mouseleave",(e=>this.onCellLeave(e))),s.addEventListener("click",(e=>this.onCellClick(e))),this.boardEl.appendChild(s)}var t,a;this.cells=Array.from(this.boardEl.children)}redrawPositions(e){for(const e of this.cells)e.innerHTML="";for(const a of e){const e=this.boardEl.children[a.position],s=document.createElement("div");s.classList.add("character",a.character.type);const i=document.createElement("div");i.classList.add("health-level");const r=document.createElement("div");r.classList.add("health-level-indicator","health-level-indicator-"+((t=a.character.health)<15?"critical":t<50?"normal":"high")),r.style.width=`${a.character.health}%`,i.appendChild(r),s.appendChild(i),e.appendChild(s)}var t}addCellEnterListener(e){this.cellEnterListeners.push(e)}addCellLeaveListener(e){this.cellLeaveListeners.push(e)}addCellClickListener(e){this.cellClickListeners.push(e)}addNewGameListener(e){this.newGameListeners.push(e)}addSaveGameListener(e){this.saveGameListeners.push(e)}addLoadGameListener(e){this.loadGameListeners.push(e)}onCellEnter(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellEnterListeners.forEach((e=>e.call(null,t)))}onCellLeave(e){e.preventDefault();const t=this.cells.indexOf(e.currentTarget);this.cellLeaveListeners.forEach((e=>e.call(null,t)))}onCellClick(e){const t=this.cells.indexOf(e.currentTarget);this.cellClickListeners.forEach((e=>e.call(null,t)))}onNewGameClick(e){e.preventDefault(),this.newGameListeners.forEach((e=>e.call(null)))}onSaveGameClick(e){e.preventDefault(),this.saveGameListeners.forEach((e=>e.call(null)))}onLoadGameClick(e){e.preventDefault(),this.loadGameListeners.forEach((e=>e.call(null)))}static showError(e){alert(e)}static showMessage(e){alert(e)}selectCell(e){let t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"yellow";this.cells[e].classList.add("selected",`selected-${t}`)}deselectCell(e){const t=this.cells[e];t.classList.remove(...Array.from(t.classList).filter((e=>e.startsWith("selected"))))}showCellTooltip(e,t){this.cells[t].title=e}hideCellTooltip(e){this.cells[e].title=""}showDamage(e,t){return new Promise((a=>{const s=this.cells[e],i=document.createElement("span");i.textContent=t,i.classList.add("damage"),s.appendChild(i),i.addEventListener("animationend",(()=>{s.removeChild(i),a()}))}))}setCursor(e){this.boardEl.style.cursor=e}checkBinding(){if(null===this.container)throw new Error("GamePlay not bind to DOM")}}class P{constructor(e){this.boardSize=e.boardSize,this.activeTeam="user",this.targetTeam="enemy",this.userTeam=e.userTeam,this.enemyTeam=e.enemyTeam,this.userTeamPositionedCharacters=e.userTeamPositionedCharacters,this.enemyTeamPositionedCharacters=e.enemyTeamPositionedCharacters,this.gameLevel=e.gameLevel}update(e){this.userTeam=e.userTeam,this.enemyTeam=e.enemyTeam,this.userPositionedCharacters=e.userTeamPositionedCharacters,this.enemyTeamPositionedCharacters=e.enemyTeamPositionedCharacters,this.gameLevel=e.gameLevel}changeTeam(){this.targetTeam=this.activeTeam,this.activeTeam="user"===this.activeTeam?"enemy":"user"}static from(e){return new this(e)}}var T={prairie:"prairie",desert:"desert",arctic:"arctic",mountain:"mountain"};const f=new g;f.bindToDOM(document.querySelector("#game-container"));const p=new class{constructor(e){this.storage=e}save(e){this.storage.setItem("state",JSON.stringify(e))}load(){try{return JSON.parse(this.storage.getItem("state"))}catch(e){throw new Error("Invalid state")}}}(localStorage),y=new class{constructor(e,t){this.gamePlay=e,this.boardSize=this.gamePlay.boardSize,this.stateService=t,this.calculateAttackCharacter=d,this.calculateMoveCharacter=l,this.rankedMove=m,this.rankedAttack=u,this.setDefaultPosition=C,this.gamePlay.addNewGameListener(this.onNewGame.bind(this)),this.gamePlay.addSaveGameListener(this.onSaveGame.bind(this)),this.gamePlay.addLoadGameListener(this.onLoadGame.bind(this))}init(){this.userTeam=c("user"),this.enemyTeam=c("enemy"),this.gameLevel={level:1,theme:"prairie"},this.gameBoard=function(e){const t=new Map,a=[],s=[],i=[],r=[];for(let t=0;t<e**2;t+=e)a.push(t);t.set("leftBorder",a);for(let t=e-1;t<e**2;t+=e)s.push(t);t.set("rightBorder",s);for(let t=0;t<e;t+=1)i.push(t);t.set("topBorder",i);for(let t=e**2-e;t<e**2;t+=1)r.push(t);return t.set("bottomBorder",r),t}(this.gamePlay.boardSize),this.activeClickPosition=null,this.activeEnterPosition=null,this.userTeamPositionedCharacters=this.creatPositionedCharactersTeam(this.userTeam,"user"),this.enemyTeamPositionedCharacters=this.creatPositionedCharactersTeam(this.enemyTeam,"enemy"),this.allPositionedCharacter=this.userTeamPositionedCharacters.concat(this.enemyTeamPositionedCharacters),this.gameState=new P(this),this.startGame()}syncGameState(e){let{userTeam:t,enemyTeam:a,userTeamPositionedCharacters:s,enemyTeamPositionedCharacters:i,gameLevel:r,boardSize:n}=e;this.userTeam=t,this.enemyTeam=a,this.boardSize=n,this.userTeamPositionedCharacters=s,this.enemyTeamPositionedCharacters=i,this.allPositionedCharacter=[...s,...i],this.gameLevel=r}startGame(){this.gameState.update(this),this.gamePlay.drawUi(this.gameLevel.theme),this.gamePlay.redrawPositions(this.allPositionedCharacter),this.addEventListener()}roundOver(){this.userTeamPositionedCharacters.length?(this.enemyTeam=c("enemy"),this.updateGameLevel(this.userTeam),this.gameState=new P(this),this.clear(),this.startGame()):this.gameOver()}gameOver(){this.removeEvenetListener(),this.gamePlay.drawUi(this.gameLevel.theme)}updateGameLevel(e){this.gameLevel.level+=1;const t=Object.keys(T);this.gameLevel.theme=T[t[(this.gameLevel.level-1)%t.length]];for(let t=0;t<e.characters.length;t+=1)e.characters[t].leveUp();this.userTeamPositionedCharacters=this.creatPositionedCharactersTeam(this.userTeam,"user"),this.enemyTeamPositionedCharacters=this.creatPositionedCharactersTeam(this.enemyTeam,"enemy"),this.allPositionedCharacter=[...this.userTeamPositionedCharacters,...this.enemyTeamPositionedCharacters]}update(){this.clear(),this.gameState.update(this),this.gameState.changeTeam(),this.gamePlay.redrawPositions(this.allPositionedCharacter),"enemy"===this.gameState.activeTeam?(this.removeEvenetListener(),this.aiLogic()):this.addEventListener()}clear(){this.activeClickPosition&&this.gamePlay.deselectCell(this.activeClickPosition),this.activeEnterPosition&&this.gamePlay.deselectCell(this.activeEnterPosition),this.activeEnterPosition=null,this.activeClickPosition=null,this.gamePlay.setCursor("auto"),this.removeEvenetListener()}creatPositionedCharactersTeam(e,t){const{characters:a}=e,{boardSize:s}=this.gamePlay,i="user"===t?this.setDefaultPosition(1,s):this.setDefaultPosition(s-1,s),r=[];for(let e=0;e<a.length;e+=1){const t=Array.from(i),s=t[Math.floor(Math.random()*t.length)];i.delete(s);const n=new h(a[e],s);r.push(n)}return r}moved(e){this.calculateMoveCharacter(this.getActiveCharacter(),this.allPositionedCharacter,this.gameBoard,this.boardSize).includes(e)&&(this.getActiveCharacter().position=e,this.update())}async attacked(e){const t=this.getActiveCharacter(),a=this.getTargetCharacter(e),s=Math.max(t.character.attack-a.character.defence,.1*t.character.attack);await this.gamePlay.showDamage(e,s),a.character.health-=s,this.checkDead(a),this.userTeamPositionedCharacters.length&&this.enemyTeamPositionedCharacters.length?this.update():this.roundOver()}checkDead(e){if(e.character.health<=0){if(this.userTeamPositionedCharacters.includes(e)){const t=new Set(this.userTeamPositionedCharacters);t.delete(e),this.userTeamPositionedCharacters=Array.from(t),this.userTeam.remove(e.character)}else{const t=new Set(this.enemyTeamPositionedCharacters);t.delete(e),this.enemyTeamPositionedCharacters=Array.from(t),this.enemyTeam.remove(e.character)}this.allPositionedCharacter=this.userTeamPositionedCharacters.concat(this.enemyTeamPositionedCharacters)}}aiLogic(){const e=this.caluclatePositionToMove(this.enemyTeamPositionedCharacters,this.userTeamPositionedCharacters),t=this.calculatePositionToAttack(this.enemyTeamPositionedCharacters,this.userTeamPositionedCharacters),a=[];for(let t=0;t<e.length;t+=1){const s=e[t][0];a.push(s)}for(let e=0;e<t.length;e+=1)a.push(t[e]);const s=a[Math.floor(Math.random()*a.length)];[,this.activeClickPosition]=s,"attack"===s[4]?this.attacked(s[2]):this.moved(s[2])}caluclatePositionToMove(e,t){const a=[],s=[],i=[];for(let t=0;t<e.length;t+=1){const s=this.calculateMoveCharacter(e[t],this.allPositionedCharacter,this.gameBoard,this.boardSize);a.push(s)}for(let e=0;e<t.length;e+=1){const a=this.calculateAttackCharacter(t[e],t,this.gameBoard,this.boardSize);s.push(a)}for(let r=0;r<a.length;r+=1){const n=a[r],o=e[r],h=[];for(let e=0;e<n.length;e+=1){const a=n[e];let i=1;for(let e=0;e<s.length;e+=1){const r=s[e].includes(a);i-=this.rankedMove(o,t[e],r)}h.push([r,o.position,a,i,"move"])}i.push(h.sort(((e,t)=>t[2]-e[2])))}return i}calculatePositionToAttack(e,t){const a=[],s=[],i=[];for(let t=0;t<e.length;t+=1){const s=this.calculateAttackCharacter(e[t],e,this.gameBoard,this.boardSize);a.push(s)}for(let e=0;e<t.length;e+=1){const a=this.calculateAttackCharacter(t[e],t,this.gameBoard,this.boardSize);s.push(a)}for(let r=0;r<e.length;r+=1){const n=e[r],o=a[r],{position:h}=n;for(let e=0;e<t.length;e+=1){const a=t[e],c=a.position,l=s[e].includes(h)?1:0;if(o.includes(c)){const e=this.rankedAttack(n,a,l);i.push([r,h,c,e,"attack"])}}}return i.sort(((e,t)=>t[3]-e[3]))}createTooltipMessage(e){const{level:t,attack:a,defence:s,health:i}=e;this.message=`🎖${t} ⚔${a} 🛡${s} ❤${i}`}changeCursorType(e){let t="auto";return this.activeClickPosition!==e&&(this.checkBusyField(e)?this.checkActiveTeamField(e)?t="pointer":this.calculateAttackCharacter(this.getActiveCharacter(),this.userTeamPositionedCharacters,this.gameBoard,this.boardSize).includes(e)?(this.gamePlay.selectCell(e,"red"),t="crosshair"):t="not-allowed":this.calculateMoveCharacter(this.getActiveCharacter(),this.allPositionedCharacter,this.gameBoard,this.boardSize).includes(e)?(this.gamePlay.selectCell(e,"green"),t="pointer"):t="not-allowed"),t}checkBusyField(e){return this.allPositionedCharacter.filter((t=>t.position===e)).length>0}checkActiveTeamField(e){return-1!==("user"===this.gameState.activeTeam?this.userTeamPositionedCharacters:this.enemyTeamPositionedCharacters).map((e=>e.position)).indexOf(e)}checkTargedTeamField(e){return-1!==("user"===this.gameState.activeTeam?this.enemyTeamPositionedCharacters:this.userTeamPositionedCharacters).map((e=>e.position)).indexOf(e)}getActiveCharacter(){return("user"===this.gameState.activeTeam?this.userTeamPositionedCharacters:this.enemyTeamPositionedCharacters).filter((e=>e.position===this.activeClickPosition))[0]}getTargetCharacter(e){return("user"===this.gameState.activeTeam?this.enemyTeamPositionedCharacters:this.userTeamPositionedCharacters).filter((t=>t.position===e))[0]}onCellClick(e){null!==this.activeClickPosition?(this.gamePlay.deselectCell(this.activeClickPosition),this.checkBusyField(e)?this.checkActiveTeamField(e)?(this.gamePlay.selectCell(e),this.activeClickPosition=e):"crosshair"===this.changeCursorType(e)?this.attacked(e):g.showError("Данным персонажем управляет компьютер"):this.moved(e)):this.checkBusyField(e)&&(this.checkActiveTeamField(e)?(this.gamePlay.selectCell(e),this.activeClickPosition=e):g.showError("Данным персонажем управляет компьютер"))}onCellEnter(e){if(null!==this.activeEnterPosition&&this.activeEnterPosition!==this.activeClickPosition&&this.gamePlay.deselectCell(this.activeEnterPosition),null!==this.activeClickPosition)this.activeEnterPosition=e,this.gamePlay.setCursor(this.changeCursorType(e));else if(this.checkBusyField(e)){const t=this.allPositionedCharacter.map((e=>e.position)).indexOf(e);this.createTooltipMessage(this.allPositionedCharacter[t].character),this.gamePlay.showCellTooltip(this.message,e),this.message=""}}onCellLeave(e){}onNewGame(){this.removeEvenetListener(),this.init()}onSaveGame(){this.stateService.save(this.gameState)}onLoadGame(){const t=this.stateService.load();this.gameState=new P(function(t){const{activeTeam:a,targetTeam:s,boardSize:i,gameLevel:r}=t,n=new e,o=new e,c=[],l=[];for(let e=0;e<t.userTeamPositionedCharacters.length;e+=1){const a=v(t.userTeamPositionedCharacters[e].character),{position:s}=t.userTeamPositionedCharacters[e];n.add(a),c.push(new h(a,s))}for(let e=0;e<t.enemyTeamPositionedCharacters.length;e+=1){const a=v(t.enemyTeamPositionedCharacters[e].character),{position:s}=t.enemyTeamPositionedCharacters[e];o.add(a),l.push(new h(a,s))}return{boardSize:i,activeTeam:a,targetTeam:s,userTeam:n,enemyTeam:o,userTeamPositionedCharacters:c,enemyTeamPositionedCharacters:l,gameLevel:r}}(t)),this.syncGameState(this.gameState),this.clear(),this.startGame()}addEventListener(){this.gamePlay.addCellClickListener(this.onCellLeave.bind(this)),this.gamePlay.addCellEnterListener(this.onCellEnter.bind(this)),this.gamePlay.addCellClickListener(this.onCellClick.bind(this))}removeEvenetListener(){this.gamePlay.cellClickListeners=[],this.gamePlay.cellEnterListeners=[],this.gamePlay.cellLeaveListeners=[]}}(f,p);y.init()}();