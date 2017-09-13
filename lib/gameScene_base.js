//////
/////   進行管理のベースクラス
/////   THREE.js　の threeComps.scene とは全く別物になる

"use strict";

class GameScene_base {
  constructor() {

  }
  
  _update(_delta) {
    this.update(_delta);
  }

  _draw() {
    this.draw();
  };

  update(_delta) {
    console.log('fatt!!??');
  }

  draw() {

  }


}