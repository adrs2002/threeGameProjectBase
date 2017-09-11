let container = null;
let userDebugMode = false;
let scene, camera, renderer, pc, clock;
let hammer = null;
let el_Canvas = null;
let ctx2d = null;
let risezeTimer = 0;
let lastTouchEnd = 0;
let c2d = null;

function j_initialize() {
  document.documentElement.addEventListener('touchstart', function(event) {
    if (event.touches.length > 1) {
      event.preventDefault();
    }
  }, false);

  document.documentElement.addEventListener('touchend', function(event) {
    var now = (new Date()).getTime();
    if (now - lastTouchEnd <= 300) {
      event.preventDefault();
    }
    lastTouchEnd = now;
  }, false);

  container = document.getElementById('viewdiv');
  camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(00, 5, -10);
  camera.lookAt(new THREE.Vector3(00, 0, 0));
  camera.up.set(0, 1, 0);

  scene = new THREE.Scene();
  scene.add(new THREE.AmbientLight(0xffffff));

  renderer = new THREE.WebGLRenderer({ alpha: true } );
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.setClearColor(0xffffff, 0);
  container.appendChild(renderer.domElement);

  el_Canvas = document.createElement('canvas');
  container.appendChild(el_Canvas);
  c2d = new canvas2d(el_Canvas);
  window.addEventListener('resize', onWindowResize, false);
  onWindowResize();

  init_callback();
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


function update(){
  requestAnimationFrame(update);
  updateGame();
  draw();
}

function draw(){
  beforeDraw();
  renderer.render(scene, camera);
  c2d.draw();
}



setTimeout(j_initialize(), 0);