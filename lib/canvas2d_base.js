
/**
 * 大体どんなゲームでも使えそうだなとかの共通２D描画処理を書き連ねていく予定がこちら
 */
class canvas2d_base {
  constructor(_canvas) {
    this.tgtCanvas = _canvas;
    this.ctx = this.tgtCanvas.getContext('2d');
    this.baseFontStr = "bold 32px sans-serif ";
    this.subFontStr = "bold 20px sans-serif ";

    this.bigFontStr = "bolder 96px sans-serif ";

    this.efTotalHeight = 0;
    this.init();
  }

  init() {
    this.resize();
    this.lastViewTime = 0;
    this.effectStringList = [];
    this.ctx.clearRect(0, 0, this.width, this.height);
  };

  resize() {
    this.width = this.tgtCanvas.width;
    this.height = this.tgtCanvas.height;
    this.ctx.font = this.baseFontStr;
  };

  _update(_delta) {
    this.efTotalHeight = [];
    this.efTotalHeight[0] = 0;
    this.efTotalHeight[1] = 0;
    for (let i = this.effectStringList.length - 1; i >= 0; i--) {
      this.effectStringList[i].update(_delta);
      if (this.effectStringList[i].nowTime > this.effectStringList[i].lifeTime) {
        this.effectStringList.pop();
      } else {
        this.efTotalHeight[this.effectStringList[i].positionType] += this.effectStringList[i].lineHeight;
      }
    }
  };

  _draw() {
    "use strict";
    this.ctx.clearRect(0, 0, this.width, this.height);
    this.initFont();

  };

  initFont() {
    this.ctx.font = this.baseFontStr;
    this.ctx.fillStyle = 'rgb(0,255,0)';
    this.ctx.lineWidth = 0.75;
    this.ctx.strokeStyle = 'rgb(0,50,0)';
    this.ctx.lineWidth = 2;
  }

  fillStroke(_str, px, py) {
    this.ctx.fillText(_str, px, py, this.width - 20);
    this.ctx.strokeText(_str, px, py, this.width - 20);
  }

  drawBigString(_str) {

    this.ctx.font = this.bigFontStr;
    this.ctx.fillStyle = 'rgb(0,255,255)';
    this.ctx.strokeStyle = 'rgb(0,50,0)';
    this.ctx.lineWidth = 3;

    let BaseHeight = this.height * 0.5 - 36;
    let BaseWidth = this.width * 0.5;
    const metrics = this.ctx.measureText(_str);
    BaseWidth = BaseWidth - metrics.width * 0.5;

    this.ctx.fillText(_str, BaseWidth | 0, BaseHeight);
    this.ctx.strokeText(_str, BaseWidth | 0, BaseHeight);
  }


  getScreenPos(_vec3d, _cam) {
    var pos = new THREE.Vector3();
    pos.copy(_vec3d);
    pos.project(_cam);
    pos.x = (pos.x * this.width * 0.5) + this.width * 0.5;
    pos.y = -(pos.y * this.height * 0.5) + this.height * 0.5;

    return pos;
  };

  clearEffectStringList() {
    this.effectStringList = [];
  }
}

///////////////////////////
var effectStringPositionType = {

  absolute: 0,
  Center: 1,
  centerTop: 2,
  centerBottom: 3,

  Left: 4,
  leftTop: 5,
  leftBottom: 6,

  Right: 7,
  rightTop: 8,
  rightBottom: 9,

};

////////////////////////////
class effectString {
  constructor() {
    this.str = '';
    this.fontSetStr = '';
    this.fillStyleStr = '';
    this.strokeStyleStr = '';
    this.lifeTime = 0;
    this.beginTime = 0;
    this.nowTime = 0;
    this.level = 0;
    this.lineHeight = 0;
    this.typeEffect = false;
    this.positionType = effectStringPositionType.Center;
    this.basePos = [0, 0];
  }

  set(_str, _lifeTime, _state, _options = {}) {
    const {
      _typeEffect = false,
        _fontSetStr = "bold 32px sans-serif",
        _lineHeight = 40,
        _fillStyleStr = 'rgb(255,255,255)',
        _strokeStyleStr = 'rgb(64,64,0)',
        _level = 0,
        _positionType = effectStringPositionType.absolute,
        _basePos = [0, 0]
    } = _options;

    this.str = _str;
    this.fontSetStr = _fontSetStr;
    this.lineHeight = _lineHeight;
    this.fillStyleStr = _fillStyleStr;
    this.strokeStyleStr = _strokeStyleStr;
    this.lifeTime = _lifeTime;
    this.typeEffect = _typeEffect;
    this.beginTime = _state.totalTime;
    this.nowTime = 0;
    this.level = _level;
    this.positionType = _positionType;
    this.basePos = _basePos;
  };

  update(_delta) {
    this.nowTime += _delta;
  };
}