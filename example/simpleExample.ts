import {BufferGeometry} from "../src/core/BufferGeometry";
import {UlitMaterial} from "../src/core/Material/UlitMaterial";
import {AObject3D} from "../src/core/Object";
import {getPlaneShape} from "../src/utils/shapeCreator"
import {Mat4} from "../src/math/Mat4";
import {Vec3} from "../src/math/Vec3";
import {WebglRenderer} from "../src/core/WebglRenderer";
import {Camera} from "../src/core/Camera";
import {RenderComponent} from "../src/core/RenderComponent";
import {loadImage} from "../src/utils/ImageLoader";
import {ObjParser} from "../src/parser/ObjParser";

class RainDrop extends AObject3D {
  speed: number;
  size: number;
  position: Vec3;

  constructor(name: string = 'new rain') {
    super(name);

    this.speed = Math.random() * 1 + 1;

    this.size = 1;

    this.position = new Vec3();

    Mat4.scaleMat4(1, 10, 1, this.tempMatrix);

    Mat4.multiply(this.tempMatrix, this.transform.localMat4, this.transform.localMat4);

    this.rebirth();
  }

  rebirth() {
    const size = 10;
    this.position.set( 
      Math.random() * size - size * 0.5,
      Math.random() * size - size * 0.5 + size,
      Math.random() * size - size * 0.5,
    );
  }


  tempMatrix = new Mat4();
  update(): void {
    // console.log(`updating: ${this.name}`);
    const deltTime = 1000 / 60;
    this.position.y = this.position.y - deltTime * this.speed;

    if (this.position.y < this.size * 0.5) {
      this.rebirth();
    }

    
  }
}

const startPaint = async () => {

  const geometry = new BufferGeometry();
  const plane = getPlaneShape();
  geometry.originData = {
    a_position: {
      size: 3,
      data: plane.position,
    },
    a_uv: {
      size: 3,
      data: plane.uv,
    }
  };

  const rootObj = new RainDrop('root');
  const root = rootObj.transform;


  const canvas = document.getElementById('canvas') as HTMLCanvasElement;

  const gl = canvas.getContext('webgl') as WebGLRenderingContext;

  const material = new UlitMaterial([1, 1, 1, 1]);

  // add all children

  const child1 = new RainDrop('child1');

  child1.renderer = new RenderComponent(
    geometry,
    material,
  );

  root.addChild(child1.transform);

  let timeSecond = 0;
  const frameTime = Math.floor(1000 / 60);

  const renderer = new WebglRenderer(gl);
  const camera = new Camera(gl.canvas.width / gl.canvas.height);
  root.addChild(camera.transform);
  camera.transform.localMat4 = Mat4.translationMat4(0, 0, 20, camera.transform.localMat4);

  gl.enable(gl.CULL_FACE);
  gl.enable(gl.DEPTH_TEST);

  renderer.renderObjectTree(root, camera)

  const v = new Mat4();

  const update = () => {

    timeSecond = timeSecond + frameTime / 1000;

    const deltT = frameTime / 1000;

    // Mat4.rotateYMat4(0.5 * deltT, v);
    // Mat4.multiply(v, child1.transform.localMat4, child1.transform.localMat4);

    Mat4.rotateYMat4(1 * deltT, v);
    // Mat4.multiply( child2.transform.localMat4, v, child2.transform.localMat4);

    gl.clearColor(0.2, 0.2, 0.2, 1);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    renderer.renderObjectTree(root, camera)

    requestAnimationFrame(update);
    // setTimeout(update, 500)
  }

  update();
}

startPaint();

