import {BufferGeometry} from "../src/core/BufferGeometry";
import {UlitMaterial} from "../src/core/Material/UlitMaterial";
import {AObject3D} from "../src/core/Object";
import {getBoxShape} from "../src/utils/shapeCreator"
import {Mat4} from "../src/math/Mat4";
import {WebglRenderer} from "../src/core/WebglRenderer";
import {Camera} from "../src/core/Camera";
import {RenderComponent} from "../src/core/RenderComponent";
import {loadImage} from "../src/utils/ImageLoader";

class TestObject extends AObject3D {
  update(): void {
    // console.log(`updating: ${this.name}`);
  }

}

const startPaint = async () => {

  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  const image = await loadImage('../res/module/women/tex/rp_mei_posed_001_dif_2k.jpg');

  const material = new UlitMaterial([1,1, 1, 1], image);

  const geometry = new BufferGeometry();
  const box = getBoxShape();
  geometry.originData = {
    a_position: {
      size: 3,
      data: box.position,
    },
    a_uv: {
      size: 2,
      data: box.uv,
    }
  };

  const rootObj = new TestObject('root');
  const root = rootObj.transform;

  const child1 = new TestObject('child1');

  const child2 = new TestObject('child2');
  child1.transform.addChild(child2.transform);

  Mat4.translationMat4(2, 0, 0, child2.transform.localMat4);

  child1.renderer = new RenderComponent(
    geometry,
    material,
  );

  child2.renderer = new RenderComponent(
    geometry,
    material,
  );

  root.addChild(child1.transform);

  let timeSecond = 0;
  const frameTime = Math.floor(1000 / 60);

  const renderer = new WebglRenderer(gl);
  const camera = new Camera(gl.canvas.width / gl.canvas.height);
  root.addChild(camera.transform);
  camera.transform.localMat4 = Mat4.translationMat4(0, 0, 10, camera.transform.localMat4);


  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  renderer.renderObjectTree(root, camera)

  const v = new Mat4();
  const v2 = new Mat4();

  const update = () => {
    timeSecond = timeSecond + frameTime / 1000;

    const deltT = frameTime / 1000;

    Mat4.rotateXMat4(1 * deltT, v);
    Mat4.rotateYMat4(1.3 * deltT, v2);
    Mat4.multiply(v, v2, v);

    Mat4.multiply(v, child1.transform.localMat4, child1.transform.localMat4);

    Mat4.rotateXMat4(10 * deltT, v);
    Mat4.multiply(v, child2.transform.localMat4, child2.transform.localMat4);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.clearColor(0.2, 0.2, 0.2, 1);

    renderer.renderObjectTree(root, camera)
    requestAnimationFrame(update);
  }

  update();
}

startPaint();

