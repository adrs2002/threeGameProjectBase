let container = null;
let userDebugMode = false;
let scene, camera, renderer, pc, clock;
let hammer = null;
let el_Canvas = null;
let ctx2d = null;
let risezeTimer = 0;
let lastTouchEnd = 0;
let c2d = null;

function initialize() {

  container = document.getElementById('viewdiv');

  renderer = new THREE.WebGLRenderer({ alpha: true});
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0xffffff, 0);
  renderer.domElement.id = "c3d";
  renderer.domElement.style.zIndex = 50;
  container.appendChild(renderer.domElement);

  reset3DScene();

  // 画面と同じ大きさのCanvasを作成し、3D描画の真上に重ねる
  el_Canvas = document.createElement('canvas');
  el_Canvas.id = "c2d";
  el_Canvas.style.zIndex = 60;
  container.appendChild(el_Canvas);
  c2d = new canvas2d(el_Canvas);

  // タッチの検出は、上に乗っている2D用Canvasで検出することになる
  hammerInit();

  // 画面サイズ変更（端末回転時や上下から余計なバーがでてきた時）時に、描画領域を自動で変更する
  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();

  // ピンチ操作（２本指でくぱぁする）で拡大縮小が出来てしまうのを防ぐ
  document.documentElement.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);
  // 画面がスクロールされるのを防ぐ
  document.documentElement.addEventListener('touchmove', function(event) {
    event.preventDefault();
  }, false);
  // ダブルタップで拡大されるのを防ぐ
  document.documentElement.addEventListener('touchend', function(event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  init_callback();
}

function reset3DScene(){
  if(camera){delete camera;}
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(00, 5, -10);
  camera.lookAt(new THREE.Vector3(00, 0, 0));
  camera.up.set(0, 1, 0);

  if(scene){delete scene;}
  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff));

}

function onWindowResize() {
  if (risezeTimer > 0) {
    clearTimeout(risezeTimer);
  }
  risezeTimer = setTimeout(function() {
    renderer.setSize(container.clientWidth, container.clienteight);
    camera.aspect = container.clientWidth / container.clientHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(container.clientWidth, container.clientHeight);
    el_Canvas.width = container.clientWidth;
    el_Canvas.height = container.clientHeight;
    c2d.resize();
  }, 200);
}


function update() {
  requestAnimationFrame(update);
  updateGame();
  draw();
}

function draw() {
  beforeDraw();
  renderer.render(scene, camera);
  c2d.draw();
}

function hammerInit() {
  // 2dCanvas
  var hammer = new Hammer(el_Canvas);

  hammer.get('pan').set({
    direction: Hammer.DIRECTION_ALL
  });

  hammer.get('press').set({
    time: 1,
  });
  hammer.get('tap');

  hammer.get('swipe').set({
    direction: Hammer.DIRECTION_ALL
  });

  hammer.on("press", function(ev) {
    onMouseDown(ev);
  });

  hammer.on("pressup", function(ev) {
    onMouseUp(ev);
  });
  hammer.on("tap", function(ev) {
    onMouseUp(ev);
  });

  hammer.on("panmove", function(ev) {
    onMouseMove(ev);
  });

  hammer.on("swipe", function(ev) {
    onSwipe(ev);
  });


  /*
  hammer.on("panend", function(ev) {
    onMouseUp(ev);
  });
  */
}

function viewModal(_flag, _options) {
  if (!_flag) {
    document.getElementById('modalWapper').style.display = 'none';
    return;
  }
  if(_options === undefined){_options = {};}

  const {
    backColor = "rgba(6, 11, 7, 0.60)"
  } = _options;

  document.getElementById('modalWapper').style.backgroundColor = backColor;
  document.getElementById('modalWapper').style.display = 'block';
}



setTimeout(initialize(), 0);