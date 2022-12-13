import { Color, TextureLoader } from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer';
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { WboitPass, WboitUtils, sRGBShader } from 'three-wboit';
import './style.css';
import { TextureAtlas } from './texture';
import LeavesImage from './leaves_oak.png';
import { BoxGeometry } from 'three';
import { MeshBasicMaterial } from 'three';
import { Mesh } from 'three';
import { Scene } from 'three';
import { PerspectiveCamera } from 'three';
import { WebGLRenderer } from 'three';
import GUI from 'lil-gui';

const gui = new GUI();

const canvas = document.getElementById('main');

const scene = new Scene();

const camera = new PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000,
);
camera.position.set(0, 0, 5);
camera.lookAt(0, 0, 0);

const renderer = new WebGLRenderer({
  canvas,
});
renderer.setPixelRatio(window.devicePixelRatio);

const composer = new EffectComposer(renderer);
const wboitPass = new WboitPass(renderer, scene, camera, new Color());
composer.addPass(wboitPass);
composer.addPass(new ShaderPass(sRGBShader));

new TextureLoader().load(LeavesImage, (texture) => {
  const atlas = TextureAtlas.createSingle('test', texture, {
    dimension: 16,
  });

  const geometry = new BoxGeometry(1, 1, 1);
  const material1 = new MeshBasicMaterial({
    map: atlas.texture,
    transparent: true,
    alphaTest: 0.1,
  });

  WboitUtils.patch(material1);

  const mesh1 = new Mesh(geometry, material1);
  mesh1.position.set(1, 0, 0);

  const material2 = new MeshBasicMaterial({
    map: atlas.texture,
    transparent: true,
    alphaTest: 0.1,
  });

  const mesh2 = new Mesh(geometry, material2);
  mesh2.position.set(-1, 0, 0);

  scene.add(mesh1, mesh2);
});

const resize = () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
};
resize();

new OrbitControls(camera, renderer.domElement);

window.addEventListener('resize', resize);

const animate = () => {
  requestAnimationFrame(animate);
  // wboitPass.render(renderer);
  composer.render();
};

animate();
